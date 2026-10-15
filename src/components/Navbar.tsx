/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Home,
  MessageSquareQuote,
  Calculator,
  ScanSearch,
  KeyRound,
  Sparkles,
  Globe2,
  Leaf,
  GraduationCap,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenApiKeyModal: () => void;
  hasCustomKey: boolean;
  serverKeyAvailable: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenApiKeyModal,
  hasCustomKey,
  serverKeyAvailable,
}) => {
  const isKeyActive = hasCustomKey || serverKeyAvailable;

  const tabs: { id: ActiveTab; label: string; icon: React.ElementType; badge?: string }[] = [
    {
      id: 'home',
      label: 'Trang chủ',
      icon: Home,
    },
    {
      id: 'chat',
      label: 'Cố vấn Xanh',
      icon: MessageSquareQuote,
      badge: 'Socratic AI',
    },
    {
      id: 'calculator',
      label: 'Dấu chân Carbon',
      icon: Calculator,
      badge: '7 Ngày',
    },
    {
      id: 'waste',
      label: 'Phân loại Rác',
      icon: ScanSearch,
      badge: 'Vision AI',
    },
    {
      id: 'assessment',
      label: 'Phiếu học tập',
      icon: GraduationCap,
      badge: 'Đánh giá',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 border-b border-emerald-500/20 shadow-md shadow-emerald-950/5 transition-all">
      {/* Top Eco Announcement Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-inner">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
          <Leaf className="w-3 h-3 text-emerald-200" /> THPT Việt Nam
        </span>
        <span className="hidden sm:inline">🌱</span>
        <span className="font-semibold tracking-wide">
          Hành động nhỏ — Tác động lớn cho Trái Đất hôm nay
        </span>
        <span className="hidden md:inline text-emerald-100 text-[11px]">
          | Hướng tới Net Zero 2050
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onTabChange('home')}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
                <Globe2 className="w-5 h-5 text-white animate-spin-slow" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-sm">
                <Leaf className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-600 bg-clip-text text-transparent">
                  EcoAI
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold tracking-wide">
                  Cố vấn Xanh
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                AI-Powered Eco Action Hub
              </p>
            </div>
          </div>

          {/* Desktop Tab Switcher */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-inner">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: API Key Button */}
          <div className="flex items-center gap-2">

            <button
              onClick={onOpenApiKeyModal}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 shadow-sm ${
                isKeyActive
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-white border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-50'
              }`}
              title="Cài đặt khóa Google Gemini API"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">
                {isKeyActive ? 'Gemini API' : 'Cài đặt API Key'}
              </span>
              {isKeyActive ? (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-semibold">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span className="hidden lg:inline">Chế độ Mock</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-2 border-t border-slate-200/80 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
