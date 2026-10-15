/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Sparkles,
  CloudRain,
  Thermometer,
  Wind,
  Flag,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  ChevronRight,
  Info,
  CheckCircle2,
  Maximize2,
  Flame,
  AlertTriangle,
} from 'lucide-react';

export interface ClimateStationData {
  id: string;
  name: string;
  regionId: string;
  regionName: string;
  domain: 'Bắc' | 'Nam';
  atlatCoords: { top: string; left: string }; // Position percentage on Atlat map
  map3DCoords: { x: number; y: number };
  tempAnnual: string;
  tempMinMax: string;
  tempAmp: string; // Biên độ nhiệt
  rainfallAnnual: string;
  rainySeason: string;
  specialPhenomena: string;
  riskFactor: string;
  schoolAction: string;
  // 12 months data for rainfall (mm) and temperature (°C)
  monthlyRain: number[]; // 12 values
  monthlyTemp: number[]; // 12 values
}

export interface ClimateZone {
  id: string;
  name: string;
  domain: 'Bắc' | 'Nam';
  color: string;
  borderColor: string;
  description: string;
  keyFeatures: string;
  stations: string[];
}

export const CLIMATE_ZONES: ClimateZone[] = [
  {
    id: 'tay-bac',
    name: 'Vùng khí hậu Tây Bắc Bộ',
    domain: 'Bắc',
    color: '#10b981',
    borderColor: '#059669',
    description: 'Địa hình núi cao Hoàng Liên Sơn chắn gió mùa Đông Bắc, tạo mùa đông đỡ lạnh hơn Đông Bắc Bộ và mùa hè có gió phơn khô nóng.',
    keyFeatures: 'Mùa đông ít lạnh hơn Đông Bắc; thung lũng ấm áp; sườn đón gió mưa lớn.',
    stations: ['dien-bien', 'sa-pa'],
  },
  {
    id: 'dong-bac',
    name: 'Vùng khí hậu Đông Bắc Bộ',
    domain: 'Bắc',
    color: '#047857',
    borderColor: '#065f46',
    description: 'Địa hình các cánh cung mở rộng về phía bắc đón trực tiếp gió mùa Đông Bắc, là vùng có mùa đông lạnh nhất cả nước.',
    keyFeatures: 'Mùa đông lạnh đến sớm và kết thúc muộn; mưa phùn cuối đông; chịu ảnh hưởng bão tháng 6-8.',
    stations: ['lang-son'],
  },
  {
    id: 'trung-nam-bac-bo',
    name: 'Vùng khí hậu Trung và Nam Bắc Bộ',
    domain: 'Bắc',
    color: '#0284c7',
    borderColor: '#0369a1',
    description: 'Bao gồm Đồng bằng sông Hồng và duyên hải vịnh Bắc Bộ. Mùa đông lạnh ẩm, mùa hè nóng ẩm mưa nhiều.',
    keyFeatures: 'Mưa nhiều tháng 7-8; bão đổ bộ nhiều tháng 7-8; biên độ nhiệt năm lớn (~12-13°C).',
    stations: ['ha-noi'],
  },
  {
    id: 'bac-trung-bo',
    name: 'Vùng khí hậu Bắc Trung Bộ',
    domain: 'Bắc',
    color: '#eab308',
    borderColor: '#ca8a04',
    description: 'Từ dãy Tam Điệp tới dãy Bạch Mã. Mùa hạ chịu gió phơn Tây Nam (gió Lào) cực kỳ khô nóng; thu đông mưa lớn và bão dồn dập.',
    keyFeatures: 'Gió Tây khô nóng gay gắt tháng 5-7; mưa bão dữ dội tháng 9-11; lũ quét đầu nguồn.',
    stations: ['dong-hoi'],
  },
  {
    id: 'nam-trung-bo',
    name: 'Vùng khí hậu Nam Trung Bộ',
    domain: 'Nam',
    color: '#f59e0b',
    borderColor: '#d97706',
    description: 'Từ phía nam Bạch Mã đến Bình Thuận. Mùa mưa lệch hẳn về thu đông (tháng 9-12); mùa khô kéo dài, hạn hán khốc liệt nhất nước.',
    keyFeatures: 'Mưa lệch thu đông do sườn đón gió mùa qua biển; Ninh Thuận - Bình Thuận khô hạn nhất nước.',
    stations: ['da-nang', 'nha-trang'],
  },
  {
    id: 'tay-nguyen',
    name: 'Vùng khí hậu Tây Nguyên',
    domain: 'Nam',
    color: '#d97706',
    borderColor: '#b45309',
    description: 'Khí hậu cận xích đạo gió mùa có tính chất phân hóa theo độ cao trên các cao nguyên bazan; 2 mùa mưa và khô tương phản sâu sắc.',
    keyFeatures: 'Đà Lạt mát lạnh quanh năm; mùa khô thiếu nước nghiêm trọng; mùa mưa lũ ống lũ quét.',
    stations: ['da-lat'],
  },
  {
    id: 'nam-bo',
    name: 'Vùng khí hậu Nam Bộ',
    domain: 'Nam',
    color: '#ea580c',
    borderColor: '#c2410c',
    description: 'Bao gồm Đông Nam Bộ và Đồng bằng sông Cửu Long. Nền nhiệt cao và ổn định quanh năm (>26-27°C), biên độ nhiệt năm rất nhỏ (<3°C).',
    keyFeatures: 'Mùa mưa tháng 5-11 chiếm >85% lượng mưa; mùa khô kéo dài gây xâm nhập mặn và triều cường ngập úng.',
    stations: ['tp-hcm', 'can-tho', 'ca-mau'],
  },
];

