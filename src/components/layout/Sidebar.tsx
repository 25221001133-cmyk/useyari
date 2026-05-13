'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  LayoutDashboard, TrendingUp, Briefcase, Star, BarChart2,
  Settings, ChevronLeft, ChevronRight, Activity, Zap,
  Flame, Globe, Layers, Users, Target, Sparkles,
} from 'lucide-react';
import clsx from 'clsx';

const NAV = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/markets', icon: TrendingUp, label: 'Markets' },
  { href: '/portfolio', icon: Briefcase, label: 'Portfolio' },
  { href: '/watchlist', icon: Star, label: 'Watchlist' },
  { href: '/charts', icon: BarChart2, label: 'Charts' },
  { href: '/analytics', icon: Activity, label: 'Analytics' },
];

const MARKET_SECTIONS = [
  { href: '/options', icon: Target, label: 'Options / F&O' },
  { href: '/ipo', icon: Flame, label: 'IPO' },
  { href: '/mutual-funds', icon: Layers, label: 'Mutual Funds' },
  { href: '/global', icon: Globe, label: 'Global Markets' },
  { href: '/leaderboard', icon: Users, label: 'Leaderboard' },
];

const BOTTOM = [
  { href: '/settings', icon: Settings, label: 'Settings' },
  { href: '/about-ygl', icon: Sparkles, label: 'About YGL' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  useEffect(() => { setMounted(true); }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 228 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="relative flex flex-col h-screen border-r z-30 shrink-0 overflow-hidden"
      style={{ background: 'var(--sidebar)', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #387ED1, #8B5CF6)' }}>
            <Zap size={16} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col leading-none"
              >
                <span className="font-bold text-[14px] tracking-tight whitespace-nowrap" style={{ color: 'var(--text)' }}>UseYari</span>
                <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>Your Yaari</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {/* Main nav */}
        {!collapsed && (
          <p className="text-[9px] font-bold uppercase tracking-widest px-4 mb-2" style={{ color: 'var(--text3)' }}>Main</p>
        )}
        <div className="px-2 space-y-0.5">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href} suppressHydrationWarning>
                <motion.div
                  whileHover={{ x: collapsed ? 0 : 3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={clsx(
                    'relative flex items-center gap-3 h-10 px-2.5 rounded-lg cursor-pointer transition-colors',
                    active ? '' : 'hover:bg-white/5'
                  )}
                  style={active ? {} : { color: 'var(--text3)' }}
                >
                  {active && (
                    mounted ? (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: 'linear-gradient(135deg, #387ED1 0%, #8B5CF6 100%)' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 rounded-lg"
                        style={{ background: 'linear-gradient(135deg, #387ED1 0%, #8B5CF6 100%)' }}
                      />
                    )
                  )}
                  <Icon size={17} className="relative z-10 shrink-0" style={{ color: active ? '#fff' : undefined }} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }}
                        className="relative z-10 text-[13px] font-medium whitespace-nowrap"
                        style={{ color: active ? '#fff' : undefined }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </div>

        <div className="mx-3 my-3" style={{ borderTop: '1px solid var(--border)' }} />

        {/* Market sections */}
        {!collapsed && (
          <p className="text-[9px] font-bold uppercase tracking-widest px-4 mb-2" style={{ color: 'var(--text3)' }}>Markets</p>
        )}
        <div className="px-2 space-y-0.5">
          {MARKET_SECTIONS.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            return (
              <Link key={href} href={href} suppressHydrationWarning>
                <div
                  className="flex items-center gap-3 h-9 px-2.5 rounded-lg transition-colors cursor-pointer hover:bg-white/5"
                  style={{ color: active ? 'var(--accent)' : 'var(--text3)' }}
                >
                  <Icon size={15} className="shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[12px] font-medium whitespace-nowrap"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mx-3 my-3" style={{ borderTop: '1px solid var(--border)' }} />

        <div className="px-2 space-y-0.5">
          {BOTTOM.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href} suppressHydrationWarning>
              <div className="flex items-center gap-3 h-10 px-2.5 rounded-lg transition-colors cursor-pointer hover:bg-white/5"
                style={{ color: 'var(--text3)' }}>
                <Icon size={17} className="shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[13px] font-medium whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="p-3 shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0"
            style={{ border: '1.5px solid rgba(34,197,94,0.4)', boxShadow: '0 0 8px rgba(34,197,94,0.2)' }}>
            <Image src="/images/ygl-founder.png" alt="Yash Sharma" fill className="object-cover" sizes="32px" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0 flex-1"
              >
                <p className="text-[12px] font-semibold truncate" style={{ color: 'var(--text)' }}>Yash Sharma</p>
                <p className="text-[10px] truncate" style={{ color: 'var(--accent)' }}>₹10,00,000 Balance</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* YGL mini brand */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-3 pb-2 shrink-0"
          >
            <Link href="/about-ygl" suppressHydrationWarning>
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-white/5">
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E', letterSpacing: '0.05em' }}>
                  YGL
                </span>
                <span className="text-[9px] font-medium" style={{ color: 'var(--text3)' }}>
                  Yash Growth Labs
                </span>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 border rounded-full flex items-center justify-center transition-all z-40 shadow-lg hover:scale-110"
        style={{ background: 'var(--bg3)', borderColor: 'var(--border)', color: 'var(--text3)' }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
