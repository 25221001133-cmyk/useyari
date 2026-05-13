export type Stock = {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  exchange: 'NSE' | 'BSE' | 'BOTH';
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  marketCapCr: number;
  high52w: number;
  low52w: number;
  // Valuation
  pe: number;
  pb: number;
  eps: number;
  dividendYield: number;
  faceValue: number;
  bookValue: number;
  // Quality
  roe: number;
  roce: number;
  debtToEquity: number;
  currentRatio: number;
  // Holdings
  promoterHolding: number;
  fiiHolding: number;
  diiHolding: number;
  publicHolding: number;
  // Risk
  beta: number;
  cagr3y: number;
  cagr5y: number;
  deliveryPct: number;
};

export type Holding = {
  symbol: string;
  name: string;
  qty: number;
  avgPrice: number;
  currentPrice: number;
  sector: string;
};

export type ChartPoint = {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
};

export type IndexData = {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  sparkline: number[];
};

export type QuarterlyResult = {
  quarter: string;
  revenue: number;
  profit: number;
  eps: number;
  revenueGrowth: number;
  profitGrowth: number;
};

export type ShareholdingPattern = {
  quarter: string;
  promoter: number;
  fii: number;
  dii: number;
  public: number;
};

export const INDICES: IndexData[] = [
  { name: "NIFTY 50", value: 24856.35, change: 187.45, changePercent: 0.76, sparkline: [24100, 24250, 24180, 24400, 24600, 24550, 24750, 24856] },
  { name: "SENSEX", value: 81456.78, change: 612.34, changePercent: 0.76, sparkline: [79800, 80100, 79900, 80400, 80900, 80700, 81200, 81456] },
  { name: "NIFTY BANK", value: 52345.60, change: -234.50, changePercent: -0.45, sparkline: [52800, 52600, 52700, 52400, 52300, 52500, 52400, 52345] },
  { name: "NIFTY IT", value: 38456.90, change: 345.60, changePercent: 0.91, sparkline: [37800, 37900, 38100, 38000, 38200, 38300, 38400, 38456] },
  { name: "NIFTY MIDCAP", value: 53234.80, change: 423.20, changePercent: 0.80, sparkline: [52400, 52600, 52800, 52700, 53000, 53100, 53200, 53234] },
  { name: "INDIA VIX", value: 13.45, change: -0.78, changePercent: -5.48, sparkline: [15.2, 14.8, 14.2, 13.9, 13.7, 14.1, 13.6, 13.45] },
];

