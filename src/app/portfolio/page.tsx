'use client';
import { TrendingUp, TrendingDown, Briefcase } from "lucide-react";
import { useTrading } from "@/lib/trading";
import PnLChart from "@/components/portfolio/PnLChart";
import AllocationChart from "@/components/portfolio/AllocationChart";
import HoldingsTable from "@/components/portfolio/HoldingsTable";

function StatCard({ label, value, sub, up }: { label: string; value: string; sub?: string; up?: boolean }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <p className="text-[11px] font-medium mb-2" style={{ color: 'var(--text3)' }}>{label}</p>
      <p className="text-[20px] font-black leading-tight" style={{ color: 'var(--text)' }}>{value}</p>
      {sub && (
        <p className="text-[12px] font-semibold mt-1 flex items-center gap-1"
          style={{ color: up === true ? 'var(--green)' : up === false ? 'var(--red)' : 'var(--text3)' }}>
          {up === true && <TrendingUp size={12} />}
          {up === false && <TrendingDown size={12} />}
          {sub}
        </p>
      )}
    </div>
  );
}

export default function PortfolioPage() {
  const { positions, totalInvested, totalCurrent, totalPnL, totalPnLPct, orders, balance } = useTrading();
  const up = totalPnL >= 0;

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(56,126,209,0.1)' }}>
          <Briefcase size={18} style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <h1 className="text-[20px] font-black" style={{ color: 'var(--text)' }}>Portfolio</h1>
          <p className="text-[12px]" style={{ color: 'var(--text3)' }}>{positions.length} holdings · {orders.length} orders</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Invested" value={`₹${(totalInvested / 1e5).toFixed(2)}L`} sub="Total capital deployed" />
        <StatCard label="Current Value" value={`₹${(totalCurrent / 1e5).toFixed(2)}L`} up={up} />
        <StatCard label="Total P&L"
          value={`${up ? '+' : '-'}₹${(Math.abs(totalPnL) / 1000).toFixed(1)}K`}
          sub={`${up ? '+' : ''}${totalPnLPct.toFixed(2)}% overall return`} up={up} />
        <StatCard label="Cash Balance" value={`₹${(balance / 1e5).toFixed(2)}L`} sub="Available to trade" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        <PnLChart />
        <AllocationChart />
      </div>

      <HoldingsTable />

      {/* Orders */}
      {orders.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ background: 'var(--bg3)' }}>
                  {['Order ID', 'Stock', 'Side', 'Qty', 'Price', 'Value', 'Status', 'Time'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-bold text-[10px] uppercase tracking-wider" style={{ color: 'var(--text3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border2)', background: i % 2 === 0 ? 'transparent' : 'var(--bg3)' }}>
                    <td className="px-4 py-2.5 font-mono text-[11px]" style={{ color: 'var(--text3)' }}>{o.id}</td>
                    <td className="px-4 py-2.5 font-bold" style={{ color: 'var(--text)' }}>{o.symbol}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                        style={{
                          background: o.side === 'BUY' ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
                          color: o.side === 'BUY' ? 'var(--green)' : 'var(--red)',
                        }}>{o.side}</span>
                    </td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text2)' }}>{o.qty}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--text2)' }}>₹{o.price.toFixed(2)}</td>
                    <td className="px-4 py-2.5 font-semibold" style={{ color: 'var(--text)' }}>₹{o.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] font-bold" style={{ color: 'var(--green)' }}>{o.status}</span>
                    </td>
                    <td className="px-4 py-2.5 text-[11px]" style={{ color: 'var(--text3)' }}>{o.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
