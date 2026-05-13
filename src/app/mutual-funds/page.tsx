'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, TrendingUp, Star, Filter } from 'lucide-react';
import { MF_DATA } from '@/lib/data';

const CATEGORIES = ['All', 'Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap'];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={11} fill={i <= rating ? '#F59E0B' : 'none'}
          style={{ color: i <= rating ? '#F59E0B' : 'var(--border)' }} />
      ))}
    </div>
  );
}

export default function MutualFundsPage() {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? MF_DATA : MF_DATA.filter(f => f.category === cat);

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(139,92,246,0.15)' }}>
          <Layers size={20} style={{ color: '#8B5CF6' }} />
        </div>
        <div>
          <h1 className="text-[20px] font-black" style={{ color: 'var(--text)' }}>Mutual Funds</h1>
          <p className="text-[12px]" style={{ color: 'var(--text3)' }}>Top-rated equity mutual funds · SIP & lump sum</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={13} style={{ color: 'var(--text3)' }} />
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
            style={{
              background: cat === c ? 'var(--accent)' : 'var(--card)',
              color: cat === c ? '#fff' : 'var(--text3)',
              border: '1px solid var(--border)',
            }}>
            {c}
          </button>
        ))}
      </div>

      {/* Fund cards */}
      <div className="space-y-3">
        {filtered.map((fund, i) => (
          <motion.div
            key={fund.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ x: 4 }}
            className="rounded-2xl p-5 cursor-pointer transition-all"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #387ED1)' }}>
                  MF
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-black truncate" style={{ color: 'var(--text)' }}>{fund.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>
                      {fund.category}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text3)' }}>AUM: {fund.aum}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-[10px] font-semibold mb-0.5" style={{ color: 'var(--text3)' }}>NAV</p>
                  <p className="text-[16px] font-black" style={{ color: 'var(--text)' }}>₹{fund.nav}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-semibold mb-0.5" style={{ color: 'var(--text3)' }}>1Y Return</p>
                  <p className="text-[16px] font-black" style={{ color: 'var(--green)' }}>+{fund.returns1y}%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-semibold mb-0.5" style={{ color: 'var(--text3)' }}>3Y Return</p>
                  <p className="text-[16px] font-black" style={{ color: 'var(--accent)' }}>+{fund.returns3y}%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-semibold mb-0.5" style={{ color: 'var(--text3)' }}>Rating</p>
                  <StarRating rating={fund.rating} />
                </div>
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-bold"
                    style={{ background: 'rgba(56,126,209,0.1)', color: 'var(--accent)', border: '1px solid rgba(56,126,209,0.2)' }}>
                    SIP
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #387ED1)' }}>
                    Invest
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Returns bar */}
            <div className="mt-3 flex items-center gap-3">
              <span className="text-[10px] font-semibold" style={{ color: 'var(--text3)' }}>Performance vs benchmark</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(fund.returns1y * 1.5, 100)}%` }}
                  transition={{ delay: i * 0.05 + 0.3, duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #8B5CF6, #387ED1)' }}
                />
              </div>
              <TrendingUp size={12} style={{ color: 'var(--green)' }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
