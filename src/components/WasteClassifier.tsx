/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  ScanSearch,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Recycle,
  Apple,
  Trash,
  Clock,
  Lightbulb,
  ShieldCheck,
  BatteryCharging,
  AlertTriangle,
  Search,
  BookOpen,
} from 'lucide-react';
import { PresetSample, WasteAnalysisResult, WasteCategory } from '../types';
import { classifyWasteImage } from '../services/geminiService';

// High-fidelity SVG Data URI images for the 4 preset samples
const BOTTLE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none"><rect width="400" height="300" fill="%23f0fdf4"/><path d="M185 50h30v25h-30z" fill="%230284c7"/><rect x="175" y="75" width="50" height="25" rx="5" fill="%230369a1"/><path d="M160 100c0-10 15-20 40-20s40 10 40 20v140c0 15-15 20-40 20s-40-5-40-20V100z" fill="%2338bdf8" fill-opacity="0.25" stroke="%230284c7" stroke-width="5"/><rect x="160" y="145" width="80" height="50" fill="%230284c7" fill-opacity="0.3" stroke="%230284c7" stroke-width="2"/><text x="200" y="175" fill="%230369a1" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">AQUAFINA</text><path d="M180 120h40M180 220h40" stroke="%2338bdf8" stroke-width="3" stroke-linecap="round"/></svg>`;

const BANANA_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none"><rect width="400" height="300" fill="%23f0fdf4"/><path d="M130 90c30 40 50 110 140 130 20 5 40-5 50-15-5 15-25 30-55 25-85-15-125-90-145-135-5-10 5-15 10-5z" fill="%23eab308"/><path d="M130 90c-5-10-15-15-25-15 5 10 10 15 20 20l5-5z" fill="%23713f12"/><path d="M145 105c20 30 45 85 115 105" stroke="%23ca8a04" stroke-width="3" stroke-linecap="round"/><circle cx="210" cy="180" r="4" fill="%23713f12"/><circle cx="240" cy="195" r="3" fill="%23713f12"/><text x="200" y="270" fill="%23713f12" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">Vỏ chuối chín / Rác thực phẩm</text></svg>`;

const BATTERY_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none"><rect width="400" height="300" fill="%23fff1f2"/><rect x="160" y="70" width="80" height="150" rx="10" fill="%23e11d48" stroke="%239f1239" stroke-width="4"/><rect x="185" y="50" width="30" height="20" rx="3" fill="%239f1239"/><text x="200" y="145" fill="%23ffffff" font-size="28" font-family="sans-serif" font-weight="bold" text-anchor="middle">PIN AA</text><text x="200" y="175" fill="%23ffffff" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">NGUY HẠI</text><circle cx="200" cy="245" r="16" fill="%23e11d48"/><path d="M195 245h10M200 240v10" stroke="%23ffffff" stroke-width="2" stroke-linecap="round"/></svg>`;

const PLASTIC_BAG_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none"><rect width="400" height="300" fill="%23fefce8"/><path d="M150 90h20v40h-20zm80 0h20v40h-20z" fill="%23eab308" fill-opacity="0.3"/><path d="M130 120h140l15 120c0 15-20 20-85 20s-85-5-85-20l15-120z" fill="%23facc15" fill-opacity="0.25" stroke="%23ca8a04" stroke-width="4"/><path d="M165 140c20 30 50 20 70 0M160 180c25 20 60 15 80-5" stroke="%23ca8a04" stroke-width="3" stroke-linecap="round"/><text x="200" y="220" fill="%23a16207" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">TÚI NILON / RÁC KHÁC</text></svg>`;

