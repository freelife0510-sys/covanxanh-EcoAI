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
  AlertTriangle,
  RotateCcw,
  Check,
  Calendar,
} from 'lucide-react';
import { QuizQuestion, StudentStudyRecord } from '../types';

const STORAGE_KEY_STUDENT = 'ecoai_student_assessment_v3';

const GDPT_CURRICULUM_MAPPING = [
  {
    subject: 'Địa lí (Lớp 10 & 12)',
    topics: 'Khí quyển, Gió Phơn, Thiên tai & Biến đổi khí hậu Việt Nam',
    standard: 'Phân tích được nguyên nhân bão lũ miền Trung, gió Tây Nam khô nóng và tác động của El Niño đối với khí hậu, hạn mặn ĐBSCL.',
    color: 'border-emerald-300 bg-emerald-50/60 text-emerald-950',
    tag: 'Địa lí 10, 12',
  },
  {
    subject: 'Sinh học (Lớp 12)',
    topics: 'Sinh thái học, Chu trình Carbon & Quản lý Chất thải',
    standard: 'Đánh giá được chu trình sinh địa hóa của carbon (CO2), tác động của hiệu ứng nhà kính và vai trò của phân loại rác thải tại nguồn.',
    color: 'border-teal-300 bg-teal-50/60 text-teal-950',
    tag: 'Sinh học 12',
  },
  {
    subject: 'Hoạt động Trải nghiệm, Hướng nghiệp',
    topics: 'Xây dựng Dự án Xanh vì Cộng đồng & Khởi nghiệp Xanh',
    standard: 'Chủ động lập kế hoạch giảm thiểu rác thải nhựa, thực hiện lối sống xanh Net Zero 2050 và lan tỏa ý thức bảo vệ môi trường trường học.',
    color: 'border-cyan-300 bg-cyan-50/60 text-cyan-950',
    tag: 'HĐTN 10, 11, 12',
  },
];

