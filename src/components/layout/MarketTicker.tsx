'use client';
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { STOCKS } from '@/lib/data';
import { useTrading } from '@/lib/trading';

export default function MarketTicker() {
  const { livePrices } = useTrading();
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate items for seamless loop
  const items = [...STOCKS, ...STOCKS];

  return (
    <div className="overflow-hidden h-8 flex items-center shrink-0 border-b"
      style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <div
        ref={trackRef}
        className="flex items-center gap-0 ticker-track"
        style={{ animation: 'ticker-scroll 60s linear infinite', whiteSpace: 'nowrap', willChange: 'transform' }}
      >
        {items.map((s, i) => {
          const live = livePrices[s.symbol] ?? s.price;
          const up = live >= s.price;
          return (
            <button
              key={`${s.symbol}-${i}`}
              onClick={() => router.push(`/stocks/${s.symbol}`)}
              className="inline-flex items-center gap-2 px-4 h-8 transition-colors hover:bg-white/5 shrink-0"
            >
              <span className="text-[11px] font-bold" style={{ color: 'var(--text)' }}>{s.symbol}</span>
              <span className="text-[11px] font-mono" style={{ color: up ? 'var(--green)' : 'var(--red)' }}>
                ₹{live.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] font-semibold" style={{ color: up ? 'var(--green)' : 'var(--red)' }}>
                {up ? '▲' : '▼'}{Math.abs(((live - s.price) / s.price) * 100).toFixed(2)}%
              </span>
              <span className="text-[10px]" style={{ color: 'var(--border)' }}>·</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
