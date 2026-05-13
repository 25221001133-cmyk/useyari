'use client';
import { motion } from 'framer-motion';
import { Users, Trophy, TrendingUp, Crown, Medal } from 'lucide-react';
import { useTrading } from '@/lib/trading';

const LEADERBOARD = [
  { rank: 1, name: 'Arjun Kapoor', avatar: 'AK', pnl: 284567, pnlPct: 28.45, trades: 142, badge: 'Elite Trader' },
  { rank: 2, name: 'Priya Singh', avatar: 'PS', pnl: 198234, pnlPct: 19.82, trades: 98, badge: 'Pro Investor' },
  { rank: 3, name: 'Rahul Mehta', avatar: 'RM', pnl: 156789, pnlPct: 15.67, trades: 213, badge: 'Swing Master' },
  { rank: 4, name: 'Ananya Sharma', avatar: 'AS', pnl: 134560, pnlPct: 13.45, trades: 76, badge: 'Long-term Pro' },
  { rank: 5, name: 'Vikram Nair', avatar: 'VN', pnl: 112340, pnlPct: 11.23, trades: 189, badge: 'Day Trader' },
  { rank: 6, name: 'Sneha Patel', avatar: 'SP', pnl: 98765, pnlPct: 9.87, trades: 64, badge: 'Value Investor' },
  { rank: 7, name: 'Yash Sharma', avatar: 'YS', pnl: 0, pnlPct: 0, trades: 0, badge: 'Newcomer', isYou: true },
];

const RANK_COLORS = ['#F59E0B', '#94A3B8', '#CD7F32'];
const RANK_ICONS = [Crown, Medal, Medal];

export default function LeaderboardPage() {
  const { totalPnL, totalPnLPct, orders } = useTrading();

  const board = LEADERBOARD.map(u =>
    u.isYou ? { ...u, pnl: Math.round(totalPnL), pnlPct: +totalPnLPct.toFixed(2), trades: orders.length } : u
  ).sort((a, b) => b.pnl - a.pnl).map((u, i) => ({ ...u, rank: i + 1 }));

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(245,158,11,0.15)' }}>
          <Trophy size={20} style={{ color: '#F59E0B' }} />
        </div>
        <div>
          <h1 className="text-[20px] font-black" style={{ color: 'var(--text)' }}>Leaderboard</h1>
          <p className="text-[12px]" style={{ color: 'var(--text3)' }}>Top UseYari traders by portfolio P&L</p>
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3">
        {board.slice(0, 3).map((u, i) => {
          const RankIcon = RANK_ICONS[i];
          return (
            <motion.div
              key={u.name}
              initial={{ opacity: 0, y: i === 1 ? -16 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-5 text-center relative overflow-hidden ${i === 0 ? 'order-2' : i === 1 ? 'order-1' : 'order-3'}`}
              style={{
                background: i === 0
                  ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))'
                  : 'var(--card)',
                border: `1px solid ${i === 0 ? '#F59E0B' : 'var(--border)'}`,
                marginTop: i === 0 ? 0 : 24,
              }}
            >
              {i === 0 && <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at 50% 0%, #F59E0B, transparent)' }} />}
              <RankIcon size={20} className="mx-auto mb-2" style={{ color: RANK_COLORS[i] }} />
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white font-black text-[14px] mb-2"
                style={{ background: 'linear-gradient(135deg, #387ED1, #8B5CF6)' }}>
                {u.avatar}
              </div>
              <p className="text-[13px] font-black" style={{ color: 'var(--text)' }}>{u.name}</p>
              <p className="text-[20px] font-black mt-1" style={{ color: 'var(--green)' }}>+{u.pnlPct}%</p>
              <p className="text-[11px]" style={{ color: 'var(--text3)' }}>₹{u.pnl.toLocaleString('en-IN')} P&L</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full mt-2 inline-block font-semibold"
                style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>{u.badge}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Full table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <Users size={14} style={{ color: 'var(--accent)' }} />
          <h3 className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>All Traders</h3>
        </div>
        <div>
          {board.map((u, i) => {
            const isTop3 = i < 3;
            return (
              <motion.div
                key={u.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors"
                style={{
                  borderBottom: i < board.length - 1 ? '1px solid var(--border2)' : 'none',
                  background: u.isYou ? 'rgba(56,126,209,0.05)' : 'transparent',
                }}
                onMouseEnter={e => !u.isYou && (e.currentTarget.style.background = 'var(--bg3)')}
                onMouseLeave={e => !u.isYou && (e.currentTarget.style.background = 'transparent')}
              >
                <div className="w-7 text-center">
                  {isTop3
                    ? <span className="text-[16px]">{['🥇', '🥈', '🥉'][i]}</span>
                    : <span className="text-[13px] font-bold" style={{ color: 'var(--text3)' }}>{u.rank}</span>
                  }
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-[11px] shrink-0"
                  style={{ background: u.isYou ? 'linear-gradient(135deg, #387ED1, #8B5CF6)' : 'var(--bg3)', color: u.isYou ? '#fff' : 'var(--text2)' }}>
                  {u.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>
                      {u.name} {u.isYou && <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(56,126,209,0.15)', color: 'var(--accent)' }}>You</span>}
                    </p>
                  </div>
                  <p className="text-[10px]" style={{ color: 'var(--text3)' }}>{u.badge} · {u.trades} trades</p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-black" style={{ color: u.pnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {u.pnl >= 0 ? '+' : ''}₹{Math.abs(u.pnl).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] font-semibold flex items-center justify-end gap-0.5"
                    style={{ color: u.pnlPct >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    <TrendingUp size={10} />
                    {u.pnlPct >= 0 ? '+' : ''}{u.pnlPct}%
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
