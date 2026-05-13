'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, BarChart2 } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, ReferenceLine,
} from 'recharts';
import { STOCKS, IndexData, fmt } from '@/lib/data';

const INDEX_CONSTITUENTS: Record<string, string[]> = {
  'NIFTY 50': ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'SBIN', 'BAJFINANCE', 'MARUTI', 'LT'],
  'SENSEX': ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'SBIN', 'BAJFINANCE', 'MARUTI', 'TITAN'],
  'NIFTY BANK': ['HDFCBANK', 'ICICIBANK', 'AXISBANK', 'SBIN', 'KOTAKBANK', 'INDUSINDBK'],
  'NIFTY IT': ['TCS', 'INFY', 'WIPRO', 'HCLTECH', 'TECHM', 'PERSISTENT'],
  'NIFTY MIDCAP': ['BAJFINANCE', 'TITAN', 'LT', 'ASIANPAINT', 'DRREDDY', 'CIPLA'],
  'INDIA VIX': [],
};

function seedRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function generateIndexHistory(name: string, days = 90) {
  const seed = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = seedRandom(seed);
  const base = { 'NIFTY 50': 22400, 'SENSEX': 73800, 'NIFTY BANK': 50000, 'NIFTY IT': 35000, 'NIFTY MIDCAP': 49000, 'INDIA VIX': 14 }[name] ?? 20000;
  let value = base;
  const data = [];
  const now = new Date('2026-05-13');
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    value += (rng() - 0.46) * value * 0.008;
    data.push({
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      value: +value.toFixed(2),
    });
  }
  return data;
}

