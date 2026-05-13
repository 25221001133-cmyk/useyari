'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown } from 'lucide-react';
import { useTrading } from '@/lib/trading';

type SortKey = 'symbol' | 'current' | 'pnl' | 'pnlPct';

export default function HoldingsTable() {
  const { positions, totalInvested, totalCurrent, totalPnL, totalPnLPct } = useTrading();
  const [sortKey, setSortKey] = useState<SortKey>('current');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();

  const sorted = [...positions].sort((a, b) => {
    const va = a[sortKey] as number | string;
    const vb = b[sortKey] as number | string;
    if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
    return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k
    ? sortDir === 'desc' ? <ChevronDown size={11} style={{ color: 'var(--accent)' }} /> : <ChevronUp size={11} style={{ color: 'var(--accent)' }} />
    : <ChevronDown size={11} style={{ color: 'var(--text3)' }} />;

  if (positions.length === 0) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <p className="text-[14px] font-semibold" style={{ color: 'var(--text3)' }}>No holdings yet. Place your first trade!</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
        <h3 className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>Holdings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
              {[['Stock', 'symbol'], ['Qty', null], ['Avg Price', null], ['LTP', 'current'], ['Invested', null], ['Cur. Value', 'current'], ['P&L', 'pnl'], ['P&L %', 'pnlPct']].map(([label, key]) => (
                <th key={label as string}
                  onClick={() => key && toggleSort(key as SortKey)}
                  className={`px-4 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider whitespace-nowrap ${key ? 'cursor-pointer select-none' : ''}`}
                  style={{ color: 'var(--text3)' }}>
                  <span className="flex items-center gap-1">{label}{key && <SortIcon k={key as SortKey} />}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((h, i) => {
              const up = h.pnl >= 0;
              return (
                <motion.tr key={h.symbol}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => router.push(`/stocks/${h.symbol}`)}
                  className="transition-colors cursor-pointer"
                  style={{ borderBottom: '1px solid var(--border2)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #387ED1, #8B5CF6)' }}>
                        <span className="text-[8px] text-white font-black">{h.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: 'var(--text)' }}>{h.symbol}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text3)' }}>{h.sector}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--text2)' }}>{h.qty}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text2)' }}>₹{h.avgPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text)' }}>₹{h.currentPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text2)' }}>₹{(h.invested / 1000).toFixed(1)}K</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text)' }}>₹{(h.current / 1000).toFixed(1)}K</td>
                  <td className="px-4 py-3 font-bold" style={{ color: up ? 'var(--green)' : 'var(--red)' }}>
                    {up ? '+' : '-'}₹{(Math.abs(h.pnl) / 1000).toFixed(1)}K
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full w-fit"
                      style={{
                        background: up ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
                        color: up ? 'var(--green)' : 'var(--red)',
                      }}>
                      {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {up ? '+' : ''}{h.pnlPct.toFixed(2)}%
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: 'var(--bg3)', borderTop: '2px solid var(--border)' }}>
              <td className="px-4 py-3 font-bold text-[12px]" style={{ color: 'var(--text)' }}>Total</td>
              <td colSpan={4} className="px-4 py-3 font-semibold" style={{ color: 'var(--text2)' }}>₹{(totalInvested / 1000).toFixed(1)}K invested</td>
              <td className="px-4 py-3 font-bold" style={{ color: 'var(--accent)' }}>₹{(totalCurrent / 1000).toFixed(1)}K</td>
              <td className="px-4 py-3 font-bold text-[13px]" style={{ color: totalPnL >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {totalPnL >= 0 ? '+' : '-'}₹{(Math.abs(totalPnL) / 1000).toFixed(1)}K
              </td>
              <td className="px-4 py-3">
                <span className="text-[12px] font-black" style={{ color: totalPnL >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {totalPnLPct >= 0 ? '+' : ''}{totalPnLPct.toFixed(2)}%
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
