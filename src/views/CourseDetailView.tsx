import React, { useState, useEffect } from 'react';
import { Course, Lesson, UserProgress } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { ArrowLeft, Clock, BookOpen, CheckCircle, Lock, PlayCircle, Award, ShieldAlert } from 'lucide-react';

interface CourseDetailViewProps {
  courseId: string;
  onNavigate: (view: string, param?: any) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({ courseId, onNavigate, onOpenAuth }) => {
  const { user, authFetch, language } = useAuth();
  const [course, setCourse] = useState<(Course & { lessons: Lesson[] }) | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses/${courseId}`);
        if (res.ok) {
          const data = await res.json();
          setCourse(data);
        }
      } catch (e) {
        console.error('Failed to load course:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (user) {
      authFetch(`/api/progress/${user.id}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) setProgress(data);
        })
        .catch(console.error);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        جاري تحميل تفاصيل الدورة...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-200">الدورة غير موجودة</h2>
        <button
          onClick={() => onNavigate('courses')}
          className="mt-4 px-4 py-2 bg-slate-800 text-cyan-400 rounded-xl text-xs font-semibold"
        >
          العودة لقائمة الدورات
        </button>
      </div>
    );
  }

  const completedIds = progress?.completedLessonIds || [];
  const lessons = course.lessons || [];
  const completedCount = lessons.filter(l => completedIds.includes(l.id)).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
  const isEnrolledActive = user && (user.subscriptionStatus === 'active' || user.role === 'admin');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('courses')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        الرجوع إلى الدورات
      </button>

      {/* Course Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {course.category}
            </span>
            <span className="text-xs uppercase px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold">
              المستوى: {course.level}
            </span>
          </div>

          <div>
            {course.isFree ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                وصول مجاني بالكامل
              </span>
            ) : (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                مشمول في باقة PRO / VIP
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {course.title[language] || course.title.ar}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            {course.description[language] || course.description.ar}
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block">المدة التقديرية:</span>
            <strong className="text-slate-200 text-sm">{course.durationHours} ساعة تدريب</strong>
          </div>
          <div>
            <span className="text-slate-500 block">الدروس المستهدفة:</span>
            <strong className="text-slate-200 text-sm">{course.lessonsTarget} درس</strong>
          </div>
          <div>
            <span className="text-slate-500 block">الدروس المتوفرة حالياً:</span>
            <strong className="text-cyan-400 text-sm">{lessons.length} درس كامل</strong>
          </div>
          <div>
            <span className="text-slate-500 block">الشهادة:</span>
            <strong className="text-emerald-400 text-sm">معتمدة برمز فريد</strong>
          </div>
        </div>

        {/* Progress Bar for logged in user */}
        {user && lessons.length > 0 && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-300">نسبة إنجازك في هذه الدورة:</span>
              <span className="text-cyan-400 font-bold font-mono">{progressPercent}% ({completedCount} من {lessons.length})</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Lessons Syllabus List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            فهرس دروس الدورة
          </h2>
          <span className="text-xs text-slate-400">
            {lessons.length} درس مفصل
          </span>
        </div>

        <div className="space-y-3">
          {lessons.map((lesson, idx) => {
            const isCompleted = completedIds.includes(lesson.id);
            const isLocked = !lesson.isFree && !isEnrolledActive;

            return (
              <div
                key={lesson.id}
                className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-900/90 border-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-100 text-sm">
                        {lesson.title[language] || lesson.title.ar}
                      </h3>
                      {lesson.isFree && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          مجاني
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {lesson.description[language] || lesson.description.ar}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                      <span>{lesson.durationMin} دقيقة</span>
                      <span>•</span>
                      <span className="uppercase">{lesson.level}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  {isLocked ? (
                    <button
                      onClick={() => user ? onNavigate('pricing') : onOpenAuth('login')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 hover:bg-amber-500/20 transition"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      ترقية الحساب لفتح الدرس
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('lesson-detail', lesson.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
                    >
                      <PlayCircle className="w-4 h-4" />
                      {isCompleted ? 'إعادة مراجعة الدرس' : 'بدء الدرس الآن'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {lessons.length === 0 && (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            يتم تجهيز ونشر دفعات الدروس المبرمجة لهذه الدورة تباعاً عبر لوحة الإدارة.
          </div>
        )}
      </div>
    </div>
  );
};
