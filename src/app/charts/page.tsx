import StockChart from "@/components/charts/StockChart";
import CandlestickChart from "@/components/charts/CandlestickChart";
import { BarChart2 } from "lucide-react";

export default function ChartsPage() {
  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(56,126,209,0.1)' }}>
          <BarChart2 size={18} style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <h1 className="text-[20px] font-black" style={{ color: 'var(--text)' }}>Charts</h1>
          <p className="text-[12px]" style={{ color: 'var(--text3)' }}>Area & candlestick technical analysis</p>
        </div>
      </div>

      <div>
        <h2 className="text-[12px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
          style={{ color: 'var(--text3)' }}>
          <BarChart2 size={13} /> Area Charts
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <StockChart defaultSymbol="RELIANCE" />
          <StockChart defaultSymbol="TCS" />
          <StockChart defaultSymbol="HDFCBANK" />
          <StockChart defaultSymbol="BAJFINANCE" />
        </div>
      </div>

      <div>
        <h2 className="text-[12px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
          style={{ color: 'var(--text3)' }}>
          <BarChart2 size={13} /> Candlestick Charts
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <CandlestickChart defaultSymbol="RELIANCE" />
          <CandlestickChart defaultSymbol="INFY" />
          <CandlestickChart defaultSymbol="ICICIBANK" />
          <CandlestickChart defaultSymbol="MARUTI" />
        </div>
      </div>
    </div>
  );
}