const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'sample-bottle',
    name: 'Vỏ chai nhựa PET',
    category: 'Rác tái chế',
    thumbnailUrl: BOTTLE_SVG,
    description: 'Chai nước khoáng hoặc nước ngọt rỗng dùng 1 lần',
    analysis: {
      item_name: 'Vỏ chai nhựa PET (Polyethylene terephthalate)',
      waste_type: 'Rác tái chế',
      decomposition_time: 'Ước tính khoảng 450 - 500 năm (nghiên cứu NOAA/EPA)',
      instruction: 'Uống cạn nước, súc sạch cặn, tháo nhãn nilon nếu có, bóp dẹp thân chai để tiết kiệm thể tích và vứt vào Thùng rác Tái chế (Màu Trắng hoặc Xanh dương).',
      eco_impact: 'Nếu thải ra đại dương, chai nhựa bị phân rã quang học thành hàng triệu hạt vi nhựa (microplastics) ngấm vào nguồn nước và chuỗi thực phẩm.',
      alternative: 'Mang bình nước inox giữ nhiệt cá nhân để lấy nước tại trạm lọc nước sạch trường học, vừa tiết kiệm tiền vừa giảm phát thải.',
      isDemo: true,
    },
  },
  {
    id: 'sample-banana',
    name: 'Vỏ chuối / Thức ăn thừa',
    category: 'Rác thực phẩm',
    thumbnailUrl: BANANA_SVG,
    description: 'Vỏ hoa quả ăn vặt, cuống rau, thức ăn thừa sau giờ ra chơi',
    analysis: {
      item_name: 'Vỏ chuối / Chất thải thực phẩm hữu cơ',
      waste_type: 'Rác thực phẩm',
      decomposition_time: 'Ước tính khoảng 2 - 4 tuần trong môi trường tự nhiên',
      instruction: 'Tách biệt không để lẫn túi nilon hay thìa nhựa, vứt vào Thùng rác Thực phẩm (Màu Xanh lá cây) hoặc gom làm phân ủ compost bón cho cây xanh của trường.',
      eco_impact: 'Nếu bị chôn lấp lẫn với rác vô cơ trong điều kiện thiếu khí, rác thực phẩm sinh ra khí Methane (CH4) - khí nhà kính mạnh gấp 28 lần CO2.',
      alternative: 'Tận dụng làm phân hữu cơ tự nhiên cho câu lạc bộ sinh học trường học hoặc làm thức ăn chăn nuôi.',
      isDemo: true,
    },
  },
  {
    id: 'sample-battery',
    name: 'Pin cũ / Rác nguy hại',
    category: 'Rác nguy hại',
    thumbnailUrl: BATTERY_SVG,
    description: 'Pin tiểu AA/AAA, pin máy tính Casio, pin dự phòng hỏng',
    analysis: {
      item_name: 'Pin tiểu kiềm / Chất thải nguy hại học đường',
      waste_type: 'Rác nguy hại',
      decomposition_time: 'Chứa kim loại nặng không tự phân hủy sinh học, tồn lưu vĩnh viễn',
      instruction: 'TUYỆT ĐỐI KHÔNG vứt vào thùng rác chung hay đốt bỏ! Bỏ vào Thùng/Hộp Thu Gom Pin Cũ riêng biệt (Thùng màu Đỏ hoặc Trạm thu gom pin của Đoàn trường).',
      eco_impact: '1 viên pin có thể làm ô nhiễm 500 lít nước hoặc 1m3 đất trong 50 năm do rò rỉ kim loại nặng thủy ngân, chì, cadmium gây ngộ độc thần kinh.',
      alternative: 'Chuyển sang sử dụng pin sạc lại được nhiều lần (Rechargeable Batteries) hoặc thiết bị dùng năng lượng mặt trời.',
      isDemo: true,
    },
  },
  {
    id: 'sample-bag',
    name: 'Túi nilon / Hộp xốp',
    category: 'Rác sinh hoạt khác',
    thumbnailUrl: PLASTIC_BAG_SVG,
    description: 'Bao bì bánh kẹo màng nhôm, túi bóng mỏng xách đồ ăn',
    analysis: {
      item_name: 'Túi nilon mỏng / Rác sinh hoạt khó phân hủy',
      waste_type: 'Rác sinh hoạt khác',
      decomposition_time: 'Ước tính từ 500 đến hơn 1.000 năm trong bãi chôn lấp',
      instruction: 'Vứt vào Thùng rác Sinh hoạt khác (Màu Vàng, Cam hoặc Xám tùy địa phương). Tuyệt đối không tự ý đốt vì sinh khí độc Dioxin và Furan.',
      eco_impact: 'Tắc nghẽn cống rãnh gây ngập úng mùa mưa lũ, ngăn cản oxy ngấm vào lòng đất khiến cây xanh còi cọc.',
      alternative: 'Sử dụng túi vải canvas đi học, túi cói, hoặc hộp đựng thực phẩm bằng bã mía sinh học tự phân hủy.',
      isDemo: true,
    },
  },
];

