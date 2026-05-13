'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Layers, Trophy, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Stock, fmt } from '@/lib/data';

type SectorData = { sector: string; change: number; stocks: number };

function seedRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function generateSectorHistory(sectorName: string, days = 90) {
  const seed = sectorName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = seedRandom(seed);
  let value = 10000 + seed * 7;
  const data = [];
  const now = new Date('2026-05-13');
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    value += (rng() - 0.46) * value * 0.009;
    data.push({ date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), value: +value.toFixed(2) });
  }
  return data;
}

const SECTOR_COLORS: Record<string, string> = {
  IT: '#60A5FA', Banking: '#4ADE80', Energy: '#F59E0B', FMCG: '#A78BFA',
  Pharma: '#F472B6', Auto: '#34D399', Infrastructure: '#FCD34D',
  Metals: '#94A3B8', Cement: '#FDBA74', Utilities: '#67E8F9',
  Consumer: '#C4B5FD', Telecom: '#86EFAC', NBFC: '#FCA5A5',
  Insurance: '#6EE7B7', 'Real Estate': '#FDE68A', Defence: '#93C5FD',
};

export default function SectorDetailClient({
  sectorName, slug, stocks, sectorData,
}: {
  sectorName: string;
  slug: string;
  stocks: Stock[];
  sectorData: SectorData;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState<'1M' | '3M' | '6M'>('3M');
  const [sortBy, setSortBy] = useState<'changePercent' | 'marketCapCr' | 'pe'>('changePercent');

  useEffect(() => { setMounted(true); }, []);

  const up = sectorData.change >= 0;
  const accentColor = SECTOR_COLORS[sectorName] ?? 'var(--accent)';
  const dayMap = { '1M': 30, '3M': 90, '6M': 180 };
  const histData = generateSectorHistory(sectorName, dayMap[period]);

  const sorted = [...stocks].sort((a, b) => {
    if (sortBy === 'changePercent') return b.changePercent - a.changePercent;
    if (sortBy === 'marketCapCr') return b.marketCapCr - a.marketCapCr;
    return a.pe - b.pe;
  });

  const best = stocks.length ? [...stocks].sort((a, b) => b.changePercent - a.changePercent)[0] : null;
  const worst = stocks.length ? [...stocks].sort((a, b) => a.changePercent - b.changePercent)[0] : null;
  const avgPE = stocks.length ? stocks.reduce((s, x) => s + x.pe, 0) / stocks.length : 0;
  const totalMCap = stocks.reduce((s, x) => s + x.marketCapCr, 0);

  return (
    <div className="p-5 space-y-5" style={{ background: 'var(--bg)' }}>
      {/* Back */}
      <button onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[12px] transition-all hover:gap-2.5"
        style={{ color: 'var(--text3)' }}>
        <ArrowLeft size={14} /> Back
      </button>

      {/* Hero */}
      <div className="rounded-2xl p-6" style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        boxShadow: up ? 'var(--glow-green)' : 'var(--glow-red)',
      }}>
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: `${accentColor}22`, border: `2px solid ${accentColor}` }}>
                <Layers size={22} style={{ color: accentColor }} />
              </div>
              <div>
                <h1 className="text-[26px] font-black" style={{ color: 'var(--text)' }}>{sectorName}</h1>
                <p className="text-[12px]" style={{ color: 'var(--text3)' }}>{stocks.length} stocks · NSE/BSE</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[32px] font-black tabular-nums"
                style={{ color: up ? 'var(--green)' : 'var(--red)' }}>
                {up ? '+' : ''}{sectorData.change.toFixed(2)}%
              </span>
              <span className="flex items-center gap-1 text-[14px] font-bold px-3 py-1.5 rounded-xl"
                style={{ color: up ? 'var(--green)' : 'var(--red)', background: up ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)' }}>
                {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                Today
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Stocks', value: stocks.length.toString(), color: 'var(--text)' },
              { label: 'Avg P/E', value: avgPE.toFixed(1) + 'x', color: 'var(--accent)' },
              { label: 'Total MCap', value: `₹${(totalMCap / 100000).toFixed(1)}L Cr`, color: 'var(--text)' },
              { label: 'Sector Chg', value: `${up ? '+' : ''}${sectorData.change.toFixed(2)}%`, color: up ? 'var(--green)' : 'var(--red)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text3)' }}>{label}</p>
                <p className="text-[14px] font-black mt-0.5" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best/Worst */}
      {best && worst && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: 'var(--card)', border: '1px solid rgba(22,163,74,0.3)', boxShadow: 'var(--glow-green)' }}>
            <Trophy size={20} style={{ color: 'var(--green)' }} />
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text3)' }}>Top Performer</p>
              <p className="text-[15px] font-black" style={{ color: 'var(--text)' }}>{best.name}</p>
              <p className="text-[12px] font-bold" style={{ color: 'var(--green)' }}>+{best.changePercent.toFixed(2)}% · ₹{fmt(best.price)}</p>
            </div>
            <button onClick={() => router.push(`/stocks/${best.symbol}`)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:scale-105"
              style={{ background: 'rgba(22,163,74,0.1)', color: 'var(--green)' }}>
              View
            </button>
          </div>
          <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: 'var(--card)', border: '1px solid rgba(220,38,38,0.3)', boxShadow: 'var(--glow-red)' }}>
            <AlertTriangle size={20} style={{ color: 'var(--red)' }} />
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text3)' }}>Worst Performer</p>
              <p className="text-[15px] font-black" style={{ color: 'var(--text)' }}>{worst.name}</p>
              <p className="text-[12px] font-bold" style={{ color: 'var(--red)' }}>{worst.changePercent.toFixed(2)}% · ₹{fmt(worst.price)}</p>
            </div>
            <button onClick={() => router.push(`/stocks/${worst.symbol}`)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:scale-105"
              style={{ background: 'rgba(220,38,38,0.1)', color: 'var(--red)' }}>
              View
            </button>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>{sectorName} Sector Index</h3>
          <div className="flex gap-1 rounded-lg p-0.5" style={{ background: 'var(--bg3)' }}>
            {(['1M', '3M', '6M'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all"
                style={{ background: period === p ? 'var(--card)' : 'transparent', color: period === p ? 'var(--accent)' : 'var(--text3)' }}>
                {p}
              </button>
            ))}
          </div>
        </div>
        {mounted && (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={histData}>
              <defs>
                <linearGradient id="secGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accentColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} axisLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(1)}K`} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}
                formatter={(v) => [Number(v).toFixed(2), `${sectorName} Index`]} />
              <Area type="monotone" dataKey="value" stroke={accentColor} strokeWidth={2.5} fill="url(#secGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Stocks Table */}
      {stocks.length > 0 ? (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3.5 flex items-center gap-3 flex-wrap" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>{sectorName} Stocks</h3>
            <div className="ml-auto flex gap-1 rounded-lg p-0.5" style={{ background: 'var(--bg3)' }}>
              {[['changePercent', 'Return'], ['marketCapCr', 'Mkt Cap'], ['pe', 'P/E']].map(([key, label]) => (
                <button key={key} onClick={() => setSortBy(key as typeof sortBy)}
                  className="px-2.5 py-1 rounded-md text-[10px] font-bold transition-all"
                  style={{ background: sortBy === key ? 'var(--card)' : 'transparent', color: sortBy === key ? 'var(--accent)' : 'var(--text3)' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ background: 'var(--bg3)' }}>
                  {['Stock', 'Price', 'Change', 'Mkt Cap', 'P/E', 'ROE', 'Beta'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider" style={{ color: 'var(--text3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((s, i) => {
                  const up = s.changePercent >= 0;
                  return (
                    <motion.tr key={s.symbol}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => router.push(`/stocks/${s.symbol}`)}
                      className="cursor-pointer transition-colors"
                      style={{ borderBottom: '1px solid var(--border2)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0"
                            style={{ background: `linear-gradient(135deg, ${accentColor}, #8B5CF6)` }}>
                            {s.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold" style={{ color: 'var(--text)' }}>{s.symbol}</p>
                            <p className="text-[10px] truncate max-w-[120px]" style={{ color: 'var(--text3)' }}>{s.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold tabular-nums" style={{ color: 'var(--text)' }}>₹{fmt(s.price)}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-[11px] flex items-center gap-0.5" style={{ color: up ? 'var(--green)' : 'var(--red)' }}>
                          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {up ? '+' : ''}{s.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--text2)' }}>{s.marketCap}</td>
                      <td className="px-4 py-3" style={{ color: s.pe < 25 ? 'var(--green)' : s.pe > 50 ? 'var(--red)' : 'var(--text2)' }}>{s.pe.toFixed(1)}x</td>
                      <td className="px-4 py-3" style={{ color: s.roe > 15 ? 'var(--green)' : 'var(--text2)' }}>{s.roe.toFixed(1)}%</td>
                      <td className="px-4 py-3" style={{ color: 'var(--text2)' }}>{s.beta.toFixed(2)}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <Layers size={32} className="mx-auto mb-3" style={{ color: 'var(--text3)' }} />
          <p className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>No stocks tracked yet</p>
          <p className="text-[12px] mt-1" style={{ color: 'var(--text3)' }}>Stocks in the {sectorName} sector will appear here.</p>
        </div>
      )}

      {/* AI Sector Rotation */}
      <div className="rounded-2xl p-5" style={{
        background: 'linear-gradient(135deg, rgba(56,126,209,0.08), rgba(139,92,246,0.08))',
        border: '1px solid var(--accent)',
      }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black text-white"
            style={{ background: 'linear-gradient(135deg, #387ED1, #8B5CF6)' }}>AI</span>
          <h4 className="text-[13px] font-black" style={{ color: 'var(--text)' }}>Sector Rotation Insight</h4>
        </div>
        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text2)' }}>
          The <strong>{sectorName}</strong> sector is{' '}
          <strong style={{ color: up ? 'var(--green)' : 'var(--red)' }}>
            {up ? 'outperforming' : 'underperforming'} today ({up ? '+' : ''}{sectorData.change.toFixed(2)}%)
          </strong>.{' '}
          {sectorName === 'IT'
            ? 'IT sector driven by global tech sentiment and USD/INR tailwinds. Strong order book visibility for FY27 is a positive.'
            : sectorName === 'Banking'
              ? 'Banking sector showing strength on improving NIM outlook and declining NPAs. RBI policy trajectory key to watch.'
              : sectorName === 'Pharma'
                ? 'Pharma benefiting from USFDA approvals and domestic volume growth. Generic exports to US remain a key driver.'
                : sectorName === 'Auto'
                  ? 'Auto sector driven by strong two-wheeler rural demand and premium four-wheeler mix. EV transition pace critical.'
                  : sectorName === 'FMCG'
                    ? 'FMCG showing resilience with urban premiumisation trend. Rural recovery and commodity tailwinds bode well.'
                    : `${sectorName} sector tracking broader market trends. Watch key earnings for direction.`
          }
        </p>
      </div>
    </div>
  );
}