const PRE_POST_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: 'Theo số liệu nghiên cứu của ĐH Bách khoa Hà Nội và Bộ TN&MT (2024), hệ số phát thải của lưới điện Việt Nam là khoảng bao nhiêu?',
    options: [
      'Khoảng 0.25 tCO2e/MWh',
      'Khoảng 0.681 tCO2e/MWh (~0.681 kg CO2/kWh)',
      'Khoảng 1.85 tCO2e/MWh',
      'Bằng 0 vì sử dụng 100% thủy điện',
    ],
    correctIndex: 1,
    explanation: 'Hệ số lưới điện Việt Nam hiện ở mức ~0.681 tCO2e/MWh do cơ cấu nguồn điện vẫn còn tỷ trọng nhiệt điện than đáng kể, vì vậy tiết kiệm điện năng điều hòa có ý nghĩa trực tiếp giảm phát thải khí nhà kính.',
    subjectDomain: 'Địa lí',
  },
  {
    id: 2,
    question: 'Tại sao gió Phơn (gió Lào) ở vùng Bắc Trung Bộ và duyên hải miền Trung vào mùa hè lại có tính chất đặc trưng là cực kỳ khô và nóng?',
    options: [
      'Do gió thổi trực tiếp từ sa mạc Sahara qua Biển Đỏ',
      'Do gió mùa Tây Nam bị bức tường núi Trường Sơn chắn ẩm ở sườn Tây, khi vượt đỉnh núi hạ thấp xuống sườn Đông bị nén đoạn nhiệt và nóng lên',
      'Do hiệu ứng phản xạ ánh sáng từ các cồn cát ven biển',
      'Do các đợt bão nhiệt đới gây ra',
    ],
    correctIndex: 1,
    explanation: 'Theo kiến thức Địa lí 10 & 12, không khí ẩm từ biển khi leo dốc sườn Tây Trường Sơn mất ẩm qua mưa, sang sườn Đông hạ xuống theo quy luật đoạn nhiệt khô (cứ hạ 100m nhiệt độ tăng 1°C), trở thành gió Phơn khô rát.',
    subjectDomain: 'Địa lí',
  },
  {
    id: 3,
    question: 'Theo Luật Bảo vệ môi trường 2020 của Việt Nam, chất thải rắn sinh hoạt từ hộ gia đình và trường học được phân loại bắt buộc thành mấy nhóm chính?',
    options: [
      '2 nhóm: Rác cháy được và Rác không cháy được',
      '3 nhóm: Chất thải tái sử dụng/tái chế, Chất thải thực phẩm, và Chất thải rắn sinh hoạt khác (bao gồm rác nguy hại & vô cơ)',
      '5 nhóm không có nhóm nguy hại',
      'Không quy định bắt buộc phân loại',
    ],
    correctIndex: 1,
    explanation: 'Luật BVMT 2020 quy định 3 nhóm bắt buộc: Rác tái chế, Rác thực phẩm, và Rác sinh hoạt khác. Trong đó rác nguy hại như pin, bóng đèn phải được thu gom lưu trữ riêng biệt an toàn.',
    subjectDomain: 'Sinh học',
  },
  {
    id: 4,
    question: 'Tại sao pin cũ (pin tiểu, pin nút áo, ắc quy) tuyệt đối KHÔNG được vứt chung vào thùng rác thông thường hay đốt bỏ?',
    options: [
      'Vì pin có thể tái chế làm phân bón hữu cơ',
      'Vì pin chứa các kim loại nặng cực độc (chì, thủy ngân, cadmium) làm ô nhiễm nguồn nước ngầm và đất trong hàng chục năm; khi đốt sinh khí độc',
      'Vì pin làm thùng rác bị nặng',
      'Vì pin dễ tan chảy trong nước mưa thành bọt tuyết',
    ],
    correctIndex: 1,
    explanation: 'Chỉ 1 viên pin thủy ngân khi vứt ra môi trường có thể làm ô nhiễm 500 lít nước sạch hoặc 1m3 đất trong 50 năm, gây tổn thương hệ thần kinh và thận của con người qua chuỗi thức ăn.',
    subjectDomain: 'Sinh học',
  },
  {
    id: 5,
    question: 'Hành động nào sau đây của học sinh THPT đem lại hiệu quả cắt giảm phát thải carbon cao nhất và dễ duy trì tại trường học?',
    options: [
      'Sử dụng bình nước giữ nhiệt cá nhân để lấy nước lọc học đường thay vì mua ly/chai nhựa dùng 1 lần',
      'Tắt điều hòa và quạt đèn khi rời phòng học',
      'Đi xe đạp, xe buýt điện hoặc đi chung xe đến trường',
      'Tất cả các hành động trên đều đem lại tác động xanh thiết thực và tích lũy bền vững',
    ],
    correctIndex: 3,
    explanation: 'Sự kết hợp đồng bộ giữa thói quen giảm rác nhựa dùng một lần, tiết kiệm điện năng phòng học và sử dụng giao thông xanh tạo nên lối sống Net Zero toàn diện cho thế hệ trẻ.',
    subjectDomain: 'HĐTN',
  },
];

