'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SECTOR_DATA } from '@/lib/data';

function getStyle(change: number): { bg: string; text: string } {
  if (change >= 2) return { bg: 'rgba(22,163,74,0.35)', text: '#4ADE80' };
  if (change >= 1) return { bg: 'rgba(22,163,74,0.2)', text: '#22C55E' };
  if (change >= 0.3) return { bg: 'rgba(22,163,74,0.1)', text: '#16A34A' };
  if (change > -0.3) return { bg: 'var(--bg3)', text: 'var(--text3)' };
  if (change > -1) return { bg: 'rgba(220,38,38,0.1)', text: '#DC2626' };
  if (change > -2) return { bg: 'rgba(220,38,38,0.25)', text: '#F87171' };
  return { bg: 'rgba(220,38,38,0.4)', text: '#FCA5A5' };
}

export default function SectorHeatmap() {
  const router = useRouter();
  return (
    <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>Sector Heatmap</h3>
        <span className="text-[11px]" style={{ color: 'var(--text3)' }}>NSE · Today · Click to explore</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {SECTOR_DATA.map((s, i) => {
          const { bg, text } = getStyle(s.change);
          const slug = s.sector.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return (
            <motion.div
              key={s.sector}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 22 }}
              whileHover={{ scale: 1.06, zIndex: 10 }}
              onClick={() => router.push(`/sector/${slug}`)}
              className="rounded-xl p-2.5 text-center cursor-pointer"
              style={{ background: bg }}
            >
              <p className="text-[11px] font-bold mb-0.5 truncate" style={{ color: text }}>{s.sector}</p>
              <p className="text-[13px] font-black" style={{ color: text }}>
                {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
              </p>
              <p className="text-[9px] mt-0.5 opacity-70" style={{ color: text }}>{s.stocks} stocks</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
