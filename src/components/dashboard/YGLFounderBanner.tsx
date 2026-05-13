'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const LinkedinIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const LINKEDIN_URL = 'https://www.linkedin.com/company/113128021/';

export default function YGLFounderBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl overflow-hidden flex flex-col sm:flex-row items-center gap-5 p-5"
      style={{
        background: 'linear-gradient(135deg, #050C18 0%, #0A1628 70%, #060F1E 100%)',
        border: '1px solid rgba(34,197,94,0.18)',
        boxShadow: '0 4px 30px rgba(34,197,94,0.05)',
      }}
    >
      {/* Founder image */}
      <div className="relative shrink-0">
        <div className="absolute -inset-1.5 rounded-full blur-lg opacity-40"
          style={{ background: 'radial-gradient(circle, #22C55E, transparent 70%)' }} />
        <div className="relative w-12 h-12 rounded-full overflow-hidden"
          style={{ border: '2px solid rgba(34,197,94,0.4)', boxShadow: '0 0 14px rgba(34,197,94,0.2)' }}>
          <Image
            src="/images/ygl-founder.png"
            alt="Yash Sharma — Yash Growth Labs"
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 text-center sm:text-left min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-0.5" style={{ color: '#22C55E' }}>
          Built by Yash Growth Labs
        </p>
        <p className="text-[12px] font-semibold text-white leading-snug">
          UseYari — AI · Finance · Automation · Growth
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Ideas · Systems · Growth
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: '0 4px 18px rgba(10,102,194,0.5)' }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold"
            style={{ background: '#0A66C2', color: '#fff' }}>
            <LinkedinIcon size={12} /> LinkedIn
          </motion.button>
        </a>
        <Link href="/about-ygl">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold"
            style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}>
            Our Story <ArrowRight size={11} />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
