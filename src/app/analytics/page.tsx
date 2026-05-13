'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, BarChart2, Shield, Zap } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useTrading } from '@/lib/trading';
import { STOCKS, generatePortfolioPnL, SECTOR_DATA } from '@/lib/data';
import SectorHeatmap from '@/components/dashboard/SectorHeatmap';
import AllocationChart from '@/components/portfolio/AllocationChart';

function MetricCard({ label, value, sub, color, icon: Icon }: { label: string; value: string; sub?: string; color?: string; icon?: React.ElementType }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-medium" style={{ color: 'var(--text3)' }}>{label}</p>
        {Icon && <Icon size={14} style={{ color: color ?? 'var(--accent)' }} />}
      </div>
      <p className="text-[22px] font-black" style={{ color: color ?? 'var(--text)' }}>{value}</p>
      {sub && <p className="text-[11px] mt-1" style={{ color: 'var(--text3)' }}>{sub}</p>}
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const { positions, totalInvested, totalCurrent, totalPnL, totalPnLPct } = useTrading();
  useEffect(() => { setMounted(true); }, []);

  const pnlData = generatePortfolioPnL();
  const up = totalPnL >= 0;

  // Performance vs NIFTY
  const niftyReturn = 7.6;
  const alphaVsNifty = totalPnLPct - niftyReturn;

  // Risk metrics
  const beta = positions.length
    ? positions.reduce((s, p) => {
        const stock = STOCKS.find(st => st.symbol === p.symbol);
        return s + (stock?.beta ?? 1) * (p.current / (totalCurrent || 1));
      }, 0)
    : 1;

  const sharpe = totalPnLPct > 0 ? (totalPnLPct - 6.5) / (beta * 12) : -1;

  // Radar data — portfolio quality scores
  const radarData = [
    { subject: 'Return', A: Math.min(100, Math.max(0, 50 + totalPnLPct * 3)) },
    { subject: 'Risk Adj.', A: Math.min(100, Math.max(0, 50 + sharpe * 20)) },
    { subject: 'Diversif.', A: Math.min(100, positions.length * 12) },
    { subject: 'Quality', A: positions.length ? positions.reduce((s, p) => { const st = STOCKS.find(x => x.symbol === p.symbol); return s + (st?.roe ?? 10); }, 0) / positions.length * 3.5 : 50 },
    { subject: 'Momentum', A: Math.min(100, Math.max(0, 50 + totalPnLPct * 2)) },
    { subject: 'Stability', A: Math.max(0, 100 - beta * 40) },
  ];

  // Sector performance
  const sectorPerf = SECTOR_DATA.map(s => ({ ...s, fill: s.change >= 0 ? 'var(--green)' : 'var(--red)' }))
    .sort((a, b) => b.change - a.change);

  // Monthly P&L simulation — seeded by totalPnL so values are stable per session
  const monthlyData = useMemo(() => {
    const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const seed = Math.abs(totalPnL) || 12345;
    return Array.from({ length: 6 }, (_, i) => {
      // Deterministic pseudo-random using integer arithmetic
      const s1 = Math.sin(seed * (i + 1) * 2.3) * 10000;
      const s2 = Math.sin(seed * (i + 2) * 1.7) * 10000;
      const frac1 = s1 - Math.floor(s1);
      const frac2 = s2 - Math.floor(s2);
      const val = totalPnL * (0.4 + frac1 * 0.6) * (frac2 > 0.3 ? 1 : -1);
      return { month: months[i], pnl: Math.round(val * (i + 1) / 6) };
    });
  }, [totalPnL]);

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(139,92,246,0.1)' }}>
          <Activity size={18} style={{ color: '#8B5CF6' }} />
        </div>
        <div>
          <h1 className="text-[20px] font-black" style={{ color: 'var(--text)' }}>Analytics</h1>
          <p className="text-[12px]" style={{ color: 'var(--text3)' }}>Deep portfolio insights & performance attribution</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Portfolio Return" value={`${up ? '+' : ''}${totalPnLPct.toFixed(2)}%`} sub="Since inception" color={up ? 'var(--green)' : 'var(--red)'} icon={TrendingUp} />
        <MetricCard label="Alpha vs NIFTY" value={`${alphaVsNifty >= 0 ? '+' : ''}${alphaVsNifty.toFixed(2)}%`} sub="NIFTY: +7.6% YTD" color={alphaVsNifty >= 0 ? 'var(--green)' : 'var(--red)'} icon={Zap} />
        <MetricCard label="Portfolio Beta" value={beta.toFixed(2)} sub={beta > 1.1 ? 'High risk' : beta < 0.9 ? 'Defensive' : 'Market-like'} color={beta > 1.2 ? 'var(--red)' : 'var(--accent)'} icon={Shield} />
        <MetricCard label="Sharpe Ratio" value={sharpe.toFixed(2)} sub={sharpe > 1 ? 'Excellent risk-adj.' : sharpe > 0 ? 'Positive' : 'Poor risk-adj.'} color={sharpe > 1 ? 'var(--green)' : sharpe > 0 ? 'var(--accent)' : 'var(--red)'} icon={BarChart2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* P&L Chart */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 className="text-[13px] font-bold mb-4" style={{ color: 'var(--text)' }}>Portfolio Value Over Time</h3>
          {mounted ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={pnlData}>
                <defs>
                  <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={up ? '#16A34A' : '#DC2626'} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={up ? '#16A34A' : '#DC2626'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} axisLine={false}
                  tickFormatter={v => `₹${(v / 1e5).toFixed(1)}L`} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}
                  formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Value']} />
                <Area type="monotone" dataKey="value" stroke={up ? '#16A34A' : '#DC2626'} strokeWidth={2.5}
                  fill="url(#pnlGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <div className="h-[220px] rounded-xl shimmer" />}
        </div>

        {/* Portfolio Radar */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 className="text-[13px] font-bold mb-1" style={{ color: 'var(--text)' }}>Portfolio Quality Score</h3>
          <p className="text-[11px] mb-4" style={{ color: 'var(--text3)' }}>Multi-dimensional portfolio health</p>
          {mounted ? (
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--text3)' }} />
                <Radar dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          ) : <div className="h-[200px] rounded-xl shimmer" />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly P&L breakdown */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 className="text-[13px] font-bold mb-4" style={{ color: 'var(--text)' }}>Monthly P&L Breakdown</h3>
          {mounted ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false} axisLine={false}
                  tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}
                  formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Monthly P&L']} />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {monthlyData.map((entry, i) => (
                    <Cell key={i} fill={entry.pnl >= 0 ? 'rgba(22,163,74,0.7)' : 'rgba(220,38,38,0.7)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-[180px] rounded-xl shimmer" />}
        </div>

        {/* Allocation chart */}
        <AllocationChart />
      </div>

      {/* Sector Performance */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h3 className="text-[13px] font-bold mb-4" style={{ color: 'var(--text)' }}>Sector Performance Today</h3>
        {mounted ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={sectorPerf} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text3)' }} tickLine={false}
                tickFormatter={v => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`} domain={['auto', 'auto']} />
              <YAxis type="category" dataKey="sector" tick={{ fontSize: 10, fill: 'var(--text2)' }} tickLine={false} width={56} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}
                formatter={(v) => [`${Number(v) >= 0 ? '+' : ''}${Number(v).toFixed(2)}%`, 'Change']} />
              <Bar dataKey="change" radius={[0, 4, 4, 0]} maxBarSize={18}>
                {sectorPerf.map((entry, i) => (
                  <Cell key={i} fill={entry.change >= 0 ? 'rgba(22,163,74,0.7)' : 'rgba(220,38,38,0.7)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : <div className="h-[180px] rounded-xl shimmer" />}
      </div>

      {/* Sector Heatmap */}
      <SectorHeatmap />

      {/* Risk Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Concentration Risk', value: positions.length > 0 ? `${Math.max(...positions.map(p => (p.current / (totalCurrent || 1)) * 100)).toFixed(1)}%` : '0%', desc: 'Largest single position', warning: positions.length > 0 && Math.max(...positions.map(p => (p.current / (totalCurrent || 1)) * 100)) > 30 },
          { label: 'Portfolio Beta', value: beta.toFixed(2), desc: beta > 1.1 ? 'More volatile than market' : 'Less volatile than market', warning: beta > 1.3 },
          { label: 'Volatility', value: `${(beta * 12.4).toFixed(1)}%`, desc: 'Estimated annualized vol.', warning: beta > 1.3 },
        ].map(({ label, value, desc, warning }) => (
          <div key={label} className="rounded-2xl p-4" style={{
            background: 'var(--card)',
            border: `1px solid ${warning ? 'rgba(220,38,38,0.4)' : 'var(--border)'}`,
          }}>
            <div className="flex items-center gap-2 mb-2">
              {warning ? <TrendingDown size={14} style={{ color: 'var(--red)' }} /> : <Shield size={14} style={{ color: 'var(--green)' }} />}
              <p className="text-[11px] font-semibold" style={{ color: 'var(--text3)' }}>{label}</p>
            </div>
            <p className="text-[24px] font-black" style={{ color: warning ? 'var(--red)' : 'var(--green)' }}>{value}</p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text3)' }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
