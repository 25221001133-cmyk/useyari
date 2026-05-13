'use client';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, TrendingDown } from 'lucide-react';
import { GLOBAL_INDICES } from '@/lib/data';

const CRYPTO = [
  { name: 'Bitcoin', symbol: 'BTC', price: 8234567, change: 2.84, icon: '₿' },
  { name: 'Ethereum', symbol: 'ETH', price: 456789, change: -1.24, icon: 'Ξ' },
  { name: 'BNB', symbol: 'BNB', price: 54321, change: 0.84, icon: '◈' },
  { name: 'Solana', symbol: 'SOL', price: 18234, change: 4.28, icon: '◎' },
];

const COMMODITIES = [
  { name: 'Gold', symbol: 'MCX', price: 74235, unit: '/10g', change: 0.42 },
  { name: 'Silver', symbol: 'MCX', price: 86450, unit: '/kg', change: -0.28 },
  { name: 'Crude Oil', symbol: 'MCX', price: 6834, unit: '/bbl', change: 1.12 },
  { name: 'Natural Gas', symbol: 'MCX', price: 234, unit: '/mmBtu', change: -2.14 },
];

export default function GlobalMarketsPage() {
  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(56,126,209,0.15)' }}>
          <Globe size={20} style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <h1 className="text-[20px] font-black" style={{ color: 'var(--text)' }}>Global Markets</h1>
          <p className="text-[12px]" style={{ color: 'var(--text3)' }}>World indices, crypto & commodities</p>
        </div>
      </div>

      {/* Global Indices */}
      <div>
        <h2 className="text-[14px] font-bold mb-3" style={{ color: 'var(--text)' }}>World Indices</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {GLOBAL_INDICES.map((idx, i) => {
            const up = idx.change >= 0;
            return (
              <motion.div
                key={idx.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2 }}
                className="rounded-2xl p-4 cursor-pointer transition-all"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[18px]">{idx.country}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: up ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', color: up ? 'var(--green)' : 'var(--red)' }}>
                    {up ? '+' : ''}{idx.change}%
                  </span>
                </div>
                <p className="text-[11px] font-semibold mb-1" style={{ color: 'var(--text3)' }}>{idx.name}</p>
                <p className="text-[16px] font-black" style={{ color: 'var(--text)' }}>
                  {idx.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Crypto */}
      <div>
        <h2 className="text-[14px] font-bold mb-3" style={{ color: 'var(--text)' }}>Crypto (INR)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CRYPTO.map((c, i) => {
            const up = c.change >= 0;
            return (
              <motion.div
                key={c.symbol}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 + 0.2 }}
                whileHover={{ y: -2 }}
                className="rounded-2xl p-4 cursor-pointer"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-black"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>{c.icon}</span>
                  <div>
                    <p className="text-[12px] font-bold" style={{ color: 'var(--text)' }}>{c.symbol}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text3)' }}>{c.name}</p>
                  </div>
                </div>
                <p className="text-[14px] font-black" style={{ color: 'var(--text)' }}>
                  ₹{c.price.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] font-bold flex items-center gap-0.5 mt-1"
                  style={{ color: up ? 'var(--green)' : 'var(--red)' }}>
                  {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {up ? '+' : ''}{c.change}%
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Commodities */}
      <div>
        <h2 className="text-[14px] font-bold mb-3" style={{ color: 'var(--text)' }}>Commodities (MCX)</h2>
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {COMMODITIES.map((c, i) => {
            const up = c.change >= 0;
            return (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 + 0.3 }}
                className="flex items-center justify-between px-5 py-3.5 cursor-pointer transition-colors"
                style={{ borderBottom: i < COMMODITIES.length - 1 ? '1px solid var(--border2)' : 'none' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <div>
                  <p className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>{c.name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text3)' }}>{c.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-black" style={{ color: 'var(--text)' }}>
                    ₹{c.price.toLocaleString('en-IN')}{c.unit}
                  </p>
                  <p className="text-[11px] font-bold flex items-center justify-end gap-0.5"
                    style={{ color: up ? 'var(--green)' : 'var(--red)' }}>
                    {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {up ? '+' : ''}{c.change}%
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
