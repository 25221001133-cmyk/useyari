'use client';
import { useState, useEffect } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateChartData, STOCKS, type ChartPoint } from '@/lib/data';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RANGES = ['1W', '1M', '3M', '6M', '1Y'] as const;
const RANGE_DAYS: Record<string, number> = { '1W': 7, '1M': 30, '3M': 60, '6M': 90, '1Y': 180 };

function CandleTooltip({ active, payload, label }: { active?: boolean; payload?: { payload: ChartPoint }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const up = d.close >= d.open;
  return (
    <div className="rounded-xl shadow-xl p-3 text-[11px] min-w-[140px]"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <p className="font-bold mb-2" style={{ color: 'var(--text2)' }}>{label}</p>
      <div className="space-y-1">
        {[['Open', d.open], ['Close', d.close], ['High', d.high], ['Low', d.low]].map(([k, v]) => (
          <div key={k as string} className="flex justify-between gap-4">
            <span style={{ color: 'var(--text3)' }}>{k}</span>
            <span className="font-semibold"
              style={{ color: k === 'Close' ? (up ? 'var(--green)' : 'var(--red)') : 'var(--text)' }}>
              ₹{(v as number).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          </div>
        ))}
        <div className="flex justify-between gap-4 pt-1" style={{ borderTop: '1px solid var(--border2)' }}>
          <span style={{ color: 'var(--text3)' }}>Change</span>
          <span className="font-semibold" style={{ color: up ? 'var(--green)' : 'var(--red)' }}>
            {up ? '+' : ''}{((d.close - d.open) / d.open * 100).toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}

function buildCandleShape(domMin: number, domMax: number) {
  return function Candle(props: {
    x?: number; y?: number; width?: number; payload?: ChartPoint;
    background?: { x: number; y: number; width: number; height: number };
  }) {
    const { x = 0, width = 0, payload, background } = props;
    if (!payload || !background || background.height <= 0) return null;
    const { open, close, high, low } = payload;
    const range = domMax - domMin;
    if (range <= 0) return null;
    const toY = (v: number) => background.y + background.height * (1 - (v - domMin) / range);
    const color = close >= open ? '#16A34A' : '#DC2626';
    const cx = x + width / 2;
    const barW = Math.max(width - 2, 1);
    const hy = toY(high), ly = toY(low), oy = toY(open), cy = toY(close);
    const bodyTop = Math.min(oy, cy);
    const bodyH = Math.max(Math.abs(cy - oy), 1.5);
    return (
      <g>
        <line x1={cx} y1={hy} x2={cx} y2={bodyTop} stroke={color} strokeWidth={1} strokeLinecap="round" />
        <line x1={cx} y1={bodyTop + bodyH} x2={cx} y2={ly} stroke={color} strokeWidth={1} strokeLinecap="round" />
        <rect x={x + 1} y={bodyTop} width={barW} height={bodyH} fill={color} rx={1} />
      </g>
    );
  };
}

export default function CandlestickChart({ defaultSymbol = 'RELIANCE' }: { defaultSymbol?: string }) {
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [range, setRange] = useState<keyof typeof RANGE_DAYS>('1M');
  const [showDrop, setShowDrop] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const data = generateChartData(symbol, RANGE_DAYS[range]);
  const stock = STOCKS.find(s => s.symbol === symbol)!;
  const up = stock.changePercent >= 0;
  const allLows = data.map(d => d.low);
  const allHighs = data.map(d => d.high);
  const minVal = Math.min(...allLows);
  const maxVal = Math.max(...allHighs);
  const pad = (maxVal - minVal) * 0.06;
  const domMin = minVal - pad;
  const domMax = maxVal + pad;
  const intervalX = Math.max(1, Math.floor(data.length / 7));
  const CandleShape = buildCandleShape(domMin, domMax);
  const filtered = STOCKS.filter(s =>
    s.symbol.includes(searchQ.toUpperCase()) || s.name.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative">
          <button onClick={() => setShowDrop(!showDrop)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all"
            style={{ borderColor: 'var(--border)', background: 'var(--bg3)' }}>
            <div>
              <span className="text-[13px] font-bold block leading-tight" style={{ color: 'var(--text)' }}>{symbol}</span>
              <span className="text-[10px]" style={{ color: 'var(--text3)' }}>Candlestick</span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text3)' }} />
          </button>

          <AnimatePresence>
            {showDrop && (
              <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.14 }}
                className="absolute top-full left-0 mt-1 rounded-xl shadow-2xl z-50 w-60 overflow-hidden"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="p-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search…" autoFocus
                    className="w-full px-2.5 py-1.5 text-[12px] rounded-lg outline-none"
                    style={{ background: 'var(--bg3)', color: 'var(--text)' }} />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filtered.map(s => (
                    <button key={s.symbol}
                      onClick={() => { setSymbol(s.symbol); setShowDrop(false); setSearchQ(''); }}
                      className="w-full flex items-center justify-between px-3.5 py-2 text-left transition-colors"
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}>
                      <div>
                        <p className="text-[12px] font-bold" style={{ color: 'var(--text)' }}>{s.symbol}</p>
                        <p className="text-[10px] truncate max-w-[120px]" style={{ color: 'var(--text3)' }}>{s.name}</p>
                      </div>
                      <span className="text-[11px] font-semibold"
                        style={{ color: s.changePercent >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-[20px] font-bold" style={{ color: 'var(--text)' }}>
            ₹{stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </span>
          <span className="flex items-center gap-1 text-[12px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: up ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
              color: up ? 'var(--green)' : 'var(--red)',
            }}>
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {up ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </span>
        </div>

        <div className="flex items-center gap-1 ml-auto rounded-lg p-0.5" style={{ background: 'var(--bg3)' }}>
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className="relative px-3 py-1 rounded-md text-[12px] font-semibold transition-all"
              style={{ color: range === r ? 'var(--accent)' : 'var(--text3)' }}>
              {range === r && <motion.div layoutId={`cs-range-${defaultSymbol}`} className="absolute inset-0 rounded-md" style={{ background: 'var(--card)' }} />}
              <span className="relative">{r}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3">
        {[['Bullish', '#16A34A'], ['Bearish', '#DC2626']].map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
            <span className="text-[10px] font-medium" style={{ color: 'var(--text3)' }}>{label}</span>
          </div>
        ))}
        <span className="text-[10px] ml-auto" style={{ color: 'var(--text3)' }}>{data.length} candles</span>
      </div>

      <div className="h-[280px] w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="15%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} axisLine={false} interval={intervalX} />
              <YAxis domain={[domMin, domMax]} tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} axisLine={false}
                tickFormatter={v => `₹${(v / 1000).toFixed(1)}k`} width={54} />
              <Tooltip content={<CandleTooltip />} />
              <Bar dataKey="close" shape={<CandleShape />} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        ) : <div className="h-full w-full rounded-xl shimmer" />}
      </div>

      <div className="grid grid-cols-4 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        {[
          { label: '52W High', val: `₹${stock.high52w.toLocaleString('en-IN')}`, color: 'var(--green)' },
          { label: '52W Low', val: `₹${stock.low52w.toLocaleString('en-IN')}`, color: 'var(--red)' },
          { label: 'Volume', val: `${(stock.volume / 1e5).toFixed(2)}L`, color: 'var(--text)' },
          { label: 'Mkt Cap', val: stock.marketCap, color: 'var(--accent)' },
        ].map(({ label, val, color }) => (
          <div key={label}>
            <p className="text-[10px] font-medium" style={{ color: 'var(--text3)' }}>{label}</p>
            <p className="text-[12px] font-bold mt-0.5" style={{ color }}>{val}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
