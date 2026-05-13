import MarketCards from "@/components/dashboard/MarketCards";
import SectorHeatmap from "@/components/dashboard/SectorHeatmap";
import MarketsTable from "@/components/markets/MarketsTable";
import { TrendingUp } from "lucide-react";

export default function MarketsPage() {
  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(56,126,209,0.1)' }}>
          <TrendingUp size={18} className="text-[--accent]" style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <h1 className="text-[20px] font-black" style={{ color: 'var(--text)' }}>Markets</h1>
          <p className="text-[12px]" style={{ color: 'var(--text3)' }}>NSE · BSE · NIFTY 50 · Real-time simulation</p>
        </div>
      </div>
      <MarketCards />
      <SectorHeatmap />
      <MarketsTable />
    </div>
  );
}
