'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { generatePortfolioPnL } from '@/lib/data';
import { useTrading } from '@/lib/trading';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import Link from 'next/link';

const pnlHistory = generatePortfolioPnL();

export default function PortfolioSummary() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const router = useRouter();
  const { positions, totalInvested, totalCurrent, totalPnL, totalPnLPct } = useTrading();
  const up = totalPnL >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl p-5"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(56,126,209,0.1)' }}>
            <Briefcase size={14} style={{ color: 'var(--accent)' }} />
          </div>
          <h3 className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>Portfolio Overview</h3>
        </div>
        <Link href="/portfolio" className="flex items-center gap-1 text-[12px] font-semibold hover:underline"
          style={{ color: 'var(--accent)' }}>
          View All <ArrowUpRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Invested', val: `₹${(totalInvested / 1e5).toFixed(1)}L`, bg: 'var(--bg3)', color: 'var(--text3)' },
          { label: 'Current', val: `₹${(totalCurrent / 1e5).toFixed(1)}L`, bg: 'rgba(56,126,209,0.1)', color: 'var(--accent)' },
          {
            label: 'P&L', val: `${up ? '+' : '-'}₹${(Math.abs(totalPnL) / 1e3).toFixed(1)}K`,
            bg: up ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
            color: up ? 'var(--green)' : 'var(--red)',
          },
        ].map(({ label, val, bg, color }) => (
          <div key={label} className="rounded-xl p-3" style={{ background: bg }}>
            <p className="text-[10px] font-medium mb-1" style={{ color }}>{label}</p>
            <p className="text-[13px] font-black" style={{ color }}>{val}</p>
          </div>
        ))}
      </div>

      <div className="h-[72px] w-full mb-4">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pnlHistory} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2} fill="url(#pnlGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="space-y-1">
        {positions.slice(0, 5).map((h, i) => (
          <motion.div
            key={h.symbol}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => router.push(`/stocks/${h.symbol}`)}
            className="flex items-center justify-between py-1.5 px-2 rounded-lg transition-colors cursor-pointer"
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
            onMouseLeave={e => (e.currentTarget.style.background = '')}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #387ED1, #8B5CF6)' }}>
                <span className="text-[8px] text-white font-bold">{h.symbol.slice(0, 2)}</span>
              </div>
              <span className="text-[12px] font-semibold" style={{ color: 'var(--text)' }}>{h.symbol}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px]" style={{ color: 'var(--text3)' }}>{h.qty} qty</span>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                style={{
                  background: h.pnl >= 0 ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
                  color: h.pnl >= 0 ? 'var(--green)' : 'var(--red)',
                }}>
                {h.pnl >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                {h.pnlPct.toFixed(2)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
