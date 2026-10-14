/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  ArrowRight,
  MessageSquareQuote,
  Calculator,
  ScanSearch,
  TreePine,
  Zap,
  Leaf,
  CheckCircle2,
  Shield,
  Award,
  Waves,
  Mountain,
  CloudRain,
  Flag,
  Download,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { VietnamClimateMap3D } from './VietnamClimateMap3D';

interface HomeHeroProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenApiKeyModal: () => void;
  onOpenDownloadModal?: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onNavigate, onOpenDownloadModal }) => {
  return (
    <div className="space-y-12 py-2 animate-in fade-in duration-500">
      {/* =========================================================================
          1. HERO HEADER BANNER: ECO-FUTURISTIC & EDUCATIONAL GLASSMORPHISM
          ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/95 via-emerald-50/70 to-teal-50/80 border border-emerald-400/40 shadow-2xl p-6 sm:p-10 lg:p-12">
        {/* Soft Ambient Colorful Aura */}
        <div className="absolute top-0 right-1/4 w-[30rem] h-[30rem] bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[26rem] h-[26rem] bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-4xl">
          {/* Top National School Climate Slogan Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-black shadow-md shadow-emerald-600/20">
              <TreePine className="w-4 h-4 text-emerald-200" />
              <span>HÀNH ĐỘNG KHÍ HẬU HỌC ĐƯỜNG THPT VIỆT NAM</span>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-900 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-300 shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span>Đồng Hành Cùng Cam Kết Net Zero 2050</span>
            </div>
          </div>

          {/* Golden Slogan Ribbon */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 border border-emerald-500/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-400 text-slate-950 flex items-center justify-center font-black text-lg shrink-0 shadow">
                🇻🇳
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black tracking-wide text-emerald-200 uppercase">
                  "Chung Tay Vì Một Việt Nam Xanh — Thích Ứng Khí Hậu & Giữ Vững Tương Lai!"
                </p>
                <p className="text-[11px] text-slate-300 font-medium">
                  Mỗi lớp học một mầm xanh • Mỗi học sinh THPT một lá chắn bảo vệ đất mẹ chữ S
                </p>
              </div>
            </div>

            <span className="shrink-0 text-[11px] px-3 py-1 rounded-xl bg-white/15 text-emerald-300 font-bold border border-white/20 self-start md:self-auto">
              UN SDG 13: Climate Action
            </span>
          </div>

          {/* Main Title & Description */}
          <div className="space-y-3 pt-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              EcoAI — Cố Vấn Xanh <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Đồng Hành Cùng Thế Hệ Trẻ Tiên Phong
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-3xl">
              Nền tảng công nghệ giáo dục môi trường tích hợp trí tuệ nhân tạo thế hệ mới (Google Gemini AI), định lượng dấu chân carbon học đường chuẩn lưới điện Việt Nam, nhận diện rác thải thông minh theo Luật BVMT 2020 và đối chiếu chuẩn đầu ra Chương trình GDPT 2018.
            </p>
          </div>

          {/* Quick Action Navigation CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('calculator')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/25 active:scale-95 transition-all flex items-center gap-2 group"
            >
              <Calculator className="w-4 h-4" />
              <span>Đo Dấu Chân Carbon Của Bạn</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('chat')}
              className="px-6 py-3.5 rounded-2xl bg-white/95 hover:bg-white text-slate-800 hover:text-emerald-700 font-bold text-xs sm:text-sm border border-emerald-400/40 shadow-md hover:shadow-lg backdrop-blur-md active:scale-95 transition-all flex items-center gap-2"
            >
              <MessageSquareQuote className="w-4 h-4 text-emerald-600" />
              <span>Hỏi Thầy/Cô Cố Vấn Socratic</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('waste')}
              className="px-5 py-3.5 rounded-2xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-bold text-xs sm:text-sm border border-cyan-300 shadow-md transition-all flex items-center gap-2"
            >
              <ScanSearch className="w-4 h-4 text-cyan-700" />
              <span>Phân Loại Rác Gemini Vision</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('assessment')}
              className="px-5 py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm border border-amber-300 shadow-md transition-all flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-amber-700" />
              <span>Phiếu Học Tập & Đo Nhận Thức (SKKN)</span>
            </button>

            {onOpenDownloadModal && (
              <button
                type="button"
                onClick={onOpenDownloadModal}
                className="px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm border border-slate-300 transition-all flex items-center gap-2"
                title="Tải toàn bộ code và file chạy .bat về máy"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Tải Code Chạy Local (ZIP)</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. BẢN ĐỒ VIỆT NAM KHÍ HẬU 3D & 5 VÙNG SINH THÁI TƯƠNG TÁC
          ========================================================================= */}
      <section className="space-y-4">
        <VietnamClimateMap3D />
      </section>

      {/* =========================================================================
          3. BENTO SHOWCASE: 4 PHÂN HỆ CỐT LÕI (MẠCH HỌC TẬP KHÉP KÍN)
          ========================================================================= */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mạch Học Tập Sư Phạm Khép Kín 4 Bước</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Khám Phá Các Phân Hệ Của EcoAI
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Khám phá kiến thức $\rightarrow$ Định lượng phát thải $\rightarrow$ Hành động thực tiễn $\rightarrow$ Phản tư đánh giá kết quả.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Chat Socratic */}
          <div
            onClick={() => onNavigate('chat')}
            className="group relative cursor-pointer rounded-3xl bg-white/95 border border-emerald-200/90 hover:border-emerald-500 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                <MessageSquareQuote className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  Bước 1: Khám phá
                </span>
                <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition mt-2">
                  Cố Vấn Xanh Socratic AI
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  Đàm thoại theo phương pháp gợi mở: giải thích bản chất khoa học trước, sau đó đặt câu hỏi liên hệ thực tế học đường.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Bắt đầu trò chuyện</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Carbon Calculator */}
          <div
            onClick={() => onNavigate('calculator')}
            className="group relative cursor-pointer rounded-3xl bg-white/95 border border-teal-200/90 hover:border-teal-500 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full border border-teal-300">
                  Bước 2: Đo lường
                </span>
                <h3 className="text-base font-black text-slate-900 group-hover:text-teal-700 transition mt-2">
                  Máy Tính Dấu Chân Carbon
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  Đo lường phát thải CO2 cá nhân chuẩn lưới điện VN 2024, chia sẻ điều hòa theo số người và nhận lộ trình 7 ngày sống xanh.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
              <span>Tính toán phát thải</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Waste Classifier */}
          <div
            onClick={() => onNavigate('waste')}
            className="group relative cursor-pointer rounded-3xl bg-white/95 border border-cyan-200/90 hover:border-cyan-500 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                <ScanSearch className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full border border-cyan-300">
                  Bước 3: Hành động
                </span>
                <h3 className="text-base font-black text-slate-900 group-hover:text-cyan-700 transition mt-2">
                  Phân Loại Rác Gemini Vision
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  Nhận diện tức thời theo quy chuẩn Luật BVMT 2020: Tái chế, Thực phẩm, Rác khác và nhánh Rác nguy hại (Pin, bóng đèn).
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-700">
              <span>Quét ảnh phân loại</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Assessment & Study Sheet */}
          <div
            onClick={() => onNavigate('assessment')}
            className="group relative cursor-pointer rounded-3xl bg-white/95 border border-amber-200/90 hover:border-amber-500 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  Bước 4: Phản tư & SKKN
                </span>
                <h3 className="text-base font-black text-slate-900 group-hover:text-amber-700 transition mt-2">
                  Phiếu Học Tập & Đánh Giá
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                  Đối chiếu khung GDPT 2018, làm bài trắc nghiệm đo nhận thức Trước - Sau và xuất phiếu kết quả học tập phục vụ báo cáo.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Xem phiếu học tập</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. THỐNG KÊ KHOA HỌC & CĂN CỨ THỰC TIỄN VIỆT NAM (CHUẨN HÓA NGUỒN)
          ========================================================================= */}
      <section className="rounded-3xl bg-white/95 border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Căn Cứ Khoa Học & Bối Cảnh Việt Nam
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              Tại sao Học sinh THPT là Lực lượng Tiên phong?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Theo <em>Báo cáo Chỉ số Rủi ro Khí hậu Toàn cầu (Germanwatch CRI, giai đoạn 1999–2018)</em>, Việt Nam xếp thứ 6 trong số các quốc gia chịu tổn thương nặng nề nhất bởi thiên tai và thời tiết cực đoan. Việc hình thành thói quen xanh ngay từ trường THPT sẽ tạo nền móng vững chắc cho mục tiêu quốc gia Net Zero 2050.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <span className="text-xl sm:text-2xl font-black text-emerald-800 font-mono">0.681</span>
              <p className="text-[11px] font-bold text-slate-800">tCO2e/MWh</p>
              <p className="text-[10px] text-slate-500">Hệ số lưới điện VN 2024</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-1">
              <span className="text-xl sm:text-2xl font-black text-teal-800 font-mono">-450g</span>
              <p className="text-[11px] font-bold text-slate-800">Rác nhựa/tuần</p>
              <p className="text-[10px] text-slate-500">Khi dùng bình cá nhân</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-200 text-center space-y-1">
              <span className="text-xl sm:text-2xl font-black text-cyan-800 font-mono">3+1 Nhóm</span>
              <p className="text-[11px] font-bold text-slate-800">Thùng rác chuẩn</p>
              <p className="text-[10px] text-slate-500">Luật BVMT 2020</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
              <span className="text-xl sm:text-2xl font-black text-amber-800 font-mono">7 Ngày</span>
              <p className="text-[11px] font-bold text-slate-800">Lộ trình sống xanh</p>
              <p className="text-[10px] text-slate-500">Lưu tiến độ tự động</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
