import React, { useState } from 'react';
import { Percent, DollarSign, ShieldCheck, ArrowRight, Calculator } from 'lucide-react';

export const RiskCalculator: React.FC = () => {
  const [accountBalance, setAccountBalance] = useState<number>(5000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [stopLossPips, setStopLossPips] = useState<number>(25);
  const [assetType, setAssetType] = useState<'gold' | 'forex' | 'crypto'>('gold');

  // Calculations:
  // Risk in $ = Balance * (Risk% / 100)
  const riskAmount = (accountBalance * riskPercent) / 100;

  // Pip value multiplier per standard 1.0 lot:
  // Forex: 1 pip = $10 on standard pair
  // Gold XAUUSD: 10 pips = $1.0 price move ($10 per pip on 1.0 lot)
  // Crypto BTC: $100 price move = $100 on 1 BTC
  let pipValuePerLot = 10;
  if (assetType === 'crypto') pipValuePerLot = 1;

  const calculatedLotSize = stopLossPips > 0
    ? Number((riskAmount / (stopLossPips * pipValuePerLot)).toFixed(2))
    : 0;

  const reward1to2 = riskAmount * 2;
  const reward1to3 = riskAmount * 3;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm sm:text-base">
              حاسبة إدارة رأس المال وحجم العقد الاحترافي (Lot Size Calculator)
            </h3>
            <p className="text-xs text-slate-400">
              حساب حجم اللوت الآمن لتفادي نداء الهامش وفق معايير المحترفين
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              رصيد الحساب ($ USD)
            </label>
            <div className="relative">
              <input
                type="number"
                min="50"
                step="50"
                value={accountBalance}
                onChange={e => setAccountBalance(Math.max(10, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
              />
              <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">$</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                نسبة المخاطرة (%)
              </label>
              <div className="flex items-center gap-1.5">
                {[1.0, 1.5, 2.0].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setRiskPercent(pct)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex-1 ${
                      riskPercent === pct
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                الأصل المالي
              </label>
              <select
                value={assetType}
                onChange={e => setAssetType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="gold">الذهب XAUUSD</option>
                <option value="forex">أزواج الفوركس (EUR/USD)</option>
                <option value="crypto">العملات الرقمية (Crypto)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              مسافة وقف الخسارة (Stop Loss Pips)
            </label>
            <input
              type="number"
              min="1"
              value={stopLossPips}
              onChange={e => setStopLossPips(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              في الذهب: كل 10 نقاط = 1.0 دولار في السعر (مثال: 25 نقطة = 2.5$).
            </span>
          </div>
        </div>

        {/* Right Output Card */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-cyan-500/20 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <span className="text-xs text-slate-400 font-medium">أقصى مبلغ مسموح بخسارته:</span>
              <span className="text-base font-extrabold text-rose-400 font-mono">
                ${riskAmount.toFixed(2)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-center">
              <span className="text-xs text-cyan-300 font-medium block mb-1">
                حجم العقد الموصى به بدقة (Lot Size):
              </span>
              <div className="text-3xl font-black text-cyan-400 font-mono">
                {calculatedLotSize} <span className="text-sm font-semibold text-slate-300">Lot</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {calculatedLotSize <= 0.01 ? 'عقد ميكرو (Micro Lot 0.01)' : calculatedLotSize < 0.1 ? 'عقد ميني (Mini)' : 'عقد قياسي (Standard)'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">الربح المتوقع (1:2 R:R):</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">+${reward1to2.toFixed(2)}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">الربح المتوقع (1:3 R:R):</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">+${reward1to3.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>هذا الحجم يضمن استمرارية حسابك حتى لو حدثت 20 خسارة متتالية.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
