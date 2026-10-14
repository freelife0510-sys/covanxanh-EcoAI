/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Leaf, Globe2, ShieldCheck, Heart, Sparkles, Phone, Download } from 'lucide-react';

interface FooterProps {
  onOpenDownloadModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDownloadModal }) => {
  return (
    <footer className="w-full bg-white/95 border-t border-emerald-500/20 text-slate-600 py-12 px-4 sm:px-6 lg:px-8 mt-16 shadow-inner">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Branding & Manifesto */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-base font-black text-slate-900 tracking-tight">
                EcoAI - Cố vấn Xanh
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                Dành cho học sinh THPT
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md">
              Hệ thống công nghệ giáo dục biến đổi khí hậu thế hệ mới ứng dụng Google Gemini AI, định lượng phát thải carbon và hỗ trợ phân loại rác thông minh, truyền cảm hứng hành động xanh thiết thực cho thế hệ tương lai.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-700 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Đồng hành cùng học sinh Việt Nam tiến tới mục tiêu Net Zero 2050</span>
            </div>
          </div>

          {/* Col 2: SDGs Impact */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Mục tiêu Phát triển Bền vững (UN SDGs)
            </h4>
            <ul className="text-xs space-y-1.5 text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>SDG 12: Tiêu dùng & sản xuất có trách nhiệm</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>SDG 13: Hành động vì khí hậu</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                <span>SDG 15: Bảo vệ hệ sinh thái trên cạn</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Privacy & Security */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Bảo Mật & Pháp Lý Dữ Liệu
            </h4>
            <div className="text-xs space-y-2 text-slate-600">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Tuân thủ Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 & NĐ 356/2025/NĐ-CP: Ứng dụng không thu thập dữ liệu định danh học sinh, ảnh rác và câu hỏi được xử lý in-memory phục vụ mục tiêu học tập.</span>
              </div>
              <div className="flex items-start gap-2">
                <Globe2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Chuẩn hóa theo Chương trình GDPT 2018 (môn Địa lí, Sinh học, Hoạt động trải nghiệm).</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            <p>© {new Date().getFullYear()} EcoAI — Nền tảng Giáo dục Môi trường & Biến đổi Khí hậu THPT.</p>
            <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 mt-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Ban Dự án Sáng kiến Kinh nghiệm EcoAI — Tác giả: Thầy Hồ Sỹ Long (Hotline chuyên môn:{' '}
                <a href="tel:0943278804" className="hover:underline text-emerald-700 font-bold font-mono">
                  0943278804
                </a>
                )
              </span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={onOpenDownloadModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition shadow-sm"
              title="Tải toàn bộ mã nguồn về máy tính (.ZIP)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tải Mã Nguồn (.ZIP)</span>
            </button>
            <div className="flex items-center gap-1 text-slate-600 font-medium text-xs">
              <span>Được thiết kế với tình yêu môi trường</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>cho học sinh THPT</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