export const STOCKS: Stock[] = [
  {
    symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy", industry: "Oil & Gas Refining",
    exchange: "BOTH", price: 2847.35, change: 34.20, changePercent: 1.22, volume: 8234567,
    marketCap: "19.2L Cr", marketCapCr: 1920000, high52w: 3024.90, low52w: 2220.30,
    pe: 28.4, pb: 2.1, eps: 100.3, dividendYield: 0.34, faceValue: 10, bookValue: 1355,
    roe: 9.8, roce: 11.2, debtToEquity: 0.41, currentRatio: 1.28,
    promoterHolding: 50.3, fiiHolding: 22.4, diiHolding: 15.6, publicHolding: 11.7,
    beta: 1.12, cagr3y: 14.2, cagr5y: 18.7, deliveryPct: 44.2,
  },
  {
    symbol: "TCS", name: "Tata Consultancy Services", sector: "IT", industry: "IT Services & Consulting",
    exchange: "BOTH", price: 3912.60, change: -28.45, changePercent: -0.72, volume: 2134890,
    marketCap: "14.1L Cr", marketCapCr: 1410000, high52w: 4592.25, low52w: 3311.75,
    pe: 30.1, pb: 15.2, eps: 130.0, dividendYield: 1.45, faceValue: 1, bookValue: 257,
    roe: 52.3, roce: 68.4, debtToEquity: 0.02, currentRatio: 3.12,
    promoterHolding: 72.3, fiiHolding: 12.8, diiHolding: 8.9, publicHolding: 6.0,
    beta: 0.68, cagr3y: 8.4, cagr5y: 15.2, deliveryPct: 58.3,
  },
  {
    symbol: "HDFCBANK", name: "HDFC Bank", sector: "Banking", industry: "Private Sector Banks",
    exchange: "BOTH", price: 1678.90, change: 22.10, changePercent: 1.34, volume: 6789012,
    marketCap: "12.7L Cr", marketCapCr: 1270000, high52w: 1880.00, low52w: 1363.55,
    pe: 19.8, pb: 2.9, eps: 84.8, dividendYield: 1.12, faceValue: 1, bookValue: 578,
    roe: 16.2, roce: 7.8, debtToEquity: 7.2, currentRatio: 1.05,
    promoterHolding: 0, fiiHolding: 54.2, diiHolding: 21.3, publicHolding: 24.5,
    beta: 0.92, cagr3y: 6.8, cagr5y: 12.4, deliveryPct: 52.1,
  },
  {
    symbol: "INFY", name: "Infosys", sector: "IT", industry: "IT Services & Consulting",
    exchange: "BOTH", price: 1834.25, change: -15.30, changePercent: -0.83, volume: 3456789,
    marketCap: "7.6L Cr", marketCapCr: 760000, high52w: 2006.45, low52w: 1358.35,
    pe: 24.6, pb: 8.4, eps: 74.6, dividendYield: 2.18, faceValue: 5, bookValue: 218,
    roe: 34.8, roce: 44.2, debtToEquity: 0.06, currentRatio: 2.86,
    promoterHolding: 14.7, fiiHolding: 34.2, diiHolding: 16.8, publicHolding: 34.3,
    beta: 0.74, cagr3y: 9.2, cagr5y: 16.8, deliveryPct: 55.4,
  },
  {
    symbol: "ICICIBANK", name: "ICICI Bank", sector: "Banking", industry: "Private Sector Banks",
    exchange: "BOTH", price: 1245.70, change: 18.90, changePercent: 1.54, volume: 5678901,
    marketCap: "8.8L Cr", marketCapCr: 880000, high52w: 1362.35, low52w: 949.90,
    pe: 17.4, pb: 2.8, eps: 71.6, dividendYield: 0.80, faceValue: 2, bookValue: 444,
    roe: 18.2, roce: 8.4, debtToEquity: 6.8, currentRatio: 1.08,
    promoterHolding: 0, fiiHolding: 47.8, diiHolding: 23.4, publicHolding: 28.8,
    beta: 1.05, cagr3y: 22.4, cagr5y: 19.8, deliveryPct: 49.8,
  },
  {
    symbol: "HINDUNILVR", name: "Hindustan Unilever", sector: "FMCG", industry: "Personal Products",
    exchange: "BOTH", price: 2567.40, change: 12.35, changePercent: 0.48, volume: 1234567,
    marketCap: "6.0L Cr", marketCapCr: 600000, high52w: 2859.60, low52w: 2172.60,
    pe: 52.4, pb: 11.2, eps: 49.0, dividendYield: 1.68, faceValue: 1, bookValue: 228,
    roe: 22.4, roce: 29.8, debtToEquity: 0.0, currentRatio: 1.52,
    promoterHolding: 61.9, fiiHolding: 16.4, diiHolding: 11.2, publicHolding: 10.5,
    beta: 0.52, cagr3y: 4.2, cagr5y: 7.8, deliveryPct: 62.3,
  },
  {
    symbol: "SBIN", name: "State Bank of India", sector: "Banking", industry: "Public Sector Banks",
    exchange: "BOTH", price: 812.55, change: -6.40, changePercent: -0.78, volume: 9876543,
    marketCap: "7.2L Cr", marketCapCr: 720000, high52w: 912.10, low52w: 600.65,
    pe: 10.2, pb: 1.4, eps: 79.7, dividendYield: 1.84, faceValue: 1, bookValue: 575,
    roe: 14.8, roce: 6.2, debtToEquity: 12.4, currentRatio: 1.02,
    promoterHolding: 57.5, fiiHolding: 14.2, diiHolding: 18.8, publicHolding: 9.5,
    beta: 1.24, cagr3y: 28.4, cagr5y: 14.2, deliveryPct: 38.7,
  },
  {
    symbol: "WIPRO", name: "Wipro", sector: "IT", industry: "IT Services & Consulting",
    exchange: "BOTH", price: 634.80, change: 8.20, changePercent: 1.31, volume: 2345678,
    marketCap: "3.3L Cr", marketCapCr: 330000, high52w: 672.75, low52w: 412.10,
    pe: 21.8, pb: 4.2, eps: 29.1, dividendYield: 0.47, faceValue: 2, bookValue: 151,
    roe: 19.2, roce: 22.8, debtToEquity: 0.04, currentRatio: 2.64,
    promoterHolding: 72.9, fiiHolding: 6.8, diiHolding: 8.4, publicHolding: 11.9,
    beta: 0.71, cagr3y: 5.8, cagr5y: 11.4, deliveryPct: 47.9,
  },
  {
    symbol: "BAJFINANCE", name: "Bajaj Finance", sector: "NBFC", industry: "Non-Banking Financial",
    exchange: "BOTH", price: 7234.50, change: 145.60, changePercent: 2.05, volume: 987654,
    marketCap: "4.4L Cr", marketCapCr: 440000, high52w: 7830.00, low52w: 6187.80,
    pe: 34.8, pb: 6.8, eps: 207.8, dividendYield: 0.28, faceValue: 2, bookValue: 1064,
    roe: 22.8, roce: 12.4, debtToEquity: 3.2, currentRatio: 1.18,
    promoterHolding: 55.8, fiiHolding: 22.4, diiHolding: 12.8, publicHolding: 9.0,
    beta: 1.38, cagr3y: 12.4, cagr5y: 28.7, deliveryPct: 42.8,
  },
  {
    symbol: "MARUTI", name: "Maruti Suzuki", sector: "Auto", industry: "Passenger Vehicles",
    exchange: "BOTH", price: 12456.75, change: -89.30, changePercent: -0.71, volume: 456789,
    marketCap: "3.7L Cr", marketCapCr: 370000, high52w: 13680.00, low52w: 9761.05,
    pe: 26.8, pb: 4.8, eps: 464.8, dividendYield: 0.68, faceValue: 5, bookValue: 2594,
    roe: 18.4, roce: 22.8, debtToEquity: 0.01, currentRatio: 0.98,
    promoterHolding: 58.2, fiiHolding: 20.4, diiHolding: 12.8, publicHolding: 8.6,
    beta: 0.82, cagr3y: 22.8, cagr5y: 14.8, deliveryPct: 56.4,
  },
  {
    symbol: "LT", name: "Larsen & Toubro", sector: "Infrastructure", industry: "Engineering & Capital Goods",
    exchange: "BOTH", price: 3567.90, change: 56.70, changePercent: 1.62, volume: 1098765,
    marketCap: "5.0L Cr", marketCapCr: 500000, high52w: 3908.80, low52w: 2924.65,
    pe: 32.4, pb: 4.4, eps: 110.1, dividendYield: 0.84, faceValue: 2, bookValue: 811,
    roe: 14.8, roce: 18.4, debtToEquity: 1.84, currentRatio: 1.12,
    promoterHolding: 0, fiiHolding: 28.4, diiHolding: 34.8, publicHolding: 36.8,
    beta: 1.18, cagr3y: 32.4, cagr5y: 18.4, deliveryPct: 51.2,
  },
  {
    symbol: "TITAN", name: "Titan Company", sector: "Consumer", industry: "Jewellery & Accessories",
    exchange: "BOTH", price: 3789.25, change: 67.80, changePercent: 1.82, volume: 678901,
    marketCap: "3.4L Cr", marketCapCr: 340000, high52w: 3886.05, low52w: 2851.65,
    pe: 78.4, pb: 18.4, eps: 48.3, dividendYield: 0.34, faceValue: 1, bookValue: 206,
    roe: 24.8, roce: 31.2, debtToEquity: 0.12, currentRatio: 1.84,
    promoterHolding: 52.9, fiiHolding: 18.4, diiHolding: 14.8, publicHolding: 13.9,
    beta: 0.88, cagr3y: 18.4, cagr5y: 24.8, deliveryPct: 58.7,
  },
  {
    symbol: "ASIANPAINT", name: "Asian Paints", sector: "Consumer", industry: "Paints & Coatings",
    exchange: "BOTH", price: 2934.60, change: -23.45, changePercent: -0.79, volume: 567890,
    marketCap: "2.8L Cr", marketCapCr: 280000, high52w: 3394.00, low52w: 2670.30,
    pe: 52.8, pb: 14.2, eps: 55.6, dividendYield: 0.78, faceValue: 1, bookValue: 206,
    roe: 28.4, roce: 36.8, debtToEquity: 0.02, currentRatio: 1.68,
    promoterHolding: 52.8, fiiHolding: 18.2, diiHolding: 16.4, publicHolding: 12.6,
    beta: 0.62, cagr3y: 2.8, cagr5y: 8.4, deliveryPct: 60.2,
  },
  {
    symbol: "AXISBANK", name: "Axis Bank", sector: "Banking", industry: "Private Sector Banks",
    exchange: "BOTH", price: 1123.40, change: 15.60, changePercent: 1.41, volume: 4567890,
    marketCap: "3.5L Cr", marketCapCr: 350000, high52w: 1339.65, low52w: 995.25,
    pe: 14.8, pb: 2.1, eps: 75.9, dividendYield: 0.18, faceValue: 2, bookValue: 534,
    roe: 16.4, roce: 7.8, debtToEquity: 7.8, currentRatio: 1.04,
    promoterHolding: 8.2, fiiHolding: 52.4, diiHolding: 18.8, publicHolding: 20.6,
    beta: 1.14, cagr3y: 14.8, cagr5y: 12.4, deliveryPct: 46.8,
  },
  {
    symbol: "SUNPHARMA", name: "Sun Pharmaceutical", sector: "Pharma", industry: "Pharmaceuticals",
    exchange: "BOTH", price: 1678.30, change: 34.50, changePercent: 2.10, volume: 1234567,
    marketCap: "4.0L Cr", marketCapCr: 400000, high52w: 1789.50, low52w: 1215.60,
    pe: 34.2, pb: 5.8, eps: 49.1, dividendYield: 0.68, faceValue: 1, bookValue: 289,
    roe: 18.4, roce: 22.8, debtToEquity: 0.18, currentRatio: 2.14,
    promoterHolding: 54.5, fiiHolding: 18.4, diiHolding: 14.8, publicHolding: 12.3,
    beta: 0.78, cagr3y: 28.4, cagr5y: 18.8, deliveryPct: 53.4,
  },
  {
    symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", sector: "Banking", industry: "Private Sector Banks",
    exchange: "BOTH", price: 1923.45, change: -12.30, changePercent: -0.64, volume: 2134567,
    marketCap: "3.8L Cr", marketCapCr: 380000, high52w: 2148.15, low52w: 1543.85,
    pe: 22.4, pb: 3.4, eps: 85.9, dividendYield: 0.10, faceValue: 5, bookValue: 565,
    roe: 15.8, roce: 8.4, debtToEquity: 5.4, currentRatio: 1.08,
    promoterHolding: 26.1, fiiHolding: 38.4, diiHolding: 20.8, publicHolding: 14.7,
    beta: 0.88, cagr3y: 8.4, cagr5y: 10.2, deliveryPct: 52.8,
  },
  {
    symbol: "ULTRACEMCO", name: "UltraTech Cement", sector: "Cement", industry: "Cement & Cement Products",
    exchange: "BOTH", price: 11234.70, change: 234.50, changePercent: 2.13, volume: 234567,
    marketCap: "3.2L Cr", marketCapCr: 320000, high52w: 12048.00, low52w: 8324.30,
    pe: 42.8, pb: 6.4, eps: 262.5, dividendYield: 0.34, faceValue: 10, bookValue: 1755,
    roe: 15.8, roce: 18.4, debtToEquity: 0.48, currentRatio: 0.82,
    promoterHolding: 59.7, fiiHolding: 20.4, diiHolding: 12.8, publicHolding: 7.1,
    beta: 0.92, cagr3y: 14.2, cagr5y: 12.8, deliveryPct: 48.4,
  },
  {
    symbol: "NESTLEIND", name: "Nestle India", sector: "FMCG", industry: "Food Processing",
    exchange: "BOTH", price: 2456.80, change: -18.70, changePercent: -0.76, volume: 123456,
    marketCap: "2.4L Cr", marketCapCr: 240000, high52w: 2778.15, low52w: 2232.50,
    pe: 68.4, pb: 82.4, eps: 35.9, dividendYield: 1.84, faceValue: 10, bookValue: 29.8,
    roe: 128.4, roce: 172.4, debtToEquity: 0.0, currentRatio: 0.72,
    promoterHolding: 62.8, fiiHolding: 12.4, diiHolding: 10.8, publicHolding: 14.0,
    beta: 0.44, cagr3y: 4.8, cagr5y: 10.4, deliveryPct: 64.8,
  },
  {
    symbol: "POWERGRID", name: "Power Grid Corp", sector: "Utilities", industry: "Power Transmission",
    exchange: "BOTH", price: 334.25, change: 7.80, changePercent: 2.39, volume: 5678901,
    marketCap: "3.1L Cr", marketCapCr: 310000, high52w: 366.20, low52w: 229.55,
    pe: 18.4, pb: 3.2, eps: 18.2, dividendYield: 4.28, faceValue: 10, bookValue: 104,
    roe: 18.4, roce: 12.8, debtToEquity: 2.14, currentRatio: 0.68,
    promoterHolding: 51.3, fiiHolding: 18.8, diiHolding: 22.4, publicHolding: 7.5,
    beta: 0.58, cagr3y: 42.8, cagr5y: 18.4, deliveryPct: 44.8,
  },
  {
    symbol: "NTPC", name: "NTPC Limited", sector: "Utilities", industry: "Power Generation",
    exchange: "BOTH", price: 389.45, change: 5.60, changePercent: 1.46, volume: 8901234,
    marketCap: "3.8L Cr", marketCapCr: 380000, high52w: 448.45, low52w: 263.75,
    pe: 14.8, pb: 1.8, eps: 26.3, dividendYield: 2.58, faceValue: 10, bookValue: 216,
    roe: 12.8, roce: 9.4, debtToEquity: 1.84, currentRatio: 0.84,
    promoterHolding: 51.1, fiiHolding: 14.8, diiHolding: 24.8, publicHolding: 9.3,
    beta: 0.72, cagr3y: 52.4, cagr5y: 14.8, deliveryPct: 41.2,
  },
  {
    symbol: "ADANIENT", name: "Adani Enterprises", sector: "Conglomerate", industry: "Diversified",
    exchange: "BOTH", price: 2456.80, change: 42.30, changePercent: 1.75, volume: 3456789,
    marketCap: "2.8L Cr", marketCapCr: 280000, high52w: 3743.90, low52w: 1920.80,
    pe: 72.4, pb: 6.8, eps: 33.9, dividendYield: 0.04, faceValue: 1, bookValue: 361,
    roe: 9.8, roce: 11.4, debtToEquity: 1.24, currentRatio: 1.14,
    promoterHolding: 72.6, fiiHolding: 8.4, diiHolding: 6.8, publicHolding: 12.2,
    beta: 1.52, cagr3y: 18.4, cagr5y: 42.8, deliveryPct: 32.4,
  },
  {
    symbol: "TATAMOTORS", name: "Tata Motors", sector: "Auto", industry: "Commercial Vehicles",
    exchange: "BOTH", price: 987.65, change: 18.40, changePercent: 1.90, volume: 7234567,
    marketCap: "3.6L Cr", marketCapCr: 360000, high52w: 1063.70, low52w: 740.60,
    pe: 12.4, pb: 2.8, eps: 79.6, dividendYield: 0.20, faceValue: 2, bookValue: 352,
    roe: 24.8, roce: 14.8, debtToEquity: 1.64, currentRatio: 0.88,
    promoterHolding: 46.4, fiiHolding: 24.8, diiHolding: 14.8, publicHolding: 14.0,
    beta: 1.44, cagr3y: 64.8, cagr5y: 18.4, deliveryPct: 38.8,
  },
  {
    symbol: "HCLTECH", name: "HCL Technologies", sector: "IT", industry: "IT Services & Consulting",
    exchange: "BOTH", price: 1834.50, change: 24.80, changePercent: 1.37, volume: 2897654,
    marketCap: "4.9L Cr", marketCapCr: 490000, high52w: 1944.80, low52w: 1235.50,
    pe: 27.8, pb: 7.4, eps: 66.0, dividendYield: 2.84, faceValue: 2, bookValue: 248,
    roe: 28.4, roce: 36.8, debtToEquity: 0.04, currentRatio: 2.84,
    promoterHolding: 60.8, fiiHolding: 18.4, diiHolding: 12.8, publicHolding: 8.0,
    beta: 0.72, cagr3y: 22.8, cagr5y: 18.4, deliveryPct: 54.2,
  },
  {
    symbol: "ONGC", name: "Oil & Natural Gas Corp", sector: "Energy", industry: "Oil & Gas Exploration",
    exchange: "BOTH", price: 278.45, change: -4.20, changePercent: -1.49, volume: 12345678,
    marketCap: "3.5L Cr", marketCapCr: 350000, high52w: 345.00, low52w: 185.70,
    pe: 8.4, pb: 1.1, eps: 33.1, dividendYield: 5.84, faceValue: 5, bookValue: 253,
    roe: 13.8, roce: 16.4, debtToEquity: 0.48, currentRatio: 1.14,
    promoterHolding: 58.9, fiiHolding: 10.4, diiHolding: 18.8, publicHolding: 11.9,
    beta: 1.08, cagr3y: 28.4, cagr5y: 8.4, deliveryPct: 36.8,
  },
  {
    symbol: "DRREDDY", name: "Dr. Reddy's Laboratories", sector: "Pharma", industry: "Pharmaceuticals",
    exchange: "BOTH", price: 6234.80, change: 112.40, changePercent: 1.84, volume: 456789,
    marketCap: "1.04L Cr", marketCapCr: 104000, high52w: 6800.00, low52w: 4960.00,
    pe: 18.4, pb: 4.8, eps: 338.8, dividendYield: 0.48, faceValue: 5, bookValue: 1299,
    roe: 24.8, roce: 29.4, debtToEquity: 0.14, currentRatio: 1.84,
    promoterHolding: 26.7, fiiHolding: 28.4, diiHolding: 22.4, publicHolding: 22.5,
    beta: 0.64, cagr3y: 14.8, cagr5y: 12.8, deliveryPct: 56.8,
  },
  // Auto
  {
    symbol: "BAJAJ-AUTO", name: "Bajaj Auto", sector: "Auto", industry: "Two & Three Wheelers",
    exchange: "BOTH", price: 8934.50, change: 124.30, changePercent: 1.41, volume: 345678,
    marketCap: "2.6L Cr", marketCapCr: 260000, high52w: 10000.00, low52w: 6534.10,
    pe: 28.4, pb: 7.2, eps: 314.6, dividendYield: 1.24, faceValue: 10, bookValue: 1241,
    roe: 28.4, roce: 35.8, debtToEquity: 0.0, currentRatio: 1.84,
    promoterHolding: 54.9, fiiHolding: 16.4, diiHolding: 14.8, publicHolding: 13.9,
    beta: 0.84, cagr3y: 28.4, cagr5y: 22.8, deliveryPct: 52.4,
  },
  {
    symbol: "HEROMOTOCO", name: "Hero MotoCorp", sector: "Auto", industry: "Two & Three Wheelers",
    exchange: "BOTH", price: 4234.60, change: -34.50, changePercent: -0.81, volume: 234567,
    marketCap: "0.85L Cr", marketCapCr: 85000, high52w: 5235.00, low52w: 3050.40,
    pe: 20.8, pb: 4.8, eps: 203.6, dividendYield: 2.48, faceValue: 2, bookValue: 882,
    roe: 24.8, roce: 30.2, debtToEquity: 0.0, currentRatio: 1.34,
    promoterHolding: 34.8, fiiHolding: 28.4, diiHolding: 18.4, publicHolding: 18.4,
    beta: 0.74, cagr3y: 18.4, cagr5y: 8.4, deliveryPct: 54.8,
  },
  {
    symbol: "M&M", name: "Mahindra & Mahindra", sector: "Auto", industry: "SUV & Tractors",
    exchange: "BOTH", price: 2834.70, change: 52.40, changePercent: 1.88, volume: 1234567,
    marketCap: "3.5L Cr", marketCapCr: 350000, high52w: 3222.00, low52w: 1575.00,
    pe: 24.8, pb: 5.2, eps: 114.3, dividendYield: 0.56, faceValue: 5, bookValue: 545,
    roe: 22.4, roce: 18.8, debtToEquity: 0.28, currentRatio: 1.12,
    promoterHolding: 18.6, fiiHolding: 34.8, diiHolding: 20.4, publicHolding: 26.2,
    beta: 1.04, cagr3y: 58.4, cagr5y: 28.4, deliveryPct: 46.8,
  },
  // Metals
  {
    symbol: "TATASTEEL", name: "Tata Steel", sector: "Metals", industry: "Steel",
    exchange: "BOTH", price: 178.45, change: -2.30, changePercent: -1.27, volume: 18234567,
    marketCap: "2.2L Cr", marketCapCr: 220000, high52w: 189.10, low52w: 108.70,
    pe: 14.8, pb: 1.8, eps: 12.1, dividendYield: 2.24, faceValue: 1, bookValue: 99,
    roe: 12.8, roce: 10.4, debtToEquity: 1.24, currentRatio: 0.88,
    promoterHolding: 33.2, fiiHolding: 24.8, diiHolding: 22.4, publicHolding: 19.6,
    beta: 1.48, cagr3y: 22.8, cagr5y: 8.4, deliveryPct: 34.8,
  },
  {
    symbol: "HINDALCO", name: "Hindalco Industries", sector: "Metals", industry: "Aluminium",
    exchange: "BOTH", price: 678.90, change: 12.40, changePercent: 1.86, volume: 5678901,
    marketCap: "1.5L Cr", marketCapCr: 150000, high52w: 734.00, low52w: 466.30,
    pe: 12.4, pb: 2.1, eps: 54.7, dividendYield: 0.59, faceValue: 1, bookValue: 323,
    roe: 14.8, roce: 12.4, debtToEquity: 0.88, currentRatio: 1.08,
    promoterHolding: 34.6, fiiHolding: 28.4, diiHolding: 18.8, publicHolding: 18.2,
    beta: 1.28, cagr3y: 24.8, cagr5y: 14.8, deliveryPct: 38.4,
  },
  // FMCG
  {
    symbol: "ITC", name: "ITC Limited", sector: "FMCG", industry: "Cigarettes & Consumer Goods",
    exchange: "BOTH", price: 456.80, change: 3.40, changePercent: 0.75, volume: 14567890,
    marketCap: "5.7L Cr", marketCapCr: 570000, high52w: 528.50, low52w: 399.35,
    pe: 28.4, pb: 8.4, eps: 16.1, dividendYield: 2.84, faceValue: 1, bookValue: 54,
    roe: 28.4, roce: 36.8, debtToEquity: 0.0, currentRatio: 2.14,
    promoterHolding: 0.0, fiiHolding: 42.4, diiHolding: 28.4, publicHolding: 29.2,
    beta: 0.54, cagr3y: 12.8, cagr5y: 6.4, deliveryPct: 58.4,
  },
  {
    symbol: "DABUR", name: "Dabur India", sector: "FMCG", industry: "FMCG - Household & Personal Products",
    exchange: "BOTH", price: 534.25, change: -4.80, changePercent: -0.89, volume: 1234567,
    marketCap: "0.95L Cr", marketCapCr: 95000, high52w: 647.75, low52w: 498.50,
    pe: 48.4, pb: 12.4, eps: 11.0, dividendYield: 0.88, faceValue: 1, bookValue: 43,
    roe: 22.8, roce: 28.4, debtToEquity: 0.0, currentRatio: 1.84,
    promoterHolding: 67.9, fiiHolding: 12.4, diiHolding: 12.8, publicHolding: 6.9,
    beta: 0.48, cagr3y: 4.8, cagr5y: 8.4, deliveryPct: 60.4,
  },
  // Pharma
  {
    symbol: "CIPLA", name: "Cipla", sector: "Pharma", industry: "Pharmaceuticals",
    exchange: "BOTH", price: 1578.40, change: 28.70, changePercent: 1.85, volume: 987654,
    marketCap: "1.27L Cr", marketCapCr: 127000, high52w: 1702.00, low52w: 1144.70,
    pe: 26.8, pb: 4.8, eps: 58.9, dividendYield: 0.48, faceValue: 2, bookValue: 329,
    roe: 18.4, roce: 22.8, debtToEquity: 0.08, currentRatio: 1.98,
    promoterHolding: 33.5, fiiHolding: 24.8, diiHolding: 18.4, publicHolding: 23.3,
    beta: 0.68, cagr3y: 22.4, cagr5y: 14.8, deliveryPct: 55.8,
  },
  // Telecom
  {
    symbol: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom", industry: "Telecommunications",
    exchange: "BOTH", price: 1834.70, change: 34.20, changePercent: 1.90, volume: 4567890,
    marketCap: "11.0L Cr", marketCapCr: 1100000, high52w: 1967.00, low52w: 1127.35,
    pe: 68.4, pb: 8.4, eps: 26.8, dividendYield: 0.28, faceValue: 5, bookValue: 218,
    roe: 14.8, roce: 8.4, debtToEquity: 2.84, currentRatio: 0.58,
    promoterHolding: 55.8, fiiHolding: 20.4, diiHolding: 12.8, publicHolding: 11.0,
    beta: 0.88, cagr3y: 34.8, cagr5y: 22.4, deliveryPct: 48.4,
  },
  // Insurance
  {
    symbol: "HDFCLIFE", name: "HDFC Life Insurance", sector: "Insurance", industry: "Life Insurance",
    exchange: "BOTH", price: 678.90, change: 8.40, changePercent: 1.25, volume: 2345678,
    marketCap: "1.46L Cr", marketCapCr: 146000, high52w: 761.20, low52w: 511.40,
    pe: 78.4, pb: 9.8, eps: 8.7, dividendYield: 0.34, faceValue: 10, bookValue: 69,
    roe: 12.8, roce: 9.4, debtToEquity: 0.0, currentRatio: 1.24,
    promoterHolding: 50.4, fiiHolding: 22.4, diiHolding: 14.8, publicHolding: 12.4,
    beta: 0.82, cagr3y: 8.4, cagr5y: 12.8, deliveryPct: 52.4,
  },
  // Real Estate
  {
    symbol: "DLF", name: "DLF Limited", sector: "Real Estate", industry: "Real Estate Development",
    exchange: "BOTH", price: 834.50, change: 18.40, changePercent: 2.25, volume: 5678901,
    marketCap: "2.07L Cr", marketCapCr: 207000, high52w: 967.00, low52w: 517.60,
    pe: 48.4, pb: 5.8, eps: 17.2, dividendYield: 0.48, faceValue: 2, bookValue: 144,
    roe: 12.4, roce: 9.8, debtToEquity: 0.28, currentRatio: 1.14,
    promoterHolding: 74.1, fiiHolding: 12.4, diiHolding: 8.8, publicHolding: 4.7,
    beta: 1.18, cagr3y: 42.8, cagr5y: 18.4, deliveryPct: 44.8,
  },
  // IT - more
  {
    symbol: "TECHM", name: "Tech Mahindra", sector: "IT", industry: "IT Services & Consulting",
    exchange: "BOTH", price: 1534.70, change: 24.50, changePercent: 1.62, volume: 1987654,
    marketCap: "1.5L Cr", marketCapCr: 150000, high52w: 1807.50, low52w: 1166.35,
    pe: 42.4, pb: 5.8, eps: 36.2, dividendYield: 1.48, faceValue: 5, bookValue: 265,
    roe: 14.8, roce: 18.4, debtToEquity: 0.02, currentRatio: 2.24,
    promoterHolding: 35.1, fiiHolding: 22.4, diiHolding: 18.8, publicHolding: 23.7,
    beta: 0.92, cagr3y: 12.4, cagr5y: 8.4, deliveryPct: 48.4,
  },
  {
    symbol: "PERSISTENT", name: "Persistent Systems", sector: "IT", industry: "IT Services & Consulting",
    exchange: "BOTH", price: 5834.60, change: 112.40, changePercent: 1.97, volume: 234567,
    marketCap: "0.90L Cr", marketCapCr: 90000, high52w: 6788.50, low52w: 3244.50,
    pe: 72.4, pb: 18.4, eps: 80.6, dividendYield: 0.48, faceValue: 5, bookValue: 317,
    roe: 28.4, roce: 36.8, debtToEquity: 0.0, currentRatio: 3.14,
    promoterHolding: 31.2, fiiHolding: 24.8, diiHolding: 18.4, publicHolding: 25.6,
    beta: 1.08, cagr3y: 58.4, cagr5y: 38.4, deliveryPct: 52.4,
  },
  // Banking
  {
    symbol: "INDUSINDBK", name: "IndusInd Bank", sector: "Banking", industry: "Private Sector Banks",
    exchange: "BOTH", price: 1012.40, change: -18.70, changePercent: -1.81, volume: 3456789,
    marketCap: "0.79L Cr", marketCapCr: 79000, high52w: 1695.55, low52w: 880.00,
    pe: 10.8, pb: 1.4, eps: 93.7, dividendYield: 1.48, faceValue: 10, bookValue: 723,
    roe: 14.8, roce: 6.8, debtToEquity: 6.4, currentRatio: 1.02,
    promoterHolding: 16.4, fiiHolding: 42.8, diiHolding: 18.4, publicHolding: 22.4,
    beta: 1.38, cagr3y: -12.4, cagr5y: -4.8, deliveryPct: 38.4,
  },
  // Coal & Energy
  {
    symbol: "COALINDIA", name: "Coal India", sector: "Energy", industry: "Coal Mining",
    exchange: "BOTH", price: 456.80, change: 8.40, changePercent: 1.88, volume: 9876543,
    marketCap: "2.8L Cr", marketCapCr: 280000, high52w: 543.55, low52w: 347.50,
    pe: 8.8, pb: 2.8, eps: 51.9, dividendYield: 5.84, faceValue: 10, bookValue: 163,
    roe: 34.8, roce: 44.8, debtToEquity: 0.0, currentRatio: 1.28,
    promoterHolding: 63.1, fiiHolding: 8.4, diiHolding: 18.8, publicHolding: 9.7,
    beta: 0.88, cagr3y: 14.8, cagr5y: 8.4, deliveryPct: 42.8,
  },
  // Defence
  {
    symbol: "HAL", name: "Hindustan Aeronautics", sector: "Defence", industry: "Aerospace & Defence",
    exchange: "BOTH", price: 4234.70, change: 84.50, changePercent: 2.04, volume: 456789,
    marketCap: "2.84L Cr", marketCapCr: 284000, high52w: 5674.80, low52w: 2452.00,
    pe: 34.8, pb: 8.4, eps: 121.6, dividendYield: 1.08, faceValue: 10, bookValue: 504,
    roe: 28.4, roce: 34.8, debtToEquity: 0.0, currentRatio: 1.88,
    promoterHolding: 71.6, fiiHolding: 8.4, diiHolding: 12.8, publicHolding: 7.2,
    beta: 0.94, cagr3y: 72.4, cagr5y: 38.4, deliveryPct: 48.8,
  },
  // Railways/Infrastructure
  {
    symbol: "IRCTC", name: "Indian Railway Catering", sector: "Tourism", industry: "Travel & Tourism",
    exchange: "BOTH", price: 834.50, change: 12.40, changePercent: 1.51, volume: 1234567,
    marketCap: "0.66L Cr", marketCapCr: 66000, high52w: 1110.00, low52w: 718.00,
    pe: 52.4, pb: 18.4, eps: 15.9, dividendYield: 0.72, faceValue: 2, bookValue: 45,
    roe: 38.4, roce: 48.4, debtToEquity: 0.0, currentRatio: 3.14,
    promoterHolding: 62.4, fiiHolding: 18.4, diiHolding: 10.4, publicHolding: 8.8,
    beta: 1.24, cagr3y: 18.4, cagr5y: 34.8, deliveryPct: 52.4,
  },
];

