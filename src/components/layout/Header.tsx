'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, RefreshCw, TrendingUp, TrendingDown, Sun, Moon, Wallet } from 'lucide-react';
import Image from 'next/image';
import { STOCKS } from '@/lib/data';
import { useTheme } from '@/lib/theme';
import { useTrading } from '@/lib/trading';

export default function Header() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const { theme, toggle } = useTheme();
  const { balance } = useTrading();
  const router = useRouter();

  const results = query.length > 0
    ? STOCKS.filter(s =>
        s.symbol.includes(query.toUpperCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 7)
    : [];

  const goToStock = (symbol: string) => {
    setQuery('');
    setFocused(false);
    router.push(`/stocks/${symbol}`);
  };

  return (
    <header className="h-14 flex items-center px-5 gap-4 sticky top-0 z-20 transition-all"
      style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>

      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <div className={`flex items-center gap-2.5 h-8 px-3 rounded-lg border transition-all ${
          focused ? 'border-[#387ED1] shadow-[0_0_0_3px_rgba(56,126,209,0.15)]' : ''
        }`} style={{ borderColor: focused ? '#387ED1' : 'var(--border)', background: 'var(--bg3)' }}>
          <Search size={13} className="shrink-0" style={{ color: 'var(--text3)' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => { setFocused(false); setQuery(''); }, 200)}
            onKeyDown={e => { if (e.key === 'Enter' && results.length > 0) goToStock(results[0].symbol); }}
            placeholder="Search NSE/BSE stocks…"
            className="bg-transparent border-none outline-none text-[12px] w-full"
            style={{ color: 'var(--text)' }}
          />
          <kbd className="hidden sm:flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded border"
            style={{ color: 'var(--text3)', background: 'var(--bg)', borderColor: 'var(--border)' }}>⌘K</kbd>
        </div>

        <AnimatePresence>
          {focused && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.14 }}
              className="absolute top-10 left-0 right-0 rounded-xl border overflow-hidden z-50 shadow-2xl"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              {results.map((s, i) => (
                <motion.div
                  key={s.symbol}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => goToStock(s.symbol)}
                  className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-colors"
                  style={{ borderBottom: i < results.length - 1 ? `1px solid var(--border2)` : 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black"
                      style={{ background: 'var(--bg3)', color: 'var(--accent)' }}>
                      {s.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold" style={{ color: 'var(--text)' }}>{s.symbol}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text3)' }}>{s.name} · {s.exchange}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-semibold" style={{ color: 'var(--text)' }}>₹{s.price.toLocaleString('en-IN')}</p>
                    <p className={`text-[11px] font-medium flex items-center justify-end gap-0.5`}
                      style={{ color: s.change >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {s.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Market status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)' }}>
          <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--green)' }} />
          <span className="text-[11px] font-semibold" style={{ color: 'var(--green)' }}>Market Open</span>
        </div>

        {/* Balance */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
          <Wallet size={11} style={{ color: 'var(--accent)' }} />
          <span className="text-[11px] font-semibold" style={{ color: 'var(--text2)' }}>
            ₹{(balance / 1e5).toFixed(1)}L
          </span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)' }}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Refresh */}
        <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg3)]"
          style={{ color: 'var(--text3)' }}>
          <RefreshCw size={14} />
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg3)]"
          style={{ color: 'var(--text3)' }}>
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
        </button>

        {/* User avatar */}
        <button className="flex items-center gap-2 h-8 pl-2 pr-2.5 rounded-lg transition-colors hover:bg-[var(--bg3)]">
          <div className="relative w-6 h-6 rounded-full overflow-hidden"
            style={{ border: '1.5px solid rgba(34,197,94,0.4)', boxShadow: '0 0 6px rgba(34,197,94,0.2)' }}>
            <Image src="/images/ygl-founder.png" alt="Yash Sharma" fill className="object-cover" sizes="24px" />
          </div>
        </button>
      </div>
    </header>
  );
}
