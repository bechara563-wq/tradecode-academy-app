import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useMarket } from '../context/MarketContext.js';
import { Course } from '../types/index.js';
import { RiskCalculator } from '../components/RiskCalculator.js';
import {
  TrendingUp,
  Code,
  Globe,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Zap,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Layers,
  HelpCircle,
  Cpu,
  Coins
} from 'lucide-react';

interface HomeViewProps {
  courses: Course[];
  onNavigate: (view: string, param?: any) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ courses, onNavigate, onOpenAuth }) => {
  const { user, t, language } = useAuth();
  const { quotes, news, isStale, source } = useMarket();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Top 4 preview assets
  const previewQuotes = quotes.slice(0, 4);

  // Featured courses: first 4
  const featuredCourses = courses.slice(0, 4);

  const faqs = [
    {
      q: 'هل أحتاج إلى خبرة سابقة في التداول أو البرمجة للبدء؟',
      a: 'لا على الإطلاق. صُممت المسارات التعليمية في TradeCode Academy لتبدأ معك من الصفر المطلق في كل من أساسيات الأسواق المالية وأساسيات البرمجة، مع توفير أمثلة وتمارين وتطبيقات عملية متدرجة حتى الاحتراف.'
    },
    {
      q: 'ما هي العملات وطرق الدفع المعتمدة للاشتراك؟',
      a: 'ندعم الدفع بالعملة الوطنية الموريتانية (MRU أوقية) عبر التطبيقات البنكية الأكثر انتشاراً (Bankily، Masrvi، Sedad)، بالإضافة إلى الدفع الدولي بالدولار الأمريكي (USD) عبر Binance Pay أو التحويل البنكي، مع مراجعة وتفعيل يدوي فوري من الإدارة.'
    },
    {
      q: 'كيف تضمن المنصة مصداقية بيانات الأسواق والأخبار المالية؟',
      a: 'ترتبط المنصة مباشرة بواجهات برمجية حقيقية للأسعار (Binance Live API للعملات الرقمية، وخوادم أسعار الصرف الرسمية للفوركس والذهب). كما توضح المنصة بوضوح مصدر كل سعر، ووقت التحديث، وتضع علامة تنبيه واضحة في حال كانت البيانات مخزنة أو متأخرة.'
    },
    {
      q: 'ما هي معايير الحصول على شهادة إتمام الدورة؟',
      a: 'يجب على الطالب إكمال جميع دروس الدورة، واجتياز الاختبار التقييمي النهائي بنسبة لا تقل عن 70%. عند النجاح، يتم إصدار شهادة رقمية تحمل رمز تحقق فريد (TCA-XXXX) يمكن التحقق منه إلكترونياً.'
    }
  ];

  return (
    <div className="w-full space-y-16 sm:space-y-24 py-8">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow backdrop decorative effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            {t('heroBadge')}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            أتقن أسرار <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">التداول المالي</span> وبرمجة المستقبل
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            منظومة تعليمية متكاملة تجمع بين التحليل الفني والأساسي للأسواق (الذهب، الفوركس، الكريبتو) وهندسة البرمجيات وبناء المؤشرات والبوتات مع بيانات الأسواق الحية، مستهدفة مكتبة حقيقية تضم أكثر من 2500 عنصر منهجي.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => user ? onNavigate('courses') : onOpenAuth('register')}
              className="px-6 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-xl shadow-cyan-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>{t('heroCtaStart')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('courses')}
              className="px-6 py-3 rounded-xl font-bold text-sm text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white transition"
            >
              {t('heroCtaCourses')}
            </button>
          </div>

          {/* Key Metric Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80 text-start">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">الهدف المنهجي</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">2,500+</span>
              <span className="text-[10px] text-cyan-400 font-semibold mt-0.5 block">درس ومسار معتمد</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">مسار التداول</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">1,200</span>
              <span className="text-[10px] text-slate-400 block">فوركس • ذهب • كريبتو</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">مسار البرمجة</span>
              <span className="text-xl sm:text-2xl font-black text-blue-400 font-mono">1,000</span>
              <span className="text-[10px] text-slate-400 block">ويب • بايثون • APIs</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">المخاطر والتطبيق</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">300</span>
              <span className="text-[10px] text-slate-400 block">علم نفس • مشاريع</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL MARKET QUOTES TICKER CARDS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              نبض الأسواق المالية الحية
            </h2>
            <p className="text-xs text-slate-400">
              بيانات لحظية مدفوعة بـ Binance وOpen Rates ({source})
            </p>
          </div>
          <button
            onClick={() => onNavigate('markets')}
            className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
          >
            عرض كافة الأسواق والرسوم البيانية <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {previewQuotes.map(q => {
            const isPos = q.changePercent24h >= 0;
            return (
              <div
                key={q.symbol}
                onClick={() => onNavigate('markets')}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer group shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-slate-200 font-mono group-hover:text-cyan-400 transition">
                    {q.symbol}
                  </span>
                  <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">
                    {q.category}
                  </span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  ${q.price.toLocaleString(undefined, { minimumFractionDigits: q.price < 10 ? 4 : 2, maximumFractionDigits: 4 })}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-xs">
                  <span className={`font-bold font-mono ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPos ? '+' : ''}{q.changePercent24h.toFixed(2)}%
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {q.lastUpdated}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. TWO CORE ACADEMIES: TRADING & PROGRAMMING */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            المساران الرئيسيان في الأكاديمية
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            مناهج عملية متبادلة تمكّنك من احتراف التحليل المالي وبناء أدواتك البرمجية بنفسك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Track 1: Trading */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/20 border border-slate-800 hover:border-cyan-500/30 transition shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">المسار الأول</span>
              <h3 className="text-xl font-bold text-white mt-1">أكاديمية التداول والأسواق المالية</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              منهج متكامل يغطي الفوركس، تداول الذهب XAUUSD، العملات الرقمية، الشموع اليابانية، الدعم والمقاومة، السيولة المؤسسية، واجتياز تحديات الحسابات الممولة Prop Firms بنجاح.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">الذهب XAUUSD</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">سوق الفوركس</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">الشموع اليابانية</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">الحسابات الممولة</span>
            </div>
            <button
              onClick={() => onNavigate('courses', { track: 'trading' })}
              className="pt-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition"
            >
              استكشف دورات التداول (1,200 درس) <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Track 2: Programming */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/20 border border-slate-800 hover:border-blue-500/30 transition shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">المسار الثاني</span>
              <h3 className="text-xl font-bold text-white mt-1">أكاديمية البرمجة والأنظمة المالية</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              تعلّم تطوير مواقع الويب، تطبيقات جافاسكريبت التفاعلية، لغة Python لتحليل بيانات الأسعار التاريخية، ربط واجهات APIs اللحظية، وتأمين المحافظ الرقمية.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">HTML & Modern CSS</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">JavaScript ES6+</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">Python for Finance</span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">APIs & WebSockets</span>
            </div>
            <button
              onClick={() => onNavigate('courses', { track: 'programming' })}
              className="pt-2 text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition"
            >
              استكشف دورات البرمجة (1,000 درس) <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. FEATURED COURSES */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">الدورات التأسيسية المميزة</h2>
            <p className="text-xs text-slate-400">ابدأ بأهم المسارات المصممة بعناية لبناء قاعدة متينة</p>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
          >
            عرض كافة الدورات ({courses.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredCourses.map(course => (
            <div
              key={course.id}
              onClick={() => onNavigate('course-detail', course.id)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition cursor-pointer group shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    course.track === 'trading' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  }`}>
                    {course.category}
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

                <h3 className="font-bold text-slate-100 text-sm group-hover:text-cyan-400 transition leading-snug">
                  {course.title.ar}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {course.description.ar}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{course.durationHours} ساعة تدريب</span>
                <span className="font-semibold text-cyan-400 flex items-center gap-1">
                  عرض الدورة <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE RISK CALCULATOR PREVIEW */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RiskCalculator />
      </section>

      {/* 6. FINANCIAL NEWS WIRE PREVIEW */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              أحدث الأخبار والتحليلات الاقتصادية
            </h2>
            <p className="text-xs text-slate-400">عناوين أصلية وتلخيصات عربية من وكالات الأنباء العالمية المعتمدة</p>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
          >
            عرض كافة الأخبار <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {news.slice(0, 3).map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px] uppercase">
                    {item.category}
                  </span>
                  <span className="text-slate-500 text-[11px] font-mono">
                    {new Date(item.publishedAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>

                <h4 className="font-bold text-slate-100 text-sm leading-snug">
                  {item.titleAr || item.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {item.summaryAr || item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-medium">{item.source}</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 font-semibold hover:underline"
                >
                  الخبر الأصلي ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">الأسئلة الشائعة</h2>
          <p className="text-xs text-slate-400">إجابات واضحة ومباشرة حول نظام الأكاديمية والاشتراكات</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-start p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