// Common High School Waste Items Directory (Cẩm nang 20 loại rác học đường)
interface SchoolWasteEntry {
  name: string;
  category: WasteCategory;
  binColor: string;
  tip: string;
}

const COMMON_SCHOOL_WASTE_ITEMS: SchoolWasteEntry[] = [
  { name: 'Vỏ hộp sữa giấy (Fami, Vinamilk, Milo)', category: 'Rác tái chế', binColor: 'Trắng / Xanh dương', tip: 'Bóc 4 góc, ép phẳng, cắm ống hút vào trong hoặc tháo riêng.' },
  { name: 'Giấy kiểm tra, giấy nháp, vở học sinh cũ', category: 'Rác tái chế', binColor: 'Trắng / Xanh dương', tip: 'Không để dính dầu mỡ đồ ăn hoặc nước ngọt.' },
  { name: 'Chai nước khoáng nhựa PET', category: 'Rác tái chế', binColor: 'Trắng / Xanh dương', tip: 'Uống cạn nước, bóp dẹp thân chai để tiết kiệm thể tích thùng.' },
  { name: 'Vỏ lon nhôm (Cocacola, Pepsi, Redbull)', category: 'Rác tái chế', binColor: 'Trắng / Xanh dương', tip: 'Dốc sạch nước đọng, dẫm dẹp vỏ lon.' },
  { name: 'Bìa carton, thùng giấy đựng sách vở', category: 'Rác tái chế', binColor: 'Trắng / Xanh dương', tip: 'Gập phẳng xếp gọn gàng ở góc khu tái chế.' },
  { name: 'Vỏ chuối, vỏ cam, cuống táo giờ ra chơi', category: 'Rác thực phẩm', binColor: 'Xanh lá cây', tip: 'Không để lẫn túi nilon hay thìa nhựa vào thùng.' },
  { name: 'Thức ăn thừa bữa trưa bán trú', category: 'Rác thực phẩm', binColor: 'Xanh lá cây', tip: 'Đổ cặn vào thùng thức ăn thừa để ủ phân compost hoặc chăn nuôi.' },
  { name: 'Bã trà, bã cà phê giáo viên', category: 'Rác thực phẩm', binColor: 'Xanh lá cây', tip: 'Rất giàu khoáng chất, tuyệt vời để bón cây ban công.' },
  { name: 'Lá cây rụng, cỏ quét sân trường', category: 'Rác thực phẩm', binColor: 'Xanh lá cây', tip: 'Tập kết làm phân xanh bón vườn thực vật sinh học.' },
  { name: 'Pin tiểu AA/AAA máy tính Casio', category: 'Rác nguy hại', binColor: 'Đỏ / Hộp thu gom pin', tip: 'Tuyệt đối không vứt chung rác sinh hoạt. Bỏ vào trạm pin.' },
  { name: 'Bóng đèn huỳnh quang neon phòng học hỏng', category: 'Rác nguy hại', binColor: 'Đỏ / Trạm riêng', tip: 'Chứa hơi thủy ngân độc hại, giao bác bảo vệ lưu trữ riêng.' },
  { name: 'Bình xịt khử khuẩn, xịt muỗi hết ga', category: 'Rác nguy hại', binColor: 'Đỏ / Trạm riêng', tip: 'Có nguy cơ phát nổ nếu bị nghiền hoặc đốt ở nhiệt độ cao.' },
  { name: 'Túi nilon xách đồ ăn sáng', category: 'Rác sinh hoạt khác', binColor: 'Vàng / Cam', tip: 'Vứt vào thùng rác còn lại. Hạn chế xin túi nilon khi mua bánh mì.' },
  { name: 'Hộp xốp đựng cơm tấm, xôi', category: 'Rác sinh hoạt khác', binColor: 'Vàng / Cam', tip: 'Chứa chất dẻo PS khó phân hủy và khó tái chế khi dính mỡ.' },
  { name: 'Vỏ bánh kẹo màng nhôm ghép nhựa', category: 'Rác sinh hoạt khác', binColor: 'Vàng / Cam', tip: 'Không thể tách lớp nhôm nhựa thông thường nên phải chôn lấp.' },
  { name: 'Bã kẹo cao su', category: 'Rác sinh hoạt khác', binColor: 'Vàng / Cam', tip: 'Gói vào mẩu giấy nhỏ trước khi vứt để không dính gầm bàn ghế.' },
  { name: 'Ruột bút bi, vỏ bút lông hết mực', category: 'Rác sinh hoạt khác', binColor: 'Vàng / Cam', tip: 'Nhựa hỗn hợp dính cặn mực.' },
  { name: 'Khăn giấy ướt, khăn giấy lau miệng bẩn', category: 'Rác sinh hoạt khác', binColor: 'Vàng / Cam', tip: 'Khăn giấy ướt có sợi vi nhựa, không tự tan trong nước.' },
  { name: 'Quai ly trà sữa, nắp vòm nhựa mỏng', category: 'Rác sinh hoạt khác', binColor: 'Vàng / Cam', tip: 'Nhựa mỏng lẫn dầu mỡ khó thu gom tái chế.' },
  { name: 'Khẩu trang y tế dùng một lần', category: 'Rác sinh hoạt khác', binColor: 'Vàng / Cam', tip: 'Cắt đứt quai đeo trước khi vứt để tránh bẫy chim cá.' },
];

