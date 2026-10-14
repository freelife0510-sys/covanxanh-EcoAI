/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Download,
  X,
  CheckCircle2,
  FolderArchive,
  Terminal,
  Laptop,
  Sparkles,
  FileText,
  Phone,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';

interface DownloadLocalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadLocalModal: React.FC<DownloadLocalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadCompleted, setDownloadCompleted] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Fetch binary zip from backend API
      const res = await fetch('/api/export/zip', {
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (!res.ok) {
        throw new Error(`Tải tệp không thành công: HTTP ${res.status}`);
      }

      const blob = await res.blob();

      // Check if size is suspiciously small (e.g. 11KB HTML preview error page)
      if (blob.size < 20000 || blob.type.includes('text/html')) {
        throw new Error('Tệp tải về không hợp lệ từ máy chủ trung gian.');
      }

      // Create a local blob object URL in browser memory
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = blobUrl;
      link.download = 'EcoAI-SourceCode.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 30000);

      setDownloadCompleted(true);

      // Trigger celebration confetti
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#10b981', '#14b8a6', '#06b6d4', '#f59e0b'],
      });
    } catch (err) {
      console.error('Download error:', err);
      // Fallback: direct window download
      const link = document.createElement('a');
      link.href = '/api/export/zip';
      link.download = 'EcoAI-SourceCode.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadCompleted(true);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-emerald-300 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Decorative ambient aura */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-600/25">
              <FolderArchive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Tải Trọn Bộ Mã Nguồn & Cấu Hình Chạy Local
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  Full ZIP
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Chạy hoàn chỉnh trên máy tính cá nhân (Windows / Mac / Linux) không giới hạn
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="mt-5 space-y-6 overflow-y-auto pr-1 flex-1">
          {/* Main Download Call To Action Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white shadow-xl border border-emerald-500/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider">
                  Gói tải về hoàn chỉnh
                </span>
                <h4 className="text-base font-black text-white mt-0.5">
                  Tệp Nén: EcoAI-SourceCode.zip (~90 KB)
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Bao gồm toàn bộ React UI, Tailwind, Express Server, SDK Gemini, kịch bản Mock và file chạy 1-click.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="shrink-0 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>
                  {downloadCompleted ? 'Đã Tải Xong! Bấm Tải Lại' : 'Tải Xuống Ngay'}
                </span>
              </button>
            </div>

            {downloadCompleted && (
              <div className="pt-2 border-t border-emerald-700/60 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Tệp đang được lưu vào thư mục <strong>Downloads</strong> trên máy tính của bạn!
                </span>
              </div>
            )}
          </div>

          {/* Windows Unzip Notice for Vietnamese Folder Paths */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Lưu ý quan trọng khi giải nén trên Windows:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900">
              Trình giải nén mặc định của Windows Explorer có lỗi hạn chế với thư mục có dấu tiếng Việt (ví dụ nếu thư mục chứa file tên là <em>"Học cách tạo app"</em> sẽ bị báo lỗi <em>"contains characters: ọạ"</em>).<br />
              👉 <strong>Cách xử lý trong 5 giây:</strong> Thầy chỉ cần đổi tên thư mục thành không dấu (ví dụ <strong>"Hoc cach tao app"</strong> hoặc copy file zip ra thẳng ổ <strong>E:\</strong>, <strong>C:\</strong>), hoặc dùng phần mềm <strong>WinRAR / 7-Zip</strong> để giải nén bình thường!
            </p>
          </div>

          {/* 3 Steps To Run Local */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Laptop className="w-4 h-4 text-emerald-600" />
              <span>3 Bước Cực Dễ Để Chạy Trên Máy Tính:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Step 1 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h5 className="font-bold text-slate-900">Giải nén tệp ZIP</h5>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Bấm chuột phải vào <span className="font-mono text-emerald-700">EcoAI-SourceCode.zip</span> chọn <strong>Extract All</strong> vào thư mục bất kỳ.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h5 className="font-bold text-emerald-950">Chạy file 1-Click</h5>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  Bấm đúp vào file <strong className="font-mono text-emerald-800">chay-ecoai-windows.bat</strong> (hoặc mở Terminal gõ <span className="font-mono bg-white px-1 py-0.5 rounded border">npm install</span> rồi <span className="font-mono bg-white px-1 py-0.5 rounded border">npm run dev</span>).
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h5 className="font-bold text-slate-900">Mở trình duyệt web</h5>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Truy cập địa chỉ <a href="http://localhost:3000" target="_blank" rel="noreferrer" className="text-teal-700 font-bold font-mono underline">http://localhost:3000</a> để sử dụng app mượt mà!
                </p>
              </div>
            </div>
          </div>

          {/* Package Contents Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <h5 className="font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Gói mã nguồn này bao gồm:</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Mã nguồn React 19 + Tailwind CSS 4 hoàn chỉnh</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Backend Express.js tích hợp sẵn Gemini AI</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Bộ dữ liệu Sư phạm Mock chạy offline không cần mạng</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>File tự động chạy cho Windows (.bat) và Mac (.sh)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>File hướng dẫn chi tiết tiếng Việt (HUONG_DAN_CAI_DAT.txt)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>File cấu hình tệp môi trường chuẩn (.env.example)</span>
              </div>
            </div>
          </div>

          {/* Teacher contact badge */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold">
              <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Hỗ trợ chuyên môn & Kỹ thuật SKKN: <strong>Tác giả Thầy Hồ Sỹ Long</strong> — Hotline: <strong className="font-mono">0943278804</strong></span>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold">Mô hình Giáo dục THPT</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <a
            href="https://nodejs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-emerald-700 font-medium inline-flex items-center gap-1 transition"
          >
            <span>Tải Node.js LTS (nếu máy tính chưa có)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải Tệp Nén ZIP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
