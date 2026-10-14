/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  Shield,
  Sparkles,
  Mountain,
  CloudRain,
  TreePine,
  Waves,
  Flag,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Thermometer,
  Droplets,
  Wind,
  Award,
  Layers,
} from 'lucide-react';

export interface RegionalClimateData {
  id: string;
  name: string;
  shortName: string;
  subRegion: string;
  coords: { x: number; y: number };
  color: string;
  gradient: string;
  slogan: string;
  temperatureRange: string;
  rainfallAnnual: string;
  climateRiskLevel: 'Rất Cao' | 'Cao' | 'Trung Bình';
  challenges: string;
  solutions: string;
  schoolAction: string;
  suggestedProject: string;
  icon: React.ElementType;
}

export const VIETNAM_REGIONS: RegionalClimateData[] = [
  {
    id: 'north',
    name: 'Bắc Bộ & Thủ Đô Hà Nội',
    shortName: 'Bắc Bộ',
    subRegion: 'Đồng bằng sông Hồng & Trung du miền núi phía Bắc',
    coords: { x: 175, y: 78 },
    color: '#059669',
    gradient: 'from-emerald-600 to-teal-700',
    slogan: 'Năng Lượng Sạch & Giao Thông Xanh Học Đường',
    temperatureRange: '15°C - 39°C (Biên độ nhiệt năm lớn)',
    rainfallAnnual: '1.600 - 2.000 mm/năm',
    climateRiskLevel: 'Cao',
    challenges: 'Ô nhiễm không khí bụi mịn PM2.5 vào mùa đông do nghịch nhiệt; các đợt nắng nóng gay gắt đầu hè làm tăng tải lưới điện.',
    solutions: 'Mở rộng vành đai xanh đô thị, thúc đẩy xe buýt điện công cộng và phát triển điện gió ngoài khơi Bạch Long Vĩ.',
    schoolAction: 'Ưu tiên đi xe buýt điện, xe đạp, tích cực tham gia trồng cây xanh khuôn viên trường và tắt điều hòa sớm 30 phút.',
    suggestedProject: 'Bản đồ chất lượng không khí học đường & Chiến dịch "Lớp học không khói xe".',
    icon: Mountain,
  },
  {
    id: 'central',
    name: 'Miền Trung Kiên Cường',
    shortName: 'Miền Trung',
    subRegion: 'Bắc Trung Bộ & Duyên hải Nam Trung Bộ',
    coords: { x: 235, y: 168 },
    color: '#d97706',
    gradient: 'from-amber-600 to-orange-700',
    slogan: 'Lá Chắn Rừng Phòng Hộ — Thích Ứng Siêu Bão & Gió Lào',
    temperatureRange: '18°C - 41°C (Gió Phơn khô rát mùa hè)',
    rainfallAnnual: '1.800 - 2.800 mm/năm (Mưa dồn dập tháng 9 - 11)',
    climateRiskLevel: 'Rất Cao',
    challenges: 'Hứng chịu bão lũ dồn dập cuối năm, sạt lở đất sườn đông Trường Sơn và hiện tượng gió Phơn Tây Nam khô nóng cực đoan.',
    solutions: 'Trồng rừng phòng hộ chắn cát ven biển (phi lao, bàng biển), giữ rừng tự nhiên đầu nguồn Trường Sơn và xây trường học kiên cố chống bão.',
    schoolAction: 'Học sinh tham gia diễn tập an toàn thiên tai, xây dựng bản đồ số các điểm tránh lũ an toàn tại địa phương.',
    suggestedProject: 'Mô hình "Trường học Thích ứng Lũ lụt" & Vườn ươm phi lao chắn sóng học sinh.',
    icon: CloudRain,
  },
  {
    id: 'highlands',
    name: 'Tây Nguyên Đại Ngàn',
    shortName: 'Tây Nguyên',
    subRegion: 'Vùng cao nguyên bazan 5 tỉnh Tây Nguyên',
    coords: { x: 252, y: 242 },
    color: '#0d9488',
    gradient: 'from-teal-600 to-emerald-800',
    slogan: 'Bảo Vệ Rừng Đầu Nguồn & Giữ Vững Mạch Nước Ngầm',
    temperatureRange: '16°C - 33°C (Khí hậu cao nguyên 2 mùa rõ rệt)',
    rainfallAnnual: '1.900 - 2.500 mm/năm',
    climateRiskLevel: 'Cao',
    challenges: 'Suy giảm tầng nước ngầm nghiêm trọng, khô hạn kéo dài mùa khô ảnh hưởng nặng nề đến tưới tiêu cà phê, hồ tiêu.',
    solutions: 'Phục hồi độ che phủ rừng tự nhiên, áp dụng kỹ thuật tưới nhỏ giọt tiết kiệm nước và trữ nước hồ sinh thái.',
    schoolAction: 'Thực hành tiết kiệm nước từng giọt tại trường nội trú, trồng cây che phủ đất và tuyên truyền bảo vệ động vật hoang dã.',
    suggestedProject: 'Hệ thống tưới cây tự động bằng cảm biến độ ẩm đất trong khuôn viên trường học.',
    icon: TreePine,
  },
  {
    id: 'south',
    name: 'Nam Bộ & ĐBSCL',
    shortName: 'ĐBSCL & Nam Bộ',
    subRegion: 'Đông Nam Bộ & Đồng bằng sông Cửu Long',
    coords: { x: 195, y: 318 },
    color: '#0284c7',
    gradient: 'from-cyan-600 to-blue-700',
    slogan: 'Sống Chung Với Hạn Mặn — Giữ Vững Vựa Lúa Quốc Gia',
    temperatureRange: '25°C - 36°C (Cận xích đạo nóng ẩm quanh năm)',
    rainfallAnnual: '1.400 - 2.200 mm/năm',
    climateRiskLevel: 'Rất Cao',
    challenges: 'Xâm nhập mặn sâu 50 - 70km vào nội đồng, sạt lở bờ sông kênh rạch, triều cường đô thị và nước biển dâng.',
    solutions: 'Chuyển đổi cơ cấu cây trồng thích ứng mặn, bảo vệ và phục hồi rừng ngập mặn Cà Mau, Trà Vinh, trữ nước mưa.',
    schoolAction: 'Học sinh tiên phong trữ nước mưa sinh hoạt, nói không với túi nilon làm tắc nghẽn kênh rạch Nam Bộ.',
    suggestedProject: 'Trạm lọc và đo độ mặn nước ngọt trường học & Vườn ươm mầm đước xanh.',
    icon: Waves,
  },
  {
    id: 'islands',
    name: 'Biển Đảo Hoàng Sa & Trường Sa',
    shortName: 'Biển Đảo Quê Hương',
    subRegion: 'Quần đảo Hoàng Sa (Đà Nẵng) & Quần đảo Trường Sa (Khánh Hòa)',
    coords: { x: 330, y: 218 },
    color: '#e11d48',
    gradient: 'from-rose-600 to-red-700',
    slogan: 'Bảo Vệ Đại Dương Xanh & Khẳng Định Chủ Quyền Thiêng Liêng',
    temperatureRange: '26°C - 34°C (Khí hậu hải dương nhiệt đới)',
    rainfallAnnual: '2.000 - 2.600 mm/năm',
    climateRiskLevel: 'Rất Cao',
    challenges: 'Rác thải nhựa trôi nổi đại dương, hiện tượng axit hóa nước biển và biến đổi khí hậu gây tẩy trắng các rạn san hô quý.',
    solutions: 'Kiểm soát xả thải nhựa từ đất liền, bảo tồn các khu bảo tồn biển và phát triển năng lượng gió, mặt trời trên các đảo.',
    schoolAction: 'Cự tuyệt tuyệt đối sản phẩm nhựa dùng một lần, tìm hiểu luật biển và lan tỏa tình yêu chủ quyền biển đảo Tổ quốc.',
    suggestedProject: 'Chiến dịch học đường "Triệu Lời Cam Kết Vì Biển Đảo Hoàng Sa — Trường Sa Không Rác Thải Nhựa".',
    icon: Flag,
  },
];