export const WasteClassifier: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'ai' | 'dictionary'>('ai');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<WasteAnalysisResult | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Helper: Client-side Image Compression using HTML5 Canvas
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800; // Resize to max 800px width/height for fast AI processing
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn một tệp hình ảnh hợp lệ (PNG, JPG, WEBP).');
      return;
    }

    try {
      const compressed = await compressImage(file);
      setSelectedImage(compressed);
      analyzeImage(compressed, 'image/jpeg');
    } catch {
      alert('Có lỗi khi xử lý hình ảnh. Vui lòng thử lại.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      alert('Không thể mở camera trên thiết bị của bạn. Vui lòng cấp quyền hoặc tải ảnh từ thư viện.');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg', 0.85);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setSelectedImage(base64);
    analyzeImage(base64, 'image/jpeg');
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleSelectPreset = (preset: PresetSample) => {
    setSelectedImage(preset.thumbnailUrl);
    setResult(preset.analysis);
  };

  const analyzeImage = async (base64Image: string, mimeType: string) => {
    setIsAnalyzing(true);
    try {
      const analysis = await classifyWasteImage(base64Image, mimeType);
      const withImg = { ...analysis, imageUrl: base64Image };
      setResult(withImg);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getCategoryStyles = (category: WasteCategory) => {
    if (category === 'Rác tái chế') {
      return {
        badge: 'bg-cyan-100 text-cyan-800 border-cyan-300',
        binName: 'Thùng rác Tái chế (Trắng / Xanh dương)',
        binColor: 'bg-cyan-600 text-white',
        icon: Recycle,
      };
    }
    if (category === 'Rác thực phẩm') {
      return {
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        binName: 'Thùng rác Thực phẩm hữu cơ (Xanh lá cây)',
        binColor: 'bg-emerald-600 text-white',
        icon: Apple,
      };
    }
    if (category === 'Rác nguy hại') {
      return {
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        binName: 'Thùng/Hộp Thu Gom Rác Nguy Hại (Màu Đỏ hoặc Trạm riêng)',
        binColor: 'bg-rose-600 text-white',
        icon: BatteryCharging,
      };
    }
    return {
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      binName: 'Thùng rác Sinh hoạt khác (Vàng / Cam / Xám)',
      binColor: 'bg-amber-600 text-white',
      icon: Trash,
    };
  };

  const filteredItems = COMMON_SCHOOL_WASTE_ITEMS.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tip.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeStyles = result ? getCategoryStyles(result.waste_type) : null;
  const CategoryIcon = activeStyles ? activeStyles.icon : Sparkles;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 text-xs font-bold">
          <ScanSearch className="w-3.5 h-3.5" />
          <span>Thị giác Máy tính Gemini Vision & Luật BVMT 2020</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Nhận Diện & Phân Loại Rác Thông Minh
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Chụp ảnh hoặc tra cứu vật thể rác thải học đường theo quy chuẩn 3+1 nhóm của Bộ Tài nguyên & Môi trường.
        </p>
      </div>

      {/* Subtab Navigation: AI Scanner vs Cẩm Nang 20 Loại Rác */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('ai')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm ${
            activeSubTab === 'ai'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ScanSearch className="w-4 h-4" />
          <span>Quét Ảnh Gemini Vision AI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('dictionary')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm ${
            activeSubTab === 'dictionary'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Cẩm Nang 20 Loại Rác Học Đường</span>
        </button>
      </div>

      {activeSubTab === 'ai' ? (
        <>
          {/* PRIVACY COMPLIANCE NOTICE BANNER */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-300 text-xs text-emerald-950 flex items-start gap-2.5 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Bảo vệ quyền riêng tư học sinh (Luật 91/2025/QH15 & NĐ 356/2025/NĐ-CP):</span>
              <p className="text-slate-600 leading-relaxed">
                Vui lòng chỉ chụp cận cảnh vật thể rác thải cần phân loại. Tuyệt đối <strong>không chụp khuôn mặt người</strong> hay tài liệu định danh cá nhân. Hình ảnh được xử lý in-memory và không lưu trữ trên máy chủ.
              </p>
            </div>
          </div>

          {/* Preset Test Samples Bar (4 Samples) */}
          <div className="bg-white/95 border border-emerald-200/80 rounded-3xl p-5 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ảnh mẫu thử nghiệm chuẩn hóa (Nhấp để kiểm tra tức thì):</span>
              </span>
              <span className="text-[11px] text-slate-500 font-bold">3 + 1 Nhóm Quy Chuẩn</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_SAMPLES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-left transition flex items-center gap-3 group shadow-xs hover:shadow"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200 flex items-center justify-center p-1">
                    <img
                      src={preset.thumbnailUrl}
                      alt={preset.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition truncate">
                      {preset.name}
                    </p>
                    <span className="inline-block mt-0.5 text-[9px] px-2 py-0.2 rounded-full font-bold bg-white text-teal-800 border border-slate-200">
                      {preset.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* MAIN TWO-COLUMN WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: UPLOAD / CAMERA (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white/95 border border-emerald-200/80 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="w-5 h-5 rounded-md bg-cyan-100 text-cyan-800 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  Tải Ảnh Lên Hoặc Kéo Thả Trực Tiếp
                </h3>

                {/* Camera View Mode */}
                {isCameraActive ? (
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex flex-col items-center justify-center border border-slate-300">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-3 px-4">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition active:scale-95"
                      >
                        Chụp Ảnh Này
                      </button>
                      <button
                        type="button"
                        onClick={closeCamera}
                        className="px-4 py-2 rounded-xl bg-white text-slate-700 font-bold text-xs transition border border-slate-300"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition group aspect-video sm:aspect-[4/3] flex flex-col items-center justify-center relative overflow-hidden ${
                      isDragging
                        ? 'border-emerald-500 bg-emerald-50/50 scale-[1.02]'
                        : 'border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/20'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {selectedImage ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img
                          src={selectedImage}
                          alt="Xem trước vật thể rác"
                          className="max-h-full max-w-full rounded-xl object-contain shadow-md"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-xl">
                          <span className="text-xs font-bold text-slate-800 bg-white/95 px-3 py-1.5 rounded-lg border border-slate-200 shadow-md">
                            Nhấp để chọn ảnh khác
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center mx-auto group-hover:scale-110 transition duration-300 shadow-xs">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {isDragging ? 'Thả tệp ảnh vào đây ngay...' : 'Kéo thả ảnh hoặc nhấp để tải tệp lên'}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Tự động nén ảnh client-side & tăng tốc độ nhận diện
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    disabled={isCameraActive}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 transition"
                  >
                    <Camera className="w-4 h-4 text-cyan-600" />
                    <span>Bật Camera Chụp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 transition"
                  >
                    <Upload className="w-4 h-4 text-teal-600" />
                    <span>Chọn File Ảnh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CLASSIFICATION RESULT CARD (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white/95 border border-emerald-200/80 rounded-3xl p-5 sm:p-7 shadow-xl backdrop-blur-md min-h-[420px] flex flex-col justify-between">
                {isAnalyzing ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-4 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-white shadow-xl shadow-cyan-500/20 animate-pulse">
                      <ScanSearch className="w-8 h-8 animate-spin-slow" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-900">
                        Gemini Vision đang phân tích cấu trúc vật liệu...
                      </p>
                      <p className="text-xs text-slate-500">
                        Đối chiếu với quy chuẩn phân loại rác thải Luật Bảo vệ môi trường 2020
                      </p>
                    </div>
                  </div>
                ) : result && activeStyles ? (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    {/* Fallback Warning Notice if offline */}
                    {result.isFallbackWarning && (
                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Hệ thống đang hoạt động ở chế độ ngoại tuyến không có API Key. Hãy thử 4 mẫu ảnh chuẩn ở trên hoặc cấu hình Gemini API Key để nhận diện ảnh chụp thực tế!</span>
                      </div>
                    )}

                    {/* Result Top Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                          Kết quả nhận diện
                        </span>
                        <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 mt-0.5">
                          {result.item_name}
                        </h4>
                      </div>
                      <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 self-start ${activeStyles.badge}`}>
                        <CategoryIcon className="w-4 h-4" />
                        <span>{result.waste_type}</span>
                      </div>
                    </div>

                    {/* 1. Disposal Instruction & Correct Bin */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${activeStyles.binColor}`}>
                          {activeStyles.binName}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {result.instruction}
                      </p>
                    </div>

                    {/* 2. Decomposition Timeline */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Thời gian phân hủy ngoài tự nhiên:
                        </span>
                        <span className="font-mono font-bold text-amber-700 text-xs sm:text-sm">
                          {result.decomposition_time}
                        </span>
                      </div>
                    </div>

                    {/* 3. Eco Impact & Green Alternative */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                          <AlertOctagon className="w-3.5 h-3.5" />
                          <span>Tác hại môi trường nếu vứt bừa bãi:</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {result.eco_impact}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                          <Lightbulb className="w-3.5 h-3.5" />
                          <span>Giải pháp xanh thay thế:</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {result.alternative}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                      <ScanSearch className="w-7 h-7" />
                    </div>
                    <div className="max-w-sm space-y-1">
                      <p className="text-sm font-bold text-slate-900">Chưa có kết quả phân tích</p>
                      <p className="text-xs text-slate-500">
                        Vui lòng tải ảnh lên từ máy tính/điện thoại hoặc nhấp vào một trong 4 ảnh mẫu ở trên để kiểm tra kết quả ngay!
                      </p>
                    </div>
                  </div>
                )}

                {/* School Waste Sorting Quick Legend (3+1 Standards) */}
                <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2 font-medium">
                  <span className="font-bold text-slate-800">Quy chuẩn thùng rác học đường (Luật BVMT 2020):</span>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Thực phẩm (Xanh lá)
                    </span>
                    <span className="flex items-center gap-1 text-cyan-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-cyan-500" /> Tái chế (Trắng/Xanh dương)
                    </span>
                    <span className="flex items-center gap-1 text-rose-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-rose-500" /> Nguy hại (Đỏ/Hộp riêng)
                    </span>
                    <span className="flex items-center gap-1 text-amber-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-amber-500" /> Rác khác (Vàng/Cam)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* =========================================================================
           CẨM NANG TRA CỨU 20 LOẠI RÁC HỌC ĐƯỜNG PHỔ BIẾN
           ========================================================================= */
        <section className="bg-white/95 border border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>Cẩm Nang Tra Cứu Nhanh 20 Loại Rác Học Đường</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hướng dẫn phân loại chuẩn xác theo Luật Bảo vệ môi trường 2020 tại lớp học và trường THPT
              </p>
            </div>

            {/* Search Input Box */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Tìm tên đồ vật (hộp sữa, bút bi, pin...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredItems.map((item, idx) => {
              const styles = getCategoryStyles(item.category);
              const ItemIcon = styles.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {item.name}
                    </h4>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 flex items-center gap-1 ${styles.badge}`}>
                      <ItemIcon className="w-3 h-3" />
                      <span>{item.category}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] ${styles.binColor}`}>
                      Vứt vào thùng: {item.binColor}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    💡 <strong>Mẹo xử lý chuẩn:</strong> {item.tip}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
