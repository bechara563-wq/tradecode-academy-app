import React, { useState } from 'react';
import { RiskCalculator } from '../components/RiskCalculator.js';
import {
  Calculator,
  BookOpen,
  Download,
  Copy,
  Check,
  FileText,
  Percent,
  Terminal,
  Activity,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculators' | 'cheatsheets' | 'code'>('calculators');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Compounding calculator state
  const [initialCapital, setInitialCapital] = useState(1000);
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState(5);
  const [monthsCount, setMonthsCount] = useState(12);

  // Calculate compound return: A = P * (1 + r)^n
  const finalCompounded = initialCapital * Math.pow(1 + monthlyGrowthRate / 100, monthsCount);
  const totalProfit = finalCompounded - initialCapital;

  const handleCopyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const pythonScript = `# TradeCode Academy - Python Strategy Backtesting Script
import pandas as pd
import numpy as np

def calculate_strategy_metrics(df):
    """
    df requires columns: ['Open', 'High', 'Low', 'Close', 'Volume']
    """
    # 1. Compute 50 EMA and 200 EMA
    df['EMA_50'] = df['Close'].ewm(span=50, adjust=False).mean()
    df['EMA_200'] = df['Close'].ewm(span=200, adjust=False).mean()
    
    # 2. Golden Cross Strategy Signal
    df['Signal'] = np.where(df['EMA_50'] > df['EMA_200'], 1, 0)
    df['Position'] = df['Signal'].diff()
    
    # 3. Strategy Returns
    df['Market_Return'] = df['Close'].pct_change()
    df['Strategy_Return'] = df['Market_Return'] * df['Signal'].shift(1)
    
    # Cumulative Wealth
    df['Cumulative_Market'] = (1 + df['Market_Return']).cumprod()
    df['Cumulative_Strategy'] = (1 + df['Strategy_Return']).cumprod()
    
    win_rate = len(df[df['Strategy_Return'] > 0]) / len(df[df['Strategy_Return'] != 0])
    print(f"Strategy Win Rate: {win_rate * 100:.2f}%")
    return df
`;

  const jsWebSocketScript = `// TradeCode Academy - Live Binance Ticker Stream
const symbol = 'btcusdt';
const ws = new WebSocket(\`wss://stream.binance.com:9443/ws/\${symbol}@ticker\`);

ws.onopen = () => {
  console.log('Connected to Binance real-time market stream!');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const price = parseFloat(data.c);
  const changePct = parseFloat(data.P);
  console.log(\`BTC/USDT Live: $\${price.toLocaleString()} (\${changePct > 0 ? '+' : ''}\${changePct}%)\`);
};
`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
          <Calculator className="w-7 h-7 text-cyan-400" />
          مكتبة الموارد والأدوات الحاسوبية
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          أدوات تفاعلية لإدارة المخاطر، قوالب الأكواد البرمجية، وكتيبات التحليل الفني الجاهزة
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('calculators')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'calculators'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          الحاسبات المالية وإدارة المخاطر
        </button>
        <button
          onClick={() => setActiveTab('cheatsheets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'cheatsheets'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          كتيبات النماذج والوصايا الذهبية
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'code'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          قوالب الأكواد البرمجية (Python & JS)
        </button>
      </div>

      {activeTab === 'calculators' && (
        <div className="space-y-8">
          {/* 1. Lot Size Calculator */}
          <RiskCalculator />

          {/* 2. Compounding Growth Calculator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  حاسبة العائد التراكمي والنمو المركب (Compounding Calculator)
                </h3>
                <p className="text-xs text-slate-400">
                  شاهد القوة السحرية للعائد المستقر بنسبة منخفضة على المدى الزمني
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  رأس المال الأولي ($ USD)
                </label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={initialCapital}
                  onChange={e => setInitialCapital(Math.max(10, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  نسبة الربح الشهري المستهدف (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  step="0.5"
                  value={monthlyGrowthRate}
                  onChange={e => setMonthlyGrowthRate(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">نسبة واقعية للمحترفين: 3% إلى 8% شهرياً</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  المدة الزمنية (بالأشهر)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={monthsCount}
                  onChange={e => setMonthsCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-950 to-emerald-950/20 border border-emerald-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-start">
              <div>
                <span className="text-xs text-slate-400 block">رأس المال بعد {monthsCount} شهراً:</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  ${finalCompounded.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">صافي الأرباح المركبة:</span>
                <span className="text-xl font-bold text-cyan-400 font-mono">
                  +${totalProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">نسبة النمو الإجمالية:</span>
                <span className="text-xl font-bold text-slate-200 font-mono">
                  +{((totalProfit / initialCapital) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cheatsheets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cheatsheet 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              أقوى نماذج الشموع اليابانية ومعدل نجاحها
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-slate-200 block">شمعة الابتلاع الشرائي (Bullish Engulfing)</strong>
                  <span className="text-slate-400 text-[11px]">تظهر عند نهاية الاتجاه الهابط مع كسر سيولة القاع</span>
                </div>
                <span className="text-emerald-400 font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10">68% Win Rate</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-slate-200 block">شمعة المطرقة (Pin Bar / Hammer)</strong>
                  <span className="text-slate-400 text-[11px]">ذيل سفلي طويل يعكس رفض السعر للهبوط بقوة</span>
                </div>
                <span className="text-emerald-400 font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10">64% Win Rate</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="text-slate-200 block">شمعة الشهاب (Shooting Star)</strong>
                  <span className="text-slate-400 text-[11px]">ذيل علوي طويل عند مقاومة هامة مع فوليوم مرتفع</span>
                </div>
                <span className="text-emerald-400 font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10">66% Win Rate</span>
              </div>
            </div>
          </div>

          {/* Cheatsheet 2: Psychology */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              وصايا الانضباط النفسي للمتداول الرابح
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold font-mono">1.</span>
                <span>لا تدخل أي صفقة دون تحديد أمر وقف الخسارة مسبقاً في المنصة.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold font-mono">2.</span>
                <span>إذا خسرت صفقتين متتاليتين في نفس الجلسة، أوقف التداول فوراً وابتعد عن الشاشة.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold font-mono">3.</span>
                <span>التداول الانتقامي (Revenge Trading) هو أسرع طريق لتصفير الحساب.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold font-mono">4.</span>
                <span>السوق سيبقى مفتوحاً غداً وبعد غد؛ لا داعي للاستعجال أو الخوف من فوات الفرصة (FOMO).</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'code' && (
        <div className="space-y-6">
          {/* Script 1: Python */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">
                  سكريبت بايثون: حساب المتوسطات المتحركة والاختبار التاريخي للاستراتيجية
                </h3>
                <p className="text-xs text-slate-400">كود جاهز للتشغيل في بيئة Jupyter Notebook أو Google Colab</p>
              </div>
              <button
                onClick={() => handleCopyCode(pythonScript, 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 1 ? 'تم النسخ' : 'نسخ الكود'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto" dir="ltr">
              <code>{pythonScript}</code>
            </pre>
          </div>

          {/* Script 2: JS WebSocket */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">
                  سكريبت جافاسكريبت: الربط الحي مع WebSocket لبث أسعار البيتكوين
                </h3>
                <p className="text-xs text-slate-400">يعمل مباشرة في المتصفح أو بيئة Node.js</p>
              </div>
              <button
                onClick={() => handleCopyCode(jsWebSocketScript, 2)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition"
              >
                {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 2 ? 'تم النسخ' : 'نسخ الكود'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto" dir="ltr">
              <code>{jsWebSocketScript}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
