import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext.js';
import { MarketQuote } from '../types/index.js';
import { MarketChart } from '../components/MarketChart.js';
import {
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  Calendar,
  Clock,
  ShieldAlert,
  BarChart2,
  DollarSign,
  Zap
} from 'lucide-react';

export const MarketsView: React.FC = () => {
  const { quotes, calendar, isQuotesLoading, isStale, source, lastUpdated, refreshQuotes } = useMarket();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<MarketQuote | null>(null);
  const [activeTab, setActiveTab] = useState<'quotes' | 'calendar'>('quotes');

  // Set default selected quote if null
  const currentQuote = selectedQuote || quotes[0] || {
    symbol: 'XAU/USD',
    name: 'Spot Gold',
    category: 'metals' as const,
    price: 2745.80,
    change24h: 14.50,
    changePercent24h: 0.53,
    lastUpdated: '12:00',
    source: 'Binance / Global Metals'
  };

  const categories = [
    { id: 'all', label: 'كافة الأصول' },
    { id: 'metals', label: 'الذهب والسلع (Gold/Metals)' },
    { id: 'forex', label: 'سوق الفوركس (Forex)' },
    { id: 'crypto', label: 'العملات الرقمية (Crypto)' },
    { id: 'indices', label: 'المؤشرات العالمية (Indices)' }
  ];

  const filteredQuotes = quotes.filter(q => {
    if (selectedCategory !== 'all' && q.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const qText = searchQuery.toLowerCase();
      if (!q.symbol.toLowerCase().includes(qText) && !q.name.toLowerCase().includes(qText)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-cyan-400" />
            شاشات وبيانات الأسواق المالية الحية
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            متابعة فورية لأسعار الذهب، العملات الأجنبية، العملات الرقمية والمؤشرات العالمية مع الرسوم البيانية التفاعلية
          </p>
        </div>

        {/* Refresh and status */}
        <div className="flex items-center gap-3">
          <div className="text-start sm:text-right text-xs">
            <span className="text-slate-400 block text-[10px]">المصدر: {source}</span>
            <span className="text-slate-300 font-mono text-[11px]">آخر تحديث: {lastUpdated || 'الآن'}</span>
          </div>
          <button
            onClick={() => refreshQuotes()}
            disabled={isQuotesLoading}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition hover:border-slate-700"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${isQuotesLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stale Warning Banner if offline or API limit */}
      {isStale && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            تنبيه: يتم عرض بيانات مخزنة من الجلسة السابقة بسبب انقطاع الاتصال الخارجي أو حدود المزود. يرجى الملاحظة أنها إرشادية وليست لحظية.
          </span>
        </div>
      )}

      {/* Main Tabs: Market Quotes vs Economic Calendar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'quotes'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          شاشات الأسعار والرسوم البيانية
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'calendar'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          التقويم الاقتصادي والأحداث الكبرى
        </button>
      </div>

      {activeTab === 'quotes' ? (
        <>
          {/* Interactive Chart Component for Selected Symbol */}
          <MarketChart quote={currentQuote} />

          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute top-3 right-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن رمز (XAU/USD, BTC, EUR/USD)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
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

          {/* Quotes Table (Responsive scrollable for Android & Desktop) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-start">الأصل المالي</th>
                    <th className="px-4 py-3 text-end">سعر السوق ($)</th>
                    <th className="px-4 py-3 text-end">التغير 24h</th>
                    <th className="px-4 py-3 text-end hidden md:table-cell">القمة 24h</th>
                    <th className="px-4 py-3 text-end hidden md:table-cell">القاع 24h</th>
                    <th className="px-4 py-3 text-end hidden lg:table-cell">الحجم 24h</th>
                    <th className="px-4 py-3 text-center">الرسم والتحليل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {filteredQuotes.map(q => {
                    const isPos = q.changePercent24h >= 0;
                    const isSelected = currentQuote.symbol === q.symbol;

                    return (
                      <tr
                        key={q.symbol}
                        onClick={() => setSelectedQuote(q)}
                        className={`transition cursor-pointer ${
                          isSelected ? 'bg-cyan-500/10' : 'hover:bg-slate-800/50'
                        }`}
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-100">{q.symbol}</span>
                            <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">
                              {q.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-end font-bold text-white">
                          ${q.price.toLocaleString(undefined, { minimumFractionDigits: q.price < 10 ? 4 : 2, maximumFractionDigits: 4 })}
                        </td>

                        <td className="px-4 py-3.5 text-end">
                          <span className={`inline-flex items-center gap-0.5 font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPos ? '+' : ''}{q.changePercent24h.toFixed(2)}%
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-end text-slate-300 hidden md:table-cell">
                          {q.high24h ? `$${q.high24h.toLocaleString()}` : '-'}
                        </td>

                        <td className="px-4 py-3.5 text-end text-slate-300 hidden md:table-cell">
                          {q.low24h ? `$${q.low24h.toLocaleString()}` : '-'}
                        </td>

                        <td className="px-4 py-3.5 text-end text-slate-400 hidden lg:table-cell text-[11px]">
                          {q.volume24h || '-'}
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedQuote(q);
                            }}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition font-sans ${
                              isSelected
                                ? 'bg-cyan-500 text-slate-950'
                                : 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
                            }`}
                          >
                            عرض الشارت
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Economic Calendar View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-5">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              أهم مؤشرات التقويم الاقتصادي وقرارات الفائدة
            </h3>
            <p className="text-xs text-slate-400">
              متابعة البيانات الكبرى التي تؤثر مباشرة على سيولة الفوركس والذهب ومؤشرات وول ستريت
            </p>
          </div>

          <div className="space-y-3">
            {calendar.map(event => (
              <div
                key={event.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                      {event.currency}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      event.impact === 'high' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      تأثير {event.impact === 'high' ? 'قوي جداً' : 'متوسط'}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">{event.time}</span>
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm">
                    {event.title}
                  </h4>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono self-end sm:self-center">
                  {event.actual && (
                    <div>
                      <span className="text-[10px] text-slate-500 block">الفعلي:</span>
                      <strong className="text-emerald-400">{event.actual}</strong>
                    </div>
                  )}
                  {event.forecast && (
                    <div>
                      <span className="text-[10px] text-slate-500 block">المتوقع:</span>
                      <strong className="text-slate-300">{event.forecast}</strong>
                    </div>
                  )}
                  {event.previous && (
                    <div>
                      <span className="text-[10px] text-slate-500 block">السابق:</span>
                      <span className="text-slate-400">{event.previous}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Educational Notice */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 block mb-0.5">تنويه الشفافية والبيانات المالية:</strong>
          أسعار العملات الرقمية مستمدة مباشرة من Binance API، وأسعار الفوركس من واجهات الصرف العالمية المعتمدة. قد تشهد بعض الأسعار تأخيراً إرشادياً بحسب خطة المزود. الرسوم البيانية مخصصة للمحاكاة والتحليل التعليمي، ولا ينبغي الاعتماد عليها كأوامر تنفيذ مالي حقيقي دون استشارة وسيطك المعتمد.
        </div>
      </div>
    </div>
  );
};
