'use client';
import Sidebar from './Sidebar';
import Header from './Header';
import IndexTicker from '@/components/dashboard/IndexTicker';
import MarketTicker from './MarketTicker';
import AIAssistant from '@/components/ai/AIAssistant';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <IndexTicker />
        <MarketTicker />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}
