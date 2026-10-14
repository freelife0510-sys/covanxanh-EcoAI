/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Copy,
  Check,
  Compass,
  Lightbulb,
  HelpCircle,
  School,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/geminiService';

const STORAGE_KEY_CHAT = 'ecoai_chat_history_v2';

const QUICK_PROMPTS = [
  {
    title: 'Miền Trung & Bão Lũ',
    text: 'Tại sao miền Trung nước ta chịu bão lũ dữ dội vào cuối năm và nắng nóng khô rát vào mùa hè?',
    icon: Compass,
    color: 'from-amber-500/10 to-orange-500/10 border-amber-300 text-amber-900',
  },
  {
    title: 'El Niño & Hạn Mặn',
    text: 'Hiện tượng El Niño và Hiệu ứng nhà kính khác nhau như thế nào? Tác động ra sao đến ĐBSCL?',
    icon: Lightbulb,
    color: 'from-cyan-500/10 to-blue-500/10 border-cyan-300 text-cyan-900',
  },
  {
    title: 'Rác Nhựa Căng Tin',
    text: 'Làm thế nào để học sinh và Đoàn trường thuyết phục căng tin giảm ly nhựa dùng một lần?',
    icon: School,
    color: 'from-emerald-500/10 to-teal-500/10 border-emerald-300 text-emerald-900',
  },
  {
    title: 'Ý Tưởng Sáng Kiến Xanh',
    text: 'Gợi ý cho em 3 ý tưởng dự án môi trường vừa sức để viết báo cáo Sáng kiến kinh nghiệm / Hoạt động trải nghiệm.',
    icon: HelpCircle,
    color: 'from-teal-500/10 to-emerald-500/10 border-teal-300 text-teal-900',
  },
];

const INITIAL_GREETING: ChatMessage = {
  id: 'msg-init-1',
  sender: 'assistant',
  text: `Chào em! Thầy/Cô EcoAI rất vui được đồng hành cùng em trong hành trình khám phá khí hậu và môi trường Việt Nam 🌿.

**Phương pháp đồng hành**:
Khi em đặt câu hỏi, Thầy/Cô sẽ **giải thích ngắn gọn bản chất khoa học cốt lõi trước**, sau đó cùng em đặt những câu hỏi gợi mở (**Socratic**) để liên hệ thực tế trường học và tìm ra hành động thiết thực nhất!

Em đang băn khoăn về vấn đề môi trường nào nhất hôm nay? Hãy chọn một gợi ý nhanh bên dưới hoặc nhắn tin trực tiếp cho Thầy/Cô nhé!`,
  timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
  isMock: false,
};

export const EcoMentorChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHAT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [INITIAL_GREETING];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || inputPrompt).trim();
    if (!textToSend || isLoading) return;

    if (textToSend.length > 500) {
      alert('Câu hỏi tối đa 500 ký tự. Vui lòng rút gọn nội dung để được giải đáp tốt nhất!');
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(messages, textToSend);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isMock: response.isMock,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: 'Thầy/Cô vừa gặp sự cố kết nối tạm thời. Em hãy kiểm tra đường truyền và thử lại nhé!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isMock: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    if (confirm('Em có muốn bắt đầu lại cuộc trò chuyện mới với Thầy/Cô EcoAI không? Lịch sử cũ sẽ được làm mới.')) {
      const fresh: ChatMessage[] = [
        {
          ...INITIAL_GREETING,
          id: `msg-init-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ];
      setMessages(fresh);
      try {
        localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(fresh));
      } catch {
        // ignore
      }
    }
  };

  // Helper to format text with Markdown bold and bullet points
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
      const isNumbered = /^\d+\.\s/.test(line.trim());
      const isHeader = line.trim().startsWith('### ') || line.trim().startsWith('## ');

      let lineContent = line;
      if (isBullet) {
        lineContent = line.trim().substring(2);
      } else if (isNumbered) {
        lineContent = line.trim().replace(/^\d+\.\s/, '');
      } else if (isHeader) {
        lineContent = line.trim().replace(/^#+\s/, '');
      }

      // Convert **text** into bold tags
      const parts = lineContent.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-black text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (isHeader) {
        return (
          <h4 key={idx} className="text-xs sm:text-sm font-black text-emerald-800 mt-2 mb-1">
            {formattedParts}
          </h4>
        );
      }

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-2 my-1">
            <span className="text-emerald-600 font-bold mt-1 text-xs">•</span>
            <span className="flex-1 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
              {formattedParts}
            </span>
          </div>
        );
      }

      if (isNumbered) {
        return (
          <div key={idx} className="flex items-start gap-2 ml-2 my-1">
            <span className="text-teal-700 font-black text-xs mt-0.5">✓</span>
            <span className="flex-1 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
              {formattedParts}
            </span>
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Chat Container Header */}
      <div className="bg-white/95 border border-emerald-300 rounded-3xl p-5 shadow-xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">EcoAI — Cố Vấn Xanh Học Đường</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                Socratic AI
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Giải thích cốt lõi $\rightarrow$ Gợi mở tư duy phản biện $\rightarrow$ Hành động thực tiễn
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetChat}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition self-start sm:self-auto border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Cuộc trò chuyện mới</span>
        </button>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {QUICK_PROMPTS.map((qp, idx) => {
          const Icon = qp.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(qp.text)}
              className={`p-3 rounded-2xl bg-gradient-to-r ${qp.color} border text-left transition hover:scale-[1.01] active:scale-95 shadow-xs flex items-center gap-3 group`}
            >
              <div className="w-8 h-8 rounded-xl bg-white/80 shrink-0 flex items-center justify-center shadow-xs">
                <Icon className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate">{qp.title}</p>
                <p className="text-[11px] text-slate-600 truncate">{qp.text}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chat Stream Messages Container */}
      <div className="bg-white/95 border border-emerald-200/90 rounded-3xl p-4 sm:p-6 shadow-xl backdrop-blur-md min-h-[480px] max-h-[600px] overflow-y-auto space-y-5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[78%] space-y-1.5`}>
                <div className={`flex items-center gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-[10px] font-bold text-slate-400">
                    {isUser ? 'Học sinh' : 'Thầy/Cô EcoAI'} • {msg.timestamp}
                  </span>
                  {!isUser && msg.isMock && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      Mô phỏng
                    </span>
                  )}
                </div>

                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-xs shadow-md shadow-emerald-600/20'
                      : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-xs'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                  ) : (
                    renderFormattedText(msg.text)
                  )}
                </div>

                {!isUser && (
                  <div className="flex items-center gap-2 pl-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="text-[10px] font-bold text-slate-400 hover:text-emerald-700 flex items-center gap-1 transition"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-md">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Thầy/Cô EcoAI đang suy nghĩ và chuẩn bị câu trả lời gợi mở...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative flex items-center bg-white border border-emerald-300 rounded-2xl shadow-xl overflow-hidden p-1.5 focus-within:ring-2 focus-within:ring-emerald-500 transition"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Đặt câu hỏi về biến đổi khí hậu, bão lũ miền Trung, rác nhựa, hay ý tưởng dự án xanh..."
          disabled={isLoading}
          maxLength={500}
          className="w-full px-4 py-3 bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
        />

        <div className="flex items-center gap-2 shrink-0 pr-1">
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            {inputPrompt.length}/500
          </span>
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="p-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/25 transition active:scale-95 disabled:opacity-40"
            aria-label="Gửi tin nhắn"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
