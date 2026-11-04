import React, { useState, useMemo } from 'react';
import { MarketQuote } from '../types/index.js';
import { BarChart3, TrendingUp, TrendingDown, Maximize2, Clock } from 'lucide-react';

interface MarketChartProps {
  quote: MarketQuote;
}

interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const MarketChart: React.FC<MarketChartProps> = ({ quote }) => {
  const [timeframe, setTimeframe] = useState<'1M' | '5M' | '1H' | '1D'>('1H');
  const [chartType, setChartType] = useState<'candle' | 'line'>('candle');
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  // Generate deterministic realistic candles around current quote price for visual trading analysis
  const candles: Candle[] = useMemo(() => {
    const base = quote.price;
    const volatility = base * 0.004; // 0.4% typical swing
    const list: Candle[] = [];
    let current = base * (1 - (quote.changePercent24h / 100));

    const totalBars = 32;
    for (let i = 0; i < totalBars; i++) {
      const stepRand = Math.sin(i * 0.8) * volatility + (Math.random() - 0.48) * volatility;
      const open = current;
      const close = i === totalBars - 1 ? base : open + stepRand;
      const high = Math.max(open, close) + Math.random() * (volatility * 0.6);
      const low = Math.min(open, close) - Math.random() * (volatility * 0.6);
      const volume = Math.floor(100 + Math.random() * 800);

      const d = new Date(Date.now() - (totalBars - i) * (timeframe === '1M' ? 60000 : timeframe === '5M' ? 300000 : timeframe === '1H' ? 3600000 : 86400000));
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      list.push({ time: timeStr, open, high, low, close, volume });
      current = close;
    }
    return list;
  }, [quote.price, quote.changePercent24h, timeframe]);

  // Compute SVG dimensions & scaling
  const chartHeight = 220;
  const chartWidth = 600;
  const paddingY = 20;

  const minPrice = Math.min(...candles.map(c => c.low));
  const maxPrice = Math.max(...candles.map(c => c.high));
  const priceRange = maxPrice - minPrice || 1;

  const scaleY = (p: number) => {
    return chartHeight - paddingY - ((p - minPrice) / priceRange) * (chartHeight - paddingY * 2);
  };

  const candleWidth = chartWidth / candles.length;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
      {/* Chart Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-slate-100 font-mono">{quote.symbol}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold uppercase">
                {quote.category}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-black text-white font-mono">
                ${quote.price.toLocaleString(undefined, { minimumFractionDigits: quote.price < 10 ? 4 : 2, maximumFractionDigits: 4 })}
              </span>
              <span className={`text-xs font-bold font-mono flex items-center ${quote.changePercent24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {quote.changePercent24h >= 0 ? '+' : ''}{quote.changePercent24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Timeframe & Chart Style toggles */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['1M', '5M', '1H', '1D'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg font-bold font-mono transition ${
                  timeframe === tf ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setChartType('candle')}
              className={`px-2 py-1 rounded-lg font-bold transition ${chartType === 'candle' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}
              title="نمط الشموع اليابانية"
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2 py-1 rounded-lg font-bold transition ${chartType === 'line' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'}`}
              title="الرسم الخطي"
            >
              Line
            </button>
          </div>
        </div>
      </div>

      {/* Hover Info Strip */}
      <div className="h-6 flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 py-1">
        {hoveredCandle ? (
          <div className="flex items-center gap-3">
            <span>الوقت: <strong className="text-slate-200">{hoveredCandle.time}</strong></span>
            <span>O: <strong className="text-slate-200">{hoveredCandle.open.toFixed(2)}</strong></span>
            <span>H: <strong className="text-slate-200">{hoveredCandle.high.toFixed(2)}</strong></span>
            <span>L: <strong className="text-slate-200">{hoveredCandle.low.toFixed(2)}</strong></span>
            <span>C: <strong className={hoveredCandle.close >= hoveredCandle.open ? 'text-emerald-400' : 'text-rose-400'}>{hoveredCandle.close.toFixed(2)}</strong></span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span>القمة 24h: <strong className="text-slate-200">${maxPrice.toFixed(2)}</strong></span>
            <span>القاع 24h: <strong className="text-slate-200">${minPrice.toFixed(2)}</strong></span>
            <span className="text-[10px] text-slate-500 hidden sm:inline">مرر المؤشر فوق الشموع لعرض تفاصيل الأسعار</span>
          </div>
        )}
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative w-full overflow-hidden bg-slate-950/60 rounded-xl border border-slate-800/80 p-2">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map(ratio => {
            const y = chartHeight * ratio;
            const priceLevel = maxPrice - ratio * priceRange;
            return (
              <g key={ratio}>
                <line
                  x1={0}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
                <text
                  x={chartWidth - 5}
                  y={y - 4}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {priceLevel.toFixed(2)}
                </text>
              </g>
            );
          })}

          {chartType === 'line' ? (
            /* Line Chart */
            <polyline
              fill="none"
              stroke="#06b6d4"
              strokeWidth={2.5}
              points={candles
                .map((c, i) => `${i * candleWidth + candleWidth / 2},${scaleY(c.close)}`)
                .join(' ')}
            />
          ) : (
            /* Candlestick Chart */
            candles.map((candle, idx) => {
              const x = idx * candleWidth + candleWidth / 2;
              const isBullish = candle.close >= candle.open;
              const color = isBullish ? '#10b981' : '#f43f5e';
              const topY = scaleY(Math.max(candle.open, candle.close));
              const botY = scaleY(Math.min(candle.open, candle.close));
              const height = Math.max(botY - topY, 2);

              return (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredCandle(candle)}
                  onMouseLeave={() => setHoveredCandle(null)}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                >
                  {/* High - Low Wick */}
                  <line
                    x1={x}
                    y1={scaleY(candle.high)}
                    x2={x}
                    y2={scaleY(candle.low)}
                    stroke={color}
                    strokeWidth={1.5}
                  />
                  {/* Candle Body */}
                  <rect
                    x={x - candleWidth * 0.35}
                    y={topY}
                    width={candleWidth * 0.7}
                    height={height}
                    fill={color}
                    rx={1}
                  />
                </g>
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
};