export const PORTFOLIO: Holding[] = [
  { symbol: "RELIANCE", name: "Reliance Industries", qty: 50, avgPrice: 2650.00, currentPrice: 2847.35, sector: "Energy" },
  { symbol: "TCS", name: "Tata Consultancy Services", qty: 25, avgPrice: 3750.00, currentPrice: 3912.60, sector: "IT" },
  { symbol: "HDFCBANK", name: "HDFC Bank", qty: 100, avgPrice: 1580.00, currentPrice: 1678.90, sector: "Banking" },
  { symbol: "INFY", name: "Infosys", qty: 75, avgPrice: 1920.00, currentPrice: 1834.25, sector: "IT" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", qty: 15, avgPrice: 6800.00, currentPrice: 7234.50, sector: "NBFC" },
  { symbol: "TITAN", name: "Titan Company", qty: 30, avgPrice: 3400.00, currentPrice: 3789.25, sector: "Consumer" },
  { symbol: "ICICIBANK", name: "ICICI Bank", qty: 80, avgPrice: 1150.00, currentPrice: 1245.70, sector: "Banking" },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical", qty: 45, avgPrice: 1550.00, currentPrice: 1678.30, sector: "Pharma" },
];

export const SECTOR_DATA = [
  { sector: "IT", change: 0.91, stocks: 8 },
  { sector: "Banking", change: 1.12, stocks: 12 },
  { sector: "Energy", change: 1.22, stocks: 5 },
  { sector: "FMCG", change: 0.35, stocks: 7 },
  { sector: "Pharma", change: 1.87, stocks: 9 },
  { sector: "Auto", change: -0.45, stocks: 6 },
  { sector: "Infrastructure", change: 1.34, stocks: 4 },
  { sector: "NBFC", change: 1.95, stocks: 5 },
  { sector: "Metals", change: -1.23, stocks: 7 },
  { sector: "Cement", change: 2.13, stocks: 4 },
  { sector: "Utilities", change: 1.78, stocks: 6 },
  { sector: "Consumer", change: 0.67, stocks: 8 },
];

export const IPO_DATA = [
  { company: "Swiggy", symbol: "SWIGGY", sector: "Tech", price: 390, gmpPercent: 12.4, opens: "Open Now", lot: 38, rating: 4.2, exchange: "NSE" },
  { company: "Ola Electric", symbol: "OLAELEC", sector: "EV/Auto", price: 91, gmpPercent: -3.8, opens: "Open Now", lot: 165, rating: 3.8, exchange: "BOTH" },
  { company: "FirstCry", symbol: "FIRSTCRY", sector: "E-Commerce", price: 465, gmpPercent: 8.2, opens: "Upcoming", lot: 32, rating: 4.0, exchange: "NSE" },
  { company: "NSDL", symbol: "NSDL", sector: "Financial Services", price: 280, gmpPercent: 22.4, opens: "Upcoming", lot: 53, rating: 4.5, exchange: "BOTH" },
  { company: "PhysicsWallah", symbol: "PW", sector: "EdTech", price: 120, gmpPercent: 18.8, opens: "Soon", lot: 125, rating: 3.9, exchange: "NSE" },
  { company: "Go Digit Insurance", symbol: "GODIGIT", sector: "Insurance", price: 272, gmpPercent: 5.4, opens: "Open Now", lot: 55, rating: 3.6, exchange: "BSE" },
];

export const MF_DATA = [
  { name: "Mirae Asset Large Cap Fund", aum: "₹32,450 Cr", nav: 98.45, returns1y: 24.8, returns3y: 18.4, rating: 5, category: "Large Cap" },
  { name: "Parag Parikh Flexi Cap Fund", aum: "₹68,234 Cr", nav: 72.34, returns1y: 28.4, returns3y: 22.8, rating: 5, category: "Flexi Cap" },
  { name: "Axis Small Cap Fund", aum: "₹18,340 Cr", nav: 102.45, returns1y: 38.4, returns3y: 28.4, rating: 4, category: "Small Cap" },
  { name: "SBI Bluechip Fund", aum: "₹42,560 Cr", nav: 76.23, returns1y: 18.4, returns3y: 14.8, rating: 4, category: "Large Cap" },
  { name: "HDFC Mid-Cap Opportunities", aum: "₹64,450 Cr", nav: 134.56, returns1y: 44.8, returns3y: 32.4, rating: 5, category: "Mid Cap" },
  { name: "Nippon India Small Cap", aum: "₹52,340 Cr", nav: 148.23, returns1y: 52.4, returns3y: 34.8, rating: 4, category: "Small Cap" },
];

export const GLOBAL_INDICES = [
  { name: "S&P 500", value: 5812.34, change: 0.84, country: "🇺🇸" },
  { name: "NASDAQ", value: 18234.56, change: 1.24, country: "🇺🇸" },
  { name: "DOW JONES", value: 42567.89, change: 0.48, country: "🇺🇸" },
  { name: "FTSE 100", value: 8234.56, change: -0.28, country: "🇬🇧" },
  { name: "DAX", value: 19456.78, change: 0.64, country: "🇩🇪" },
  { name: "NIKKEI 225", value: 38234.56, change: 1.14, country: "🇯🇵" },
  { name: "HANG SENG", value: 22456.78, change: -0.84, country: "🇭🇰" },
  { name: "SHANGHAI", value: 3456.78, change: 0.24, country: "🇨🇳" },
];

function seedRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateChartData(symbol: string, days = 60): ChartPoint[] {
  const stock = STOCKS.find((s) => s.symbol === symbol);
  const basePrice = stock ? stock.price * 0.88 : 1000;
  const rng = seedRandom(symbol.charCodeAt(0) * 31 + symbol.charCodeAt(1));
  const data: ChartPoint[] = [];
  let price = basePrice;
  const now = new Date("2026-05-13");

  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const skip = d.getDay() === 0 || d.getDay() === 6;
    if (skip) continue;
    const open = price;
    const move = (rng() - 0.47) * price * 0.022;
    const close = open + move;
    const wick = rng() * price * 0.008;
    price = close;
    data.push({
      date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      open: +open.toFixed(2),
      close: +close.toFixed(2),
      high: +(Math.max(open, close) + wick).toFixed(2),
      low: +(Math.min(open, close) - wick).toFixed(2),
      volume: Math.floor(rng() * 6000000 + 800000),
    });
  }
  return data;
}