export const StudyAssessment: React.FC = () => {
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    classGrade: '',
    schoolName: '',
  });

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [reflection, setReflection] = useState('');

  // Load from localStorage if previously stored
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.studentInfo) setStudentInfo(parsed.studentInfo);
        if (parsed.reflection) setReflection(parsed.reflection);
        if (parsed.selectedAnswers) setSelectedAnswers(parsed.selectedAnswers);
        if (parsed.quizSubmitted) setQuizSubmitted(parsed.quizSubmitted);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_STUDENT,
        JSON.stringify({
          studentInfo,
          reflection,
          selectedAnswers,
          quizSubmitted,
        })
      );
    } catch {
      // ignore
    }
  }, [studentInfo, reflection, selectedAnswers, quizSubmitted]);

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    PRE_POST_QUIZ.forEach((q) => {
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
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#14b8a6', '#06b6d4', '#f59e0b'],
      });
    }
  };

  const handleResetQuiz = () => {
    if (confirm('Em có muốn làm lại bài đánh giá nhận thức không?')) {
      setSelectedAnswers({});
      setQuizSubmitted(false);
    }
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
          PHIẾU HỌC TẬP & KẾT QUẢ THỰC HÀNH SINH THÁI KHÍ HẬU ECOAI
        </h1>
        <p className="text-xs text-slate-600 italic">
          (Minh chứng thực nghiệm phục vụ Báo cáo Sáng kiến kinh nghiệm / Hoạt động trải nghiệm GDPT 2018)
        </p>
        <div className="flex justify-between text-xs pt-3 px-6 text-left font-medium">
          <p>Họ và tên học sinh: <strong>{studentInfo.name || '...................................................'}</strong></p>
          <p>Lớp: <strong>{studentInfo.classGrade || '.............'}</strong></p>
          <p>Ngày thực hiện: <strong>{new Date().toLocaleDateString('vi-VN')}</strong></p>
        </div>
      </div>

      {/* Screen Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-2 no-print">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
          <GraduationCap className="w-4 h-4 text-emerald-600" />
          <span>Hồ Sơ Sư Phạm & Đo Lường Nhận Thức GDPT 2018</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Phiếu Học Tập & Đánh Giá Nhận Thức Môi Trường
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Tích hợp đối chiếu chuẩn GDPT 2018, bài trắc nghiệm đo lường trước - sau (Pre/Post-test) và xuất phiếu kết quả làm minh chứng báo cáo Sáng kiến kinh nghiệm (SKKN).
        </p>
      </div>

      {/* 1. CURRICULUM MAPPING ACCORDING TO GDPT 2018 */}
      <section className="bg-white/95 border border-emerald-200/90 rounded-3xl p-6 shadow-xl space-y-4 no-print">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900">
              Khung Đối Chiếu Yêu Cầu Cần Đạt (Chương Trình GDPT 2018)
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

      {/* 2. STUDENT INFORMATION & PRE/POST TEST */}
      <section className="bg-white/95 border border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 print:border-none print:shadow-none print:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-black text-slate-900">
                Bài Trắc Nghiệm Đánh Giá Nhận Thức (Pre-test / Post-test)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              5 câu hỏi trắc nghiệm khách quan đo lường kiến thức khoa học và hành vi môi trường (Thang điểm 10)
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="no-print inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition self-start sm:self-auto"
            title="In phiếu học tập để nộp giáo viên"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>In Phiếu Học Tập A4</span>
          </button>
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

        {/* Quiz Questions List */}
        <div className="space-y-6">
          {PRE_POST_QUIZ.map((q, idx) => {
            const isCorrect = quizSubmitted && selectedAnswers[q.id] === q.correctIndex;
            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-3 print:bg-white print:border-slate-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    <span className="text-emerald-700 font-black mr-1">Câu {idx + 1}:</span>{' '}
                    {q.question}
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-300 text-slate-600 shrink-0">
                    {q.subjectDomain}
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

        {/* Submit or Score Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {!quizSubmitted ? (
            <button
              type="button"
              onClick={handleSubmitQuiz}
              disabled={Object.keys(selectedAnswers).length < PRE_POST_QUIZ.length}
              className="no-print w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition active:scale-95 disabled:opacity-50"
            >
              Nộp Bài Đánh Giá ({Object.keys(selectedAnswers).length}/{PRE_POST_QUIZ.length} câu)
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white shadow-xl print:bg-white print:text-slate-900 print:border print:border-slate-300">
              <div>
                <p className="text-xs uppercase font-bold text-emerald-300 print:text-slate-600">Kết quả đánh giá nhận thức</p>
                <p className="text-xl sm:text-2xl font-black mt-0.5">
                  Điểm số: <span className="font-mono text-amber-400 print:text-emerald-700">{score} / 10 điểm</span>
                </p>
                <p className="text-xs text-slate-300 mt-0.5 print:text-slate-600">
                  {score >= 8
                    ? 'Xuất sắc! Em nắm rất vững kiến thức khoa học và hành vi môi trường học đường.'
                    : 'Rất tốt! Em hãy đọc kỹ phần giải thích chi tiết để củng cố thêm kiến thức nhé.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetQuiz}
                className="no-print px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold border border-white/30 transition flex items-center gap-1.5 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại bài</span>
              </button>
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
          Sau khi sử dụng EcoAI để đo lường dấu chân carbon và phân loại rác, em hãy viết 2-3 câu chia sẻ hành động cụ thể mà em và lớp sẽ thực hiện ngay trong tuần này:
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
          <span>* Dữ liệu trên phiếu được tự động lưu trên trình duyệt và sẵn sàng in làm báo cáo SKKN.</span>
          <span className="font-bold text-emerald-700">Mục tiêu: Lớp học Net Zero 2050</span>
        </div>
      </section>
    </div>
  );
};
