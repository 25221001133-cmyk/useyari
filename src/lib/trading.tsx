'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STOCKS, PORTFOLIO } from './data';

export type Order = {
  id: string;
  symbol: string;
  name: string;
  side: 'BUY' | 'SELL';
  qty: number;
  price: number;
  type: 'MARKET' | 'LIMIT' | 'SL';
  status: 'EXECUTED' | 'PENDING' | 'CANCELLED';
  timestamp: string;
  value: number;
  pnl?: number;
};

export type Position = {
  symbol: string;
  name: string;
  qty: number;
  avgPrice: number;
  currentPrice: number;
  sector: string;
  pnl: number;
  pnlPct: number;
  invested: number;
  current: number;
};

type TradingCtx = {
  balance: number;
  positions: Position[];
  orders: Order[];
  totalInvested: number;
  totalCurrent: number;
  totalPnL: number;
  totalPnLPct: number;
  livePrices: Record<string, number>;
  placeOrder: (symbol: string, side: 'BUY' | 'SELL', qty: number, type: 'MARKET' | 'LIMIT' | 'SL', limitPrice?: number) => { ok: boolean; msg: string };
};

const Ctx = createContext<TradingCtx>({} as TradingCtx);

const INITIAL_BALANCE = 1000000;

function initPositions(): Position[] {
  return PORTFOLIO.map(h => {
    const stock = STOCKS.find(s => s.symbol === h.symbol)!;
    const invested = h.qty * h.avgPrice;
    const current = h.qty * stock.price;
    return {
      symbol: h.symbol,
      name: h.name,
      qty: h.qty,
      avgPrice: h.avgPrice,
      currentPrice: stock.price,
      sector: h.sector,
      pnl: current - invested,
      pnlPct: ((current - invested) / invested) * 100,
      invested,
      current,
    };
  });
}

function initLivePrices(): Record<string, number> {
  return Object.fromEntries(STOCKS.map(s => [s.symbol, s.price]));
}

export function TradingProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [positions, setPositions] = useState<Position[]>(initPositions);
  const [orders, setOrders] = useState<Order[]>([]);
  const [livePrices, setLivePrices] = useState<Record<string, number>>(initLivePrices);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrices(prev => {
        const next = { ...prev };
        STOCKS.forEach(s => {
          const delta = s.price * (Math.random() * 0.006 - 0.003);
          next[s.symbol] = Math.max(1, +(prev[s.symbol] + delta).toFixed(2));
        });
        // Sync positions with new live prices
        setPositions(pos => pos.map(p => {
          const lp = next[p.symbol] ?? p.currentPrice;
          const newCurrent = p.qty * lp;
          const newPnl = newCurrent - p.invested;
          return { ...p, currentPrice: lp, current: newCurrent, pnl: newPnl, pnlPct: (newPnl / p.invested) * 100 };
        }));
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const totalInvested = positions.reduce((s, p) => s + p.invested, 0);
  const totalCurrent = positions.reduce((s, p) => s + p.current, 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const placeOrder = useCallback((
    symbol: string, side: 'BUY' | 'SELL', qty: number,
    type: 'MARKET' | 'LIMIT' | 'SL', limitPrice?: number
  ): { ok: boolean; msg: string } => {
    const stock = STOCKS.find(s => s.symbol === symbol);
    if (!stock) return { ok: false, msg: 'Stock not found' };

    const execPrice = type === 'MARKET' ? stock.price : (limitPrice ?? stock.price);
    const value = qty * execPrice;

    if (side === 'BUY') {
      if (value > balance) return { ok: false, msg: `Insufficient balance. Need ₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` };
      setBalance(b => b - value);
      setPositions(prev => {
        const existing = prev.find(p => p.symbol === symbol);
        if (existing) {
          const newQty = existing.qty + qty;
          const newAvg = (existing.invested + value) / newQty;
          const newInvested = newQty * newAvg;
          const newCurrent = newQty * stock.price;
          return prev.map(p => p.symbol === symbol ? {
            ...p, qty: newQty, avgPrice: newAvg, invested: newInvested,
            current: newCurrent, pnl: newCurrent - newInvested,
            pnlPct: ((newCurrent - newInvested) / newInvested) * 100,
          } : p);
        }
        const invested = value;
        const current = qty * stock.price;
        return [...prev, {
          symbol, name: stock.name, qty, avgPrice: execPrice, currentPrice: stock.price,
          sector: stock.sector, invested, current, pnl: current - invested,
          pnlPct: ((current - invested) / invested) * 100,
        }];
      });
    } else {
      const pos = positions.find(p => p.symbol === symbol);
      if (!pos || pos.qty < qty) return { ok: false, msg: `Insufficient holdings. Have ${pos?.qty ?? 0} shares` };
      const realizedPnl = qty * (execPrice - pos.avgPrice);
      setBalance(b => b + value);
      setPositions(prev => {
        const newQty = (prev.find(p => p.symbol === symbol)?.qty ?? 0) - qty;
        if (newQty === 0) return prev.filter(p => p.symbol !== symbol);
        return prev.map(p => {
          if (p.symbol !== symbol) return p;
          const newInvested = newQty * p.avgPrice;
          const newCurrent = newQty * stock.price;
          return { ...p, qty: newQty, invested: newInvested, current: newCurrent,
            pnl: newCurrent - newInvested, pnlPct: ((newCurrent - newInvested) / newInvested) * 100 };
        });
      });
      void realizedPnl;
    }

    const order: Order = {
      id: `ORD${Date.now()}`,
      symbol, name: stock.name, side, qty, price: execPrice, type,
      status: 'EXECUTED',
      timestamp: new Date().toLocaleString('en-IN'),
      value,
    };
    setOrders(prev => [order, ...prev]);
    return { ok: true, msg: `${side} order for ${qty} × ${symbol} executed at ₹${execPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` };
  }, [balance, positions]);

  return (
    <Ctx.Provider value={{ balance, positions, orders, totalInvested, totalCurrent, totalPnL, totalPnLPct, livePrices, placeOrder }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTrading = () => useContext(Ctx);
