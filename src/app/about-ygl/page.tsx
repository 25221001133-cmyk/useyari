'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Brain, TrendingUp, Zap, BarChart2, Layers,
  CheckCircle2, Circle, ArrowRight, Rocket,
  Globe, Users, Sparkles, ExternalLink,
} from 'lucide-react';

// Inline SVG brand icons (lucide-react v1.14 has no brand icons)
type SvgProps = { size?: number; style?: React.CSSProperties; className?: string };

const LinkedinIcon = ({ size = 22, style, className }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style} className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const GithubIcon = ({ size = 22, style, className }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style} className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);
const TwitterIcon = ({ size = 22, style, className }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style} className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L2.25 2.25h6.844l4.262 5.633 5.888-5.633z"/>
  </svg>
);
const InstagramIcon = ({ size = 22, style, className }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const YoutubeIcon = ({ size = 22, style, className }: SvgProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style} className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
);

const YGL_GREEN = '#22C55E';
const LINKEDIN_URL = 'https://www.linkedin.com/company/113128021/';

const ROLES = ['AI Builder', 'Finance Enthusiast', 'Startup Builder', 'Automation Developer', 'Market Systems Creator'];

const FOCUS_AREAS = [
  { icon: Brain,      label: 'Artificial Intelligence', desc: 'AI stock analysis, portfolio doctor, sentiment scoring, and predictive market insights.' },
  { icon: TrendingUp, label: 'Finance & Investing',     desc: 'NSE/BSE markets, options chains, F&O, mutual funds, IPOs — all under one roof.' },
  { icon: Zap,        label: 'Automation',              desc: 'Smart order execution, price alerts, and workflow automation for active traders.' },
  { icon: BarChart2,  label: 'Growth Analytics',        desc: 'Portfolio health metrics, Sharpe ratio, alpha/beta tracking, and risk attribution.' },
  { icon: Layers,     label: 'Startup Systems',         desc: 'Scalable fintech infrastructure built for speed, reliability, and Gen-Z usability.' },
];

const PHILOSOPHY = [
  { icon: Globe,    title: 'India-First',        desc: "Built specifically for Indian markets — NSE, BSE, SEBI compliance, INR-native, culturally aware." },
  { icon: Users,    title: 'Community-Driven',   desc: "UseYari's social layer turns solo trading into a shared growth journey." },
  { icon: Rocket,   title: 'Startup Speed',      desc: 'Ship fast, iterate relentlessly. YGL operates with the urgency of a startup and the rigor of an institution.' },
  { icon: Sparkles, title: 'AI-Native',          desc: 'Every feature is designed with AI at the core — not as a bolt-on, but as the fundamental intelligence layer.' },
];

const SOCIALS = [
  { icon: LinkedinIcon,  label: 'LinkedIn',    sub: 'Yash Growth Labs', href: LINKEDIN_URL, color: '#0A66C2', glow: 'rgba(10,102,194,0.35)', live: true },
  { icon: GithubIcon,    label: 'GitHub',      sub: '@yashgrowth',      href: '#',          color: '#E6EDF3', glow: 'rgba(230,237,243,0.2)', live: false },
  { icon: TwitterIcon,   label: 'X / Twitter', sub: '@YashGrowthLabs',  href: '#',          color: '#1D9BF0', glow: 'rgba(29,155,240,0.3)',  live: false },
  { icon: InstagramIcon, label: 'Instagram',   sub: '@yashgrowthlabs',  href: '#',          color: '#E1306C', glow: 'rgba(225,48,108,0.3)',  live: false },
  { icon: YoutubeIcon,   label: 'YouTube',     sub: 'Yash Growth Labs', href: '#',          color: '#FF0000', glow: 'rgba(255,0,0,0.3)',     live: false },
];