export function generateNiftyHistory(days = 90) {
  const rng = seedRandom(42);
  let value = 22400;
  const data = [];
  const now = new Date("2026-05-13");
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    value += (rng() - 0.46) * 130;
    data.push({
      date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      value: +value.toFixed(2),
    });
  }
  return data;
}

export function generatePortfolioPnL() {
  const rng = seedRandom(99);
  let base = 520000;
  const data = [];
  const now = new Date("2026-05-13");
  for (let i = 30; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    base += (rng() - 0.44) * 8000;
    data.push({
      date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      value: +base.toFixed(0),
    });
  }
  return data;
}

export function generateQuarterlyResults(symbol: string): QuarterlyResult[] {
  const stock = STOCKS.find(s => s.symbol === symbol);
  const rng = seedRandom((symbol.charCodeAt(0) * 17 + 5) % 2147483646);
  const quarters = ["Q1 FY26", "Q4 FY25", "Q3 FY25", "Q2 FY25", "Q1 FY25", "Q4 FY24"];
  let baseRevenue = (stock?.marketCapCr ?? 10000) * 0.12;
  let baseProfit = baseRevenue * 0.18;
  return quarters.map(q => {
    const rg = (rng() - 0.42) * 0.12;
    const pg = (rng() - 0.38) * 0.18;
    baseRevenue *= (1 + rg);
    baseProfit *= (1 + pg);
    return {
      quarter: q,
      revenue: +baseRevenue.toFixed(0),
      profit: +baseProfit.toFixed(0),
      eps: +(baseProfit / 850).toFixed(2),
      revenueGrowth: +(rg * 100).toFixed(1),
      profitGrowth: +(pg * 100).toFixed(1),
    };
  });
}

export function generateShareholdingPattern(symbol: string): ShareholdingPattern[] {
  const stock = STOCKS.find(s => s.symbol === symbol);
  const quarters = ["Jun 2025", "Mar 2025", "Dec 2024", "Sep 2024"];
  return quarters.map((q, i) => ({
    quarter: q,
    promoter: (stock?.promoterHolding ?? 50) + (i * 0.1),
    fii: (stock?.fiiHolding ?? 20) - (i * 0.08),
    dii: (stock?.diiHolding ?? 15) + (i * 0.04),
    public: (stock?.publicHolding ?? 15) - (i * 0.06),
  }));
}

export function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals });
}

export function fmtCompact(n: number) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`;
  if (n >= 1e3) return `₹${(n / 1e3).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
}
