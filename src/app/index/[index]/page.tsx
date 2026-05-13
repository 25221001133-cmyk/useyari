import { notFound } from 'next/navigation';
import { INDICES } from '@/lib/data';
import IndexDetailClient from './IndexDetailClient';

const INDEX_SLUGS: Record<string, string> = {
  'nifty-50': 'NIFTY 50',
  'sensex': 'SENSEX',
  'nifty-bank': 'NIFTY BANK',
  'nifty-it': 'NIFTY IT',
  'nifty-midcap': 'NIFTY MIDCAP',
  'india-vix': 'INDIA VIX',
};

export function generateStaticParams() {
  return Object.keys(INDEX_SLUGS).map(slug => ({ index: slug }));
}

export default async function IndexPage({ params }: { params: Promise<{ index: string }> }) {
  const { index: slug } = await params;
  const indexName = INDEX_SLUGS[slug];
  if (!indexName) notFound();
  const indexData = INDICES.find(i => i.name === indexName);
  if (!indexData) notFound();
  return <IndexDetailClient index={indexData} slug={slug} />;
}
