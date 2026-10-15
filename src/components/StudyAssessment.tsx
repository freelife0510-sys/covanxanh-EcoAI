/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  HelpCircle,
  Printer,
  Sparkles,
  FileText,
  RotateCcw,
  RefreshCw,
  Calendar,
  Check,
} from 'lucide-react';
import { QuizQuestion } from '../types';
import { generateDynamicQuiz } from '../services/geminiService';

const STORAGE_KEY_STUDENT = 'ecoai_student_assessment_v4';

const GDPT_CURRICULUM_MAPPING = [
  {
    subject: 'Địa lí (Lớp 10 & 12)',
    topics: 'Khí quyển, Gió mùa, Thiên tai & Biến đổi khí hậu Việt Nam',
    standard: 'Đọc hiểu Atlat khí hậu, phân tích đặc trưng 2 miền và 7 vùng khí hậu, nguyên nhân bão lũ và gió phơn Tây Nam khô nóng.',
    color: 'border-emerald-300 bg-emerald-50/60 text-emerald-950',
    tag: 'Địa lí 10, 12',
  },
  {
    subject: 'Sinh học (Lớp 12)',
    topics: 'Sinh thái học, Chu trình Carbon & Quản lý Chất thải',
    standard: 'Đánh giá chu trình sinh địa hóa của carbon (CO2), tác động hiệu ứng nhà kính và phân loại rác thải tại nguồn theo Luật BVMT 2020.',
    color: 'border-teal-300 bg-teal-50/60 text-teal-950',
    tag: 'Sinh học 12',
  },
  {
    subject: 'Hoạt động Trải nghiệm, Hướng nghiệp',
    topics: 'Lối sống Xanh Học đường & Mục tiêu Net Zero 2050',
    standard: 'Xây dựng kế hoạch cá nhân giảm thiểu rác nhựa dùng 1 lần, tiết kiệm điện năng phòng học và lan tỏa văn hóa bảo vệ môi trường.',
    color: 'border-cyan-300 bg-cyan-50/60 text-cyan-950',
    tag: 'HĐTN 10, 11, 12',
  },
];

