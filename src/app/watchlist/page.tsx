import WatchlistPanel from "@/components/watchlist/WatchlistPanel";
import CandlestickChart from "@/components/charts/CandlestickChart";
import { Star } from "lucide-react";

export default function WatchlistPage() {
  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(245,158,11,0.1)' }}>
          <Star size={18} fill="#F59E0B" style={{ color: '#F59E0B' }} />
        </div>
        <div>
          <h1 className="text-[20px] font-black" style={{ color: 'var(--text)' }}>Watchlist</h1>
          <p className="text-[12px]" style={{ color: 'var(--text3)' }}>Track your favourite Indian stocks</p>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
        <CandlestickChart defaultSymbol="RELIANCE" />
        <WatchlistPanel />
      </div>
    </div>
  );
}
