'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, TrendingUp, TrendingDown, Activity, Zap, BarChart2,
  ChevronDown, Info, AlertCircle, RefreshCw,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { STOCKS } from '@/lib/data';

// ── Types ───────────────────────────────────────────────────────────────────

type OptionRow = {
  strike: number;
  ce_oi: number; ce_chgOI: number; ce_vol: number; ce_iv: number; ce_ltp: number; ce_delta: number; ce_theta: number; ce_vega: number;
  pe_oi: number; pe_chgOI: number; pe_vol: number; pe_iv: number; pe_ltp: number; pe_delta: number; pe_theta: number; pe_vega: number;
  isATM: boolean; isITM_CE: boolean; isITM_PE: boolean;
};

type StrategyLeg = { type: 'CE' | 'PE'; strike: number; qty: number; action: 'BUY' | 'SELL'; ltp: number };

type Strategy = { name: string; legs: Omit<StrategyLeg, 'ltp'>[] };

// ── Data generation ──────────────────────────────────────────────────────────

function seeded(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

const EXPIRIES = ['29 May 2026', '26 Jun 2026', '31 Jul 2026'];

function generateOptionChain(spot: number, seedBase: number): OptionRow[] {
  const rng = seeded(seedBase);
  const step = spot < 5000 ? 50 : spot < 20000 ? 100 : 50;
  const atm = Math.round(spot / step) * step;
  const strikes: number[] = [];
  for (let k = atm - step * 14; k <= atm + step * 14; k += step) strikes.push(k);

  return strikes.map(strike => {
    const moneyness = (strike - spot) / spot;
    const baseIV = 0.18 + 0.4 * moneyness * moneyness;
    const ceIV = Math.max(0.1, baseIV + (rng() - 0.5) * 0.02);
    const peIV = Math.max(0.1, baseIV + (rng() - 0.5) * 0.02);
    const T = 16 / 365;

    const intrinsicCE = Math.max(0, spot - strike);
    const intrinsicPE = Math.max(0, strike - spot);
    const tvCE = spot * ceIV * Math.sqrt(T) * 0.4 * (1 + rng() * 0.1);
    const tvPE = spot * peIV * Math.sqrt(T) * 0.4 * (1 + rng() * 0.1);

    const ceLtp = Math.max(0.05, intrinsicCE + tvCE);
    const peLtp = Math.max(0.05, intrinsicPE + tvPE);

    const distPct = Math.abs(moneyness) * 100;
    const oimult = Math.exp(-distPct * 0.15);
    const ceOI = Math.floor((200000 + rng() * 800000) * oimult);
    const peOI = Math.floor((200000 + rng() * 800000) * oimult);

    const ceDelta = Math.max(0.01, Math.min(0.99, 0.5 - moneyness * 4 + (rng() - 0.5) * 0.05));
    const peDelta = -(1 - ceDelta);

    return {
      strike,
      ce_oi: ceOI, ce_chgOI: Math.floor((rng() - 0.4) * ceOI * 0.15), ce_vol: Math.floor(ceOI * 0.08 * rng()),
      ce_iv: +(ceIV * 100).toFixed(1), ce_ltp: +ceLtp.toFixed(2), ce_delta: +ceDelta.toFixed(2),
      ce_theta: +(-ceLtp * 0.05 * (rng() + 0.5)).toFixed(2), ce_vega: +(spot * ceIV * Math.sqrt(T) * 0.01).toFixed(2),
      pe_oi: peOI, pe_chgOI: Math.floor((rng() - 0.4) * peOI * 0.15), pe_vol: Math.floor(peOI * 0.08 * rng()),
      pe_iv: +(peIV * 100).toFixed(1), pe_ltp: +peLtp.toFixed(2), pe_delta: +peDelta.toFixed(2),
      pe_theta: +(-peLtp * 0.05 * (rng() + 0.5)).toFixed(2), pe_vega: +(spot * peIV * Math.sqrt(T) * 0.01).toFixed(2),
      isATM: strike === atm,
      isITM_CE: strike < spot,
      isITM_PE: strike > spot,
    };
  });
}

// ── Payoff calculation ────────────────────────────────────────────────────────

function calcPayoff(legs: StrategyLeg[], spot: number) {
  const range = spot * 0.12;
  const points: { spot: number; pnl: number }[] = [];
  for (let s = spot - range; s <= spot + range; s += range / 40) {
    let pnl = 0;
    for (const leg of legs) {
      const mult = leg.action === 'BUY' ? 1 : -1;
      const lotSize = 50;
      if (leg.type === 'CE') {
        pnl += mult * Math.max(0, s - leg.strike) * leg.qty * lotSize - (leg.action === 'BUY' ? 1 : -1) * leg.ltp * leg.qty * lotSize;
      } else {
        pnl += mult * Math.max(0, leg.strike - s) * leg.qty * lotSize - (leg.action === 'BUY' ? 1 : -1) * leg.ltp * leg.qty * lotSize;
      }
    }
    points.push({ spot: +s.toFixed(0), pnl: +pnl.toFixed(0) });
  }
  return points;
}

// ── Pre-built strategies ──────────────────────────────────────────────────────

const STRATEGIES: Strategy[] = [
  { name: 'Long Straddle', legs: [{ type: 'CE', strike: 0, qty: 1, action: 'BUY' }, { type: 'PE', strike: 0, qty: 1, action: 'BUY' }] },
  { name: 'Short Straddle', legs: [{ type: 'CE', strike: 0, qty: 1, action: 'SELL' }, { type: 'PE', strike: 0, qty: 1, action: 'SELL' }] },
  { name: 'Bull Call Spread', legs: [{ type: 'CE', strike: 0, qty: 1, action: 'BUY' }, { type: 'CE', strike: 1, qty: 1, action: 'SELL' }] },
  { name: 'Bear Put Spread', legs: [{ type: 'PE', strike: 0, qty: 1, action: 'SELL' }, { type: 'PE', strike: 1, qty: 1, action: 'BUY' }] },
  { name: 'Iron Condor', legs: [{ type: 'PE', strike: -2, qty: 1, action: 'BUY' }, { type: 'PE', strike: -1, qty: 1, action: 'SELL' }, { type: 'CE', strike: 1, qty: 1, action: 'SELL' }, { type: 'CE', strike: 2, qty: 1, action: 'BUY' }] },
  { name: 'Covered Call', legs: [{ type: 'CE', strike: 1, qty: 1, action: 'SELL' }] },
];

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtOI(n: number) { return n >= 1e5 ? `${(n / 1e5).toFixed(1)}L` : `${(n / 1000).toFixed(0)}K`; }
function fmtN(n: number) { return n.toLocaleString('en-IN', { maximumFractionDigits: 2 }); }

// ── Underlying selector data ──────────────────────────────────────────────────

const UNDERLYINGS = [
  { label: 'NIFTY 50', spot: 24856, lotSize: 50, seed: 42 },
  { label: 'BANKNIFTY', spot: 52345, lotSize: 15, seed: 77 },
  { label: 'FINNIFTY', spot: 23456, lotSize: 40, seed: 93 },
  ...STOCKS.filter(s => ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'BAJFINANCE', 'AXISBANK', 'MARUTI'].includes(s.symbol))
    .map((s, i) => ({ label: s.symbol, spot: s.price, lotSize: 250, seed: 100 + i })),
];