const ROADMAP = [
  { quarter: 'Q2 2026', label: 'UseYari — AI Investing Ecosystem', done: true },
  { quarter: 'Q3 2026', label: 'Social Investing & Community Leaderboard', done: false },
  { quarter: 'Q4 2026', label: 'AI Portfolio Manager v2 + Auto-Rebalance', done: false },
  { quarter: 'Q1 2027', label: 'UseYari Mobile App (iOS & Android)', done: false },
  { quarter: 'Q2 2027', label: 'Options Intelligence & Algo Trading Module', done: false },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45 } }),
};

function RoleCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % ROLES.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="h-6 overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="text-[13px] font-semibold absolute"
          style={{ color: YGL_GREEN }}
        >
          {ROLES[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export default function AboutYGLPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="p-5 space-y-8 max-w-5xl mx-auto pb-12">

      {/* ── HERO ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #050C18 0%, #0A1628 60%, #060F1E 100%)',
          border: '1px solid rgba(34,197,94,0.2)',
          boxShadow: '0 0 80px rgba(34,197,94,0.07), 0 0 160px rgba(56,126,209,0.05)',
        }}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage: 'linear-gradient(rgba(34,197,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 p-8 md:p-12">

          {/* ── Founder image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            whileHover={{ scale: 1.04 }}
            className="shrink-0 relative"
          >
            {/* Outer glow rings */}
            <div className="absolute -inset-5 rounded-full blur-3xl opacity-30"
              style={{ background: 'radial-gradient(circle, #22C55E 0%, transparent 70%)' }} />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-[3px] rounded-full"
              style={{ background: 'conic-gradient(from 0deg, #22C55E, #387ED1, #8B5CF6, #22C55E)', filter: 'blur(4px)' }}
            />

            {/* Image container */}
            <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden"
              style={{ border: '3px solid rgba(34,197,94,0.5)', boxShadow: '0 0 30px rgba(34,197,94,0.25)' }}>
              <Image
                src="/images/ygl-founder.png"
                alt="Yash Sharma — Founder, Yash Growth Labs"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 176px, 208px"
              />
            </div>
          </motion.div>

          {/* ── Text ── */}
          <div className="text-center md:text-left space-y-4 flex-1">
            <div>
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2"
                style={{ color: YGL_GREEN }}>Founder & Vision</p>
              <h1 className="text-[30px] md:text-[38px] font-black leading-tight text-white">
                Yash Sharma
              </h1>
              <p className="text-[13px] font-semibold mt-1 mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Founder · Yash Growth Labs
              </p>
              {mounted && <RoleCarousel />}
            </div>

            <p className="text-[13px] leading-relaxed max-w-lg" style={{ color: 'rgba(255,255,255,0.55)' }}>
              UseYari is an AI-powered Indian investing ecosystem built by Yash Growth Labs to simplify
              trading, learning, analytics, and financial growth for the next generation.
            </p>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {['AI', 'Finance', 'Automation', 'Growth', 'Startup Systems'].map(tag => (
                <span key={tag} className="text-[10px] font-bold px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: YGL_GREEN }}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-1">
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 6px 24px rgba(10,102,194,0.5)' }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold"
                  style={{ background: '#0A66C2', color: '#fff' }}>
                  <LinkedinIcon size={14} /> Follow on LinkedIn
                </motion.button>
              </a>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 6px 24px rgba(34,197,94,0.4)' }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold"
                  style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)', color: '#fff' }}>
                  Open UseYari <ArrowRight size={13} />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── LINKEDIN COMPANY CARD ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="h-16 relative"
          style={{ background: 'linear-gradient(135deg, #0A1628, #0D2137, #0A66C2 200%)' }}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 80% 50%, #0A66C2 0%, transparent 60%)',
          }} />
        </div>

        <div className="px-6 pb-6 -mt-8 relative">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div className="flex items-end gap-4">
              {/* Company logo */}
              <div className="w-16 h-16 rounded-xl overflow-hidden shadow-xl flex-shrink-0"
                style={{ border: '3px solid var(--card)', boxShadow: '0 4px 20px rgba(10,102,194,0.3)' }}>
                <div className="w-full h-full relative">
                  <Image
                    src="/images/ygl-founder.png"
                    alt="Yash Growth Labs"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              </div>
              <div className="mb-1">
                <h3 className="text-[16px] font-black" style={{ color: 'var(--text)' }}>Yash Growth Labs</h3>
                <p className="text-[11px]" style={{ color: 'var(--text3)' }}>AI · Finance · Automation · Growth</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text3)' }}>Startup · India</p>
              </div>
            </div>

            <div className="flex gap-2 mb-1">
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.06, boxShadow: '0 4px 20px rgba(10,102,194,0.45)' }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold"
                  style={{ background: '#0A66C2', color: '#fff' }}>
                  <LinkedinIcon size={13} /> Follow
                </motion.button>
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold"
                  style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
                  <ExternalLink size={13} /> Visit Page
                </motion.button>
              </a>
            </div>
          </div>

          <p className="text-[12px] leading-relaxed mt-4 max-w-2xl" style={{ color: 'var(--text2)' }}>
            Yash Growth Labs is an AI-first startup studio building fintech, automation, and growth infrastructure
            for the next generation of Indian entrepreneurs and investors.
          </p>

          <div className="flex items-center gap-4 mt-4 flex-wrap">
            {[['Fintech', '#22C55E'], ['AI', '#8B5CF6'], ['Startup', '#F59E0B'], ['Automation', '#387ED1']].map(([tag, color]) => (
              <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── FOCUS AREAS ─────────────────────────────────── */}
      <div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-5">
          <h2 className="text-[18px] font-black" style={{ color: 'var(--text)' }}>Core Focus Areas</h2>
          <p className="text-[12px] mt-1" style={{ color: 'var(--text3)' }}>The pillars Yash Growth Labs builds on</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FOCUS_AREAS.map(({ icon: Icon, label, desc }, i) => (
            <motion.div key={label} custom={i} variants={fadeUp} initial="hidden"
              animate={mounted ? 'show' : 'hidden'}
              whileHover={{ y: -4, boxShadow: `0 12px 40px rgba(34,197,94,0.12)` }}
              className="rounded-2xl p-5"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', transition: 'box-shadow 0.2s' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <Icon size={18} style={{ color: YGL_GREEN }} />
              </div>
              <h3 className="text-[13px] font-bold mb-1.5" style={{ color: 'var(--text)' }}>{label}</h3>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text3)' }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── PHILOSOPHY ──────────────────────────────────── */}
      <div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mb-5">
          <h2 className="text-[18px] font-black" style={{ color: 'var(--text)' }}>Philosophy</h2>
          <p className="text-[12px] mt-1" style={{ color: 'var(--text3)' }}>How we think about building for India's investors</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PHILOSOPHY.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} custom={i} variants={fadeUp} initial="hidden"
              animate={mounted ? 'show' : 'hidden'}
              className="rounded-2xl p-5 flex gap-4"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(56,126,209,0.1)', border: '1px solid rgba(56,126,209,0.2)' }}>
                <Icon size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h3 className="text-[13px] font-bold mb-1" style={{ color: 'var(--text)' }}>{title}</h3>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text3)' }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── PRODUCT SHOWCASE ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(34,197,94,0.07), rgba(56,126,209,0.07))',
          border: '1px solid rgba(34,197,94,0.2)',
        }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: YGL_GREEN }} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: YGL_GREEN }}>
                Flagship Product · Live
              </span>
            </div>
            <h3 className="text-[22px] font-black" style={{ color: 'var(--text)' }}>UseYari</h3>
            <p className="text-[12px] mt-1 max-w-lg" style={{ color: 'var(--text3)' }}>
              India's AI-powered investing ecosystem — NSE/BSE markets, options chains, portfolio analytics,
              AI assistant (Yari), paper trading, social leaderboard, and more.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['42 Stocks', 'Options / F&O', 'AI Assistant', 'Paper Trading', 'Leaderboard', 'Analytics'].map(f => (
                <span key={f} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg"
                  style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)' }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
          <Link href="/">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              Launch App <ExternalLink size={12} />
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* ── SOCIAL PRESENCE ─────────────────────────────── */}
      <div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mb-5">
          <h2 className="text-[18px] font-black" style={{ color: 'var(--text)' }}>Social Presence</h2>
          <p className="text-[12px] mt-1" style={{ color: 'var(--text3)' }}>Follow Yash Growth Labs across platforms</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOCIALS.map(({ icon: Icon, label, sub, href, color, glow, live }, i) => (
            <motion.a
              key={label}
              href={href}
              target={live ? '_blank' : undefined}
              rel="noopener noreferrer"
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate={mounted ? 'show' : 'hidden'}
              whileHover={live ? { scale: 1.03, boxShadow: `0 8px 32px ${glow}` } : { scale: 1.01 }}
              className="rounded-2xl p-5 flex items-center gap-4 cursor-pointer relative overflow-hidden"
              style={{
                background: 'var(--card)',
                border: `1px solid ${live ? `${color}30` : 'var(--border)'}`,
                opacity: live ? 1 : 0.7,
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>{label}</p>
                <p className="text-[11px] truncate" style={{ color: 'var(--text3)' }}>{sub}</p>
              </div>
              {live ? (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                  LIVE
                </span>
              ) : (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)' }}>
                  SOON
                </span>
              )}
            </motion.a>
          ))}
        </div>
      </div>

      {/* ── ROADMAP ──────────────────────────────────────── */}
      <div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-5">
          <h2 className="text-[18px] font-black" style={{ color: 'var(--text)' }}>Roadmap</h2>
          <p className="text-[12px] mt-1" style={{ color: 'var(--text3)' }}>What we've shipped and what's coming next</p>
        </motion.div>
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {ROADMAP.map(({ quarter, label, done }, i) => (
            <motion.div key={quarter} custom={i} variants={fadeUp} initial="hidden"
              animate={mounted ? 'show' : 'hidden'}
              className="flex items-center gap-4 px-6 py-4"
              style={{ borderBottom: i < ROADMAP.length - 1 ? '1px solid var(--border2)' : 'none' }}>
              <div className="shrink-0">
                {done
                  ? <CheckCircle2 size={18} style={{ color: YGL_GREEN }} />
                  : <Circle size={18} style={{ color: 'var(--text3)' }} />}
              </div>
              <p className="text-[13px] font-semibold flex-1" style={{ color: done ? 'var(--text)' : 'var(--text2)' }}>
                {label}
              </p>
              <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{
                  background: done ? 'rgba(34,197,94,0.1)' : 'var(--bg3)',
                  color: done ? YGL_GREEN : 'var(--text3)',
                  border: `1px solid ${done ? 'rgba(34,197,94,0.25)' : 'var(--border)'}`,
                }}>
                {quarter}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── FOOTER FOUNDER CARD ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #050C18 0%, #0A1628 100%)',
          border: '1px solid rgba(34,197,94,0.15)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6">
          {/* Mini founder image */}
          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-full opacity-40 blur-md"
              style={{ background: 'radial-gradient(circle, #22C55E, transparent)' }} />
            <div className="relative w-16 h-16 rounded-full overflow-hidden"
              style={{ border: '2px solid rgba(34,197,94,0.4)' }}>
              <Image src="/images/ygl-founder.png" alt="Yash Sharma" fill className="object-cover" sizes="64px" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: YGL_GREEN }}>
              Built with ♥ by
            </p>
            <h3 className="text-[16px] font-black text-white">Yash Sharma · Yash Growth Labs</h3>
            <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Ideas · Systems · Growth
            </p>
          </div>

          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 6px 24px rgba(10,102,194,0.5)' }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold shrink-0"
              style={{ background: '#0A66C2', color: '#fff' }}>
              <LinkedinIcon size={13} /> Connect on LinkedIn
            </motion.button>
          </a>
        </div>

        <div className="px-6 pb-4 text-center sm:text-left">
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © 2026 Yash Growth Labs · UseYari is a paper trading simulator for educational purposes only.
          </p>
        </div>
      </motion.div>

    </div>
  );
}
