/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Bike,
  Zap,
  Coffee,
  Utensils,
  Sparkles,
  TreePine,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Award,
  Layers,
  Leaf,
  Users,
  Info,
  Calendar,
  RotateCcw,
  Printer,
  Edit3,
} from 'lucide-react';
import {
  CarbonBreakdown,
  CarbonDiagnosisResult,
  CarbonInputs,
  TransportType,
} from '../types';
import {
  calculateCarbonEmissions,
  diagnoseCarbonFootprint,
} from '../services/geminiService';

const STORAGE_KEY_INPUTS = 'ecoai_carbon_inputs_v3';
const STORAGE_KEY_CHALLENGES = 'ecoai_carbon_checked_challenges_v3';
const STORAGE_KEY_JOURNAL = 'ecoai_carbon_journal_v3';

const DEFAULT_INPUTS: CarbonInputs = {
  transportType: 'electric_bike',
  transportKmPerDay: 6,
  schoolDaysPerMonth: 26,
  acHoursPerDay: 4,
  acSharingPeople: 2, // Default 2 people sharing AC room
  deviceChargingHoursPerDay: 3,
  singleUsePlasticsPerWeek: 3,
  redMeatMealsPerWeek: 4,
};

export const CarbonCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CarbonInputs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INPUTS);
      if (saved) {
        return { ...DEFAULT_INPUTS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_INPUTS;
  });

  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<CarbonDiagnosisResult | null>(null);
  const [checkedChallenges, setCheckedChallenges] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHALLENGES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {};
  });

  const [journalNotes, setJournalNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_JOURNAL);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {};
  });

  // Save inputs to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INPUTS, JSON.stringify(inputs));
    } catch {
      // ignore
    }
  }, [inputs]);

  // Save checked challenges to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(checkedChallenges));
    } catch {
      // ignore
    }
  }, [checkedChallenges]);

  // Save journal notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(journalNotes));
    } catch {
      // ignore
    }
  }, [journalNotes]);

  const breakdown: CarbonBreakdown = useMemo(() => {
    return calculateCarbonEmissions(inputs);
  }, [inputs]);

  const handleInputChange = <K extends keyof CarbonInputs>(key: K, value: CarbonInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleJournalChange = (dayId: string, note: string) => {
    setJournalNotes((prev) => ({ ...prev, [dayId]: note }));
  };

  const handleDiagnose = async () => {
    setIsDiagnosing(true);
    try {
      const result = await diagnoseCarbonFootprint(inputs, breakdown);
      setDiagnosis(result);

      // Preserve existing checked states if any
      const updatedChecked: Record<string, boolean> = { ...checkedChallenges };
      result.sevenDayChallenge.forEach((c) => {
        if (updatedChecked[c.id] === undefined) {
          updatedChecked[c.id] = false;
        }
      });
      setCheckedChallenges(updatedChecked);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const toggleChallenge = (id: string) => {
    setCheckedChallenges((prev) => {
      const nextState = !prev[id];
      const updated = { ...prev, [id]: nextState };

      if (nextState) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#10b981', '#14b8a6', '#06b6d4', '#f59e0b'],
        });
      }

      return updated;
    });
  };

  const challengesList = diagnosis?.sevenDayChallenge || [
    {
      id: 'day-1',
      day: 1,
      title: 'Thiết lập điều hòa 26°C - 27°C kết hợp quạt trần',
      description: 'Mỗi 1°C tăng lên giúp tiết kiệm 7-10% điện năng tiêu thụ của máy lạnh, giảm trực tiếp khí nhà kính từ nhiệt điện than.',
      schoolContext: 'Đề xuất ban cán sự lớp thống nhất nhiệt độ phòng học chuẩn 26°C và tắt điều hòa 30 phút trước khi tan trường.',
      impactScore: 15,
      completed: false,
    },
    {
      id: 'day-2',
      day: 2,
      title: 'Ngày Thứ Hai "Bình cá nhân — Cự tuyệt ly nhựa trà sữa"',
      description: 'Mang theo bình giữ nhiệt inox cá nhân để lấy nước uống tại cây lọc nước trường học thay vì mua nước đóng chai dùng 1 lần.',
      schoolContext: 'Cứ mỗi chai/ly nhựa giảm được sẽ ngăn ngừa 80g khí CO2e và chấm dứt nguy cơ rác thải tồn đọng bãi chôn lấp.',
      impactScore: 20,
      completed: false,
    },
    {
      id: 'day-3',
      day: 3,
      title: 'Khởi động "Green Commute" (Xe buýt / Xe đạp / Đi bộ)',
      description: 'Chuyển đổi ít nhất 2 ngày trong tuần sang đi xe buýt công cộng, xe đạp hoặc đi bộ cùng bạn bè cùng tuyến đường.',
      schoolContext: 'Vừa rèn luyện thể lực vừa giảm ngay từ 2 - 4 kg phát thải khói bụi carbon mỗi tháng ra bầu không khí đô thị.',
      impactScore: 25,
      completed: false,
    },
    {
      id: 'day-4',
      day: 4,
      title: 'Thu gom pin cũ và thiết bị điện tử hỏng vào hộp riêng',
      description: 'Không vứt pin tiểu, pin đồng hồ vào sọt rác sinh hoạt thông thường để tránh nhiễm độc chì, thủy ngân vào nguồn nước ngầm.',
      schoolContext: 'Đem pin cũ đến gửi tại "Hộp thu gom pin cũ" của Đoàn trường hoặc câu lạc bộ môi trường.',
      impactScore: 20,
      completed: false,
    },
    {
      id: 'day-5',
      day: 5,
      title: 'Bữa trưa Thứ Sáu Xanh (Zero Food Waste) — Ăn hết khẩu phần',
      description: 'Ăn hết khẩu phần thức ăn, không để thừa thức ăn và ưu tiên rau xanh, củ quả tươi thay thế một phần thịt đỏ.',
      schoolContext: 'Ngăn chặn thức ăn thừa bị chôn lấp yếm khí sinh ra khí Methane (CH4) — khí nhà kính mạnh gấp 28 lần CO2.',
      impactScore: 20,
      completed: false,
    },
    {
      id: 'day-6',
      day: 6,
      title: 'Rút phích cắm & Tắt hẳn thiết bị điện (Phantom Load Hunt)',
      description: 'Tắt công tắc ổ cắm sạc máy tính, tivi, quạt khi không dùng để triệt tiêu dòng điện chờ (tiêu tốn 5-10% hóa đơn điện).',
      schoolContext: 'Kiểm tra và ngắt cầu dao điện phòng học trước khi đóng cửa phòng vào cuối tuần.',
      impactScore: 15,
      completed: false,
    },
    {
      id: 'day-7',
      day: 7,
      title: 'Lan tỏa sáng kiến xanh — Chia sẻ kết quả & Cam kết cùng lớp',
      description: 'Chia sẻ chỉ số Dấu chân Carbon và thành tích 7 ngày sống xanh của em lên bảng tin lớp hoặc nhóm Zalo học tập.',
      schoolContext: 'Rủ thêm 2 người bạn thân cùng tính toán carbon và cùng ký cam kết giữ gìn lớp học xanh Net Zero 2050.',
      impactScore: 30,
      completed: false,
    },
  ];

  const completedCount = challengesList.filter((c) => checkedChallenges[c.id]).length;
  const progressPercent = Math.round((completedCount / challengesList.length) * 100);

  const transportPct = breakdown.totalCO2 > 0 ? Math.round((breakdown.transportCO2 / breakdown.totalCO2) * 100) : 0;
  const energyPct = breakdown.totalCO2 > 0 ? Math.round((breakdown.energyCO2 / breakdown.totalCO2) * 100) : 0;
  const consumptionPct = breakdown.totalCO2 > 0 ? Math.round((breakdown.consumptionCO2 / breakdown.totalCO2) * 100) : 0;
  const nutritionPct = breakdown.totalCO2 > 0 ? Math.round((breakdown.nutritionCO2 / breakdown.totalCO2) * 100) : 0;

  const getRatingBadge = () => {
    if (breakdown.ratingLevel === 'green') {
      return {
        label: 'Mức Xanh Tích Cực 🌿',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: Leaf,
        desc: 'Thấp hơn mức trung bình học sinh THPT (< 35 kg CO2/tháng)',
      };
    }
    if (breakdown.ratingLevel === 'moderate') {
      return {
        label: 'Mức Cân Bằng Trung Bình ⚖️',
        color: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: AlertTriangle,
        desc: 'Ngang bằng mức trung bình học sinh THPT (35 - 55 kg CO2/tháng)',
      };
    }
    return {
      label: 'Mức Báo Động Đỏ ⚠️',
      color: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: Flame,
      desc: 'Cao hơn mức chuẩn (> 55 kg CO2/tháng)! Cần kế hoạch giảm thiểu ngay',
    };
  };

  const ratingInfo = getRatingBadge();

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>Mô hình định lượng chuẩn lưới điện Việt Nam 2024</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Máy Tính Dấu Chân Carbon Học Đường
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Ước tính lượng phát thải CO2 cá nhân hàng tháng qua 4 nhóm sinh hoạt chính (chia sẻ điều hòa, giao thông, nhựa dùng 1 lần, dinh dưỡng) và nhận chẩn đoán AI cùng Thử thách 7 ngày.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: INPUT CONTROLS (7 Cols) */}
        <div className="lg:col-span-7 bg-white/95 border border-emerald-200/90 rounded-3xl p-5 sm:p-7 shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                1
              </span>
              Nhập Thói Quen Sinh Hoạt Học Đường Của Bạn
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Tự động lưu tiến độ</span>
          </div>

          {/* 1. Giao thông đi lại */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Bike className="w-4 h-4 text-emerald-600" />
                <span>Phương tiện đi học hàng ngày:</span>
              </label>
              <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {breakdown.transportCO2} kg CO2/tháng
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'bicycle' as TransportType, label: 'Xe đạp / Đi bộ', sub: '0 kg CO2/km' },
                { type: 'electric_bike' as TransportType, label: 'Xe đạp điện', sub: '~0.02 kg/km' },
                { type: 'bus' as TransportType, label: 'Xe buýt', sub: '~0.035 kg/km' },
                { type: 'motorbike' as TransportType, label: 'Xe máy xăng', sub: '~0.048 kg/km' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleInputChange('transportType', item.type)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    inputs.transportType === item.type
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-bold">{item.label}</p>
                  <p className={`text-[10px] mt-0.5 ${inputs.transportType === item.type ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {item.sub}
                  </p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Quãng đường khứ hồi mỗi ngày:</span>
                  <span className="font-mono font-bold text-slate-900">{inputs.transportKmPerDay} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={inputs.transportKmPerDay}
                  onChange={(e) => handleInputChange('transportKmPerDay', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Số ngày đi học trong tháng:</span>
                  <span className="font-mono font-bold text-slate-900">{inputs.schoolDaysPerMonth} ngày</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="28"
                  step="1"
                  value={inputs.schoolDaysPerMonth}
                  onChange={(e) => handleInputChange('schoolDaysPerMonth', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 2. Tiêu thụ năng lượng (Điều hòa & sạc thiết bị) */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-600" />
                <span>Năng lượng điện (Điều hòa & Thiết bị):</span>
              </label>
              <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                {breakdown.energyCO2} kg CO2/tháng
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Thời gian bật điều hòa:</span>
                  <span className="font-mono font-bold text-slate-900">{inputs.acHoursPerDay} giờ/ngày</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="16"
                  step="1"
                  value={inputs.acHoursPerDay}
                  onChange={(e) => handleInputChange('acHoursPerDay', Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              {/* Number of people sharing AC room */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    <span>Số người dùng chung phòng:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">{inputs.acSharingPeople} người</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={inputs.acSharingPeople}
                  onChange={(e) => handleInputChange('acSharingPeople', Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">
                  * Công suất máy lạnh được chia đều theo số người cùng ở trong phòng
                </p>
              </div>
            </div>

            <div className="pt-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">Sạc điện thoại, laptop, máy tính bảng:</span>
                <span className="font-mono font-bold text-slate-900">{inputs.deviceChargingHoursPerDay} giờ/ngày</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={inputs.deviceChargingHoursPerDay}
                onChange={(e) => handleInputChange('deviceChargingHoursPerDay', Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          </div>

          {/* 3. Đồ nhựa dùng một lần */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Coffee className="w-4 h-4 text-cyan-600" />
                <span>Tiêu thụ đồ nhựa dùng một lần (Căng tin, trà sữa):</span>
              </label>
              <span className="text-[11px] font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                {breakdown.consumptionCO2} kg CO2/tháng
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">Số ly trà sữa, chai nước ngọt PET, hộp xốp/tuần:</span>
                <span className="font-mono font-bold text-slate-900">{inputs.singleUsePlasticsPerWeek} món/tuần</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={inputs.singleUsePlasticsPerWeek}
                onChange={(e) => handleInputChange('singleUsePlasticsPerWeek', Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Mỗi ly nhựa dùng 1 lần phát thải ~80g CO2e và mất hơn 450 năm chôn lấp ngoài môi trường.
              </p>
            </div>
          </div>

          {/* 4. Khẩu phần ăn (Thịt đỏ) */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-600" />
                <span>Khẩu phần thịt đỏ trong tuần (Thịt bò, thịt heo):</span>
              </label>
              <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {breakdown.nutritionCO2} kg CO2/tháng
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">Số bữa ăn có thịt đỏ (bò, lợn)/tuần:</span>
                <span className="font-mono font-bold text-slate-900">{inputs.redMeatMealsPerWeek} bữa/tuần</span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                step="1"
                value={inputs.redMeatMealsPerWeek}
                onChange={(e) => handleInputChange('redMeatMealsPerWeek', Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Thịt bò phát thải ~2.5 kg CO2e/khẩu phần, thịt heo ~0.9 kg CO2e/khẩu phần (do phát thải Methane từ chăn nuôi).
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REALTIME STATS & AI DIAGNOSIS (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Dashboard Card */}
          <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-emerald-500/30 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/30">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Tổng phát thải cá nhân
              </span>
              <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${ratingInfo.color}`}>
                {ratingInfo.label}
              </div>
            </div>

            {/* Big Carbon Number */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
                  {breakdown.totalCO2}
                </span>
                <span className="text-sm font-bold text-emerald-300">kg CO2 / tháng</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Mức chuẩn học sinh THPT: <strong className="text-amber-300">35 - 55 kg CO2/tháng</strong>
              </p>
            </div>

            {/* Virtual Eco Tree Forest (Vườn cây ảo học sinh) */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-200 flex items-center gap-1.5">
                  <TreePine className="w-4 h-4 text-emerald-400" />
                  <span>Vườn cây xanh cần bù đắp trong năm:</span>
                </span>
                <span className="font-mono text-emerald-300 font-black text-sm">
                  {breakdown.treesNeeded} cây xanh
                </span>
              </div>

              {/* Render visual trees */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Array.from({ length: Math.min(15, breakdown.treesNeeded) }).map((_, idx) => (
                  <span
                    key={idx}
                    className="text-base select-none transition-transform hover:scale-125"
                    title={`Cây xanh thứ ${idx + 1}`}
                  >
                    🌲
                  </span>
                ))}
                {breakdown.treesNeeded > 15 && (
                  <span className="text-xs font-bold text-emerald-300 self-center">
                    +{breakdown.treesNeeded - 15} cây nữa...
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-300">
                * 1 cây xanh đô thị hấp thụ khoảng 21 kg CO2/năm trong điều kiện sinh trưởng tự nhiên.
              </p>
            </div>

            {/* Proportional Breakdown Bars */}
            <div className="space-y-2 pt-2 border-t border-emerald-500/20">
              <span className="text-xs font-bold text-emerald-200">Cơ cấu phát thải của bạn:</span>
              <div className="space-y-1.5 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-300">Năng lượng điện:</span>
                    <span className="font-mono font-bold text-teal-300">{energyPct}% ({breakdown.energyCO2} kg)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-teal-400 h-full rounded-full" style={{ width: `${energyPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-300">Dinh dưỡng (Thịt đỏ):</span>
                    <span className="font-mono font-bold text-amber-300">{nutritionPct}% ({breakdown.nutritionCO2} kg)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${nutritionPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-300">Giao thông đi học:</span>
                    <span className="font-mono font-bold text-emerald-300">{transportPct}% ({breakdown.transportCO2} kg)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${transportPct}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-300">Đồ nhựa dùng 1 lần:</span>
                    <span className="font-mono font-bold text-cyan-300">{consumptionPct}% ({breakdown.consumptionCO2} kg)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${consumptionPct}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnose CTA Button */}
            <button
              type="button"
              onClick={handleDiagnose}
              disabled={isDiagnosing}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isDiagnosing ? 'AI Đang Phân Tích Dấu Chân Carbon...' : 'Nhận Chẩn Đoán Lộ Trình Xanh 7 Ngày'}</span>
            </button>
          </div>

          {/* Scientific Reference Callout */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              <span>Căn cứ khoa học định lượng:</span>
            </p>
            <p className="text-[11px] leading-relaxed">
              Dựa trên Hệ số phát thải lưới điện Việt Nam 2024 (ĐH Bách khoa Hà Nội & Bộ TN&MT: ~0.681 tCO2e/MWh), định mức tiêu hao xăng xe máy đô thị (2.0L/100km) và nghiên cứu phát thải vòng đời sản phẩm nhựa (LCA EPA).
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          7-DAY GREEN ACTION CHALLENGE WITH JOURNALING (FULL 7 DAYS)
          ========================================================================= */}
      <section className="bg-white/95 border border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Thử Thách Hành Động Học Đường</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Lộ Trình 7 Ngày Sống Xanh (Net Zero Student Challenge)
            </h3>
            <p className="text-xs text-slate-500">
              Checklist 7 hành động thực tế đã được chuẩn hóa cho học sinh THPT Việt Nam — Tích hợp viết nhật ký hành động
            </p>
          </div>

          {/* Progress Bar Badge */}
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl self-start sm:self-auto">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-emerald-800">Tiến độ hoàn thành</p>
              <p className="text-base font-black text-emerald-950 font-mono">
                {completedCount} / {challengesList.length} ngày ({progressPercent}%)
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 7 Days Grid with Action Journaling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challengesList.map((ch) => {
            const isDone = Boolean(checkedChallenges[ch.id]);
            const note = journalNotes[ch.id] || '';
            return (
              <div
                key={ch.id}
                className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isDone
                    ? 'bg-emerald-50/90 border-emerald-500 shadow-md'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-900 text-white font-mono">
                      Ngày {ch.day}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isDone ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      +{ch.impactScore} Điểm Xanh
                    </span>
                  </div>

                  <h4 className={`text-xs sm:text-sm font-bold ${isDone ? 'text-emerald-950' : 'text-slate-900'}`}>
                    {ch.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {ch.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/80 text-[11px] text-slate-700">
                    <strong className="text-emerald-800">🏫 Bối cảnh trường học:</strong> {ch.schoolContext}
                  </div>

                  {/* Journal Input for student note */}
                  <div className="pt-1">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold mb-1">
                      <Edit3 className="w-3 h-3 text-emerald-600" />
                      <span>Nhật ký thực hiện của em:</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Ghi lại hành động em đã làm..."
                      value={note}
                      onChange={(e) => handleJournalChange(ch.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => toggleChallenge(ch.id)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition flex items-center gap-1.5"
                  >
                    <span>{isDone ? '✓ Đã hoàn thành' : 'Đánh dấu hoàn thành'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleChallenge(ch.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition ${isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white hover:border-emerald-500'}`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
