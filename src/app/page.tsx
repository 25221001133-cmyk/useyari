import MarketCards from "@/components/dashboard/MarketCards";
import StockChart from "@/components/charts/StockChart";
import TopMovers from "@/components/dashboard/TopMovers";
import SectorHeatmap from "@/components/dashboard/SectorHeatmap";
import PortfolioSummary from "@/components/dashboard/PortfolioSummary";
import WatchlistPanel from "@/components/watchlist/WatchlistPanel";
import OrderPanel from "@/components/dashboard/OrderPanel";

export default function DashboardPage() {
  return (
    <div className="p-5 space-y-5">
      <div>
        <h1 className="text-[20px] font-black" style={{ color: 'var(--text)' }}>Dashboard</h1>
        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text3)' }}>
          Tuesday, 13 May 2026 · NSE/BSE · Market Open
        </p>
      </div>

      <MarketCards />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">
        <div className="space-y-5 min-w-0">
          <StockChart />
          <SectorHeatmap />
          <TopMovers />
        </div>
        <div className="space-y-5">
          <PortfolioSummary />
          <OrderPanel />
          <WatchlistPanel compact />
        </div>
      </div>
    </div>
  );
}