export const CLIMATE_STATIONS: ClimateStationData[] = [
  {
    id: 'sa-pa',
    name: 'Trạm Sa Pa (Lào Cai)',
    regionId: 'tay-bac',
    regionName: 'Tây Bắc Bộ',
    domain: 'Bắc',
    atlatCoords: { top: '8.5%', left: '33%' },
    map3DCoords: { x: 130, y: 35 },
    tempAnnual: '15.2°C',
    tempMinMax: '8.4°C (tháng 1) — 19.8°C (tháng 7)',
    tempAmp: '11.4°C',
    rainfallAnnual: '2.680 mm/năm',
    rainySeason: 'Tháng 5 — Tháng 9 (đỉnh mưa tháng 7-8 đạt >480 mm)',
    specialPhenomena: 'Khí hậu núi cao á nhiệt đới, mùa đông có băng giá và tuyết rơi, độ ẩm quanh năm rất cao.',
    riskFactor: 'Rét hại, sương muối, sạt lở đất trên các sườn dốc Hoàng Liên Sơn.',
    schoolAction: 'Tham gia bảo vệ thảm thực vật rừng tự nhiên để chống trượt lở đất và giữ nguồn sinh thủy.',
    monthlyTemp: [8.4, 9.8, 13.5, 17.2, 19.1, 19.8, 19.7, 19.3, 17.8, 14.9, 12.0, 9.2],
    monthlyRain: [35, 45, 80, 190, 320, 390, 485, 450, 310, 180, 65, 30],
  },
  {
    id: 'dien-bien',
    name: 'Trạm Điện Biên Phủ',
    regionId: 'tay-bac',
    regionName: 'Tây Bắc Bộ',
    domain: 'Bắc',
    atlatCoords: { top: '14%', left: '25%' },
    map3DCoords: { x: 105, y: 55 },
    tempAnnual: '21.8°C',
    tempMinMax: '16.2°C (tháng 1) — 26.1°C (tháng 6)',
    tempAmp: '9.9°C',
    rainfallAnnual: '1.620 mm/năm',
    rainySeason: 'Tháng 5 — Tháng 9',
    specialPhenomena: 'Thung lũng kín gió, mùa đông đỡ buốt hơn Đông Bắc, đầu hè có gió phơn khô nóng.',
    riskFactor: 'Lũ quét cục bộ, hạn hán đầu mùa mưa.',
    schoolAction: 'Tiết kiệm nước sinh hoạt và tham gia trồng rừng phủ xanh đất trống đồi trọc.',
    monthlyTemp: [16.2, 18.0, 21.5, 24.8, 25.9, 26.1, 25.8, 25.4, 24.5, 22.2, 19.3, 16.5],
    monthlyRain: [20, 25, 50, 120, 220, 260, 310, 290, 160, 70, 40, 15],
  },
  {
    id: 'lang-son',
    name: 'Trạm Lạng Sơn',
    regionId: 'dong-bac',
    regionName: 'Đông Bắc Bộ',
    domain: 'Bắc',
    atlatCoords: { top: '11.5%', left: '50%' },
    map3DCoords: { x: 195, y: 48 },
    tempAnnual: '21.2°C',
    tempMinMax: '13.3°C (tháng 1) — 27.2°C (tháng 7)',
    tempAmp: '13.9°C (Biên độ nhiệt lớn)',
    rainfallAnnual: '1.450 mm/năm',
    rainySeason: 'Tháng 5 — Tháng 9',
    specialPhenomena: 'Đón luồng gió mùa Đông Bắc sớm và mạnh nhất, số ngày rét đậm rét hại nhiều nhất nước.',
    riskFactor: 'Sương muối, băng giá làm chết cây trồng và gia súc.',
    schoolAction: 'Chống rét cho lớp học, tham gia chiến dịch giữ ấm cho học sinh vùng cao.',
    monthlyTemp: [13.3, 14.5, 18.2, 22.5, 25.8, 27.0, 27.2, 26.8, 25.1, 22.0, 18.2, 14.6],
    monthlyRain: [25, 30, 55, 105, 190, 240, 275, 260, 150, 75, 35, 15],
  },
  {
    id: 'ha-noi',
    name: 'Trạm Hà Nội (Thủ đô)',
    regionId: 'trung-nam-bac-bo',
    regionName: 'Trung và Nam Bắc Bộ',
    domain: 'Bắc',
    atlatCoords: { top: '17.5%', left: '42%' },
    map3DCoords: { x: 170, y: 72 },
    tempAnnual: '23.6°C',
    tempMinMax: '16.4°C (tháng 1) — 29.2°C (tháng 6-7)',
    tempAmp: '12.8°C',
    rainfallAnnual: '1.680 mm/năm',
    rainySeason: 'Tháng 5 — Tháng 10 (đỉnh mưa tháng 7-8)',
    specialPhenomena: 'Mùa đông lạnh và có mưa phùn ẩm ướt vào nửa cuối; mùa hè oi bức, hiệu ứng đảo nhiệt đô thị.',
    riskFactor: 'Ngập lụt đô thị khi mưa lớn, ô nhiễm bụi mịn mùa đông do nghịch nhiệt.',
    schoolAction: 'Sử dụng xe đạp và phương tiện công cộng (xe buýt điện/metro), giảm rác nhựa trường học.',
    monthlyTemp: [16.4, 17.2, 20.0, 23.9, 27.4, 29.2, 29.0, 28.5, 27.2, 24.6, 21.4, 18.1],
    monthlyRain: [18, 26, 45, 90, 190, 240, 295, 320, 250, 130, 45, 20],
  },
  {
    id: 'dong-hoi',
    name: 'Trạm Đồng Hới (Quảng Bình)',
    regionId: 'bac-trung-bo',
    regionName: 'Bắc Trung Bộ',
    domain: 'Bắc',
    atlatCoords: { top: '39%', left: '52%' },
    map3DCoords: { x: 215, y: 155 },
    tempAnnual: '24.8°C',
    tempMinMax: '19.2°C (tháng 1) — 29.6°C (tháng 7)',
    tempAmp: '10.4°C',
    rainfallAnnual: '2.180 mm/năm',
    rainySeason: 'Tháng 9 — Tháng 12 (đỉnh mưa tháng 10 >600 mm)',
    specialPhenomena: 'Đầu hè chịu gió phơn Tây Nam cực nóng rát (>40°C), thu đông chịu bão lũ dồn dập.',
    riskFactor: 'Lũ lụt, cát bay cát chảy lấn chiếm đồng ruộng ven biển.',
    schoolAction: 'Trồng phi lao chắn cát ven biển và học kỹ năng ứng phó bão lũ an toàn.',
    monthlyTemp: [19.2, 19.8, 22.4, 25.8, 28.5, 29.6, 29.4, 28.7, 26.8, 24.9, 22.6, 20.1],
    monthlyRain: [55, 40, 45, 60, 110, 95, 85, 140, 420, 640, 360, 130],
  },
  {
    id: 'da-nang',
    name: 'Trạm Đà Nẵng (Duyên hải)',
    regionId: 'nam-trung-bo',
    regionName: 'Nam Trung Bộ',
    domain: 'Nam',
    atlatCoords: { top: '48%', left: '60%' },
    map3DCoords: { x: 245, y: 195 },
    tempAnnual: '25.9°C',
    tempMinMax: '21.5°C (tháng 1) — 29.4°C (tháng 6-7)',
    tempAmp: '7.9°C',
    rainfallAnnual: '2.510 mm/năm',
    rainySeason: 'Tháng 9 — Tháng 12 (tháng 10-11 mưa cực lớn >700 mm/tháng)',
    specialPhenomena: 'Nằm ngay phía nam dãy Bạch Mã, chịu ảnh hưởng mưa sườn đón gió và bão nhiệt đới.',
    riskFactor: 'Bão lớn đổ bộ, sạt lở ven bờ và ngập lụt ven sông Vu Gia - Thu Bồn.',
    schoolAction: 'Diễn tập phòng chống thiên tai bão lụt tại trường học, thu dọn rác bãi biển.',
    monthlyTemp: [21.5, 22.4, 24.5, 27.0, 28.8, 29.4, 29.2, 28.8, 27.4, 25.8, 24.0, 22.3],
    monthlyRain: [85, 30, 25, 30, 70, 85, 90, 115, 350, 750, 620, 260],
  },
  {
    id: 'nha-trang',
    name: 'Trạm Nha Trang (Khánh Hòa)',
    regionId: 'nam-trung-bo',
    regionName: 'Nam Trung Bộ',
    domain: 'Nam',
    atlatCoords: { top: '74%', left: '71%' },
    map3DCoords: { x: 280, y: 295 },
    tempAnnual: '26.8°C',
    tempMinMax: '23.8°C (tháng 1) — 28.8°C (tháng 6-7)',
    tempAmp: '5.0°C (Biên độ nhiệt nhỏ)',
    rainfallAnnual: '1.360 mm/năm (Thuộc vùng khô hạn)',
    rainySeason: 'Tháng 9 — Tháng 12 (ngắn và tập trung)',
    specialPhenomena: 'Khí hậu ven biển ôn hòa, nhiều nắng, mùa khô kéo dài tới 8 tháng.',
    riskFactor: 'Khô hạn kéo dài ảnh hưởng nguồn nước ngọt, xói lở bờ biển.',
    schoolAction: 'Tiết kiệm nước ngọt, bảo vệ rạn san hô và rừng ngập mặn vịnh Nha Trang.',
    monthlyTemp: [23.8, 24.5, 26.0, 27.6, 28.5, 28.8, 28.5, 28.4, 27.8, 26.8, 25.5, 24.2],
    monthlyRain: [40, 15, 18, 25, 60, 45, 40, 55, 175, 330, 370, 185],
  },
  {
    id: 'da-lat',
    name: 'Trạm Đà Lạt (Lâm Đồng)',
    regionId: 'tay-nguyen',
    regionName: 'Tây Nguyên',
    domain: 'Nam',
    atlatCoords: { top: '76%', left: '64%' },
    map3DCoords: { x: 255, y: 305 },
    tempAnnual: '18.1°C',
    tempMinMax: '15.8°C (tháng 1) — 19.6°C (tháng 5)',
    tempAmp: '3.8°C (Rất nhỏ)',
    rainfallAnnual: '1.760 mm/năm',
    rainySeason: 'Tháng 5 — Tháng 10',
    specialPhenomena: 'Độ cao ~1500m trên cao nguyên Lang Biang, quanh năm mát mẻ như xứ ôn đới, nhiều sương mù.',
    riskFactor: 'Xói mòn đất dốc do phá rừng trồng rau hoa trong nhà kính.',
    schoolAction: 'Hạn chế sử dụng màng phủ nilon trong nông nghiệp, trồng thông phủ xanh đồi dốc.',
    monthlyTemp: [15.8, 16.5, 18.0, 19.2, 19.6, 19.2, 18.8, 18.7, 18.5, 18.0, 17.2, 16.1],
    monthlyRain: [10, 15, 40, 100, 210, 230, 250, 260, 280, 230, 95, 40],
  },
  {
    id: 'tp-hcm',
    name: 'Trạm TP. Hồ Chí Minh',
    regionId: 'nam-bo',
    regionName: 'Nam Bộ',
    domain: 'Nam',
    atlatCoords: { top: '85%', left: '53%' },
    map3DCoords: { x: 220, y: 345 },
    tempAnnual: '27.4°C',
    tempMinMax: '26.0°C (tháng 12-1) — 29.1°C (tháng 4)',
    tempAmp: '3.1°C (Biên độ nhiệt năm rất nhỏ)',
    rainfallAnnual: '1.950 mm/năm',
    rainySeason: 'Tháng 5 — Tháng 11 (chiếm >85% lượng mưa năm)',
    specialPhenomena: 'Khí hậu cận xích đạo gió mùa điển hình, nắng ấm quanh năm, 2 mùa mưa - khô rõ rệt.',
    riskFactor: 'Ngập lụt đô thị do triều cường kết hợp mưa lớn, hiệu ứng đảo nhiệt.',
    schoolAction: 'Phân loại rác tại nguồn, giữ thông thoáng cống rãnh trường học, tiết kiệm điện điều hòa.',
    monthlyTemp: [26.0, 26.8, 28.2, 29.1, 28.8, 28.1, 27.6, 27.5, 27.2, 27.0, 26.8, 26.1],
    monthlyRain: [15, 8, 12, 55, 220, 290, 310, 305, 330, 270, 115, 40],
  },
  {
    id: 'can-tho',
    name: 'Trạm Cần Thơ (ĐBSCL)',
    regionId: 'nam-bo',
    regionName: 'Nam Bộ',
    domain: 'Nam',
    atlatCoords: { top: '89%', left: '42%' },
    map3DCoords: { x: 175, y: 365 },
    tempAnnual: '27.1°C',
    tempMinMax: '25.6°C (tháng 1) — 28.4°C (tháng 4)',
    tempAmp: '2.8°C',
    rainfallAnnual: '1.650 mm/năm',
    rainySeason: 'Tháng 5 — Tháng 11',
    specialPhenomena: 'Đồng bằng phù sa châu thổ sông Cửu Long, mạng lưới sông ngòi kênh rạch chằng chịt.',
    riskFactor: 'Hạn hán và xâm nhập mặn mùa khô, ngập lụt mùa nước nổi và triều cường.',
    schoolAction: 'Tuyên truyền tiết kiệm nước ngọt mùa khô, không xả rác xuống kênh rạch.',
    monthlyTemp: [25.6, 26.2, 27.4, 28.4, 28.1, 27.6, 27.2, 27.1, 26.9, 26.7, 26.5, 25.8],
    monthlyRain: [10, 5, 10, 45, 180, 220, 240, 250, 270, 260, 130, 30],
  },
  {
    id: 'ca-mau',
    name: 'Trạm Cà Mau (Cực Nam)',
    regionId: 'nam-bo',
    regionName: 'Nam Bộ',
    domain: 'Nam',
    atlatCoords: { top: '95%', left: '38%' },
    map3DCoords: { x: 155, y: 395 },
    tempAnnual: '27.2°C',
    tempMinMax: '25.8°C (tháng 1) — 28.6°C (tháng 4)',
    tempAmp: '2.8°C',
    rainfallAnnual: '2.350 mm/năm',
    rainySeason: 'Tháng 5 — Tháng 11',
    specialPhenomena: 'Ba mặt giáp biển, hệ sinh thái rừng ngập mặn lớn thứ 2 thế giới sau Amazon.',
    riskFactor: 'Xói lở bờ biển nghiêm trọng, nước biển dâng, sụt lún đất do khai thác nước ngầm.',
    schoolAction: 'Bảo vệ và trồng thêm rừng đước ngập mặn chắn sóng bảo vệ bán đảo Cà Mau.',
    monthlyTemp: [25.8, 26.5, 27.6, 28.6, 28.2, 27.7, 27.4, 27.3, 27.1, 27.0, 26.8, 26.0],
    monthlyRain: [20, 10, 25, 80, 270, 310, 340, 360, 390, 350, 160, 45],
  },
  {
    id: 'hoang-sa',
    name: 'Quần đảo Hoàng Sa (TP. Đà Nẵng)',
    regionId: 'nam-trung-bo',
    regionName: 'Biển đảo Việt Nam',
    domain: 'Nam',
    atlatCoords: { top: '48%', left: '92%' },
    map3DCoords: { x: 385, y: 195 },
    tempAnnual: '26.5°C',
    tempMinMax: '23.0°C (tháng 1) — 29.5°C (tháng 6)',
    tempAmp: '6.5°C',
    rainfallAnnual: '1.200 - 1.600 mm/năm',
    rainySeason: 'Tháng 8 — Tháng 11',
    specialPhenomena: 'Khí hậu nhiệt đới hải đảo gió mùa, nhiều bão nhiệt đới và áp thấp trên Biển Đông.',
    riskFactor: 'Siêu bão nhiệt đới đổ bộ trực tiếp từ biển Đông.',
    schoolAction: 'Nâng cao ý thức chủ quyền biển đảo thiêng liêng và bảo vệ môi trường biển.',
    monthlyTemp: [23.0, 24.0, 25.5, 27.5, 29.0, 29.5, 29.2, 28.8, 28.0, 27.0, 25.5, 24.0],
    monthlyRain: [30, 20, 15, 25, 60, 90, 120, 210, 320, 350, 180, 80],
  },
  {
    id: 'truong-sa',
    name: 'Quần đảo Trường Sa (Khánh Hòa)',
    regionId: 'nam-trung-bo',
    regionName: 'Biển đảo Việt Nam',
    domain: 'Nam',
    atlatCoords: { top: '89%', left: '88%' },
    map3DCoords: { x: 375, y: 360 },
    tempAnnual: '27.8°C',
    tempMinMax: '26.2°C (tháng 1) — 29.5°C (tháng 5)',
    tempAmp: '3.3°C',
    rainfallAnnual: '2.500 mm/năm',
    rainySeason: 'Tháng 8 — Tháng 12',
    specialPhenomena: 'Khí hậu cận xích đạo hải đảo, nắng gió quanh năm, thời tiết diễn biến nhanh chóng.',
    riskFactor: 'Bão biển cuối năm, khan hiếm nước ngọt trong mùa khô, sóng lớn.',
    schoolAction: 'Học sinh tích cực gửi thông điệp và tiết kiệm nước ngọt như các chiến sĩ Trường Sa.',
    monthlyTemp: [26.2, 26.8, 27.8, 29.2, 29.5, 28.8, 28.2, 28.0, 28.0, 27.8, 27.2, 26.5],
    monthlyRain: [70, 25, 20, 40, 130, 160, 220, 270, 340, 380, 460, 380],
  },
];

