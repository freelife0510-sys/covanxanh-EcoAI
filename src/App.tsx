/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { EcoMentorChat } from './components/EcoMentorChat';
import { CarbonCalculator } from './components/CarbonCalculator';
import { WasteClassifier } from './components/WasteClassifier';
import { StudyAssessment } from './components/StudyAssessment';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Footer } from './components/Footer';
import { hasUserApiKey } from './services/geminiService';
import { Info, MapPin, Calculator, Recycle, Award, ChevronRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const [serverKeyAvailable, setServerKeyAvailable] = useState(false);

  const checkKeys = async () => {
    setHasCustomKey(hasUserApiKey());
    try {
      const res = await fetch('/api/gemini/status');
      if (res.ok) {
        const data = await res.json();
        setServerKeyAvailable(Boolean(data.serverKeyConfigured));
      }
    } catch {
      setServerKeyAvailable(false);
    }
  };

  useEffect(() => {
    checkKeys();
  }, []);

  const isLiveAI = hasCustomKey || serverKeyAvailable;

  const pedagogicalSteps = [
    {
      step: '1',
      title: 'Khám phá',
      subtitle: 'Bản đồ Khí hậu Atlat 3D',
      tab: 'home' as ActiveTab,
      icon: MapPin,
    },
    {
      step: '2',
      title: 'Đo lường',
      subtitle: 'Dấu chân Carbon',
      tab: 'calculator' as ActiveTab,
      icon: Calculator,
    },
    {
      step: '3',
      title: 'Hành động',
      subtitle: 'Phân loại rác 3+1',
      tab: 'waste' as ActiveTab,
      icon: Recycle,
    },
    {
      step: '4',
      title: 'Hiểu biết của bạn',
      subtitle: 'Phiếu học tập và đánh giá',
      tab: 'assessment' as ActiveTab,
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-topo-pattern bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      {/* Background ambient radial gradients */}
      <div className="fixed top-0 left-1/4 w-[36rem] h-[36rem] bg-emerald-400/12 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-[36rem] h-[36rem] bg-teal-400/12 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasCustomKey={hasCustomKey}
        serverKeyAvailable={serverKeyAvailable}
      />

      {/* Transparent Mode Notice Bar if running in Offline / Demo Mode */}
      {!isLiveAI && (
        <aside aria-label="Thông báo chế độ mô phỏng" className="bg-amber-500/10 border-b border-amber-300/60 px-4 py-2 text-xs text-amber-950 flex items-center justify-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>
            Hệ thống đang hoạt động ở <strong>Chế độ Sư phạm Mô phỏng (Offline Demo)</strong>. Học sinh và thầy cô có thể trải nghiệm đầy đủ hoặc bấm nút <em>"Cài đặt API Key"</em> để kết nối Google Gemini AI.
          </span>
        </aside>
      )}

      {/* Pedagogical 4-Step Learning Roadmap Banner */}
      <section aria-label="Mạch học tập" className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-1">
        <div className="bg-white/75 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-2.5 sm:p-3 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Mạch học tập:
            </span>
          </div>

          <nav aria-label="Các bước học tập" className="w-full md:w-auto flex items-center justify-between md:justify-end gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0">
            {pedagogicalSteps.map((s, idx) => {
              const Icon = s.icon;
              const isCurrent = activeTab === s.tab;
              return (
                <React.Fragment key={s.step}>
                  <button
                    onClick={() => setActiveTab(s.tab)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold scale-[1.02]'
                        : 'bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/60 hover:scale-[1.01]'
                    }`}
                    title={`Chuyển tới Bước ${s.step}: ${s.title} (${s.subtitle})`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isCurrent
                          ? 'bg-white text-emerald-700'
                          : 'bg-emerald-200 text-emerald-800'
                      }`}
                    >
                      {s.step}
                    </span>
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap hidden sm:inline">{s.title}:</span>
                    <span className="whitespace-nowrap font-semibold">{s.subtitle}</span>
                  </button>
                  {idx < pedagogicalSteps.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-300 shrink-0 hidden lg:block" />
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Main Container Content with State Persistence across Tabs */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* TAB 1: HOME */}
        <section aria-label="Trang chủ" className={activeTab === 'home' ? 'block' : 'hidden'}>
          <HomeHero
            onNavigate={setActiveTab}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          />
        </section>

        {/* TAB 2: CHAT SOCRATIC */}
        <section aria-label="Cố vấn Xanh Socratic" className={activeTab === 'chat' ? 'block' : 'hidden'}>
          <EcoMentorChat />
        </section>

        {/* TAB 3: CARBON CALCULATOR */}
        <section aria-label="Máy tính Dấu chân Carbon" className={activeTab === 'calculator' ? 'block' : 'hidden'}>
          <CarbonCalculator />
        </section>

        {/* TAB 4: WASTE CLASSIFIER */}
        <section aria-label="Phân loại rác thông minh" className={activeTab === 'waste' ? 'block' : 'hidden'}>
          <WasteClassifier />
        </section>

        {/* TAB 5: STUDY ASSESSMENT */}
        <section aria-label="Hiểu biết của bạn - Phiếu học tập và đánh giá" className={activeTab === 'assessment' ? 'block' : 'hidden'}>
          <StudyAssessment />
        </section>
      </main>

      {/* Modal for Setting Gemini API Key */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={checkKeys}
      />

      {/* Educational Footer */}
      <Footer />
    </div>
  );
}
