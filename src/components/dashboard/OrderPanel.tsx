'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { STOCKS } from '@/lib/data';
import { useTrading } from '@/lib/trading';

export default function OrderPanel() {
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [symbol, setSymbol] = useState('RELIANCE');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'SL'>('MARKET');
  const [qty, setQty] = useState(1);
  const [limitPrice, setLimitPrice] = useState('');
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(true);
  const [flash, setFlash] = useState(false);
  const { placeOrder, balance } = useTrading();

  const stock = STOCKS.find(s => s.symbol === symbol)!;
  const price = orderType === 'MARKET' ? stock.price : parseFloat(limitPrice) || 0;
  const estValue = qty * price;

  const handleOrder = () => {
    const result = placeOrder(symbol, side, qty, orderType, orderType !== 'MARKET' ? parseFloat(limitPrice) : undefined);
    setMsg(result.msg);
    setOk(result.ok);
    setFlash(true);
    setTimeout(() => setFlash(false), 3000);
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
        <ShoppingCart size={14} style={{ color: 'var(--accent)' }} />
        <h3 className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>Place Order</h3>
        <span className="ml-auto text-[10px] font-semibold" style={{ color: 'var(--text3)' }}>
          ₹{(balance / 1e5).toFixed(1)}L avail.
        </span>
      </div>

      <div className="p-5">
        {/* BUY/SELL */}
        <div className="flex rounded-xl overflow-hidden mb-4" style={{ border: '1px solid var(--border)' }}>
          {(['BUY', 'SELL'] as const).map(s => (
            <button key={s} onClick={() => setSide(s)}
              className="flex-1 py-2.5 text-[13px] font-black transition-all"
              style={{
                background: side === s ? (s === 'BUY' ? 'var(--green)' : 'var(--red)') : 'transparent',
                color: side === s ? '#fff' : 'var(--text3)',
              }}>
              {s}
            </button>
          ))}
        </div>

        {/* Stock select */}
        <div className="mb-3">
          <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text3)' }}>Stock</label>
          <select value={symbol} onChange={e => setSymbol(e.target.value)}
            className="w-full h-9 px-3 rounded-lg text-[12px] outline-none appearance-none transition-all"
            style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}>
            {STOCKS.map(s => (
              <option key={s.symbol} value={s.symbol}>{s.symbol} — ₹{s.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text3)' }}>Order Type</label>
            <select value={orderType} onChange={e => setOrderType(e.target.value as 'MARKET' | 'LIMIT' | 'SL')}
              className="w-full h-9 px-3 rounded-lg text-[12px] outline-none appearance-none transition-all"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              <option value="MARKET">Market</option>
              <option value="LIMIT">Limit</option>
              <option value="SL">Stop Loss</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text3)' }}>Quantity</label>
            <input type="number" min="1" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full h-9 px-3 rounded-lg text-[12px] outline-none transition-all"
              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
          </div>
        </div>

        <AnimatePresence>
          {orderType !== 'MARKET' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-3 overflow-hidden">
              <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text3)' }}>
                {orderType === 'LIMIT' ? 'Limit' : 'Stop'} Price (₹)
              </label>
              <input type="number" placeholder={`CMP: ₹${stock.price.toFixed(2)}`} value={limitPrice} onChange={e => setLimitPrice(e.target.value)}
                className="w-full h-9 px-3 rounded-lg text-[12px] outline-none transition-all"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between rounded-lg px-3 py-2.5 mb-4"
          style={{ background: 'var(--bg3)' }}>
          <span className="text-[11px] font-medium" style={{ color: 'var(--text3)' }}>Est. Value</span>
          <span className="text-[14px] font-black" style={{ color: 'var(--text)' }}>
            ₹{estValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>

        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleOrder}
          className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white transition-all"
          style={{ background: side === 'BUY' ? 'linear-gradient(135deg, #16A34A, #4ADE80)' : 'linear-gradient(135deg, #DC2626, #F87171)' }}>
          {side} {symbol}
        </motion.button>

        <AnimatePresence>
          {flash && (
            <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-[11px] mt-2 text-center font-semibold"
              style={{ color: ok ? 'var(--green)' : 'var(--red)' }}>
              <CheckCircle size={11} className="inline mr-1" />
              {msg}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-4 space-y-1.5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          {[
            ['LTP', `₹${stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`],
            ['Day High', `₹${(stock.price * 1.018).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`],
            ['Day Low', `₹${(stock.price * 0.982).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`],
            ['Vol', `${(stock.volume / 1e5).toFixed(2)}L`],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between items-center text-[11px]">
              <span style={{ color: 'var(--text3)' }}>{label}</span>
              <span className="font-semibold" style={{ color: 'var(--text2)' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
