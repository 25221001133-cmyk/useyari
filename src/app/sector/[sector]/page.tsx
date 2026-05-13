import { notFound } from 'next/navigation';
import { STOCKS, SECTOR_DATA } from '@/lib/data';
import SectorDetailClient from './SectorDetailClient';

const SECTOR_SLUGS: Record<string, string> = {
  'it': 'IT',
  'banking': 'Banking',
  'energy': 'Energy',
  'fmcg': 'FMCG',
  'pharma': 'Pharma',
  'auto': 'Auto',
  'infrastructure': 'Infrastructure',
  'nbfc': 'NBFC',
  'metals': 'Metals',
  'cement': 'Cement',
  'utilities': 'Utilities',
  'consumer': 'Consumer',
  'telecom': 'Telecom',
  'insurance': 'Insurance',
  'real-estate': 'Real Estate',
  'defence': 'Defence',
  'tourism': 'Tourism',
};

export function generateStaticParams() {
  return Object.keys(SECTOR_SLUGS).map(slug => ({ sector: slug }));
}

export default async function SectorPage({ params }: { params: Promise<{ sector: string }> }) {
  const { sector: slug } = await params;
  const sectorName = SECTOR_SLUGS[slug];
  if (!sectorName) notFound();

  const sectorData = SECTOR_DATA.find(s => s.sector === sectorName);
  const stocks = STOCKS.filter(s => s.sector === sectorName);

  return <SectorDetailClient sectorName={sectorName} slug={slug} stocks={stocks} sectorData={sectorData ?? { sector: sectorName, change: 0, stocks: stocks.length }} />;
}
