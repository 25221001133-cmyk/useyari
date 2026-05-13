'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { STOCKS } from '@/lib/data';

const gainers = [...STOCKS].sort((a, b) => b.changePercent - a.changePercent).slice(0, 6);
const losers = [...STOCKS].sort((a, b) => a.changePercent - b.changePercent).slice(0, 6);

function MoverCard({ stock, index }: { stock: (typeof STOCKS)[0]; index: number }) {
  const up = stock.changePercent >= 0;
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 240, damping: 22 }}
      whileHover={{ x: 3 }}
      onClick={() => router.push(`/stocks/${stock.symbol}`)}
      className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer group"
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
      onMouseLeave={e => (e.currentTarget.style.background = '')}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold"
          style={{
            background: up ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
            color: up ? 'var(--green)' : 'var(--red)',
          }}>
          {stock.symbol.slice(0, 2)}
        </div>
        <div>
          <p className="text-[12px] font-bold" style={{ color: 'var(--text)' }}>{stock.symbol}</p>
          <p className="text-[10px]" style={{ color: 'var(--text3)' }}>{stock.sector}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[12px] font-semibold" style={{ color: 'var(--text)' }}>
          ₹{stock.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </p>
        <p className="text-[11px] font-bold flex items-center justify-end gap-0.5"
          style={{ color: up ? 'var(--green)' : 'var(--red)' }}>
          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {up ? '+' : ''}{stock.changePercent.toFixed(2)}%
        </p>
      </div>
    </motion.div>
  );
}

export default function TopMovers() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[
        { title: 'Top Gainers', icon: TrendingUp, color: 'var(--green)', list: gainers },
        { title: 'Top Losers', icon: TrendingDown, color: 'var(--red)', list: losers },
      ].map(({ title, icon: Icon, color, list }) => (
        <div key={title} className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Icon size={15} style={{ color }} />
            <h3 className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>{title}</h3>
          </div>
          <div>
            {list.map((s, i) => <MoverCard key={s.symbol} stock={s} index={i} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
