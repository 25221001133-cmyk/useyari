'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { STOCKS } from '@/lib/data';
import MiniSparkline from '@/components/charts/MiniSparkline';

const DEFAULT_WATCHED = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'BAJFINANCE', 'TITAN', 'ICICIBANK', 'SUNPHARMA'];

export default function WatchlistPanel({ compact = false }: { compact?: boolean }) {
  const [watched, setWatched] = useState<string[]>(DEFAULT_WATCHED);
  const [searchQ, setSearchQ] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const router = useRouter();

  const watchedStocks = STOCKS.filter(s => watched.includes(s.symbol));
  const available = STOCKS.filter(s =>
    !watched.includes(s.symbol) &&
    (s.symbol.includes(searchQ.toUpperCase()) || s.name.toLowerCase().includes(searchQ.toLowerCase()))
  ).slice(0, 6);

  const remove = (sym: string) => setWatched(w => w.filter(s => s !== sym));
  const add = (sym: string) => { setWatched(w => [...w, sym]); setSearchQ(''); setShowAdd(false); };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <Star size={14} fill="#F59E0B" color="#F59E0B" />
          <h3 className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>Watchlist</h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
            style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>{watched.length}</span>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg transition-colors"
          style={{ color: 'var(--accent)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(56,126,209,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = '')}>
          <Plus size={13} /> Add
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="p-3">
              <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 mb-2"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <Search size={12} style={{ color: 'var(--text3)' }} />
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search to add…" autoFocus
                  className="bg-transparent outline-none text-[12px] flex-1" style={{ color: 'var(--text)' }} />
              </div>
              {available.map(s => (
                <button key={s.symbol} onClick={() => add(s.symbol)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}>
                  <div className="text-left">
                    <p className="text-[12px] font-bold" style={{ color: 'var(--text)' }}>{s.symbol}</p>
                    <p className="text-[10px] truncate max-w-[160px]" style={{ color: 'var(--text3)' }}>{s.name}</p>
                  </div>
                  <Plus size={13} style={{ color: 'var(--accent)' }} />
                </button>
              ))}
              {searchQ && available.length === 0 && (
                <p className="text-[11px] text-center py-2" style={{ color: 'var(--text3)' }}>No results found</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-h-[520px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {watchedStocks.map((s, i) => {
            const up = s.changePercent >= 0;
            return (
              <motion.div
                key={s.symbol}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, height: 0 }}
                transition={{ delay: i * 0.03, type: 'spring', stiffness: 260, damping: 24 }}
                onClick={() => router.push(`/stocks/${s.symbol}`)}
                className="flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer group"
                style={{ borderBottom: '1px solid var(--border2)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                <button onClick={e => { e.stopPropagation(); remove(s.symbol); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Star size={13} fill="#F59E0B" color="#F59E0B" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-bold" style={{ color: 'var(--text)' }}>{s.symbol}</p>
                    <p className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>₹{s.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[10px]" style={{ color: 'var(--text3)' }}>{s.sector}</p>
                    <span className="flex items-center gap-0.5 text-[11px] font-semibold"
                      style={{ color: up ? 'var(--green)' : 'var(--red)' }}>
                      {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {up ? '+' : ''}{s.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                {!compact && (
                  <div className="w-[64px] h-[32px] shrink-0">
                    <MiniSparkline data={[s.price * 0.95, s.price * 0.97, s.price * 0.96, s.price * 0.98, s.price * 0.99, s.price]} up={up} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
