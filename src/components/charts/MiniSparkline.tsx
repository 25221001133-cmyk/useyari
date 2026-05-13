'use client';
import { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function MiniSparkline({ data, up }: { data: number[]; up: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const chartData = data.map((v, i) => ({ i, v }));
  const color = up ? '#16A34A' : '#DC2626';
  const gradId = `sp-${up ? 'up' : 'dn'}-${data[0]}`;

  if (!mounted) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradId})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
