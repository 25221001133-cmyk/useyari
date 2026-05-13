'use client';
import { motion } from 'framer-motion';
import { Flame, Star, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { IPO_DATA } from '@/lib/data';

function StatusBadge({ opens }: { opens: string }) {
  const open = opens === 'Open Now';
  const upcoming = opens === 'Upcoming';
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"
      style={{
        background: open ? 'rgba(22,163,74,0.1)' : upcoming ? 'rgba(245,158,11,0.1)' : 'rgba(56,126,209,0.1)',
        color: open ? 'var(--green)' : upcoming ? '#F59E0B' : 'var(--accent)',
      }}>
      {open ? <CheckCircle size={9} /> : <AlertCircle size={9} />}
      {opens}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={11} fill={i <= Math.round(rating) ? '#F59E0B' : 'none'}
          style={{ color: i <= Math.round(rating) ? '#F59E0B' : 'var(--border)' }} />
      ))}
    </div>
  );
}

export default function IPOPage() {
  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(245,158,11,0.15))' }}>
          <Flame size={20} style={{ color: '#EF4444' }} />
        </div>
        <div>
          <h1 className="text-[20px] font-black" style={{ color: 'var(--text)' }}>IPO Corner</h1>
          <p className="text-[12px]" style={{ color: 'var(--text3)' }}>Current, upcoming & recent IPOs on NSE/BSE</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Open Now', val: IPO_DATA.filter(i => i.opens === 'Open Now').length.toString(), color: 'var(--green)' },
          { label: 'Upcoming', val: IPO_DATA.filter(i => i.opens === 'Upcoming').length.toString(), color: '#F59E0B' },
          { label: 'Avg GMP', val: `+${(IPO_DATA.filter(i => i.gmpPercent > 0).reduce((s, i) => s + i.gmpPercent, 0) / IPO_DATA.length).toFixed(1)}%`, color: 'var(--accent)' },
          { label: 'Total Issues', val: IPO_DATA.length.toString(), color: 'var(--text2)' },
        ].map(({ label, val, color }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="text-[11px] font-semibold mb-1" style={{ color: 'var(--text3)' }}>{label}</p>
            <p className="text-[24px] font-black" style={{ color }}>{val}</p>
          </div>
        ))}
      </div>

      {/* IPO Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {IPO_DATA.map((ipo, i) => {
          const gmpUp = ipo.gmpPercent >= 0;
          return (
            <motion.div
              key={ipo.symbol}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3, boxShadow: 'var(--shadow-lg)' }}
              className="rounded-2xl p-5 cursor-pointer transition-all"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black text-white"
                      style={{ background: 'linear-gradient(135deg, #387ED1, #8B5CF6)' }}>
                      {ipo.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-[14px] font-black" style={{ color: 'var(--text)' }}>{ipo.company}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text3)' }}>{ipo.sector} · {ipo.exchange}</p>
                    </div>
                  </div>
                </div>
                <StatusBadge opens={ipo.opens} />
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="rounded-lg p-2.5" style={{ background: 'var(--bg3)' }}>
                  <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text3)' }}>Issue Price</p>
                  <p className="text-[14px] font-black" style={{ color: 'var(--text)' }}>₹{ipo.price}</p>
                </div>
                <div className="rounded-lg p-2.5" style={{ background: gmpUp ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)' }}>
                  <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text3)' }}>GMP</p>
                  <p className="text-[14px] font-black flex items-center gap-0.5" style={{ color: gmpUp ? 'var(--green)' : 'var(--red)' }}>
                    {gmpUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {gmpUp ? '+' : ''}{ipo.gmpPercent}%
                  </p>
                </div>
                <div className="rounded-lg p-2.5" style={{ background: 'var(--bg3)' }}>
                  <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text3)' }}>Min Lot</p>
                  <p className="text-[14px] font-black" style={{ color: 'var(--text)' }}>{ipo.lot}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <StarRating rating={ipo.rating} />
                <span className="text-[11px] font-semibold" style={{ color: 'var(--text3)' }}>Min: ₹{(ipo.lot * ipo.price).toLocaleString('en-IN')}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full mt-4 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all"
                style={{
                  background: ipo.opens === 'Open Now'
                    ? 'linear-gradient(135deg, #16A34A, #4ADE80)'
                    : 'var(--bg3)',
                  color: ipo.opens === 'Open Now' ? '#fff' : 'var(--text3)',
                }}
              >
                {ipo.opens === 'Open Now' ? 'Apply Now' : ipo.opens === 'Upcoming' ? 'Set Reminder' : 'View Details'}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