export const VietnamClimateMap3D: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'atlat' | 'model3d'>('atlat');
  const [selectedStation, setSelectedStation] = useState<ClimateStationData>(CLIMATE_STATIONS[3]); // Default Ha Noi
  const [selectedZone, setSelectedZone] = useState<ClimateZone>(CLIMATE_ZONES[2]); // Default Trung & Nam Bac Bo
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showWindLayers, setShowWindLayers] = useState<boolean>(true);
  const [showStormLayers, setShowStormLayers] = useState<boolean>(true);

  const months = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  // Calculate scaled bar heights for rainfall graph (max rain ~ 750mm)
  const maxRain = 750;

  const handleSelectStation = (st: ClimateStationData) => {
    setSelectedStation(st);
    const zone = CLIMATE_ZONES.find((z) => z.id === st.regionId);
    if (zone) setSelectedZone(zone);
  };

  const handleSelectZone = (zone: ClimateZone) => {
    setSelectedZone(zone);
    const station = CLIMATE_STATIONS.find((s) => s.regionId === zone.id);
    if (station) setSelectedStation(station);
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-emerald-300/80 shadow-2xl p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header and Mode Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-emerald-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>Địa Lí Khí Hậu Việt Nam — Chuẩn Atlat Địa Lí</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
            <span>Bản Đồ Khí Hậu Chung Việt Nam</span>
            <span className="text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800">
              Tỉ lệ 1:9 000 000
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            2 Miền khí hậu (Bắc — Nam ngăn bởi dãy Bạch Mã), 7 Vùng khí hậu, hướng gió mùa & quy luật bão biển
          </p>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0 self-start lg:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('atlat')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'atlat'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bản Đồ Atlat Gốc (HD)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('model3d')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'model3d'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-700 hover:bg-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mô Hình 3D Đa Lớp</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Workspace (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: MAP DISPLAY (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {activeTab === 'atlat' ? (
            /* ATLAT HIGH-RESOLUTION INTERACTIVE VIEWER */
            <div className="relative rounded-2xl border-2 border-emerald-400/80 bg-slate-900 shadow-xl overflow-hidden group">
              {/* Toolbar */}
              <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 p-1 bg-slate-900/80 backdrop-blur-md rounded-xl border border-white/20 text-white text-xs">
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(prev + 20, 200))}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition"
                  title="Phóng to"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(prev - 20, 80))}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition"
                  title="Thu nhỏ"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="px-2 py-1 hover:bg-white/20 rounded-lg font-mono text-[11px] transition"
                  title="Đặt lại kích thước"
                >
                  {zoomLevel}%
                </button>
              </div>

              {/* Notice Banner */}
              <div className="absolute top-3 left-3 z-30 px-3 py-1.5 bg-emerald-950/85 backdrop-blur-md rounded-xl border border-emerald-400/40 text-emerald-200 text-[11px] font-medium flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Bấm vào các trạm khí tượng trên bản đồ để xem biểu đồ</span>
              </div>

              {/* Scrollable / Zoomable Container */}
              <div className="overflow-auto max-h-[640px] p-2 flex items-center justify-center bg-slate-950/90">
                <div
                  className="relative transition-all duration-200 ease-out inline-block select-none"
                  style={{ width: `${zoomLevel}%`, minWidth: '420px' }}
                >
                  <img
                    src="/assets/atlat-khi-hau-viet-nam.jpg"
                    alt="Bản đồ khí hậu chung Việt Nam chuẩn Atlat Địa lí"
                    className="w-full h-auto rounded-xl shadow-2xl block border border-slate-700"
                    loading="eager"
                  />

                  {/* Interactive Hotspots Overlaid on the Atlat Map */}
                  {CLIMATE_STATIONS.map((st) => {
                    const isSelected = selectedStation.id === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleSelectStation(st)}
                        style={{ top: st.atlatCoords.top, left: st.atlatCoords.left }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 group/pin z-20 transition-transform ${
                          isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                        }`}
                        title={`${st.name} — Bấm xem biểu đồ nhiệt độ & lượng mưa`}
                      >
                        <div className="relative flex items-center justify-center">
                          <span
                            className={`absolute w-6 h-6 rounded-full animate-ping opacity-75 ${
                              isSelected ? 'bg-red-500' : 'bg-emerald-400'
                            }`}
                          />
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-[10px] font-black ${
                              isSelected
                                ? 'bg-red-600 text-white ring-2 ring-red-400'
                                : 'bg-emerald-600 text-white'
                            }`}
                          >
                            ★
                          </div>
                        </div>

                        {/* Hover / Selected Label */}
                        <div
                          className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap shadow-md pointer-events-none transition ${
                            isSelected
                              ? 'bg-red-600 text-white opacity-100'
                              : 'bg-slate-900/90 text-white opacity-0 group-hover/pin:opacity-100'
                          }`}
                        >
                          {st.name.split(' (')[0]}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* 3D LAYERED ECO MAP */
            <div className="relative rounded-2xl border-2 border-emerald-400/80 bg-gradient-to-b from-slate-900 via-teal-950 to-slate-950 p-6 shadow-2xl overflow-hidden min-h-[580px] flex flex-col justify-between">
              {/* Layer Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 z-20 pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Các lớp chuyên đề:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowWindLayers(!showWindLayers)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                      showWindLayers
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-slate-800 border-slate-600 text-slate-400'
                    }`}
                  >
                    Gió Mùa (Đông & Hạ)
                  </button>
                  <button
                    onClick={() => setShowStormLayers(!showStormLayers)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                      showStormLayers
                        ? 'bg-amber-600 border-amber-400 text-white'
                        : 'bg-slate-800 border-slate-600 text-slate-400'
                    }`}
                  >
                    Bão Biển (Tháng 6-12)
                  </button>
                </div>
              </div>

              {/* 3D SVG Canvas */}
              <div className="relative w-full max-w-[420px] aspect-[4/5] mx-auto my-2">
                <svg viewBox="0 0 450 480" className="w-full h-full drop-shadow-2xl select-none">
                  <defs>
                    <linearGradient id="domainNorthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                    <linearGradient id="domainSouthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                    <linearGradient id="ocean3DGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0369a1" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Ocean Base */}
                  <rect width="450" height="480" fill="url(#ocean3DGrad)" rx="16" />

                  {/* Grid Lines */}
                  <line x1="40" y1="120" x2="410" y2="120" stroke="#38bdf8" strokeOpacity="0.15" strokeDasharray="3 3" />
                  <line x1="40" y1="240" x2="410" y2="240" stroke="#38bdf8" strokeOpacity="0.15" strokeDasharray="3 3" />
                  <line x1="40" y1="360" x2="410" y2="360" stroke="#38bdf8" strokeOpacity="0.15" strokeDasharray="3 3" />
                  <line x1="150" y1="20" x2="150" y2="460" stroke="#38bdf8" strokeOpacity="0.15" strokeDasharray="3 3" />
                  <line x1="300" y1="20" x2="300" y2="460" stroke="#38bdf8" strokeOpacity="0.15" strokeDasharray="3 3" />

                  {/* 3D Depth Shadow of S-Curve Land */}
                  <path
                    d="M110 50 C 160 20, 220 25, 235 50 C 260 75, 240 100, 215 115 C 190 130, 205 160, 230 180 C 265 210, 275 255, 250 300 C 235 330, 180 375, 140 385 C 120 385, 120 355, 155 330 C 185 305, 200 270, 190 240 C 175 205, 150 175, 140 140 C 125 105, 95 80, 110 50 Z"
                    fill="#022c22"
                    transform="translate(10, 14)"
                    opacity="0.8"
                  />

                  {/* Mainland S-Shape (Domain North & South) */}
                  <path
                    d="M110 50 C 160 20, 220 25, 235 50 C 260 75, 240 100, 215 115 C 190 130, 205 160, 230 180 C 265 210, 275 255, 250 300 C 235 330, 180 375, 140 385 C 120 385, 120 355, 155 330 C 185 305, 200 270, 190 240 C 175 205, 150 175, 140 140 C 125 105, 95 80, 110 50 Z"
                    fill="url(#domainNorthGrad)"
                    stroke="#a7f3d0"
                    strokeWidth="2.5"
                  />

                  {/* Boundary Line: Dãy Bạch Mã (16°B) */}
                  <line
                    x1="220"
                    y1="190"
                    x2="260"
                    y2="190"
                    stroke="#ef4444"
                    strokeWidth="3.5"
                    strokeDasharray="4 2"
                  />
                  <text x="268" y="193" fill="#f87171" fontSize="10" fontWeight="bold">
                    Dãy Bạch Mã (16°B)
                  </text>

                  {/* Domain Badges */}
                  <rect x="135" y="85" width="28" height="22" rx="6" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
                  <text x="149" y="101" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">
                    B
                  </text>

                  <rect x="205" y="270" width="28" height="22" rx="6" fill="#ea580c" stroke="#fcd34d" strokeWidth="1.5" />
                  <text x="219" y="286" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">
                    N
                  </text>

                  {/* SOVEREIGN ARCHIPELAGOES: HOÀNG SA & TRƯỜNG SA */}
                  {/* Quần đảo Hoàng Sa (TP. Đà Nẵng) */}
                  <g className="cursor-pointer" onClick={() => handleSelectStation(CLIMATE_STATIONS[11])}>
                    <rect x="345" y="175" width="85" height="34" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                    <circle cx="355" cy="192" r="5" fill="#ef4444" />
                    <text x="366" y="188" fill="#fde047" fontSize="10" fontWeight="bold">
                      QĐ. HOÀNG SA
                    </text>
                    <text x="366" y="200" fill="#cbd5e1" fontSize="8">
                      (TP. Đà Nẵng)
                    </text>
                  </g>

                  {/* Quần đảo Trường Sa (Khánh Hòa) */}
                  <g className="cursor-pointer" onClick={() => handleSelectStation(CLIMATE_STATIONS[12])}>
                    <rect x="330" y="340" width="95" height="34" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                    <circle cx="340" cy="357" r="5" fill="#ef4444" />
                    <text x="351" y="353" fill="#fde047" fontSize="10" fontWeight="bold">
                      QĐ. TRƯỜNG SA
                    </text>
                    <text x="351" y="365" fill="#cbd5e1" fontSize="8">
                      (Tỉnh Khánh Hòa)
                    </text>
                  </g>

                  {/* Đảo Phú Quốc */}
                  <ellipse cx="115" cy="365" rx="8" ry="12" fill="#10b981" stroke="#34d399" strokeWidth="1.5" />
                  <text x="75" y="368" fill="#e2e8f0" fontSize="8" fontWeight="bold">
                    Đ. Phú Quốc
                  </text>

                  {/* Côn Đảo */}
                  <circle cx="210" cy="425" r="5" fill="#10b981" stroke="#34d399" strokeWidth="1" />
                  <text x="220" y="428" fill="#cbd5e1" fontSize="8">
                    Côn Đảo
                  </text>

                  {/* Wind Layers (Animated Arrows) */}
                  {showWindLayers && (
                    <g>
                      {/* Gió mùa mùa đông (Xanh Đông Bắc) */}
                      <path
                        d="M320 60 L240 100"
                        stroke="#38bdf8"
                        strokeWidth="3"
                        markerEnd="url(#arrowBlue)"
                        strokeDasharray="6 3"
                      />
                      <text x="310" y="52" fill="#7dd3fc" fontSize="9" fontWeight="bold">
                        Gió mùa Đông Bắc
                      </text>

                      {/* Gió mùa mùa hạ (Đỏ Tây Nam) */}
                      <path
                        d="M120 440 L190 380"
                        stroke="#f87171"
                        strokeWidth="3"
                        markerEnd="url(#arrowRed)"
                        strokeDasharray="6 3"
                      />
                      <text x="90" y="455" fill="#fca5a5" fontSize="9" fontWeight="bold">
                        Gió mùa Tây Nam
                      </text>

                      {/* Gió phơn Tây Nam (Gió Lào khô nóng) */}
                      <path
                        d="M140 180 C180 170, 200 180, 220 170"
                        stroke="#fbbf24"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                      />
                      <text x="130" y="165" fill="#fde68a" fontSize="8" fontWeight="bold">
                        Gió Phơn khô nóng
                      </text>
                    </g>
                  )}

                  {/* Storm Tracks (Bão theo tháng) */}
                  {showStormLayers && (
                    <g>
                      <path d="M370 110 C 310 100, 260 110, 210 90" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" />
                      <text x="375" y="112" fill="#fcd34d" fontSize="9" fontWeight="bold">Tháng 6, 7, 8</text>

                      <path d="M390 230 C 330 220, 280 230, 235 220" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5 3" />
                      <text x="395" y="234" fill="#fca5a5" fontSize="9" fontWeight="bold">Tháng 9, 10, 11</text>

                      <path d="M360 320 C 300 330, 250 340, 215 345" stroke="#f97316" strokeWidth="2" strokeDasharray="5 3" />
                      <text x="365" y="324" fill="#fdba74" fontSize="9" fontWeight="bold">Tháng 12</text>
                    </g>
                  )}

                  {/* Weather Station Pins */}
                  {CLIMATE_STATIONS.map((st) => {
                    const isSelected = selectedStation.id === st.id;
                    return (
                      <g
                        key={st.id}
                        className="cursor-pointer"
                        onClick={() => handleSelectStation(st)}
                        transform={`translate(${st.map3DCoords.x}, ${st.map3DCoords.y})`}
                      >
                        <circle
                          r={isSelected ? '8' : '5'}
                          fill={isSelected ? '#ef4444' : '#ffffff'}
                          stroke={isSelected ? '#fde047' : '#059669'}
                          strokeWidth="2"
                        />
                        {isSelected && (
                          <circle r="14" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping" opacity="0.6" />
                        )}
                        <text
                          y="-8"
                          fill={isSelected ? '#fde047' : '#f8fafc'}
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {st.name.split(' (')[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Bottom Quick Legend */}
              <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Miền Bắc (B)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Miền Nam (N)
                  </span>
                </div>
                <span className="font-bold text-amber-300">Hoàng Sa & Trường Sa là của Việt Nam</span>
              </div>
            </div>
          )}

          {/* 7 Climate Zones Bar */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              7 Vùng khí hậu theo Atlat Địa lí Việt Nam (Bấm để xem đặc điểm):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CLIMATE_ZONES.map((zone) => {
                const isSelected = selectedZone.id === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => handleSelectZone(zone)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: zone.color }} />
                    <span>{zone.name.replace('Vùng khí hậu ', '')}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED STATION CLIMATE DIAGRAM & DATA (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Station Profile Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {selectedStation.regionName} — Miền {selectedStation.domain}
                </span>
                <h3 className="text-xl font-black text-white mt-1">{selectedStation.name}</h3>
              </div>
              <div className="p-2 rounded-2xl bg-white/10 text-amber-400">
                <Thermometer className="w-6 h-6" />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <p className="text-slate-400 text-[11px]">Nhiệt độ TB năm:</p>
                <p className="text-base font-black text-emerald-400 mt-0.5">{selectedStation.tempAnnual}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Biên độ: {selectedStation.tempAmp}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <p className="text-slate-400 text-[11px]">Tổng lượng mưa năm:</p>
                <p className="text-base font-black text-cyan-400 mt-0.5">{selectedStation.rainfallAnnual}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Mùa mưa: {selectedStation.rainySeason.split(' (')[0]}</p>
              </div>
            </div>

            {/* CLIMATE DIAGRAM (BIỂU ĐỒ NHIỆT ĐỘ & LƯỢNG MƯA ATLAT) */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-800">
                <span className="font-bold text-slate-300">Biểu đồ Nhiệt — Ẩm 12 Tháng:</span>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                    <span className="w-2.5 h-2.5 bg-cyan-500 rounded-xs inline-block" /> Lượng mưa (mm)
                  </span>
                  <span className="flex items-center gap-1 text-red-400 font-semibold">
                    <span className="w-2.5 h-1 bg-red-500 inline-block" /> Nhiệt độ (°C)
                  </span>
                </div>
              </div>

              {/* 12-Month Bar Chart */}
              <div className="relative h-32 pt-4 flex items-end justify-between gap-1 border-b border-slate-700">
                {selectedStation.monthlyRain.map((rain, idx) => {
                  const barHeight = Math.min(Math.round((rain / maxRain) * 100), 100);
                  const temp = selectedStation.monthlyTemp[idx];
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group/bar relative">
                      {/* Temp Dot */}
                      <div
                        className="absolute w-2 h-2 rounded-full bg-red-500 border border-white z-10 transition group-hover/bar:scale-125"
                        style={{ bottom: `${Math.round((temp / 35) * 100)}%` }}
                        title={`Tháng ${idx + 1}: ${temp}°C`}
                      />

                      {/* Rain Bar */}
                      <div
                        className="w-full bg-gradient-to-t from-cyan-600 to-sky-400 rounded-t-xs transition-all duration-300 group-hover/bar:from-cyan-400 group-hover/bar:to-sky-300"
                        style={{ height: `${Math.max(barHeight, 4)}%` }}
                        title={`Tháng ${idx + 1}: ${rain} mm, ${temp}°C`}
                      />

                      {/* Month Label */}
                      <span className="text-[9px] font-bold text-slate-400 mt-1 select-none">
                        {months[idx]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Special Climate Features */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Hiện tượng thời tiết & Rủi ro:</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">{selectedStation.specialPhenomena}</p>
              <p className="text-amber-200/90 text-[11px]">
                <strong>Thiên tai chính:</strong> {selectedStation.riskFactor}
              </p>
            </div>

            {/* Action for High School Students */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Hành động thích ứng của học sinh:</span>
              </div>
              <p className="text-emerald-100 text-[11px] leading-relaxed font-medium">
                {selectedStation.schoolAction}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
