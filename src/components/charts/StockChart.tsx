'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { STOCKS, generateChartData, type ChartPoint } from '@/lib/data';
import { TrendingUp, TrendingDown, ChevronDown, ExternalLink } from 'lucide-react';

const RANGES = ['1W', '1M', '3M', '6M', '1Y'] as const;
const RANGE_DAYS: Record<string, number> = { '1W': 7, '1M': 30, '3M': 60, '6M': 90, '1Y': 180 };

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { payload: ChartPoint }[]; label?: string }) {
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
          <span style={{ color: 'var(--text3)' }}>Volume</span>
          <span className="font-semibold" style={{ color: 'var(--text)' }}>{(d.volume / 1e5).toFixed(1)}L</span>
        </div>
      </div>
    </div>
  );
}

export default function StockChart({ defaultSymbol = 'RELIANCE' }: { defaultSymbol?: string }) {
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [range, setRange] = useState<keyof typeof RANGE_DAYS>('1M');
  const [data, setData] = useState<ChartPoint[]>([]);
  const [showDrop, setShowDrop] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const stock = STOCKS.find(s => s.symbol === symbol)!;
  const up = stock.changePercent >= 0;
  const color = up ? '#16A34A' : '#DC2626';

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    setData(generateChartData(symbol, RANGE_DAYS[range]));
  }, [symbol, range]);

  const filtered = STOCKS.filter(s =>
    s.symbol.includes(searchQ.toUpperCase()) || s.name.toLowerCase().includes(searchQ.toLowerCase())
  );

  const minY = Math.min(...data.map(d => d.low));
  const maxY = Math.max(...data.map(d => d.high));
  const pad = (maxY - minY) * 0.06;
  const intervalX = Math.max(1, Math.floor(data.length / 7));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Stock picker */}
        <div className="relative">
          <button onClick={() => setShowDrop(!showDrop)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all"
            style={{ borderColor: showDrop ? 'var(--accent)' : 'var(--border)', background: showDrop ? 'rgba(56,126,209,0.05)' : 'var(--bg3)' }}>
            <div>
              <span className="text-[14px] font-bold block leading-tight" style={{ color: 'var(--text)' }}>{symbol}</span>
              <span className="text-[10px]" style={{ color: 'var(--text3)' }}>{stock.sector}</span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text3)' }} />
          </button>

          <AnimatePresence>
            {showDrop && (
              <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.14 }}
                className="absolute top-full left-0 mt-1 rounded-xl shadow-2xl z-50 w-64 overflow-hidden"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="p-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search…" autoFocus
                    className="w-full px-2.5 py-1.5 text-[12px] rounded-lg outline-none"
                    style={{ background: 'var(--bg3)', color: 'var(--text)' }} />
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {filtered.map(s => (
                    <button key={s.symbol}
                      onClick={() => { setSymbol(s.symbol); setShowDrop(false); setSearchQ(''); }}
                      className="w-full flex items-center justify-between px-3.5 py-2 text-left transition-colors"
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}>
                      <div>
                        <p className="text-[12px] font-bold" style={{ color: 'var(--text)' }}>{s.symbol}</p>
                        <p className="text-[10px] truncate max-w-[130px]" style={{ color: 'var(--text3)' }}>{s.name}</p>
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
          <span className="text-[22px] font-bold" style={{ color: 'var(--text)' }}>
            ₹{stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </span>
          <span className="flex items-center gap-1 text-[13px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: up ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
              color: up ? 'var(--green)' : 'var(--red)',
            }}>
            {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {up ? '+' : ''}{stock.change.toFixed(2)} ({up ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </span>
        </div>

        <button onClick={() => router.push(`/stocks/${symbol}`)}
          className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg transition-colors"
          style={{ color: 'var(--accent)', background: 'rgba(56,126,209,0.1)' }}>
          <ExternalLink size={11} /> Details
        </button>

        <div className="flex items-center gap-1 ml-auto rounded-lg p-0.5" style={{ background: 'var(--bg3)' }}>
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className="relative px-3 py-1 rounded-md text-[12px] font-semibold transition-all"
              style={{ color: range === r ? 'var(--accent)' : 'var(--text3)' }}>
              {range === r && (mounted
                ? <motion.div layoutId="range-active" className="absolute inset-0 rounded-md" style={{ background: 'var(--card)' }} />
                : <div className="absolute inset-0 rounded-md" style={{ background: 'var(--card)' }} />
              )}
              <span className="relative">{r}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-[260px] w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} axisLine={false} interval={intervalX} />
              <YAxis domain={[minY - pad, maxY + pad]} tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} axisLine={false}
                tickFormatter={v => `₹${(v / 1000).toFixed(1)}k`} width={54} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="close" stroke={color} strokeWidth={2.5} fill="url(#areaGrad)" dot={false}
                activeDot={{ r: 4, fill: color, strokeWidth: 2, stroke: 'var(--card)' }} animationDuration={600} />
            </AreaChart>
          </ResponsiveContainer>
        ) : <div className="h-full w-full rounded-xl shimmer" />}
      </div>

      <div className="mt-2 h-[48px] w-full">
        <p className="text-[9px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text3)' }}>Volume</p>
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Bar dataKey="volume" fill="var(--border)" radius={[2, 2, 0, 0]} maxBarSize={6} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        {[
          { label: '52W High', val: `₹${stock.high52w.toLocaleString('en-IN')}`, color: 'var(--green)' },
          { label: '52W Low', val: `₹${stock.low52w.toLocaleString('en-IN')}`, color: 'var(--red)' },
          { label: 'Volume', val: `${(stock.volume / 1e5).toFixed(2)}L`, color: 'var(--text)' },
          { label: 'Mkt Cap', val: stock.marketCap, color: 'var(--accent)' },
        ].map(({ label, val, color: c }) => (
          <div key={label}>
            <p className="text-[10px] font-medium" style={{ color: 'var(--text3)' }}>{label}</p>
            <p className="text-[12px] font-bold mt-0.5" style={{ color: c }}>{val}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
