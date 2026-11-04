import React, { useState } from 'react';
import { Course, Track, Level } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { Search, Filter, BookOpen, Clock, Award, ArrowRight, TrendingUp, Code, ShieldCheck } from 'lucide-react';

interface CoursesViewProps {
  courses: Course[];
  initialTrack?: Track | 'all';
  onNavigate: (view: string, param?: any) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({ courses, initialTrack = 'all', onNavigate }) => {
  const { language } = useAuth();
  const [selectedTrack, setSelectedTrack] = useState<string>(initialTrack);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedAccess, setSelectedAccess] = useState<'all' | 'free' | 'pro'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tracks = [
    { id: 'all', label: 'كافة المسارات (2,500 درس)' },
    { id: 'trading', label: 'أكاديمية التداول (1,200)' },
    { id: 'programming', label: 'أكاديمية البرمجة (1,000)' },
    { id: 'risk_psychology', label: 'إدارة المخاطر (200)' },
    { id: 'projects_quizzes', label: 'المشاريع والشهادات (100)' }
  ];

  const filteredCourses = courses.filter(c => {
    if (selectedTrack !== 'all' && c.track !== selectedTrack) return false;
    if (selectedLevel !== 'all' && c.level !== selectedLevel) return false;
    if (selectedAccess === 'free' && !c.isFree) return false;
    if (selectedAccess === 'pro' && c.isFree) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (c.title[language] || c.title.ar).toLowerCase().includes(q);
      const matchDesc = (c.description[language] || c.description.ar).toLowerCase().includes(q);
      const matchCat = c.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          دليل الدورات والمسارات التعليمية
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          استكشف المنهج الكامل المصمم لنقل مهاراتك من الصفر إلى الاحتراف المالي والتقني
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute top-3 right-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث عن دورة، استراتيجية، الذهب، جافاسكريبت، بايثون..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">كافة المستويات</option>
            <option value="beginner">مبتدئ (Beginner)</option>
            <option value="intermediate">متوسط (Intermediate)</option>
            <option value="advanced">متقدم (Advanced)</option>
          </select>

          {/* Access Filter */}
          <select
            value={selectedAccess}
            onChange={e => setSelectedAccess(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">كافة أنواع الوصول</option>
            <option value="free">مجاني فقط</option>
            <option value="pro">مدفوع (PRO) فقط</option>
          </select>
        </div>

        {/* Track Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {tracks.map(tr => (
            <button
              key={tr.id}
              onClick={() => setSelectedTrack(tr.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedTrack === tr.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {tr.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div
            key={course.id}
            onClick={() => onNavigate('course-detail', course.id)}
            className="bg-slate-900 border border-slate-800 hover:border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between transition cursor-pointer group shadow-xl hover:shadow-cyan-500/5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  course.track === 'trading'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : course.track === 'programming'
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {course.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {course.level}
                  </span>
                  {course.isFree ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      مجاني
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      PRO
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-slate-100 text-base group-hover:text-cyan-400 transition leading-snug">
                {course.title[language] || course.title.ar}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                {course.description[language] || course.description.ar}
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {course.durationHours} ساعة
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  {course.lessonsTarget} درس مستهدف
                </span>
              </div>
              <span className="font-bold text-cyan-400 flex items-center gap-1">
                دخول الدورة <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">لا توجد دورات تطابق معايير البحث</h3>
          <p className="text-xs text-slate-500 mt-1">جرب تغيير كلمات البحث أو إعادة ضبط خيارات التصفية.</p>
        </div>
      )}
    </div>
  );
};
