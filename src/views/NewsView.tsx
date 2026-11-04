import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext.js';
import { Globe, RefreshCw, ExternalLink, Calendar, Filter, Search, ShieldCheck } from 'lucide-react';

export const NewsView: React.FC = () => {
  const { news, isNewsLoading, refreshNews } = useMarket();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'كافة الأخبار' },
    { id: 'gold', label: 'أخبار الذهب والمعادن' },
    { id: 'forex', label: 'أخبار العملات والفوركس' },
    { id: 'crypto', label: 'أخبار العملات الرقمية' },
    { id: 'indices', label: 'أسواق الأسهم والمؤشرات' },
    { id: 'macro', label: 'الاقتصاد الكلي والبنوك' }
  ];

  const filteredNews = news.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (item.titleAr || item.title).toLowerCase().includes(q);
      const matchSummary = (item.summaryAr || item.summary).toLowerCase().includes(q);
      const matchSource = item.source.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchSource) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Globe className="w-7 h-7 text-cyan-400" />
            شريط الأخبار والتقارير المالية العالمية
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            تغطية موثوقة لأخبار الذهب، العملات، الكريبتو وقرارات البنوك المركزية من كبرى وكالات الأنباء الدولية
          </p>
        </div>

        <button
          onClick={() => refreshNews()}
          disabled={isNewsLoading}
          className="self-start sm:self-center px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isNewsLoading ? 'animate-spin text-cyan-400' : ''}`} />
          تحديث النشرة
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute top-3 right-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ابحث في الأخبار (الفيدرالي، الذهب، التضخم، البيتكوين)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map(item => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition shadow-xl space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold uppercase">
                  {item.category}
                </span>
                <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.publishedAt).toLocaleDateString('ar-EG', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {/* Arabic Headline (Primary) */}
              <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-cyan-400 transition">
                {item.titleAr || item.title}
              </h3>

              {/* Original English Headline */}
              {item.titleAr && item.title !== item.titleAr && (
                <p className="text-[11px] text-slate-400 font-mono italic" dir="ltr">
                  "{item.title}"
                </p>
              )}

              {/* Arabic Summary */}
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {item.summaryAr || item.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium text-[11px]">
                {item.source}
              </span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>المصدر الأصلي</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
          لا توجد أخبار تطابق كلمات البحث أو التصنيف المحدد حالياً.
        </div>
      )}

      {/* Compliance Box */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 block mb-0.5">سياسة النشر والنزاهة الإخبارية:</strong>
          تلتزم TradeCode Academy بحفظ حقوق النشر للمصادر الصحفية، حيث توفر المنصة عناوين أصلية وملخصات تعليمية مع إتاحة روابط مباشرة لصفحات التقارير الأصلية. يتم تحديث النشرة دورياً، وتدعم المنصة ربط مفتاح مزود Marketaux عبر بيئة الخادم المشفرة.
        </div>
      </div>
    </div>
  );
};
