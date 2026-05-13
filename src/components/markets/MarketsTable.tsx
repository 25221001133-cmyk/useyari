'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Search, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { STOCKS, type Stock } from '@/lib/data';
import { useTrading } from '@/lib/trading';
import MiniSparkline from '@/components/charts/MiniSparkline';

type SortKey = keyof Pick<Stock, 'symbol' | 'price' | 'changePercent' | 'volume' | 'marketCapCr' | 'pe'>;

const SECTORS = ['All', ...Array.from(new Set(STOCKS.map(s => s.sector))).sort()];

export default function MarketsTable() {
  const [q, setQ] = useState('');
  const [sector, setSector] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('changePercent');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const router = useRouter();
  const { livePrices } = useTrading();

  const filtered = STOCKS
    .filter(s => sector === 'All' || s.sector === sector)
    .filter(s => s.symbol.includes(q.toUpperCase()) || s.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const Sorter = ({ k }: { k: SortKey }) => sortKey === k
    ? sortDir === 'desc' ? <ChevronDown size={11} style={{ color: 'var(--accent)' }} /> : <ChevronUp size={11} style={{ color: 'var(--accent)' }} />
    : <ChevronDown size={11} style={{ color: 'var(--text3)' }} />;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
          <Search size={12} style={{ color: 'var(--text3)' }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search stocks…"
            className="bg-transparent outline-none text-[12px] w-44"
            style={{ color: 'var(--text)' }} />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {SECTORS.map(s => (
            <button key={s} onClick={() => setSector(s)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
              style={{
                background: sector === s ? 'var(--accent)' : 'var(--bg3)',
                color: sector === s ? '#fff' : 'var(--text3)',
              }}>
              {s}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[11px]" style={{ color: 'var(--text3)' }}>{filtered.length} stocks</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
              {[
                ['#', null], ['Stock', 'symbol'], ['Price', 'price'], ['Change', 'changePercent'],
                ['Volume', 'volume'], ['Mkt Cap', 'marketCapCr'], ['P/E', 'pe'], ['52W Range', null], ['Chart', null]
              ].map(([label, key]) => (
                <th key={label as string}
                  onClick={() => key && toggleSort(key as SortKey)}
                  className={`px-4 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider whitespace-nowrap ${key ? 'cursor-pointer select-none' : ''}`}
                  style={{ color: 'var(--text3)' }}>
                  <span className="flex items-center gap-1">{label}{key && <Sorter k={key as SortKey} />}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const livePrice = livePrices[s.symbol] ?? s.price;
              const liveChange = livePrice - s.price;
              const liveChangePct = (liveChange / s.price) * 100;
              const up = liveChangePct >= 0;
              const range52w = s.high52w - s.low52w;
              const pos = ((livePrice - s.low52w) / range52w) * 100;
              const sparkData = [s.price * 0.93, s.price * 0.96, s.price * 0.94, s.price * 0.97, s.price * 0.99, s.price * 0.98, livePrice];
              return (
                <motion.tr
                  key={s.symbol}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => router.push(`/stocks/${s.symbol}`)}
                  className="transition-colors cursor-pointer group"
                  style={{ borderBottom: '1px solid var(--border2)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--text3)' }}>{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${up ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.15)'}, rgba(139,92,246,0.15))` }}>
                        <span className="text-[9px] font-black" style={{ color: 'var(--accent)' }}>{s.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-bold flex items-center gap-1" style={{ color: 'var(--text)' }}>
                          {s.symbol}
                          <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }} />
                        </p>
                        <p className="text-[10px] truncate max-w-[120px]" style={{ color: 'var(--text3)' }}>{s.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold tabular-nums" style={{ color: 'var(--text)' }}>
                    ₹{livePrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-full w-fit"
                      style={{
                        background: up ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
                        color: up ? 'var(--green)' : 'var(--red)',
                      }}>
                      {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {up ? '+' : ''}{liveChangePct.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--text2)' }}>{(s.volume / 1e5).toFixed(1)}L</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text2)' }}>{s.marketCap}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text2)' }}>{s.pe.toFixed(1)}x</td>
                  <td className="px-4 py-3 min-w-[130px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px]" style={{ color: 'var(--text3)' }}>₹{(s.low52w / 1000).toFixed(1)}k</span>
                      <div className="flex-1 relative h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
                        <div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #DC2626, #F59E0B, #16A34A)', width: '100%' }} />
                      </div>
                      <div className="relative w-16 h-1.5">
                        <div className="absolute inset-0 rounded-full" style={{ background: 'var(--bg3)' }} />
                        <div className="absolute h-2.5 w-2.5 -top-0.5 rounded-full border-2 border-white shadow-sm"
                          style={{ left: `calc(${Math.min(Math.max(pos, 5), 95)}% - 5px)`, background: 'var(--accent)' }} />
                      </div>
                      <span className="text-[9px]" style={{ color: 'var(--text3)' }}>₹{(s.high52w / 1000).toFixed(1)}k</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-[70px] h-[32px]">
                      <MiniSparkline data={sparkData} up={up} />
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
