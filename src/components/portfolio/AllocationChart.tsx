'use client';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTrading } from '@/lib/trading';

const COLORS = ['#387ED1', '#16A34A', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#EF4444', '#10B981'];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; percent: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl shadow-xl p-3 text-[11px]"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <p className="font-bold mb-1" style={{ color: 'var(--text)' }}>{payload[0].name}</p>
      <p style={{ color: 'var(--text2)' }}>₹{payload[0].value.toLocaleString('en-IN')}</p>
      <p style={{ color: 'var(--text3)' }}>{(payload[0].percent * 100).toFixed(1)}% of portfolio</p>
    </div>
  );
}

export default function AllocationChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const { positions } = useTrading();

  const sectorMap = positions.reduce<Record<string, number>>((acc, h) => {
    acc[h.sector] = (acc[h.sector] || 0) + h.current;
    return acc;
  }, {});
  const pieData = Object.entries(sectorMap).map(([name, value]) => ({ name, value: Math.round(value) }));
  const total = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <h3 className="text-[13px] font-bold mb-4" style={{ color: 'var(--text)' }}>Sector Allocation</h3>
      {pieData.length === 0 ? (
        <p className="text-center text-[12px] py-8" style={{ color: 'var(--text3)' }}>No holdings to display</p>
      ) : (
        <div className="flex items-center gap-4">
          <div className="w-[160px] h-[160px] shrink-0">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={44} outerRadius={68} dataKey="value" paddingAngle={3}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full rounded-full shimmer" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-[11px] font-medium" style={{ color: 'var(--text2)' }}>{d.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(d.value / total) * 100}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                  <span className="text-[11px] font-semibold w-10 text-right" style={{ color: 'var(--text)' }}>
                    {((d.value / total) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
