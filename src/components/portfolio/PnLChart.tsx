'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { generatePortfolioPnL } from '@/lib/data';

const pnlData = generatePortfolioPnL();

const RANGES = ['1W', '1M', 'All'] as const;


export default function PnLChart() {
  const [range, setRange] = useState<'1W' | '1M' | 'All'>('1M');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const sliced = range === '1W' ? pnlData.slice(-5) : range === '1M' ? pnlData.slice(-21) : pnlData;
  const latest = sliced[sliced.length - 1]?.value || 0;
  const first = sliced[0]?.value || 0;
  const diff = latest - first;
  const up = diff >= 0;
  const min = Math.min(...sliced.map(d => d.value));
  const max = Math.max(...sliced.map(d => d.value));
  const pad = (max - min) * 0.1;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[11px] font-medium" style={{ color: 'var(--text3)' }}>Portfolio Value</p>
          <p className="text-[22px] font-black mt-0.5" style={{ color: 'var(--text)' }}>₹{latest.toLocaleString('en-IN')}</p>
          <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: up ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
              color: up ? 'var(--green)' : 'var(--red)',
            }}>
            {up ? '+' : ''}₹{Math.abs(diff).toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({up ? '+' : ''}{((diff / first) * 100).toFixed(2)}%)
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-lg p-0.5" style={{ background: 'var(--bg3)' }}>
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)}
              className="relative px-3 py-1 rounded-md text-[11px] font-semibold transition-all"
              style={{ color: range === r ? 'var(--accent)' : 'var(--text3)' }}>
              {range === r && <motion.div layoutId="pnl-range" className="absolute inset-0 rounded-md" style={{ background: 'var(--card)' }} />}
              <span className="relative">{r}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-[240px] w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sliced} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="pnlAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={up ? '#16A34A' : '#DC2626'} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={up ? '#16A34A' : '#DC2626'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} axisLine={false} interval={Math.floor(sliced.length / 5)} />
              <YAxis domain={[min - pad, max + pad]} tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} axisLine={false}
                tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} width={52} />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}
                formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Value']}
              />
              <ReferenceLine y={first} stroke="var(--border)" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="value" stroke={up ? 'var(--green)' : 'var(--red)'} strokeWidth={2.5}
                fill="url(#pnlAreaGrad)" dot={false}
                activeDot={{ r: 4, fill: up ? '#16A34A' : '#DC2626', stroke: 'var(--card)', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : <div className="h-full w-full rounded-xl shimmer" />}
      </div>
    </motion.div>
  );
}
