import { STOCKS } from '@/lib/data';
import { notFound } from 'next/navigation';
import StockDetailClient from './StockDetailClient';

export function generateStaticParams() {
  return STOCKS.map(s => ({ symbol: s.symbol }));
}

export default async function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const stock = STOCKS.find(s => s.symbol === symbol);
  if (!stock) notFound();
  return <StockDetailClient stock={stock} />;
}
