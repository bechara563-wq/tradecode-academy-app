import React, { useState, useEffect } from 'react';
import { Lesson, Quiz, Certificate } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { CertificateModal } from '../components/CertificateModal.js';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  HelpCircle,
  Check,
  AlertCircle,
  Sparkles,
  Bookmark
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LessonDetailViewProps {
  lessonId: string;
  onNavigate: (view: string, param?: any) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const LessonDetailView: React.FC<LessonDetailViewProps> = ({ lessonId, onNavigate, onOpenAuth }) => {
  const { user, authFetch, language } = useAuth();
  const [lesson, setLesson] = useState<(Lesson & { quiz?: Quiz }) | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean; correctCount: number; totalQuestions: number } | null>(null);
  const [earnedCertificate, setEarnedCertificate] = useState<Certificate | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/lessons/${lessonId}`);
        if (res.ok) {
          const data = await res.json();
          setLesson(data);
        }
      } catch (e) {
        console.error('Failed to load lesson:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  useEffect(() => {
    if (user && lessonId) {
      authFetch(`/api/progress/${user.id}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data && data.completedLessonIds) {
            setIsCompleted(data.completedLessonIds.includes(lessonId));
          }
        })
        .catch(console.error);
    }
  }, [user, lessonId]);

  const handleMarkComplete = async () => {
    if (!user) {
      onOpenAuth('login');
      return;
    }

    try {
      const res = await authFetch('/api/progress/complete-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId })
      });

      if (res.ok) {
        setIsCompleted(true);
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      }
    } catch (e) {
      console.error('Error marking lesson complete:', e);
    }
  };

  const handleQuizOptionSelect = (qId: string, optId: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optId }));
  };

  const handleSubmitQuiz = async () => {
    if (!user) {
      onOpenAuth('login');
      return;
    }

    if (!lesson?.quiz) return;

    try {
      const res = await authFetch('/api/progress/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: lesson.quiz.id,
          answers: selectedAnswers
        })
      });

      if (res.ok) {
        const data = await res.json();
        setQuizSubmitted(true);
        setQuizResult({
          score: data.score,
          passed: data.passed,
          correctCount: data.correctCount,
          totalQuestions: data.totalQuestions
        });

        if (data.passed) {
          setIsCompleted(true);
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          if (data.certificate) {
            setEarnedCertificate(data.certificate);
            setShowCertModal(true);
          }
        }
      }
    } catch (e) {
      console.error('Failed submitting quiz:', e);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        جاري تحميل الدرس...
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-200">الدرس غير متوفر</h2>
        <button
          onClick={() => onNavigate('courses')}
          className="mt-4 px-4 py-2 bg-slate-800 text-cyan-400 rounded-xl text-xs font-semibold"
        >
          العودة للدورات
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top back navigation */}
      <button
        onClick={() => onNavigate('course-detail', lesson.courseId)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        الرجوع إلى فهرس الدورة
      </button>

      {/* Lesson Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
              {lesson.track}
            </span>
            <span className="uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
              {lesson.level}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {lesson.durationMin} دقيقة
            </span>
            {isCompleted && (
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle className="w-3.5 h-3.5" /> مكتمل
              </span>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
          {lesson.title[language] || lesson.title.ar}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {lesson.description[language] || lesson.description.ar}
        </p>

        {/* Objectives Box */}
        {lesson.objectives && lesson.objectives.length > 0 && (
          <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" />
              الأهداف التعليمية لهذا الدرس:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {lesson.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{obj[language] || obj.ar}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Main Educational Article Content */}
      <article className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-slate-200 text-sm leading-relaxed space-y-6">
        <div className="whitespace-pre-line font-sans text-xs sm:text-sm space-y-4">
          {(lesson.content[language] || lesson.content.ar).split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-2 mt-6">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote key={idx} className="p-4 rounded-xl bg-cyan-950/40 border-r-4 border-cyan-400 text-cyan-200 text-xs italic my-4">
                  {paragraph.replace('> ', '')}
                </blockquote>
              );
            }
            if (paragraph.startsWith('```')) {
              const codeBlock = paragraph.replace(/```[a-z]*\n?/g, '').trim();
              return (
                <pre key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto my-4" dir="ltr">
                  <code>{codeBlock}</code>
                </pre>
              );
            }
            return <p key={idx} className="leading-relaxed text-slate-300">{paragraph}</p>;
          })}
        </div>

        {/* Practical Exercise Box */}
        {lesson.practiceExercise && (
          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-950 border border-blue-500/30 space-y-2">
            <h4 className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              تمرين تطبيقي عملي:
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lesson.practiceExercise[language] || lesson.practiceExercise.ar}
            </p>
          </div>
        )}

        {/* Key Takeaways */}
        {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
          <div className="mt-6 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              الخلاصة والنقاط الذهبية:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {lesson.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{takeaway[language] || takeaway.ar}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      {/* Completion & Quiz Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle className="w-4 h-4" />
              لقد أتممت هذا الدرس بنجاح
            </span>
          ) : (
            <button
              onClick={handleMarkComplete}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-md shadow-cyan-500/20 transition flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              تحديد الدرس كمكتمل وحفظ التقدم
            </button>
          )}
        </div>

        {lesson.quiz && (
          <button
            onClick={() => setShowQuiz(!showQuiz)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            {showQuiz ? 'إخفاء الاختبار' : 'اختبار تقييم الدرس والشهادة'}
          </button>
        )}
      </div>

      {/* Inline Quiz Section */}
      {showQuiz && lesson.quiz && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                {lesson.quiz.title[language] || lesson.quiz.title.ar}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                نسبة النجاح المطلوبة: {lesson.quiz.passingScore}% لإصدار الشهادة المعتمدة
              </p>
            </div>
            {quizResult && (
              <div className={`px-3 py-1 rounded-xl text-xs font-bold font-mono ${quizResult.passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}>
                النتيجة: {quizResult.score}%
              </div>
            )}
          </div>

          <div className="space-y-6">
            {lesson.quiz.questions.map((q, qIndex) => {
              const selectedOpt = selectedAnswers[q.id];
              const isCorrect = quizSubmitted && selectedOpt === q.correctOptionId;
              const isWrong = quizSubmitted && selectedOpt && selectedOpt !== q.correctOptionId;

              return (
                <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                      {qIndex + 1}
                    </span>
                    <span>{q.question[language] || q.question.ar}</span>
                  </h4>

                  <div className="space-y-2">
                    {q.options.map(opt => {
                      const isChosen = selectedOpt === opt.id;
                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                      if (isChosen) {
                        btnStyle = 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold';
                      }

                      if (quizSubmitted) {
                        if (opt.id === q.correctOptionId) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isChosen && opt.id !== q.correctOptionId) {
                          btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() => handleQuizOptionSelect(q.id, opt.id)}
                          className={`w-full text-start p-3 rounded-xl border text-xs transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt.text[language] || opt.text.ar}</span>
                          {quizSubmitted && opt.id === q.correctOptionId && (
                            <Check className="w-4 h-4 text-emerald-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                      <strong className="text-slate-300 block mb-0.5">شرح الإجابة:</strong>
                      {q.explanation[language] || q.explanation.ar}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between">
            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < lesson.quiz.questions.length}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 shadow-md shadow-amber-500/20 transition disabled:opacity-40"
              >
                إرسال الإجابات وتصحيح الاختبار
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setQuizSubmitted(false);
                    setSelectedAnswers({});
                    setQuizResult(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
                >
                  إعادة المحاولة
                </button>

                {earnedCertificate && (
                  <button
                    onClick={() => setShowCertModal(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition flex items-center gap-1.5"
                  >
                    <Award className="w-4 h-4" />
                    عرض الشهادة المكتسبة
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        certificate={earnedCertificate}
        onClose={() => setShowCertModal(false)}
      />
    </div>
  );
};