export default function IndexDetailClient({ index, slug }: { index: IndexData; slug: string }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');
  useEffect(() => { setMounted(true); }, []);

  const up = index.changePercent >= 0;
  const color = up ? '#16A34A' : '#DC2626';
  const dayMap = { '1M': 30, '3M': 90, '6M': 180, '1Y': 365 };
  const histData = generateIndexHistory(index.name, dayMap[period]);
  const constituents = (INDEX_CONSTITUENTS[index.name] ?? [])
    .map(sym => STOCKS.find(s => s.symbol === sym))
    .filter(Boolean) as typeof STOCKS;

  const techStats = [
    { label: 'Support', value: `${(index.value * 0.972).toFixed(0)}`, color: 'var(--green)' },
    { label: 'Resistance', value: `${(index.value * 1.028).toFixed(0)}`, color: 'var(--red)' },
    { label: '52W High', value: `${(index.value * 1.14).toFixed(0)}`, color: 'var(--text2)' },
    { label: '52W Low', value: `${(index.value * 0.82).toFixed(0)}`, color: 'var(--text2)' },
  ];

  return (
    <div className="p-5 space-y-5" style={{ background: 'var(--bg)' }}>
      {/* Back */}
      <button onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[12px] transition-all hover:gap-2.5"
        style={{ color: 'var(--text3)' }}>
        <ArrowLeft size={14} /> Back
      </button>

      {/* Hero */}
      <div className="rounded-2xl p-6" style={{
        background: 'linear-gradient(135deg, var(--card), var(--bg3))',
        border: '1px solid var(--border)',
        boxShadow: up ? 'var(--glow-green)' : 'var(--glow-red)',
      }}>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black"
                style={{ background: `linear-gradient(135deg, ${color}, #8B5CF6)` }}>
                <Activity size={22} />
              </div>
              <div>
                <h1 className="text-[24px] font-black" style={{ color: 'var(--text)' }}>{index.name}</h1>
                <p className="text-[12px]" style={{ color: 'var(--text3)' }}>NSE/BSE Index · Real-time simulation</p>
              </div>
            </div>
            <div className="flex items-end gap-3 mt-2">
              <span className="text-[40px] font-black tabular-nums" style={{ color: 'var(--text)' }}>
                {index.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-[16px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1" style={{
                  color: up ? 'var(--green)' : 'var(--red)',
                  background: up ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
                }}>
                  {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {up ? '+' : ''}{index.change.toFixed(2)} ({up ? '+' : ''}{index.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-3">
            {techStats.map(({ label, value, color: c }) => (
              <div key={label} className="rounded-xl p-3 text-center min-w-[90px]" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text3)' }}>{label}</p>
                <p className="text-[14px] font-black mt-0.5" style={{ color: c }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>Historical Performance</h3>
          <div className="flex gap-1 rounded-lg p-0.5" style={{ background: 'var(--bg3)' }}>
            {(['1M', '3M', '6M', '1Y'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all"
                style={{ background: period === p ? 'var(--card)' : 'transparent', color: period === p ? 'var(--accent)' : 'var(--text3)' }}>
                {p}
              </button>
            ))}
          </div>
        </div>
        {mounted && (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={histData}>
              <defs>
                <linearGradient id="idxGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} axisLine={false}
                tickFormatter={v => v >= 10000 ? `${(v / 1000).toFixed(0)}K` : v.toFixed(1)} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}
                formatter={(v) => [Number(v).toLocaleString('en-IN', { maximumFractionDigits: 2 }), index.name]}
              />
              <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill="url(#idxGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Constituents */}
      {constituents.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <BarChart2 size={14} style={{ color: 'var(--accent)' }} />
            <h3 className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>Index Constituents</h3>
            <span className="ml-auto text-[11px]" style={{ color: 'var(--text3)' }}>{constituents.length} stocks</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ background: 'var(--bg3)' }}>
                  {['Stock', 'Sector', 'Price', 'Change', 'Mkt Cap', 'P/E', 'Weight'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider" style={{ color: 'var(--text3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {constituents.map((s, i) => {
                  const up = s.changePercent >= 0;
                  const weight = (100 / constituents.length * (1 + (constituents.length - i) * 0.1)).toFixed(1);
                  return (
                    <motion.tr key={s.symbol}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => router.push(`/stocks/${s.symbol}`)}
                      className="cursor-pointer transition-colors"
                      style={{ borderBottom: '1px solid var(--border2)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black text-white"
                            style={{ background: `linear-gradient(135deg, ${up ? '#16A34A' : '#DC2626'}, #8B5CF6)` }}>
                            {s.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold" style={{ color: 'var(--text)' }}>{s.symbol}</p>
                            <p className="text-[10px]" style={{ color: 'var(--text3)' }}>{s.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[11px]" style={{ color: 'var(--text3)' }}>{s.sector}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text)' }}>₹{fmt(s.price)}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-[11px] flex items-center gap-0.5" style={{ color: up ? 'var(--green)' : 'var(--red)' }}>
                          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {up ? '+' : ''}{s.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--text2)' }}>{s.marketCap}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--text2)' }}>{s.pe.toFixed(1)}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: 'var(--accent)' }}>{weight}%</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Analysis */}
      <div className="rounded-2xl p-5" style={{
        background: 'linear-gradient(135deg, rgba(56,126,209,0.08), rgba(139,92,246,0.08))',
        border: '1px solid var(--accent)',
      }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black text-white"
            style={{ background: 'linear-gradient(135deg, #387ED1, #8B5CF6)' }}>AI</span>
          <h4 className="text-[13px] font-black" style={{ color: 'var(--text)' }}>AI Market Analysis</h4>
        </div>
        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text2)' }}>
          <strong>{index.name}</strong> is currently at {index.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })},{' '}
          <strong style={{ color: up ? 'var(--green)' : 'var(--red)' }}>
            {up ? 'up' : 'down'} {Math.abs(index.changePercent).toFixed(2)}%
          </strong>{' '}
          today. Support at <strong>{(index.value * 0.972).toFixed(0)}</strong> and resistance at <strong>{(index.value * 1.028).toFixed(0)}</strong>.{' '}
          {up
            ? `Positive momentum — watch for continuation if volume supports the move. ${index.name === 'INDIA VIX' ? 'Low VIX indicates market complacency — volatility may spike unexpectedly.' : 'Avoid chasing; accumulate on dips to support levels.'}`
            : `Caution advised. Key support levels are being tested. ${index.name === 'INDIA VIX' ? 'Rising VIX signals fear in the market — defensive positioning is prudent.' : 'Wait for stabilization near support before adding positions.'}`
          }
        </p>
      </div>
    </div>
  );
}
