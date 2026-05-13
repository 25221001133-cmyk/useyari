'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, TrendingUp, TrendingDown, Star, StarOff, ShoppingCart,
  Activity, BarChart2, BookOpen, Users, FileText,
  ChevronUp, ChevronDown, Info,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Stock, generateChartData, generateQuarterlyResults, generateShareholdingPattern, fmt } from '@/lib/data';
import { useTrading } from '@/lib/trading';

type Tab = 'overview' | 'financials' | 'technicals' | 'shareholding' | 'about';

function computeEMA(data: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const result: number[] = [];
  let ema = data[0];
  for (let i = 0; i < data.length; i++) {
    ema = i === 0 ? data[0] : data[i] * k + ema * (1 - k);
    result.push(ema);
  }
  return result;
}

function computeTechnicals(prices: number[]) {
  const sma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const sma50 = prices.slice(-50).reduce((a, b) => a + b, 0) / Math.min(50, prices.length);
  const last14 = prices.slice(-15);
  let gains = 0, losses = 0;
  for (let i = 1; i < last14.length; i++) {
    const d = last14[i] - last14[i - 1];
    if (d > 0) gains += d; else losses -= d;
  }
  const rs = gains / (losses || 1);
  const rsi = 100 - 100 / (1 + rs);
  const stdDev = Math.sqrt(prices.slice(-20).reduce((acc, p) => acc + Math.pow(p - sma20, 2), 0) / 20);

  // MACD
  const ema12 = computeEMA(prices, 12);
  const ema26 = computeEMA(prices, 26);
  const macdLine = ema12.map((v, i) => v - ema26[i]);
  const signalLine = computeEMA(macdLine, 9);
  const macdData = macdLine.map((m, i) => ({
    macd: +m.toFixed(2),
    signal: +signalLine[i].toFixed(2),
    histogram: +(m - signalLine[i]).toFixed(2),
  }));

  return {
    sma20: +sma20.toFixed(2),
    sma50: +sma50.toFixed(2),
    rsi: +rsi.toFixed(1),
    bbandsUpper: +(sma20 + 2 * stdDev).toFixed(2),
    bbandsLower: +(sma20 - 2 * stdDev).toFixed(2),
    signal: rsi > 70 ? 'OVERBOUGHT' : rsi < 30 ? 'OVERSOLD' : 'NEUTRAL',
    macdData,
  };
}

function MetricCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl p-3 transition-all hover:scale-[1.02]" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text3)' }}>{label}</p>
      <p className="text-[15px] font-black" style={{ color: color ?? 'var(--text)' }}>{value}</p>
      {sub && <p className="text-[10px] mt-0.5" style={{ color: 'var(--text3)' }}>{sub}</p>}
    </div>
  );
}

function StatRow({ label, value, good }: { label: string; value: string; good?: boolean | null }) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--border2)' }}>
      <span className="text-[12px]" style={{ color: 'var(--text2)' }}>{label}</span>
      <span className="text-[12px] font-semibold flex items-center gap-1"
        style={{ color: good === true ? 'var(--green)' : good === false ? 'var(--red)' : 'var(--text)' }}>
        {good === true && <ChevronUp size={12} />}
        {good === false && <ChevronDown size={12} />}
        {value}
      </span>
    </div>
  );
}