// ── Main Component ────────────────────────────────────────────────────────────

export default function OptionsPage() {
  const [mounted, setMounted] = useState(false);
  const [underlying, setUnderlying] = useState(UNDERLYINGS[0]);
  const [expiry, setExpiry] = useState(EXPIRIES[0]);
  const [tab, setTab] = useState<'chain' | 'strategy' | 'oi'>('chain');
  const [strategyIdx, setStrategyIdx] = useState(0);
  const [showUnderlying, setShowUnderlying] = useState(false);
  const [customLegs, setCustomLegs] = useState<StrategyLeg[]>([]);

  useEffect(() => { setMounted(true); }, []);

  const chain = useMemo(() => generateOptionChain(underlying.spot, underlying.seed), [underlying]);
  const atm = chain.find(r => r.isATM)!;

  // PCR
  const totalCEOI = chain.reduce((s, r) => s + r.ce_oi, 0);
  const totalPEOI = chain.reduce((s, r) => s + r.pe_oi, 0);
  const pcr = totalPEOI / totalCEOI;

  // Max Pain
  const maxPain = chain.reduce((best, row) => {
    const pain = chain.reduce((s, r) => {
      const cePain = Math.max(0, row.strike - r.strike) * r.ce_oi;
      const pePain = Math.max(0, r.strike - row.strike) * r.pe_oi;
      return s + cePain + pePain;
    }, 0);
    return pain < best.pain ? { strike: row.strike, pain } : best;
  }, { strike: 0, pain: Infinity }).strike;

  // Build payoff for strategy
  const step = underlying.spot < 5000 ? 50 : underlying.spot < 20000 ? 100 : 50;
  const atmStrike = Math.round(underlying.spot / step) * step;
  const strat = STRATEGIES[strategyIdx];

  const builtLegs: StrategyLeg[] = strat.legs.map(leg => {
    const strikeOffset = typeof leg.strike === 'number' ? leg.strike : 0;
    const targetStrike = atmStrike + strikeOffset * step;
    const row = chain.reduce((best, r) => Math.abs(r.strike - targetStrike) < Math.abs(best.strike - targetStrike) ? r : best, chain[0]);
    return { ...leg, strike: row.strike, ltp: leg.type === 'CE' ? row.ce_ltp : row.pe_ltp };
  });

  const payoffData = calcPayoff(builtLegs, underlying.spot);
  const maxProfit = Math.max(...payoffData.map(p => p.pnl));
  const maxLoss = Math.min(...payoffData.map(p => p.pnl));

  // OI data for charts
  const oiData = chain.slice(3, -3).map(r => ({
    strike: r.strike,
    CE_OI: Math.floor(r.ce_oi / 1000),
    PE_OI: Math.floor(r.pe_oi / 1000),
  }));

  const summaryStats = [
    { label: 'Spot', value: `₹${fmtN(underlying.spot)}`, color: 'var(--text)' },
    { label: 'ATM Strike', value: atmStrike.toString(), color: 'var(--accent)' },
    { label: 'PCR', value: pcr.toFixed(2), color: pcr > 1.2 ? 'var(--green)' : pcr < 0.8 ? 'var(--red)' : 'var(--text)' },
    { label: 'Max Pain', value: maxPain.toString(), color: '#F59E0B' },
    { label: 'India VIX', value: '13.45', color: 'var(--green)' },
    { label: 'IV Percentile', value: '42%', color: 'var(--text2)' },
  ];

  return (
    <div className="p-5 space-y-5" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(56,126,209,0.2), rgba(139,92,246,0.2))', border: '1px solid var(--accent)' }}>
            <Target size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="text-[20px] font-black" style={{ color: 'var(--text)' }}>Options / F&O</h1>
            <p className="text-[12px]" style={{ color: 'var(--text3)' }}>Option chain · Greeks · Strategy builder</p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {/* Underlying selector */}
          <div className="relative">
            <button onClick={() => setShowUnderlying(v => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-bold transition-all"
              style={{ background: 'var(--card)', border: `1px solid ${showUnderlying ? 'var(--accent)' : 'var(--border)'}`, color: 'var(--text)' }}>
              {underlying.label}
              <ChevronDown size={14} style={{ color: 'var(--text3)' }} />
            </button>
            <AnimatePresence>
              {showUnderlying && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 mt-1 rounded-xl z-50 w-52 overflow-hidden shadow-2xl"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  {UNDERLYINGS.map(u => (
                    <button key={u.label} onClick={() => { setUnderlying(u); setShowUnderlying(false); }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-left text-[12px] transition-colors"
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                      onMouseLeave={e => (e.currentTarget.style.background = '')}>
                      <span className="font-bold" style={{ color: 'var(--text)' }}>{u.label}</span>
                      <span className="font-semibold" style={{ color: 'var(--text3)' }}>₹{fmtN(u.spot)}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Expiry selector */}
          <div className="flex gap-1 rounded-xl p-1" style={{ background: 'var(--bg3)' }}>
            {EXPIRIES.map(e => (
              <button key={e} onClick={() => setExpiry(e)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
                style={{ background: expiry === e ? 'var(--card)' : 'transparent', color: expiry === e ? 'var(--accent)' : 'var(--text3)', boxShadow: expiry === e ? 'var(--shadow)' : 'none' }}>
                {e.split(' ')[0]} {e.split(' ')[1]}
              </button>
            ))}
          </div>

          <button className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:scale-110"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text3)' }}>
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Summary stats bar */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {summaryStats.map(({ label, value, color }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-3 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text3)' }}>{label}</p>
            <p className="text-[15px] font-black tabular-nums" style={{ color }}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 rounded-xl overflow-hidden p-1" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
        {[
          { id: 'chain', label: 'Option Chain', icon: Activity },
          { id: 'strategy', label: 'Strategy Builder', icon: Zap },
          { id: 'oi', label: 'OI Analysis', icon: BarChart2 },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id as typeof tab)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all flex-1 justify-center"
            style={{ background: tab === id ? 'var(--card)' : 'transparent', color: tab === id ? 'var(--accent)' : 'var(--text3)', boxShadow: tab === id ? 'var(--shadow)' : 'none' }}>
            <Icon size={13} /><span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* OPTION CHAIN TAB */}
      {tab === 'chain' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {/* Legend */}
          <div className="flex items-center gap-4 px-4 py-3 text-[10px] font-semibold flex-wrap" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: 'rgba(22,163,74,0.15)' }} /> ITM Call</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: 'rgba(220,38,38,0.15)' }} /> ITM Put</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border-2" style={{ borderColor: 'var(--accent)', background: 'rgba(56,126,209,0.08)' }} /> ATM</span>
            <span className="ml-auto flex items-center gap-1.5" style={{ color: 'var(--text3)' }}>
              <Info size={11} /> Expiry: {expiry} · Lot: {underlying.lotSize}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border-collapse">
              <thead>
                <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
                  <th colSpan={6} className="py-2.5 text-center font-bold text-[11px]" style={{ color: 'var(--green)', borderRight: '2px solid var(--border)' }}>CALLS (CE)</th>
                  <th className="py-2.5 px-3 text-center font-black text-[13px]" style={{ color: 'var(--accent)', minWidth: 90 }}>STRIKE</th>
                  <th colSpan={6} className="py-2.5 text-center font-bold text-[11px]" style={{ color: 'var(--red)', borderLeft: '2px solid var(--border)' }}>PUTS (PE)</th>
                </tr>
                <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
                  {['OI', 'Chg OI', 'Vol', 'IV%', 'Delta', 'LTP'].map(h => (
                    <th key={`ce-${h}`} className="px-2 py-1.5 text-right font-bold text-[9px] uppercase tracking-wider" style={{ color: 'var(--text3)' }}>{h}</th>
                  ))}
                  <th />
                  {['LTP', 'Delta', 'IV%', 'Vol', 'Chg OI', 'OI'].map(h => (
                    <th key={`pe-${h}`} className="px-2 py-1.5 text-left font-bold text-[9px] uppercase tracking-wider" style={{ color: 'var(--text3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chain.map((row) => (
                  <tr key={row.strike}
                    style={{
                      background: row.isATM
                        ? 'rgba(56,126,209,0.08)'
                        : row.isITM_CE
                          ? 'rgba(22,163,74,0.06)'
                          : row.isITM_PE
                            ? 'rgba(220,38,38,0.06)'
                            : 'transparent',
                      borderBottom: '1px solid var(--border2)',
                      borderLeft: row.isATM ? '2px solid var(--accent)' : 'none',
                      borderRight: row.isATM ? '2px solid var(--accent)' : 'none',
                    }}>
                    {/* CE side */}
                    <td className="px-2 py-2 text-right font-medium" style={{ color: 'var(--text3)', borderRight: '1px solid var(--border2)' }}>{fmtOI(row.ce_oi)}</td>
                    <td className="px-2 py-2 text-right font-medium" style={{ color: row.ce_chgOI >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {row.ce_chgOI >= 0 ? '+' : ''}{fmtOI(Math.abs(row.ce_chgOI))}
                    </td>
                    <td className="px-2 py-2 text-right" style={{ color: 'var(--text3)' }}>{fmtOI(row.ce_vol)}</td>
                    <td className="px-2 py-2 text-right font-semibold" style={{ color: 'var(--accent2)' }}>{row.ce_iv}%</td>
                    <td className="px-2 py-2 text-right font-semibold" style={{ color: 'var(--text2)' }}>{row.ce_delta.toFixed(2)}</td>
                    <td className="px-2 py-2 text-right font-black" style={{ color: 'var(--green)', borderRight: '2px solid var(--border)' }}>₹{row.ce_ltp.toFixed(1)}</td>

                    {/* Strike */}
                    <td className="px-3 py-2 text-center font-black text-[12px]"
                      style={{ color: row.isATM ? 'var(--accent)' : 'var(--text)', background: row.isATM ? 'rgba(56,126,209,0.12)' : 'var(--bg3)' }}>
                      {row.strike}
                      {row.isATM && <span className="block text-[8px] font-bold" style={{ color: 'var(--accent)' }}>ATM</span>}
                    </td>

                    {/* PE side */}
                    <td className="px-2 py-2 text-left font-black" style={{ color: 'var(--red)', borderLeft: '2px solid var(--border)' }}>₹{row.pe_ltp.toFixed(1)}</td>
                    <td className="px-2 py-2 text-left font-semibold" style={{ color: 'var(--text2)' }}>{row.pe_delta.toFixed(2)}</td>
                    <td className="px-2 py-2 text-left font-semibold" style={{ color: 'var(--accent2)' }}>{row.pe_iv}%</td>
                    <td className="px-2 py-2 text-left" style={{ color: 'var(--text3)' }}>{fmtOI(row.pe_vol)}</td>
                    <td className="px-2 py-2 text-left font-medium" style={{ color: row.pe_chgOI >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {row.pe_chgOI >= 0 ? '+' : ''}{fmtOI(Math.abs(row.pe_chgOI))}
                    </td>
                    <td className="px-2 py-2 text-left font-medium" style={{ color: 'var(--text3)' }}>{fmtOI(row.pe_oi)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* STRATEGY BUILDER TAB */}
      {tab === 'strategy' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {/* Strategy selector */}
          <div className="flex flex-wrap gap-2">
            {STRATEGIES.map((s, i) => (
              <button key={s.name} onClick={() => setStrategyIdx(i)}
                className="px-4 py-2 rounded-xl text-[12px] font-bold transition-all hover:scale-[1.03]"
                style={{
                  background: strategyIdx === i ? 'linear-gradient(135deg, #387ED1, #8B5CF6)' : 'var(--card)',
                  color: strategyIdx === i ? '#fff' : 'var(--text2)',
                  border: `1px solid ${strategyIdx === i ? 'transparent' : 'var(--border)'}`,
                }}>
                {s.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
            {/* Payoff chart */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[14px] font-black" style={{ color: 'var(--text)' }}>{strat.name} — Payoff at Expiry</h3>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text3)' }}>Lot size: {underlying.lotSize} · Underlying: {underlying.label}</p>
                </div>
                <div className="flex gap-4 text-[11px]">
                  <span className="font-bold" style={{ color: 'var(--green)' }}>Max Profit: {maxProfit === Infinity ? '∞' : `₹${fmtN(maxProfit)}`}</span>
                  <span className="font-bold" style={{ color: 'var(--red)' }}>Max Loss: {maxLoss === -Infinity ? '∞' : `₹${fmtN(Math.abs(maxLoss))}`}</span>
                </div>
              </div>
              {mounted && (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={payoffData}>
                    <defs>
                      <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16A34A" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DC2626" stopOpacity={0} />
                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0.25} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="spot" tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false}
                      tickFormatter={v => `₹${(v / 1000).toFixed(1)}k`} interval={Math.floor(payoffData.length / 6)} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} axisLine={false}
                      tickFormatter={v => v >= 0 ? `+${(v / 1000).toFixed(0)}K` : `${(v / 1000).toFixed(0)}K`} />
                    <Tooltip
                      contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}
                      formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'P&L']}
                      labelFormatter={v => `Spot: ₹${Number(v).toLocaleString('en-IN')}`}
                    />
                    <ReferenceLine y={0} stroke="var(--border)" strokeWidth={2} />
                    <ReferenceLine x={underlying.spot} stroke="var(--accent)" strokeDasharray="5 3"
                      label={{ value: 'Current', fill: 'var(--accent)', fontSize: 10 }} />
                    <Area type="monotone" dataKey="pnl" stroke="var(--accent)"
                      strokeWidth={2.5} fill={payoffData.some(p => p.pnl > 0) ? 'url(#profitGrad)' : 'url(#lossGrad)'}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--card)' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Legs detail */}
            <div className="space-y-4">
              <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <h4 className="text-[13px] font-black mb-3" style={{ color: 'var(--text)' }}>Strategy Legs</h4>
                <div className="space-y-2">
                  {builtLegs.map((leg, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg3)' }}>
                      <span className="text-[11px] font-black px-2 py-0.5 rounded-lg"
                        style={{ background: leg.action === 'BUY' ? 'rgba(22,163,74,0.15)' : 'rgba(220,38,38,0.15)', color: leg.action === 'BUY' ? 'var(--green)' : 'var(--red)' }}>
                        {leg.action}
                      </span>
                      <span className="text-[12px] font-bold" style={{ color: 'var(--text)' }}>{underlying.label} {leg.strike} {leg.type}</span>
                      <span className="ml-auto text-[12px] font-black" style={{ color: 'var(--text2)' }}>₹{leg.ltp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Greeks summary */}
              <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <h4 className="text-[13px] font-black mb-3" style={{ color: 'var(--text)' }}>Portfolio Greeks</h4>
                {[
                  { label: 'Net Delta', val: builtLegs.reduce((s, l) => s + (l.action === 'BUY' ? 1 : -1) * (atm?.ce_delta ?? 0.5) * l.qty, 0).toFixed(2), color: 'var(--accent)' },
                  { label: 'Net Theta', val: builtLegs.reduce((s, l) => s + (l.action === 'BUY' ? -1 : 1) * 12 * l.qty, 0).toFixed(0) + '/day', color: 'var(--red)' },
                  { label: 'Net Vega', val: builtLegs.reduce((s, l) => s + (l.action === 'BUY' ? 1 : -1) * 45 * l.qty, 0).toFixed(0), color: 'var(--green)' },
                  { label: 'Max Profit', val: maxProfit > 500000 ? '∞' : `₹${fmtN(maxProfit)}`, color: 'var(--green)' },
                  { label: 'Max Loss', val: maxLoss < -500000 ? '-∞' : `₹${fmtN(Math.abs(maxLoss))}`, color: 'var(--red)' },
                  { label: 'BEP', val: payoffData.find((p, i) => i > 0 && payoffData[i - 1].pnl * p.pnl <= 0)?.spot?.toString() ?? 'N/A', color: '#F59E0B' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--border2)' }}>
                    <span className="text-[12px]" style={{ color: 'var(--text2)' }}>{label}</span>
                    <span className="text-[12px] font-black" style={{ color }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* AI insight */}
              <div className="rounded-2xl p-4" style={{
                background: 'linear-gradient(135deg, rgba(56,126,209,0.08), rgba(139,92,246,0.08))',
                border: '1px solid var(--accent)',
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black text-white"
                    style={{ background: 'linear-gradient(135deg, #387ED1, #8B5CF6)' }}>AI</span>
                  <span className="text-[12px] font-bold" style={{ color: 'var(--text)' }}>Strategy Insight</span>
                </div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text2)' }}>
                  {strat.name === 'Long Straddle'
                    ? `Long Straddle profits when ${underlying.label} makes a big move either way. Best deployed before major events (earnings, RBI policy). Current IV at ~18% — strategy needs a move > ₹${Math.floor(underlying.spot * 0.04)} to be profitable.`
                    : strat.name === 'Short Straddle'
                      ? `Short Straddle profits when ${underlying.label} stays range-bound. Max profit if underlying expires at ATM. Risk: unlimited if there's a sharp directional move.`
                      : strat.name === 'Iron Condor'
                        ? `Iron Condor is a low-risk, range-bound strategy. Profits when ${underlying.label} stays within a defined channel. India VIX at 13.45 — low volatility environment favors this strategy.`
                        : `${strat.name} on ${underlying.label}. Monitor delta exposure and adjust if spot moves significantly from current levels.`
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* OI ANALYSIS TAB */}
      {tab === 'oi' && mounted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* OI Bar Chart */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-[13px] font-black mb-1" style={{ color: 'var(--text)' }}>Open Interest by Strike</h3>
              <p className="text-[11px] mb-4" style={{ color: 'var(--text3)' }}>OI in thousands · {underlying.label}</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={oiData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="strike" tick={{ fontSize: 9, fill: 'var(--text3)' }} tickLine={false}
                    interval={Math.floor(oiData.length / 8)} />
                  <YAxis tick={{ fontSize: 9, fill: 'var(--text3)' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 11 }}
                    formatter={(v, name) => [`${v}K`, name === 'CE_OI' ? 'Call OI' : 'Put OI']}
                    labelFormatter={v => `Strike: ${v}`}
                  />
                  <ReferenceLine x={atmStrike} stroke="var(--accent)" strokeDasharray="5 3"
                    label={{ value: 'ATM', fill: 'var(--accent)', fontSize: 10 }} />
                  <Bar dataKey="CE_OI" fill="rgba(22,163,74,0.7)" radius={[3, 3, 0, 0]} name="CE_OI" />
                  <Bar dataKey="PE_OI" fill="rgba(220,38,38,0.7)" radius={[3, 3, 0, 0]} name="PE_OI" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-3 text-[10px]">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: 'rgba(22,163,74,0.7)' }} /> Call OI</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: 'rgba(220,38,38,0.7)' }} /> Put OI</span>
              </div>
            </div>

            {/* PCR chart */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-[13px] font-black mb-1" style={{ color: 'var(--text)' }}>PCR per Strike</h3>
              <p className="text-[11px] mb-4" style={{ color: 'var(--text3)' }}>Put-Call Ratio (PCR &gt; 1 = Bearish sentiment)</p>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={oiData.map(d => ({ ...d, pcr: d.PE_OI / (d.CE_OI || 1) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="strike" tick={{ fontSize: 9, fill: 'var(--text3)' }} tickLine={false}
                    interval={Math.floor(oiData.length / 8)} />
                  <YAxis tick={{ fontSize: 9, fill: 'var(--text3)' }} tickLine={false} axisLine={false}
                    tickFormatter={v => v.toFixed(1)} />
                  <Tooltip
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 11 }}
                    formatter={(v) => [Number(v).toFixed(2), 'PCR']}
                    labelFormatter={v => `Strike: ${v}`}
                  />
                  <ReferenceLine y={1} stroke="#F59E0B" strokeDasharray="5 3"
                    label={{ value: 'PCR=1', fill: '#F59E0B', fontSize: 10 }} />
                  <Bar dataKey="pcr" fill="var(--accent)" opacity={0.6} radius={[3, 3, 0, 0]} />
                  <Line type="monotone" dataKey="pcr" stroke="var(--accent2)" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total CE OI', val: `${(totalCEOI / 1e5).toFixed(1)}L`, sub: 'Call open interest', color: 'var(--green)' },
              { label: 'Total PE OI', val: `${(totalPEOI / 1e5).toFixed(1)}L`, sub: 'Put open interest', color: 'var(--red)' },
              { label: 'Overall PCR', val: pcr.toFixed(2), sub: pcr > 1.2 ? 'Bearish sentiment' : pcr < 0.8 ? 'Bullish sentiment' : 'Neutral', color: pcr > 1.2 ? 'var(--red)' : pcr < 0.8 ? 'var(--green)' : 'var(--text)' },
              { label: 'Max Pain', val: maxPain.toString(), sub: `ATM: ${atmStrike}`, color: '#F59E0B' },
            ].map(({ label, val, sub, color }) => (
              <div key={label} className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <p className="text-[11px] font-medium mb-1" style={{ color: 'var(--text3)' }}>{label}</p>
                <p className="text-[22px] font-black" style={{ color }}>{val}</p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--text3)' }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* AI OI Analysis */}
          <div className="rounded-2xl p-5" style={{
            background: 'linear-gradient(135deg, rgba(56,126,209,0.08), rgba(139,92,246,0.08))',
            border: '1px solid var(--accent)',
          }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black text-white"
                style={{ background: 'linear-gradient(135deg, #387ED1, #8B5CF6)' }}>AI</span>
              <h4 className="text-[13px] font-black" style={{ color: 'var(--text)' }}>AI OI Analysis</h4>
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text2)' }}>
              The options market for <strong>{underlying.label}</strong> shows{' '}
              <strong style={{ color: pcr > 1 ? 'var(--red)' : 'var(--green)' }}>
                {pcr > 1.2 ? 'bearish' : pcr < 0.8 ? 'bullish' : 'neutral'} sentiment
              </strong>{' '}
              with a PCR of <strong>{pcr.toFixed(2)}</strong>.{' '}
              Maximum OI concentration at the {atmStrike} strike suggests strong support/resistance near current levels.
              Max pain at <strong style={{ color: '#F59E0B' }}>{maxPain}</strong> indicates that option sellers would benefit most if {underlying.label} expires near this level.
              {pcr > 1.2
                ? ' High PE OI suggests hedging activity — market may see mean reversion if negativity unwinds.'
                : pcr < 0.8
                  ? ' Low PCR with high CE OI may indicate covered call writing or limited upside expectation.'
                  : ' Balanced OI distribution — market is undecided. Wait for a breakout before taking directional bets.'
              }
            </p>
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-[11px]" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
        <AlertCircle size={14} className="shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
        <p style={{ color: 'var(--text3)' }}>
          <strong style={{ color: 'var(--text2)' }}>Simulated Data:</strong> All options data, OI figures, and Greeks are generated for educational purposes.
          Options trading involves substantial risk. Always consult a SEBI-registered advisor before trading derivatives.
        </p>
      </div>
    </div>
  );
}