export const VietnamClimateMap3D: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionalClimateData>(VIETNAM_REGIONS[1]); // Default Central
  const [viewMode, setViewMode] = useState<'map' | 'hero3d'>('map');

  const RegionIcon = selectedRegion.icon;

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-white/95 via-emerald-50/60 to-teal-50/70 border border-emerald-300 shadow-2xl p-5 sm:p-8 backdrop-blur-md relative overflow-hidden space-y-6">
      {/* Decorative ambient lighting aura */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Control Header & Mode Switcher */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mô Hình Địa Lý Khí Hậu Sinh Thái Tương Tác</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            {viewMode === 'map'
              ? 'Bản Đồ Khí Hậu 5 Vùng Sinh Thái Việt Nam'
              : 'Hiệp Sĩ Xanh THPT & Quả Cầu Sinh Thái Net Zero 2050'}
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Khẳng định toàn vẹn lãnh thổ, đất liền và hai quần đảo Hoàng Sa — Trường Sa thiêng liêng của Tổ quốc
          </p>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200 self-start sm:self-auto shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'map'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Bản Đồ Tương Tác</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('hero3d')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'hero3d'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Hiệp Sĩ Xanh 3D</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      {viewMode === 'map' ? (
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT: INTERACTIVE 3D VIETNAM MAP (6 Cols) */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center p-4 bg-white/75 rounded-3xl border border-emerald-200/90 shadow-inner">
            <div className="w-full max-w-[440px] aspect-[4/5] relative">
              <svg
                viewBox="0 0 430 450"
                className="w-full h-full drop-shadow-xl select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Topographic Land Gradient */}
                  <linearGradient id="mapCoastGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="35%" stopColor="#059669" />
                    <stop offset="70%" stopColor="#0d9488" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>

                  <linearGradient id="mapShadowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#064e3b" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </linearGradient>

                  <linearGradient id="flagYellowStar" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="100%" stopColor="#eab308" />
                  </linearGradient>
                </defs>

                {/* Ocean Ambient Waves */}
                <path
                  d="M20 200 C 60 190, 100 210, 140 200 C 180 190, 220 210, 260 200 C 300 190, 340 210, 380 200"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  strokeOpacity="0.3"
                  strokeDasharray="4 6"
                />
                <path
                  d="M10 260 C 50 250, 90 270, 130 260 C 170 250, 210 270, 250 260 C 290 250, 330 270, 370 260"
                  stroke="#0284c7"
                  strokeWidth="1.5"
                  strokeOpacity="0.25"
                  strokeDasharray="5 7"
                />

                {/* 3D Depth Layer */}
                <path
                  d="M130 50 C 170 20, 220 25, 245 45 C 275 68, 255 95, 230 110 C 210 120, 220 150, 245 170 C 275 195, 280 235, 260 280 C 245 315, 195 365, 150 375 C 130 375, 130 345, 165 320 C 195 295, 215 260, 205 230 C 190 195, 165 165, 155 130 C 140 95, 105 75, 130 50 Z"
                  fill="url(#mapShadowGradient)"
                  transform="translate(10, 14)"
                  opacity="0.6"
                />

                {/* Main Vietnam Landmass (S-Shape Topography) */}
                <path
                  d="M130 50 C 170 20, 220 25, 245 45 C 275 68, 255 95, 230 110 C 210 120, 220 150, 245 170 C 275 195, 280 235, 260 280 C 245 315, 195 365, 150 375 C 130 375, 130 345, 165 320 C 195 295, 215 260, 205 230 C 190 195, 165 165, 155 130 C 140 95, 105 75, 130 50 Z"
                  fill="url(#mapCoastGradient)"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                />

                {/* Mountain Ridge line (Dãy Trường Sơn Hùng Vĩ) */}
                <path
                  d="M195 85 Q 185 130, 220 170 T 240 240 T 195 295"
                  stroke="#a7f3d0"
                  strokeWidth="3.5"
                  strokeDasharray="4 6"
                  strokeLinecap="round"
                />

                {/* =======================================================
                    HẢI ĐẢO & QUẦN ĐẢO THIÊNG LIÊNG CỦA VIỆT NAM
                    ======================================================= */}
                {/* 1. Quần đảo Hoàng Sa (TP. Đà Nẵng) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedRegion(VIETNAM_REGIONS[4])}
                >
                  <circle cx="330" cy="155" r="24" fill="#ef4444" fillOpacity="0.18" className="animate-pulse" />
                  <ellipse cx="330" cy="155" rx="17" ry="11" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                  <ellipse cx="344" cy="163" rx="10" ry="7" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                  <ellipse cx="320" cy="165" rx="8" ry="5" fill="#34d399" />
                  {/* Flag Icon */}
                  <circle cx="330" cy="138" r="8" fill="#dc2626" />
                  <path d="M330 133 L332 137 L336 137 L333 139 L334 143 L330 141 L326 143 L327 139 L324 137 L328 137 Z" fill="url(#flagYellowStar)" />
                  <text x="330" y="125" fill="#dc2626" fontSize="11" fontWeight="900" textAnchor="middle">
                    QĐ. HOÀNG SA
                  </text>
                  <text x="330" y="184" fill="#065f46" fontSize="9" fontWeight="bold" textAnchor="middle">
                    (TP. Đà Nẵng)
                  </text>
                </g>

                {/* 2. Quần đảo Trường Sa (Tỉnh Khánh Hòa) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => setSelectedRegion(VIETNAM_REGIONS[4])}
                >
                  <circle cx="348" cy="285" r="26" fill="#ef4444" fillOpacity="0.18" className="animate-pulse" />
                  <ellipse cx="348" cy="285" rx="19" ry="12" fill="#0d9488" stroke="#ffffff" strokeWidth="2" />
                  <ellipse cx="364" cy="296" rx="11" ry="8" fill="#14b8a6" stroke="#ffffff" strokeWidth="1.5" />
                  <ellipse cx="333" cy="298" rx="9" ry="6" fill="#2dd4bf" />
                  <ellipse cx="350" cy="310" rx="8" ry="5" fill="#5eead4" />
                  {/* Flag Icon */}
                  <circle cx="348" cy="265" r="8" fill="#dc2626" />
                  <path d="M348 260 L350 264 L354 264 L351 266 L352 270 L348 268 L344 270 L345 266 L342 264 L346 264 Z" fill="url(#flagYellowStar)" />
                  <text x="348" y="252" fill="#dc2626" fontSize="11" fontWeight="900" textAnchor="middle">
                    QĐ. TRƯỜNG SA
                  </text>
                  <text x="348" y="328" fill="#115e59" fontSize="9" fontWeight="bold" textAnchor="middle">
                    (Tỉnh Khánh Hòa)
                  </text>
                </g>

                {/* 3. Đảo Phú Quốc (Kiên Giang) */}
                <g transform="translate(120, 360)">
                  <ellipse cx="0" cy="0" rx="10" ry="15" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                  <text x="0" y="24" fill="#065f46" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Phú Quốc
                  </text>
                </g>

                {/* 4. Côn Đảo (Bà Rịa - Vũng Tàu) */}
                <g transform="translate(195, 385)">
                  <ellipse cx="0" cy="0" rx="7" ry="6" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="0" y="16" fill="#075985" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Côn Đảo
                  </text>
                </g>

                {/* 5. Đảo Bạch Long Vĩ & Cát Bà (Bắc Bộ) */}
                <g transform="translate(230, 80)">
                  <circle cx="0" cy="0" r="5" fill="#059669" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="16" cy="14" r="3.5" fill="#10b981" />
                  <text x="12" y="-6" fill="#065f46" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Bạch Long Vĩ
                  </text>
                </g>

                {/* =======================================================
                    CÁC GHIM TƯƠNG TÁC ĐỊA LÝ (INTERACTIVE PINS DIRECTLY ON MAP)
                    ======================================================= */}
                {VIETNAM_REGIONS.map((region) => {
                  const isSelected = selectedRegion.id === region.id;
                  return (
                    <g
                      key={region.id}
                      transform={`translate(${region.coords.x}, ${region.coords.y})`}
                      onClick={() => setSelectedRegion(region)}
                      className="cursor-pointer transition-all duration-300"
                    >
                      {/* Radar Ping Ripple when selected */}
                      {isSelected && (
                        <>
                          <circle cx="0" cy="0" r="22" fill={region.color} fillOpacity="0.25" className="animate-ping" />
                          <circle cx="0" cy="0" r="16" fill={region.color} fillOpacity="0.3" />
                        </>
                      )}

                      {/* Pin Center Glow */}
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? "14" : "10"}
                        fill={region.color}
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        className="drop-shadow-lg transition-transform hover:scale-125"
                      />

                      {/* Small center dot */}
                      <circle cx="0" cy="0" r="4" fill="#ffffff" />
                    </g>
                  );
                })}
              </svg>

              {/* Map Legend Floating Tag */}
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-300 shadow-sm text-[10px] text-slate-700 font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Nhấp trực tiếp vào các điểm ghim trên bản đồ</span>
              </div>
            </div>

            {/* Quick Pill Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 pt-2 border-t border-slate-100 w-full">
              {VIETNAM_REGIONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRegion(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedRegion.id === r.id
                      ? 'bg-slate-900 text-white shadow-md scale-105'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50'
                  }`}
                >
                  {r.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: REGIONAL CLIMATE SPOTLIGHT DETAIL CARD (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white/95 border border-emerald-300 rounded-3xl p-6 shadow-xl space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${selectedRegion.gradient} text-white flex items-center justify-center shadow-lg`}>
                    <RegionIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                      Hồ Sơ Khí Hậu Sinh Thái Vùng
                    </span>
                    <h4 className="text-lg font-black text-slate-900">{selectedRegion.name}</h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Rủi ro: {selectedRegion.climateRiskLevel}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{selectedRegion.subRegion}</p>
                </div>
              </div>

              {/* Climate Stats Strip */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Biên độ nhiệt</p>
                    <p className="font-semibold text-slate-800 text-[11px]">{selectedRegion.temperatureRange}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Lượng mưa năm</p>
                    <p className="font-semibold text-slate-800 text-[11px]">{selectedRegion.rainfallAnnual}</p>
                  </div>
                </div>
              </div>

              {/* Slogan Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white shadow-md border border-emerald-500/30">
                <p className="text-xs font-black text-emerald-300 flex items-center gap-2">
                  <span>🚩 Khẩu hiệu hành động khí hậu:</span>
                </p>
                <p className="text-sm font-black text-white mt-0.5 tracking-wide">
                  "{selectedRegion.slogan}"
                </p>
              </div>

              {/* 4 Structured Insights */}
              <div className="space-y-2.5 pt-1">
                {/* 1. Climate Challenges */}
                <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Thách thức thiên tai & biến đổi khí hậu:</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium pl-5">
                    {selectedRegion.challenges}
                  </p>
                </div>

                {/* 2. Solutions */}
                <div className="p-3 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                    <Lightbulb className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Chiến lược thích ứng & Giảm nhẹ quốc gia:</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium pl-5">
                    {selectedRegion.solutions}
                  </p>
                </div>

                {/* 3. High School Action */}
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Hành động học sinh THPT:</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-bold pl-5">
                    {selectedRegion.schoolAction}
                  </p>
                </div>

                {/* 4. Suggested Project for SKKN */}
                <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 text-[11px] text-purple-950 flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-700 shrink-0" />
                  <span><strong>Ý tưởng dự án SKKN gợi ý:</strong> {selectedRegion.suggestedProject}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* HERO 3D GUARDIAN & GLOSSY TRANSLUCENT EARTH VIEW */
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4">
          <div className="lg:col-span-6 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Biểu Tượng Thế Hệ Trẻ Tiên Phong Vì Môi Trường</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Hiệp Sĩ Xanh THPT — Lá Chắn Bảo Vệ Hành Tinh Xanh
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Mỗi học sinh THPT không chỉ là người tiếp nhận kiến thức mà chính là một "Đại sứ Xanh" tích cực. Với sự đồng hành của công nghệ AI hiện đại, các em hoàn toàn có thể định lượng được tác động cá nhân, thay đổi thói quen và lan tỏa lối sống bền vững trong nhà trường và cộng đồng.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-1">
                <span className="text-xs font-black text-emerald-800">🎯 Mục Tiêu Net Zero 2050</span>
                <p className="text-[11px] text-slate-600">
                  Cam kết của Thủ tướng Chính phủ tại COP26, đưa Việt Nam trở thành quốc gia phát thải ròng bằng 0 vào năm 2050.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-teal-200 shadow-sm space-y-1">
                <span className="text-xs font-black text-teal-800">🌱 Giáo Dục GDPT 2018</span>
                <p className="text-[11px] text-slate-600">
                  Tích hợp liên môn Địa lý, Sinh học và Hoạt động trải nghiệm, hình thành phẩm chất yêu nước và trách nhiệm công dân.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex items-center justify-center">
            {/* Glossy 3D Earth & Guardian Artwork */}
            <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400/25 via-teal-300/30 to-cyan-400/25 blur-3xl animate-pulse" />

              <svg
                viewBox="0 0 400 400"
                className="w-full h-full drop-shadow-2xl select-none relative z-10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <radialGradient id="guardianGlobeGrad" cx="30%" cy="25%" r="70%">
                    <stop offset="0%" stopColor="#ecfdf5" stopOpacity="0.95" />
                    <stop offset="40%" stopColor="#6ee7b7" stopOpacity="0.75" />
                    <stop offset="70%" stopColor="#10b981" stopOpacity="0.85" />
                    <stop offset="95%" stopColor="#047857" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#064e3b" stopOpacity="1" />
                  </radialGradient>

                  <radialGradient id="guardianSheen" cx="35%" cy="25%" r="65%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                    <stop offset="35%" stopColor="#ffffff" stopOpacity="0.3" />
                    <stop offset="75%" stopColor="#a7f3d0" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.4" />
                  </radialGradient>

                  <linearGradient id="guardianCape" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>

                  <linearGradient id="skinTone" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fed7aa" />
                    <stop offset="100%" stopColor="#fba866" />
                  </linearGradient>
                </defs>

                {/* 3D Glossy Sphere */}
                <circle cx="200" cy="200" r="140" fill="url(#guardianGlobeGrad)" />
                <path
                  d="M160 120 C 190 110, 230 125, 250 145 C 265 165, 260 195, 235 210 C 215 220, 205 245, 195 265 C 185 275, 175 265, 165 245 C 150 220, 140 185, 145 155 Z"
                  fill="#34d399"
                  fillOpacity="0.75"
                />
                <circle cx="260" cy="220" r="14" fill="#059669" fillOpacity="0.7" />

                {/* Vietnam S-Curve Highlight */}
                <path
                  d="M205 150 Q 220 180, 205 210 T 215 245"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="3 4"
                />

                {/* Glass Sheen */}
                <circle cx="200" cy="200" r="140" fill="url(#guardianSheen)" />

                {/* Guardian Student Silhouette with Eco Shield */}
                <g transform="translate(100, 110)">
                  {/* Shield */}
                  <path
                    d="M30 15 L 60 28 C 60 70, 36 100, 30 110 C 24 100, 0 70, 0 28 Z"
                    fill="#38bdf8"
                    fillOpacity="0.7"
                    stroke="#ffffff"
                    strokeWidth="3"
                  />
                  <circle cx="30" cy="55" r="14" fill="#ffffff" fillOpacity="0.8" />
                  <path d="M30 45 C 34 45, 38 52, 30 60 C 22 52, 26 45, 30 45 Z" fill="#059669" />

                  {/* Character Head */}
                  <circle cx="95" cy="40" r="24" fill="url(#skinTone)" />
                  <ellipse cx="95" cy="30" rx="26" ry="18" fill="#0f172a" />
                  <circle cx="88" cy="40" r="3" fill="#0f172a" />
                  <circle cx="102" cy="40" r="3" fill="#0f172a" />
                  <path d="M91 52 Q 95 56, 99 52" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" fill="none" />

                  {/* Uniform Jacket */}
                  <path
                    d="M68 64 C 80 58, 110 58, 122 64 L 130 140 C 105 148, 85 148, 60 140 Z"
                    fill="url(#guardianCape)"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle cx="82" cy="80" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                </g>
              </svg>

              {/* Badges */}
              <div className="absolute -top-3 -right-2 bg-white/95 backdrop-blur-md border border-emerald-400 shadow-xl rounded-2xl p-2.5 flex items-center gap-2 z-20">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black">
                  <TreePine className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-400">Cam Kết</p>
                  <p className="text-xs font-black text-slate-900">Net Zero 2050</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
