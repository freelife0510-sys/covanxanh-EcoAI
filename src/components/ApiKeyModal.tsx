/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldCheck, ExternalLink, Trash2, CheckCircle2, Sparkles, X, Info } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeyUpdated }) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [hasExistingKey, setHasExistingKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const existing = getStoredApiKey();
      setApiKeyInput(existing);
      setHasExistingKey(Boolean(existing));
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(apiKeyInput);
    setSavedSuccess(true);
    setHasExistingKey(Boolean(apiKeyInput.trim()));
    onKeyUpdated();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setStoredApiKey('');
    setApiKeyInput('');
    setHasExistingKey(false);
    onKeyUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-emerald-300 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-800 overflow-hidden">
        {/* Glow backdrop effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                Cài đặt Google Gemini API Key
              </h3>
              <p className="text-xs text-slate-500">Kết nối trực tiếp mô hình trí tuệ nhân tạo thế hệ mới</p>
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

        {/* Body */}
        <div className="mt-5 space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 space-y-1">
              <p className="font-bold text-emerald-800">Quản lý Khóa API & Bảo mật học đường</p>
              <p>
                Khóa API được lưu cục bộ trong <span className="text-emerald-700 font-mono font-semibold">localStorage</span> trên trình duyệt này và chỉ được gửi qua header được mã hóa đến server để ủy quyền gọi Google Gemini.
              </p>
              <p className="text-amber-800 font-semibold pt-1">
                ⚠️ <strong>Lưu ý cho máy phòng Tin học dùng chung:</strong> Khi tan tiết thực hành, em hãy bấm nút <em>"Xóa API Key"</em> bên dưới để bảo mật tài khoản cá nhân!
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nhập API Key của bạn
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent font-mono transition"
            />
          </div>

          {/* Quick Guide */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Info className="w-4 h-4 text-teal-600" />
              <span>Chưa có API Key? Nhận miễn phí chỉ với 1 phút:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
              <li>Truy cập Google AI Studio (<span className="font-mono text-emerald-700">aistudio.google.com</span>).</li>
              <li>Đăng nhập bằng tài khoản Google cá nhân.</li>
              <li>Bấm nút <span className="text-slate-900 font-bold">"Get API key"</span> và dán vào ô trên.</li>
            </ol>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition underline underline-offset-4"
            >
              Mở Google AI Studio để lấy API Key miễn phí
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mock Fallback Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Không cần API Key? Bạn vẫn có thể trải nghiệm đầy đủ các tính năng qua chế độ <strong>Sư phạm Mock thông minh</strong>!</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          {hasExistingKey ? (
            <button
              onClick={handleClear}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
            >
              <Trash2 className="w-4 h-4" />
              Xóa API Key
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Đóng
            </button>
            <button
              onClick={handleSave}
              type="button"
              disabled={savedSuccess}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-lg shadow-emerald-600/25 active:scale-95 transition disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  Đã lưu thành công!
                </>
              ) : (
                'Lưu Cấu Hình'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