export const StudyAssessment: React.FC = () => {
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    classGrade: '',
    schoolName: '',
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState<boolean>(false);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [reflection, setReflection] = useState('');

  // Initial load: Fetch dynamic quiz and stored data
  const loadNewQuiz = async () => {
    setIsLoadingQuiz(true);
    try {
      const res = await generateDynamicQuiz();
      setQuestions(res.questions);
      setIsAiGenerated(!res.isMock);
      setSelectedAnswers({});
      setQuizSubmitted(false);
    } catch {
      // handled inside service
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.studentInfo) setStudentInfo(parsed.studentInfo);
        if (parsed.reflection) setReflection(parsed.reflection);
      }
    } catch {
      // ignore
    }
    loadNewQuiz();
  }, []);

  // Save student info & reflection to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_STUDENT,
        JSON.stringify({
          studentInfo,
          reflection,
        })
      );
    } catch {
      // ignore
    }
  }, [studentInfo, reflection]);

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 2; // 5 questions * 2 = 10 points
      }
    });
    return score;
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    const score = calculateScore();
    if (score >= 8) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const score = calculateScore();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* =========================================================================
          PRINT ONLY HEADER (HIỂN THỊ KHI BẤM NÚT IN HOẶC LƯU PDF A4)
          ========================================================================= */}
      <div className="hidden print:block text-center space-y-2 pb-4 border-b-2 border-slate-900 mb-6">
        <p className="text-xs font-bold uppercase tracking-wider">
          SỞ GIÁO DỤC VÀ ĐÀO TẠO — TRƯỜNG THPT: {studentInfo.schoolName || '...................................................'}
        </p>
        <p className="text-sm font-black uppercase text-slate-900">
          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
        </p>
        <p className="text-xs font-bold italic text-slate-700">
          Độc lập — Tự do — Hạnh phúc
        </p>
        <h1 className="text-lg font-black uppercase pt-3 text-slate-900">
          PHIẾU HỌC TẬP VÀ ĐÁNH GIÁ KIẾN THỨC MÔI TRƯỜNG & KHÍ HẬU
        </h1>
        <p className="text-xs text-slate-600 italic">
          (Nền tảng giáo dục sinh thái số EcoAI — Đánh giá nhận thức học sinh)
        </p>
        <div className="flex justify-between text-xs pt-3 px-6 text-left font-medium">
          <p>Họ và tên học sinh: <strong>{studentInfo.name || '...................................................'}</strong></p>
          <p>Lớp: <strong>{studentInfo.classGrade || '.............'}</strong></p>
          <p>Ngày thực hiện: <strong>{new Date().toLocaleDateString('vi-VN')}</strong></p>
        </div>
      </div>

      {/* Screen Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-2 no-print">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4 text-emerald-600" />
          <span>Bước 4: Hiểu biết của bạn</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Hiểu Biết Của Bạn — Phiếu Học Tập Và Đánh Giá
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Đo lường mức độ hiểu biết về Khí hậu Atlat, Dấu chân Carbon và Phân loại rác Luật BVMT 2020. Bộ câu hỏi được tạo mới ngẫu nhiên mỗi lần để kiểm tra kiến thức đa dạng của người học.
        </p>
      </div>

      {/* 1. CURRICULUM MAPPING */}
      <section className="bg-white/95 border border-emerald-200/90 rounded-3xl p-6 shadow-xl space-y-4 no-print">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900">
              Khung Đối Chiếu Yêu Cầu Cần Đạt (Chương Trình GDPT)
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Chuẩn Liên Môn THPT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GDPT_CURRICULUM_MAPPING.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${item.color} shadow-xs space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-white/80 border border-current shadow-xs">
                  {item.tag}
                </span>
                <span className="text-xs font-bold text-slate-700">{item.subject}</span>
              </div>
              <h4 className="text-xs font-black text-slate-900 leading-snug">{item.topics}</h4>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                <strong>Yêu cầu cần đạt:</strong> {item.standard}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. STUDENT INFORMATION & DYNAMIC AI QUIZ */}
      <section className="bg-white/95 border border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 print:border-none print:shadow-none print:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-black text-slate-900">
                Bài Trắc Nghiệm Đánh Giá Kiến Thức
              </h3>
              {isAiGenerated ? (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" /> AI Gemini Sinh Đề
                </span>
              ) : (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Ngân hàng đề thi sinh thái
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              5 câu hỏi trắc nghiệm khách quan thay đổi theo từng lần kiểm tra (Thang điểm 10)
            </p>
          </div>

          <div className="no-print flex items-center gap-2 self-start sm:self-auto">
            {/* Generate New Quiz Button */}
            <button
              type="button"
              onClick={loadNewQuiz}
              disabled={isLoadingQuiz}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold transition disabled:opacity-50"
              title="Đổi bộ 5 câu hỏi mới từ AI"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isLoadingQuiz ? 'animate-spin' : ''}`} />
              <span>{isLoadingQuiz ? 'Đang tạo câu hỏi...' : 'Đổi đề mới (AI)'}</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition"
              title="In phiếu học tập để nộp giáo viên"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>In Phiếu Học Tập A4</span>
            </button>
          </div>
        </div>

        {/* Student Meta Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 print:bg-white print:border-slate-300">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Họ và tên học sinh:
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={studentInfo.name}
              onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Lớp:
            </label>
            <input
              type="text"
              placeholder="Ví dụ: 12A1"
              value={studentInfo.classGrade}
              onChange={(e) => setStudentInfo({ ...studentInfo, classGrade: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Trường THPT:
            </label>
            <input
              type="text"
              placeholder="Ví dụ: THPT Chuyên / THPT Huyện"
              value={studentInfo.schoolName}
              onChange={(e) => setStudentInfo({ ...studentInfo, schoolName: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Dynamic Quiz Questions List */}
        {isLoadingQuiz ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-500">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-xs font-bold text-slate-700">Trí tuệ nhân tạo Gemini đang sinh 5 câu hỏi mới...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const isCorrect = quizSubmitted && selectedAnswers[q.id] === q.correctIndex;
              return (
                <div
                  key={q.id || idx}
                  className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-3 print:bg-white print:border-slate-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      <span className="text-emerald-700 font-black mr-1">Câu {idx + 1}:</span>{' '}
                      {q.question}
                    </p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-300 text-slate-600 shrink-0">
                      {q.subjectDomain || 'Sinh thái'}
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-emerald-50/40';

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                        } else if (isSelected && optIdx !== q.correctIndex) {
                          btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-xs';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span className="flex-1">{opt}</span>
                          {quizSubmitted && optIdx === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation on submission */}
                  {quizSubmitted && (
                    <div
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'
                      }`}
                    >
                      <p className="font-bold flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{isCorrect ? 'Chính xác! (+2 điểm)' : 'Chưa chính xác!'}</span>
                      </p>
                      <p className="text-[11px] leading-relaxed pl-5">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Submit or Score Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {!quizSubmitted ? (
            <button
              type="button"
              onClick={handleSubmitQuiz}
              disabled={Object.keys(selectedAnswers).length < questions.length || questions.length === 0}
              className="no-print w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition active:scale-95 disabled:opacity-50"
            >
              Nộp Bài Đánh Giá ({Object.keys(selectedAnswers).length}/{questions.length} câu)
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white shadow-xl print:bg-white print:text-slate-900 print:border print:border-slate-300">
              <div>
                <p className="text-xs uppercase font-bold text-emerald-300 print:text-slate-600">Kết quả đánh giá kiến thức</p>
                <p className="text-xl sm:text-2xl font-black mt-0.5">
                  Điểm số: <span className="font-mono text-amber-400 print:text-emerald-700">{score} / 10 điểm</span>
                </p>
                <p className="text-xs text-slate-300 mt-0.5 print:text-slate-600">
                  {score >= 8
                    ? 'Xuất sắc! Em nắm rất vững kiến thức khoa học và hành vi môi trường học đường.'
                    : 'Rất tốt! Em hãy đọc kỹ phần giải thích chi tiết để củng cố thêm kiến thức nhé.'}
                </p>
              </div>

              <div className="flex items-center gap-2 no-print">
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30 transition flex items-center gap-1.5 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Làm lại bài</span>
                </button>
                <button
                  type="button"
                  onClick={loadNewQuiz}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Đổi đề mới</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. STUDENT REFLECTION & COMMITMENT */}
      <section className="bg-white/95 border border-emerald-200/90 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 print:border-none print:shadow-none print:p-0">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileText className="w-5 h-5 text-teal-600" />
          <h3 className="text-base font-black text-slate-900">
            Suy Ngẫm Cá Nhân & Cam Kết Hành Động Xanh
          </h3>
        </div>

        <p className="text-xs text-slate-600">
          Sau khi sử dụng EcoAI để tìm hiểu khí hậu Atlat, đo lường carbon và phân loại rác, em hãy chia sẻ 2-3 câu về hành động cụ thể mà em và lớp sẽ thực hiện:
        </p>

        <textarea
          rows={3}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Ví dụ: Em và nhóm bạn sẽ bắt đầu mang bình nước cá nhân để không dùng ly nhựa ở căng tin, đồng thời đề xuất lớp giữ nhiệt độ điều hòa cố định 26°C..."
          className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs leading-relaxed font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
        />

        {/* Print Signatures */}
        <div className="hidden print:grid grid-cols-2 gap-8 pt-8 text-center text-xs">
          <div>
            <p className="font-bold">HỌC SINH CAM KẾT</p>
            <p className="italic text-[10px] text-slate-500">(Ký và ghi rõ họ tên)</p>
            <div className="h-20" />
            <p className="font-bold">{studentInfo.name || '...........................................'}</p>
          </div>

          <div>
            <p className="font-bold">XÁC NHẬN CỦA GIÁO VIÊN BỘ MÔN</p>
            <p className="italic text-[10px] text-slate-500">(Ký và nhận xét kết quả)</p>
            <div className="h-20" />
            <p className="font-bold">Thầy/Cô: ...........................................</p>
          </div>
        </div>

        <div className="no-print flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span>* Dữ liệu trên phiếu được tự động lưu trên trình duyệt và sẵn sàng in để nộp giáo viên.</span>
          <span className="font-bold text-emerald-700">Mục tiêu: Trường học Net Zero 2050</span>
        </div>
      </section>
    </div>
  );
};
