'use client';
import { INDICES } from '@/lib/data';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function IndexTicker() {
  const items = [...INDICES, ...INDICES];
  return (
    <div className="h-9 overflow-hidden flex items-center shrink-0"
      style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
      <div className="flex items-center h-full px-3 shrink-0"
        style={{ borderRight: '1px solid var(--border)', background: 'var(--sidebar)' }}>
        <span className="text-[10px] font-bold tracking-widest text-white uppercase whitespace-nowrap">Live</span>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="ticker-track flex items-center gap-0">
          {items.map((idx, i) => (
            <div key={i} className="flex items-center gap-6 px-5 h-9 shrink-0"
              style={{ borderRight: '1px solid var(--border2)' }}>
              <span className="text-[11px] font-semibold whitespace-nowrap" style={{ color: 'var(--text2)' }}>{idx.name}</span>
              <span className="text-[12px] font-bold whitespace-nowrap" style={{ color: 'var(--text)' }}>
                {idx.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold whitespace-nowrap"
                style={{ color: idx.changePercent >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {idx.changePercent >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {idx.changePercent >= 0 ? '+' : ''}{idx.changePercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