export default function StockDetailClient({ stock }: { stock: Stock }) {
  const router = useRouter();
  const { placeOrder, balance, positions, livePrices } = useTrading();
  const [tab, setTab] = useState<Tab>('overview');
  const [period, setPeriod] = useState<'1W' | '1M' | '3M' | '6M' | '1Y'>('3M');
  const [watchlisted, setWatchlisted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [orderSide, setOrderSide] = useState<'BUY' | 'SELL'>('BUY');
  const [qty, setQty] = useState(1);
  const [orderMsg, setOrderMsg] = useState('');
  const [orderOk, setOrderOk] = useState(true);
  const [orderAnim, setOrderAnim] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const daysMap = { '1W': 7, '1M': 30, '3M': 60, '6M': 120, '1Y': 252 };
  const chartData = generateChartData(stock.symbol, daysMap[period]);
  const prices = chartData.map(d => d.close);
  const technicals = mounted ? computeTechnicals(prices) : null;
  const quarterlyResults = generateQuarterlyResults(stock.symbol);
  const shareholding = generateShareholdingPattern(stock.symbol);
  const holding = positions.find(p => p.symbol === stock.symbol);

  const livePrice = (mounted && livePrices[stock.symbol]) ? livePrices[stock.symbol] : stock.price;
  const liveChange = livePrice - stock.price;
  const liveChangePct = (liveChange / stock.price) * 100;
  const pnlColor = liveChangePct >= 0 ? 'var(--green)' : 'var(--red)';
  const chartColor = liveChangePct >= 0 ? '#16A34A' : '#DC2626';
  const chartColorDark = liveChangePct >= 0 ? '#4ADE80' : '#F87171';

  const handleOrder = () => {
    const result = placeOrder(stock.symbol, orderSide, qty, 'MARKET');
    setOrderMsg(result.msg);
    setOrderOk(result.ok);
    setOrderAnim(true);
    setTimeout(() => setOrderAnim(false), 3000);
  };

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'financials', label: 'Financials', icon: BarChart2 },
    { id: 'technicals', label: 'Technicals', icon: TrendingUp },
    { id: 'shareholding', label: 'Shareholding', icon: Users },
    { id: 'about', label: 'About', icon: BookOpen },
  ];

  const pieColors = ['#387ED1', '#16A34A', '#F59E0B', '#8B5CF6'];

  return (
    <div className="min-h-full pb-10" style={{ background: 'var(--bg)' }}>
      {/* Top hero */}
      <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
        {/* Back + breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[12px] transition-all hover:gap-2.5"
            style={{ color: 'var(--text3)' }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span className="text-[12px]" style={{ color: 'var(--text3)' }}>{stock.sector}</span>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span className="text-[12px] font-semibold" style={{ color: 'var(--text)' }}>{stock.symbol}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          {/* Left: stock info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[14px] font-black text-white shrink-0"
                style={{ background: `linear-gradient(135deg, ${chartColor}, #8B5CF6)` }}>
                {stock.symbol.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-[22px] font-black" style={{ color: 'var(--text)' }}>{stock.symbol}</h1>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>
                    {stock.exchange}
                  </span>
                </div>
                <p className="text-[13px]" style={{ color: 'var(--text2)' }}>{stock.name} · {stock.sector} · {stock.industry}</p>
              </div>
            </div>

            <div className="flex items-end gap-3 mt-3">
              <span className="text-[36px] font-black leading-none tabular-nums" style={{ color: 'var(--text)' }}>
                ₹{fmt(livePrice)}
              </span>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[16px] font-bold tabular-nums" style={{ color: pnlColor }}>
                  {liveChange >= 0 ? '+' : ''}₹{fmt(Math.abs(liveChange))}
                </span>
                <span className="text-[14px] font-bold px-2 py-0.5 rounded-lg" style={{
                  color: pnlColor,
                  background: liveChangePct >= 0 ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)'
                }}>
                  {liveChangePct >= 0 ? '▲' : '▼'} {Math.abs(liveChangePct).toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2 text-[11px]" style={{ color: 'var(--text3)' }}>
              <span>52W H: <strong style={{ color: 'var(--green)' }}>₹{fmt(stock.high52w)}</strong></span>
              <span>52W L: <strong style={{ color: 'var(--red)' }}>₹{fmt(stock.low52w)}</strong></span>
              <span>Vol: <strong style={{ color: 'var(--text)' }}>{(stock.volume / 1e5).toFixed(2)}L</strong></span>
              <span>Mkt Cap: <strong style={{ color: 'var(--text)' }}>{stock.marketCap}</strong></span>
            </div>
          </div>

          {/* Right: Order Panel */}
          <div className="w-full lg:w-72 rounded-2xl p-4 shrink-0" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            {/* BUY/SELL */}
            <div className="flex rounded-xl overflow-hidden mb-3" style={{ border: '1px solid var(--border)' }}>
              {(['BUY', 'SELL'] as const).map(s => (
                <button key={s} onClick={() => setOrderSide(s)}
                  className="flex-1 py-2 text-[13px] font-black transition-all"
                  style={{
                    background: orderSide === s ? (s === 'BUY' ? 'var(--green)' : 'var(--red)') : 'transparent',
                    color: orderSide === s ? '#fff' : 'var(--text3)',
                  }}>
                  {s}
                </button>
              ))}
            </div>

            {holding && (
              <div className="mb-3 px-3 py-2 rounded-lg text-[11px]" style={{ background: 'var(--bg3)' }}>
                <span style={{ color: 'var(--text3)' }}>You hold </span>
                <strong style={{ color: 'var(--text)' }}>{holding.qty} shares</strong>
                <span style={{ color: 'var(--text3)' }}> · P&L: </span>
                <strong style={{ color: holding.pnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {holding.pnl >= 0 ? '+' : ''}₹{fmt(holding.pnl, 0)}
                </strong>
              </div>
            )}

            <div className="space-y-2.5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text3)' }}>Quantity</label>
                <input
                  type="number" min={1} value={qty}
                  onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full h-9 px-3 rounded-lg text-[13px] font-semibold outline-none transition-all"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
              </div>
              <div className="flex justify-between text-[12px] px-1">
                <span style={{ color: 'var(--text3)' }}>Est. Value</span>
                <span className="font-black" style={{ color: 'var(--text)' }}>₹{fmt(qty * livePrice, 0)}</span>
              </div>
              <div className="flex justify-between text-[12px] px-1">
                <span style={{ color: 'var(--text3)' }}>Available</span>
                <span className="font-semibold" style={{ color: 'var(--text2)' }}>₹{fmt(balance, 0)}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOrder}
              className="w-full mt-3 py-2.5 rounded-xl text-[13px] font-black text-white transition-all"
              style={{
                background: orderSide === 'BUY'
                  ? 'linear-gradient(135deg, #16A34A, #4ADE80)'
                  : 'linear-gradient(135deg, #DC2626, #F87171)',
              }}
            >
              {orderSide} {qty} × {stock.symbol}
            </motion.button>

            <AnimatePresence>
              {orderAnim && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] mt-2 text-center font-semibold"
                  style={{ color: orderOk ? 'var(--green)' : 'var(--red)' }}
                >
                  {orderMsg}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setWatchlisted(w => !w)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-semibold transition-all hover:scale-105"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: watchlisted ? '#F59E0B' : 'var(--text3)' }}
              >
                {watchlisted ? <Star size={12} fill="currentColor" /> : <StarOff size={12} />}
                {watchlisted ? 'Watchlisted' : 'Watchlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-5">
        {/* Tabs */}
        <div className="flex gap-0 rounded-xl overflow-hidden p-1" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all flex-1 justify-center"
              style={{
                background: tab === id ? 'var(--card)' : 'transparent',
                color: tab === id ? 'var(--accent)' : 'var(--text3)',
                boxShadow: tab === id ? 'var(--shadow)' : 'none',
              }}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Chart + period */}
        <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>Price Chart</h3>
            <div className="flex gap-1">
              {(['1W', '1M', '3M', '6M', '1Y'] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
                  style={{
                    background: period === p ? 'var(--accent)' : 'var(--bg3)',
                    color: period === p ? '#fff' : 'var(--text3)',
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          {mounted && (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} axisLine={false}
                  tickFormatter={v => `₹${(v / 1000).toFixed(1)}k`} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}
                  labelStyle={{ color: 'var(--text)', fontWeight: 700 }}
                  formatter={(v) => [`₹${fmt(Number(v))}`, 'Price']}
                />
                <Area type="monotone" dataKey="close" stroke={chartColor} strokeWidth={2}
                  fill="url(#colorClose)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div className="space-y-5">
                {/* Key metrics grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  <MetricCard label="P/E Ratio" value={stock.pe.toFixed(1)} sub="TTM" />
                  <MetricCard label="P/B Ratio" value={stock.pb.toFixed(1)} />
                  <MetricCard label="EPS" value={`₹${fmt(stock.eps)}`} sub="TTM" />
                  <MetricCard label="Div Yield" value={`${stock.dividendYield}%`} color={stock.dividendYield > 1 ? 'var(--green)' : undefined} />
                  <MetricCard label="Face Value" value={`₹${stock.faceValue}`} />
                  <MetricCard label="Book Value" value={`₹${fmt(stock.bookValue)}`} />
                  <MetricCard label="ROE" value={`${stock.roe.toFixed(1)}%`} color={stock.roe > 15 ? 'var(--green)' : 'var(--red)'} />
                  <MetricCard label="ROCE" value={`${stock.roce.toFixed(1)}%`} color={stock.roce > 12 ? 'var(--green)' : 'var(--red)'} />
                  <MetricCard label="D/E Ratio" value={stock.debtToEquity.toFixed(2)} color={stock.debtToEquity < 1 ? 'var(--green)' : 'var(--red)'} />
                  <MetricCard label="Curr. Ratio" value={stock.currentRatio.toFixed(2)} color={stock.currentRatio > 1 ? 'var(--green)' : 'var(--red)'} />
                  <MetricCard label="Beta" value={stock.beta.toFixed(2)} sub="vs NIFTY" />
                  <MetricCard label="3Y CAGR" value={`${stock.cagr3y.toFixed(1)}%`} color="var(--accent)" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <h4 className="text-[13px] font-black mb-3" style={{ color: 'var(--text)' }}>Fundamental Analysis</h4>
                    <StatRow label="Market Cap" value={stock.marketCap} />
                    <StatRow label="52W High" value={`₹${fmt(stock.high52w)}`} good={true} />
                    <StatRow label="52W Low" value={`₹${fmt(stock.low52w)}`} good={false} />
                    <StatRow label="Delivery %" value={`${stock.deliveryPct}%`} good={stock.deliveryPct > 50} />
                    <StatRow label="5Y CAGR" value={`${stock.cagr5y.toFixed(1)}%`} good={stock.cagr5y > 12} />
                    <StatRow label="Exchange" value={stock.exchange} />
                  </div>
                  <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <h4 className="text-[13px] font-black mb-3" style={{ color: 'var(--text)' }}>Quality Indicators</h4>
                    <StatRow label="ROE" value={`${stock.roe.toFixed(1)}%`} good={stock.roe > 15} />
                    <StatRow label="ROCE" value={`${stock.roce.toFixed(1)}%`} good={stock.roce > 12} />
                    <StatRow label="Debt/Equity" value={stock.debtToEquity.toFixed(2)} good={stock.debtToEquity < 1} />
                    <StatRow label="Current Ratio" value={stock.currentRatio.toFixed(2)} good={stock.currentRatio > 1} />
                    <StatRow label="EPS" value={`₹${fmt(stock.eps)}`} good={true} />
                    <StatRow label="Dividend Yield" value={`${stock.dividendYield}%`} good={stock.dividendYield > 1} />
                  </div>
                </div>
              </div>
            )}

            {/* FINANCIALS */}
            {tab === 'financials' && (
              <div className="space-y-5">
                <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <h4 className="text-[13px] font-black mb-4" style={{ color: 'var(--text)' }}>Quarterly Results (₹ Cr)</h4>
                  {mounted && (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={quarterlyResults} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} axisLine={false}
                          tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                        <Tooltip
                          contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}
                          formatter={(v, name) => [`₹${Number(v).toLocaleString('en-IN')} Cr`, name === 'revenue' ? 'Revenue' : 'Net Profit']}
                        />
                        <Bar dataKey="revenue" fill="var(--accent)" radius={[4, 4, 0, 0]} opacity={0.8} name="revenue" />
                        <Bar dataKey="profit" fill="var(--green)" radius={[4, 4, 0, 0]} name="profit" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <h4 className="text-[13px] font-black" style={{ color: 'var(--text)' }}>Quarterly P&L</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr style={{ background: 'var(--bg3)' }}>
                          {['Quarter', 'Revenue', 'Net Profit', 'EPS', 'Rev Growth', 'Profit Growth'].map(h => (
                            <th key={h} className="px-4 py-2.5 text-left font-bold" style={{ color: 'var(--text3)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {quarterlyResults.map((q, i) => (
                          <tr key={q.quarter} style={{ borderBottom: '1px solid var(--border2)', background: i % 2 === 0 ? 'transparent' : 'var(--bg3)' }}>
                            <td className="px-4 py-2.5 font-bold" style={{ color: 'var(--text)' }}>{q.quarter}</td>
                            <td className="px-4 py-2.5" style={{ color: 'var(--text2)' }}>₹{q.revenue.toLocaleString('en-IN')} Cr</td>
                            <td className="px-4 py-2.5" style={{ color: 'var(--text2)' }}>₹{q.profit.toLocaleString('en-IN')} Cr</td>
                            <td className="px-4 py-2.5" style={{ color: 'var(--text)' }}>₹{q.eps}</td>
                            <td className="px-4 py-2.5 font-semibold" style={{ color: q.revenueGrowth >= 0 ? 'var(--green)' : 'var(--red)' }}>
                              {q.revenueGrowth >= 0 ? '+' : ''}{q.revenueGrowth}%
                            </td>
                            <td className="px-4 py-2.5 font-semibold" style={{ color: q.profitGrowth >= 0 ? 'var(--green)' : 'var(--red)' }}>
                              {q.profitGrowth >= 0 ? '+' : ''}{q.profitGrowth}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TECHNICALS */}
            {tab === 'technicals' && technicals && (
              <div className="space-y-5">
                {/* RSI + Signal */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-2xl p-5 text-center" style={{
                    background: 'var(--card)', border: '1px solid var(--border)',
                    boxShadow: technicals.signal === 'OVERBOUGHT' ? 'var(--glow-red)' : technicals.signal === 'OVERSOLD' ? 'var(--glow-green)' : 'none',
                  }}>
                    <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text3)' }}>RSI (14)</p>
                    <p className="text-[42px] font-black leading-none" style={{
                      color: technicals.rsi > 70 ? 'var(--red)' : technicals.rsi < 30 ? 'var(--green)' : 'var(--accent)'
                    }}>
                      {technicals.rsi}
                    </p>
                    <p className="text-[12px] font-bold mt-2 px-3 py-1 rounded-full inline-block" style={{
                      background: technicals.signal === 'OVERBOUGHT' ? 'rgba(220,38,38,0.1)' : technicals.signal === 'OVERSOLD' ? 'rgba(22,163,74,0.1)' : 'var(--bg3)',
                      color: technicals.signal === 'OVERBOUGHT' ? 'var(--red)' : technicals.signal === 'OVERSOLD' ? 'var(--green)' : 'var(--text2)',
                    }}>{technicals.signal}</p>
                  </div>

                  <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text3)' }}>Moving Averages</p>
                    <StatRow label="SMA 20" value={`₹${fmt(technicals.sma20)}`}
                      good={stock.price > technicals.sma20} />
                    <StatRow label="SMA 50" value={`₹${fmt(technicals.sma50)}`}
                      good={stock.price > technicals.sma50} />
                  </div>

                  <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text3)' }}>Bollinger Bands</p>
                    <StatRow label="Upper Band" value={`₹${fmt(technicals.bbandsUpper)}`} />
                    <StatRow label="Middle (SMA20)" value={`₹${fmt(technicals.sma20)}`} />
                    <StatRow label="Lower Band" value={`₹${fmt(technicals.bbandsLower)}`} />
                  </div>
                </div>

                {/* Price vs SMAs chart */}
                <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <h4 className="text-[13px] font-black mb-4" style={{ color: 'var(--text)' }}>Price vs Moving Averages</h4>
                  {mounted && (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} interval="preserveStartEnd" />
                        <YAxis tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} axisLine={false}
                          tickFormatter={v => `₹${(v / 1000).toFixed(1)}k`} domain={['auto', 'auto']} />
                        <Tooltip
                          contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}
                          formatter={(v) => [`₹${fmt(Number(v))}`, '']}
                        />
                        <ReferenceLine y={technicals.sma20} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'SMA20', fill: '#F59E0B', fontSize: 10 }} />
                        <ReferenceLine y={technicals.sma50} stroke="#8B5CF6" strokeDasharray="4 4" label={{ value: 'SMA50', fill: '#8B5CF6', fontSize: 10 }} />
                        <ReferenceLine y={technicals.bbandsUpper} stroke="var(--red)" strokeDasharray="2 4" />
                        <ReferenceLine y={technicals.bbandsLower} stroke="var(--green)" strokeDasharray="2 4" />
                        <Area type="monotone" dataKey="close" stroke={chartColor} strokeWidth={2} fill="url(#colorClose)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* MACD Chart */}
                <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[13px] font-black" style={{ color: 'var(--text)' }}>MACD (12, 26, 9)</h4>
                    <div className="flex items-center gap-4 text-[10px]">
                      {[['MACD', '#60A5FA'], ['Signal', '#F59E0B'], ['Histogram', '#8B5CF6']].map(([l, c]) => (
                        <span key={l} className="flex items-center gap-1.5">
                          <span className="w-3 h-1.5 rounded-full inline-block" style={{ background: c }} />
                          <span style={{ color: 'var(--text3)' }}>{l}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  {mounted && (
                    <ResponsiveContainer width="100%" height={180}>
                      <ComposedChart data={chartData.map((d, i) => ({ ...d, ...technicals.macdData[i] }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--text3)' }} tickLine={false} interval="preserveStartEnd" />
                        <YAxis tick={{ fontSize: 9, fill: 'var(--text3)' }} tickLine={false} axisLine={false} tickFormatter={v => v.toFixed(0)} />
                        <Tooltip
                          contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 11 }}
                          formatter={(v, name) => [Number(v).toFixed(2), name === 'histogram' ? 'Histogram' : name === 'macd' ? 'MACD' : 'Signal']}
                        />
                        <ReferenceLine y={0} stroke="var(--border)" strokeWidth={1} />
                        <Bar dataKey="histogram" radius={[2, 2, 0, 0]}
                          fill="#8B5CF6" opacity={0.5} name="histogram" />
                        <Line type="monotone" dataKey="macd" stroke="#60A5FA" dot={false} strokeWidth={1.5} name="macd" />
                        <Line type="monotone" dataKey="signal" stroke="#F59E0B" dot={false} strokeWidth={1.5} strokeDasharray="4 2" name="signal" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* AI Analysis */}
                <div className="rounded-2xl p-5" style={{
                  background: 'linear-gradient(135deg, rgba(56,126,209,0.1), rgba(139,92,246,0.1))',
                  border: '1px solid var(--accent)',
                }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black text-white"
                      style={{ background: 'linear-gradient(135deg, #387ED1, #8B5CF6)' }}>AI</div>
                    <h4 className="text-[13px] font-black" style={{ color: 'var(--text)' }}>AI Technical Analysis</h4>
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text2)' }}>
                    {stock.symbol} is currently trading at ₹{fmt(stock.price)}, which is{' '}
                    <strong style={{ color: stock.price > technicals.sma20 ? 'var(--green)' : 'var(--red)' }}>
                      {stock.price > technicals.sma20 ? 'above' : 'below'} the 20-day SMA
                    </strong>{' '}
                    (₹{fmt(technicals.sma20)}) and{' '}
                    <strong style={{ color: stock.price > technicals.sma50 ? 'var(--green)' : 'var(--red)' }}>
                      {stock.price > technicals.sma50 ? 'above' : 'below'} the 50-day SMA
                    </strong>{' '}
                    (₹{fmt(technicals.sma50)}). The RSI at {technicals.rsi} indicates the stock is{' '}
                    <strong style={{ color: technicals.signal === 'OVERBOUGHT' ? 'var(--red)' : technicals.signal === 'OVERSOLD' ? 'var(--green)' : 'var(--accent)' }}>
                      {technicals.signal.toLowerCase()}
                    </strong>.{' '}
                    {technicals.signal === 'OVERBOUGHT'
                      ? 'Consider waiting for a pullback before entering a new position.'
                      : technicals.signal === 'OVERSOLD'
                      ? 'This may represent a buying opportunity for long-term investors.'
                      : 'The stock is in a neutral zone — watch for breakout signals.'}
                  </p>
                </div>
              </div>
            )}

            {/* SHAREHOLDING */}
            {tab === 'shareholding' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Pie */}
                  <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <h4 className="text-[13px] font-black mb-4" style={{ color: 'var(--text)' }}>Current Holding Pattern</h4>
                    {mounted && (
                      <div className="flex items-center gap-4">
                        <ResponsiveContainer width={160} height={160}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Promoter', value: stock.promoterHolding },
                                { name: 'FII', value: stock.fiiHolding },
                                { name: 'DII', value: stock.diiHolding },
                                { name: 'Public', value: stock.publicHolding },
                              ]}
                              cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                              dataKey="value" paddingAngle={2}
                            >
                              {pieColors.map((color, i) => <Cell key={i} fill={color} />)}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2">
                          {[
                            { label: 'Promoter', val: stock.promoterHolding, color: pieColors[0] },
                            { label: 'FII', val: stock.fiiHolding, color: pieColors[1] },
                            { label: 'DII', val: stock.diiHolding, color: pieColors[2] },
                            { label: 'Public', val: stock.publicHolding, color: pieColors[3] },
                          ].map(({ label, val, color }) => (
                            <div key={label} className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                              <span className="text-[11px]" style={{ color: 'var(--text2)' }}>{label}</span>
                              <span className="text-[11px] font-bold ml-auto" style={{ color: 'var(--text)' }}>{val.toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Trend table */}
                  <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                      <h4 className="text-[13px] font-black" style={{ color: 'var(--text)' }}>Shareholding Trend</h4>
                    </div>
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr style={{ background: 'var(--bg3)' }}>
                          {['Period', 'Promoter', 'FII', 'DII', 'Public'].map(h => (
                            <th key={h} className="px-3 py-2.5 text-left font-bold" style={{ color: 'var(--text3)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {shareholding.map((s, i) => (
                          <tr key={s.quarter} style={{ borderBottom: '1px solid var(--border2)', background: i % 2 === 0 ? 'transparent' : 'var(--bg3)' }}>
                            <td className="px-3 py-2.5 font-bold" style={{ color: 'var(--text2)' }}>{s.quarter}</td>
                            <td className="px-3 py-2.5 font-semibold" style={{ color: '#387ED1' }}>{s.promoter.toFixed(1)}%</td>
                            <td className="px-3 py-2.5 font-semibold" style={{ color: '#16A34A' }}>{s.fii.toFixed(1)}%</td>
                            <td className="px-3 py-2.5 font-semibold" style={{ color: '#F59E0B' }}>{s.dii.toFixed(1)}%</td>
                            <td className="px-3 py-2.5 font-semibold" style={{ color: '#8B5CF6' }}>{s.public.toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT */}
            {tab === 'about' && (
              <div className="space-y-4">
                <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <h4 className="text-[13px] font-black mb-3" style={{ color: 'var(--text)' }}>Company Profile</h4>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text2)' }}>
                    {stock.name} is one of India's leading companies in the {stock.industry} space within the {stock.sector} sector.
                    Listed on {stock.exchange === 'BOTH' ? 'NSE and BSE' : stock.exchange}, it has a market capitalisation of {stock.marketCap},
                    making it a key constituent of multiple market indices. The company has consistently delivered strong returns to shareholders,
                    with a 3-year CAGR of {stock.cagr3y.toFixed(1)}% and 5-year CAGR of {stock.cagr5y.toFixed(1)}%.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Sector', value: stock.sector },
                    { label: 'Industry', value: stock.industry },
                    { label: 'Exchange', value: stock.exchange },
                    { label: 'Face Value', value: `₹${stock.faceValue}` },
                    { label: 'Market Cap', value: stock.marketCap },
                    { label: 'Beta', value: stock.beta.toFixed(2) },
                    { label: '3Y CAGR', value: `${stock.cagr3y.toFixed(1)}%` },
                    { label: '5Y CAGR', value: `${stock.cagr5y.toFixed(1)}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl p-3" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text3)' }}>{label}</p>
                      <p className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
