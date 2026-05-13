'use client';
import { motion, type Variants } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { INDICES } from '@/lib/data';
import MiniSparkline from '@/components/charts/MiniSparkline';

const INDEX_SLUGS: Record<string, string> = {
  'NIFTY 50': '/index/nifty-50',
  'SENSEX': '/index/sensex',
  'NIFTY BANK': '/index/nifty-bank',
  'NIFTY IT': '/index/nifty-it',
  'NIFTY MIDCAP': '/index/nifty-midcap',
  'INDIA VIX': '/index/india-vix',
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 24 } },
};

export default function MarketCards() {
  const router = useRouter();
  return (
    <motion.div variants={container} initial="hidden" animate="show"
      className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {INDICES.map((idx) => {
        const up = idx.changePercent >= 0;
        const href = INDEX_SLUGS[idx.name];
        return (
          <motion.div
            key={idx.name}
            variants={item}
            whileHover={{ y: -3, scale: 1.02 }}
            onClick={() => href && router.push(href)}
            className="rounded-xl p-3.5 cursor-pointer transition-all"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
          >
            <p className="text-[11px] font-semibold mb-1 truncate" style={{ color: 'var(--text3)' }}>{idx.name}</p>
            <p className="text-[15px] font-black leading-tight" style={{ color: 'var(--text)' }}>
              {idx.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold"
              style={{ color: up ? 'var(--green)' : 'var(--red)' }}>
              {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {up ? '+' : ''}{idx.changePercent.toFixed(2)}%
            </div>
            <div className="mt-2 h-[38px] w-full">
              <MiniSparkline data={idx.sparkline} up={up} />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
