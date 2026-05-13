'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles, TrendingUp, BarChart2, Shield, BookOpen, Target, Briefcase } from 'lucide-react';
import { STOCKS } from '@/lib/data';
import { useTrading } from '@/lib/trading';

type Message = { role: 'user' | 'ai'; text: string; ts: string };

function generateAIResponse(query: string, positions: ReturnType<typeof useTrading>['positions']): string {
  const q = query.toLowerCase();

  // Stock-specific analysis
  const stockMatch = STOCKS.find(s =>
    q.includes(s.symbol.toLowerCase()) || q.includes(s.name.toLowerCase())
  );

  if (stockMatch) {
    const s = stockMatch;
    const rsiEst = 45 + s.changePercent * 8;
    const rsiSignal = rsiEst > 65 ? 'OVERBOUGHT' : rsiEst < 35 ? 'OVERSOLD' : 'NEUTRAL';
    const sma20Est = s.price * (1 - s.changePercent / 200);
    const priceVsSMA = s.price > sma20Est ? 'above' : 'below';
    const momentum = s.cagr3y > 15 ? 'strong long-term momentum' : s.cagr3y > 8 ? 'moderate momentum' : 'weak momentum';

    if (q.includes('buy') || q.includes('invest') || q.includes('should i')) {
      const verdict = s.roe > 15 && s.pe < 30 && s.debtToEquity < 1
        ? '✅ ACCUMULATE — Strong fundamentals. Good for long-term SIP.'
        : s.pe > 60
          ? '⚠️ WAIT — Premium valuation. Better entry points likely.'
          : s.changePercent < -2
            ? '📉 WATCH — Stock under pressure. Wait for reversal signals.'
            : '📌 NEUTRAL — Fair value. Phased entry recommended.';
      return `📊 **${s.symbol} (${s.name})**\n\n**Price:** ₹${s.price.toLocaleString('en-IN')} | ${s.changePercent >= 0 ? '▲' : '▼'} ${Math.abs(s.changePercent).toFixed(2)}%\n\n**Fundamentals:**\n• P/E: ${s.pe.toFixed(1)}x (${s.pe < 20 ? '🟢 Undervalued' : s.pe < 35 ? '🟡 Fair' : '🔴 Expensive'})\n• ROE: ${s.roe.toFixed(1)}% (${s.roe > 20 ? '🟢 Excellent' : s.roe > 12 ? '🟡 Good' : '🔴 Weak'})\n• D/E Ratio: ${s.debtToEquity.toFixed(2)} (${s.debtToEquity < 0.5 ? '🟢 Low debt' : s.debtToEquity < 1.5 ? '🟡 Moderate' : '🔴 High leverage'})\n• Dividend Yield: ${s.dividendYield}%\n\n**Technical:**\n• RSI ~${rsiEst.toFixed(0)}: **${rsiSignal}**\n• Price is ${priceVsSMA} 20-day SMA\n• ${momentum} (3Y CAGR: ${s.cagr3y}%)\n\n**AI Verdict:** ${verdict}\n\n*Lot size: 1 share | 52W Range: ₹${s.low52w.toLocaleString('en-IN')} — ₹${s.high52w.toLocaleString('en-IN')}*`;
    }

    if (q.includes('target') || q.includes('price target')) {
      const bull = (s.price * 1.18).toFixed(0);
      const base = (s.price * 1.10).toFixed(0);
      const bear = (s.price * 0.88).toFixed(0);
      return `🎯 **${s.symbol} — Price Targets (12M)**\n\n🐂 **Bull Case:** ₹${bull} (+18%)\n  Triggers: Earnings beat, sector re-rating, FII buying\n\n📊 **Base Case:** ₹${base} (+10%)\n  Assumption: Steady growth, stable margins\n\n🐻 **Bear Case:** ₹${bear} (-12%)\n  Risks: Macro slowdown, sector rotation, earnings miss\n\n**Current Price:** ₹${s.price.toLocaleString('en-IN')}\n\n⚠️ *Simulated targets for learning purposes only.*`;
    }

    return `**${s.name} (${s.symbol})**\n\nPrice: ₹${s.price.toLocaleString('en-IN')} | ${s.changePercent >= 0 ? '▲' : '▼'} ${Math.abs(s.changePercent).toFixed(2)}%\nMkt Cap: ${s.marketCap} | Sector: ${s.sector}\nP/E: ${s.pe.toFixed(1)}x | ROE: ${s.roe.toFixed(1)}% | D/E: ${s.debtToEquity.toFixed(2)}\n52W: ₹${s.low52w.toLocaleString('en-IN')} — ₹${s.high52w.toLocaleString('en-IN')}\n\n${rsiSignal === 'OVERBOUGHT' ? '⚠️ RSI Overbought — momentum may fade' : rsiSignal === 'OVERSOLD' ? '💚 RSI Oversold — potential reversal zone' : '📊 RSI Neutral — range-bound action'}`;
  }

  // Portfolio doctor
  if (q.includes('portfolio') || q.includes('holdings') || q.includes('doctor')) {
    if (positions.length === 0) return "You don't have any holdings yet. Use the order panel to start building your portfolio!";
    const totalPnL = positions.reduce((s, p) => s + p.pnl, 0);
    const totalInvested = positions.reduce((s, p) => s + p.invested, 0);
    const best = [...positions].sort((a, b) => b.pnlPct - a.pnlPct)[0];
    const worst = [...positions].sort((a, b) => a.pnlPct - b.pnlPct)[0];
    const sectors = [...new Set(positions.map(p => p.sector))];
    const concentrated = positions.find(p => p.invested / totalInvested > 0.35);
    return `🏥 **Portfolio Doctor Report**\n\n💼 Holdings: ${positions.length} stocks | Sectors: ${sectors.length}\nTotal Invested: ₹${(totalInvested / 1e5).toFixed(2)}L\nCurrent Value: ₹${((totalInvested + totalPnL) / 1e5).toFixed(2)}L\n\n**P&L: ${totalPnL >= 0 ? '+' : ''}₹${Math.abs(totalPnL).toLocaleString('en-IN', { maximumFractionDigits: 0 })} (${((totalPnL / totalInvested) * 100).toFixed(2)}%)**\n\n🏆 Best: **${best.symbol}** (+${best.pnlPct.toFixed(1)}%)\n📉 Worst: **${worst.symbol}** (${worst.pnlPct.toFixed(1)}%)\n\n**Diagnosis:**\n${concentrated ? `⚠️ Over-concentrated in ${concentrated.symbol} (${((concentrated.invested / totalInvested) * 100).toFixed(0)}%). Consider trimming.` : '✅ Good diversification across positions.'}\n${sectors.length < 3 ? '⚠️ Add more sectors to reduce concentration risk.' : '✅ Sector diversification looks good.'}\n${totalPnL > 0 ? '💡 Consider booking partial profits in top gainers.' : '📌 Stay invested — volatility is normal in equity markets.'}`;
  }

  // Options education
  if (q.includes('option') || q.includes('call') || q.includes('put') || q.includes('derivative') || q.includes('fno') || q.includes('f&o')) {
    if (q.includes('straddle')) {
      return `📖 **Long Straddle**\n\nA strategy where you BUY both a Call and Put at the same strike price.\n\n**Setup:**\n• Buy ATM Call (CE)\n• Buy ATM Put (PE)\n• Same strike, same expiry\n\n**When to use:**\n• Before big events (earnings, budget, RBI policy)\n• When you expect high volatility but unsure of direction\n\n**Profit:**\n• Unlimited — if stock moves sharply in either direction\n\n**Loss:**\n• Limited to premium paid (both legs)\n\n**Break-even:**\n• Upper: ATM Strike + Total Premium\n• Lower: ATM Strike - Total Premium\n\n💡 Check our Options page to build this strategy interactively!`;
    }
    if (q.includes('iron condor')) {
      return `📖 **Iron Condor**\n\nA neutral strategy that profits when the underlying stays range-bound.\n\n**Setup:**\n• Sell OTM Put (higher strike)\n• Buy further OTM Put (lower strike)\n• Sell OTM Call (lower strike)\n• Buy further OTM Call (higher strike)\n\n**When to use:**\n• Low volatility environment\n• When India VIX < 15\n• When you expect sideways movement\n\n**Max Profit:** Net premium collected\n**Max Loss:** Difference between strikes - premium\n\n💡 Try it on our Options Strategy Builder!`;
    }
    return `📊 **Options & F&O Basics**\n\n**What are Options?**\nOptions give the right (not obligation) to buy/sell a stock at a fixed price (strike) before expiry.\n\n**Types:**\n• **Call (CE)** — Right to BUY. Profitable when price goes up.\n• **Put (PE)** — Right to SELL. Profitable when price goes down.\n\n**Key Greeks:**\n• **Delta** — Price sensitivity (0 to 1 for calls)\n• **Theta** — Time decay (premium lost per day)\n• **Vega** — Volatility sensitivity\n• **Gamma** — Rate of delta change\n\n**Popular Strategies:**\n• Long Straddle — Big move expected\n• Iron Condor — Range-bound market\n• Bull Call Spread — Mildly bullish\n• Covered Call — Income generation\n\n👉 Visit **Options / F&O** in the sidebar to explore the live option chain!`;
  }

  // Market overview
  if (q.includes('nifty') || q.includes('sensex') || q.includes('market') || q.includes('today')) {
    const gainers = [...STOCKS].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
    const losers = [...STOCKS].sort((a, b) => a.changePercent - b.changePercent).slice(0, 3);
    return `📈 **Market Overview — 13 May 2026**\n\nNIFTY 50: **24,856** ▲ 0.76% 📈\nSENSEX: **81,456** ▲ 0.76% 📈\nNIFTY BANK: **52,345** ▼ 0.45%\nINDIA VIX: **13.45** (Low Volatility)\n\n**Key Levels:**\n• NIFTY Support: 24,500 | Resistance: 25,200\n\n**Top Gainers:**\n${gainers.map(s => `• ${s.symbol}: +${s.changePercent.toFixed(2)}%`).join('\n')}\n\n**Top Losers:**\n${losers.map(s => `• ${s.symbol}: ${s.changePercent.toFixed(2)}%`).join('\n')}\n\n**Market Mood:** Positive bias. IT and Energy leading. Stay cautious above 25,000 NIFTY.`;
  }

  // Swing trade ideas
  if (q.includes('swing') || q.includes('trade idea') || q.includes('short term')) {
    const candidates = STOCKS
      .filter(s => s.deliveryPct > 45 && s.beta < 1.4 && s.cagr3y > 10)
      .sort(() => 0.5 - Math.random()).slice(0, 3);
    return `⚡ **AI Swing Trade Ideas — 13 May 2026**\n\n${candidates.map((s, i) => {
      const entry = +(s.price * 0.992).toFixed(0);
      const target = +(s.price * 1.048).toFixed(0);
      const sl = +(s.price * 0.964).toFixed(0);
      return `**${i + 1}. ${s.symbol}** (${s.sector})\n   Entry: ₹${entry} | Target: ₹${target} | SL: ₹${sl}\n   Holding: 5-10 sessions | Risk:Reward = 1:1.7`;
    }).join('\n\n')}\n\n📋 *Always place stop-loss orders. This is simulated analysis.*`;
  }

  // Risk management
  if (q.includes('risk') || q.includes('diversif') || q.includes('stop loss')) {
    return `🛡️ **Risk Management Principles**\n\n**Position Sizing:**\n• No single stock > 10% of portfolio\n• No sector > 30% allocation\n• Keep 10-15% cash for opportunities\n\n**Stop Loss Rules:**\n• Use 7-8% SL for short-term trades\n• 12-15% SL for medium-term holds\n• Never average down without a plan\n\n**Diversification:**\n• Min 8-10 stocks across 4+ sectors\n• Mix large, mid, and small caps\n• Include 1-2 defensive stocks (FMCG, Pharma)\n\n**Portfolio Health Checks:**\n• Review every quarter\n• Book profits at 20-25% gains\n• Cut losses decisively at SL\n\n${positions.length > 0 ? `\n**Your Current Portfolio:**\n${positions.slice(0, 4).map(p => `• ${p.symbol}: ${((p.current / positions.reduce((s, x) => s + x.current, 1)) * 100).toFixed(1)}%`).join('\n')}` : ''}`;
  }

  // Learning mode
  if (q.includes('learn') || q.includes('teach') || q.includes('explain') || q.includes('what is')) {
    if (q.includes('pe') || q.includes('p/e') || q.includes('price to earnings')) {
      return `📚 **P/E Ratio Explained**\n\nP/E = Price ÷ Earnings Per Share\n\n**What it means:**\nHow much you pay for ₹1 of earnings.\nP/E of 20 = paying ₹20 for ₹1 of annual earnings.\n\n**Indian Market Benchmarks:**\n• < 15 = Undervalued territory\n• 15-25 = Fair value\n• 25-40 = Growth premium\n• > 40 = Expensive (needs high growth justification)\n\n**Examples from your universe:**\n${STOCKS.slice(0, 3).map(s => `• ${s.symbol}: P/E = ${s.pe.toFixed(1)}x`).join('\n')}\n\n💡 P/E alone isn't enough. Always combine with ROE, debt levels, and growth prospects.`;
    }
    if (q.includes('rsi')) {
      return `📚 **RSI (Relative Strength Index)**\n\nRSI measures price momentum on a 0-100 scale.\n\n**Key Levels:**\n• > 70: Overbought — potential reversal or cooling\n• 50-70: Bullish momentum\n• 30-50: Bearish momentum\n• < 30: Oversold — potential bounce\n\n**How to use:**\n• RSI > 70 + price at resistance = SELL signal\n• RSI < 30 + price at support = BUY signal\n• RSI divergence = strong reversal signal\n\n**Limitation:** RSI can stay overbought for long in strong trends. Always confirm with price action.`;
    }
    return `📚 **Learning Mode Activated!**\n\nI can explain:\n• **P/E, P/B, EPS** — Valuation metrics\n• **RSI, MACD, Bollinger Bands** — Technical indicators\n• **Options: Calls, Puts, Greeks** — Derivatives basics\n• **Fundamental analysis** — How to read financials\n• **Portfolio theory** — Diversification, risk management\n\nJust ask! E.g.: *"What is RSI?"* or *"Explain P/E ratio"*`;
  }

  // Long-term suggestions
  if (q.includes('long term') || q.includes('sip') || q.includes('wealth') || q.includes('invest for')) {
    const quality = STOCKS.filter(s => s.roe > 18 && s.debtToEquity < 0.5 && s.cagr5y > 12).slice(0, 4);
    return `🌱 **Long-Term Wealth Building Ideas**\n\nFiltered for: ROE > 18%, Low Debt, 5Y CAGR > 12%\n\n${quality.map(s => `**${s.symbol}** — ${s.name}\nSector: ${s.sector} | P/E: ${s.pe.toFixed(1)}x | ROE: ${s.roe.toFixed(1)}%\n5Y CAGR: ${s.cagr5y.toFixed(1)}% | D/E: ${s.debtToEquity.toFixed(2)}`).join('\n\n')}\n\n**SIP Strategy:**\n• Invest fixed amount monthly regardless of price\n• Minimum 5-7 year horizon\n• Reinvest dividends\n• Review annually (not daily!)\n\n💡 "The stock market is a device for transferring money from the impatient to the patient." — Warren Buffett`;
  }

  // Sector rotation
  if (q.includes('sector') || q.includes('rotation')) {
    return `🔄 **Sector Rotation — Current View**\n\n**Outperforming:**\n🟢 **IT** (+0.91%) — Global tech sentiment positive\n🟢 **Pharma** (+1.87%) — USFDA approvals, domestic demand\n🟢 **Cement** (+2.13%) — Infrastructure push, capex cycle\n\n**Underperforming:**\n🔴 **Metals** (-1.23%) — China demand concerns\n🔴 **Auto** (-0.45%) — Two-wheeler seasonal slowdown\n\n**Rotation Theme:**\nMoney flowing from defensives to cyclicals as inflation cools. Infrastructure and capital goods are the next leg up if govt capex continues.\n\n💡 Click on the Sector Heatmap on the dashboard to explore each sector in detail!`;
  }

  // AI features intro
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('help')) {
    return `👋 Hello! I'm your **AI Investment Assistant**, powered by StockSim AI.\n\n🎯 **What I can help with:**\n• 📊 Deep stock analysis (ask about any NSE/BSE stock)\n• 🏥 Portfolio Doctor — health check your holdings\n• ⚡ Swing trade ideas with entry/exit levels\n• 🌱 Long-term investment suggestions\n• 📖 Options & F&O education\n• 🛡️ Risk management guidance\n• 📈 Market overview & sector rotation\n• 🎓 Learning mode (explain any concept)\n\n**Try asking:**\n• *"Should I buy TCS?"*\n• *"Give me price targets for RELIANCE"*\n• *"Check my portfolio health"*\n• *"Explain iron condor strategy"*\n• *"What sectors are outperforming?"*`;
  }

  // Default with market context
  const randomStocks = [...STOCKS].sort(() => 0.5 - Math.random()).slice(0, 2);
  return `🤖 **StockSim AI**\n\nI can help with stock analysis, options education, portfolio review, and investment ideas!\n\n**Today's Quick Picks:**\n${randomStocks.map(s => `• **${s.symbol}**: ₹${s.price.toLocaleString('en-IN')} (${s.changePercent >= 0 ? '+' : ''}${s.changePercent.toFixed(2)}%) — ${s.sector}`).join('\n')}\n\n**Try:** *"Analyze HDFC Bank"* or *"Best stocks to buy now"*`;
}

const QUICK_PROMPTS = [
  { icon: TrendingUp, label: 'Market', q: 'How is the market today?' },
  { icon: BarChart2, label: 'Swings', q: 'Give me swing trade ideas' },
  { icon: Shield, label: 'Risk', q: 'How to manage risk in my portfolio?' },
  { icon: Target, label: 'Options', q: 'Explain options trading basics' },
  { icon: BookOpen, label: 'Learn', q: 'Teach me about P/E ratio' },
  { icon: Briefcase, label: 'Doctor', q: 'Check my portfolio health' },
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: `👋 Hi! I'm your **AI Investment Assistant**.\n\nAsk me about any NSE/BSE stock, options strategies, portfolio analysis, or market trends. I'm here to help you invest smarter!`, ts: 'Now' },
  ]);
  const [typing, setTyping] = useState(false);
  const { positions } = useTrading();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = (text: string = input.trim()) => {
    if (!text) return;
    const ts = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setMessages(m => [...m, { role: 'user', text, ts }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, {
        role: 'ai',
        text: generateAIResponse(text, positions),
        ts: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl flex items-center justify-center z-50 float-btn shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #387ED1, #8B5CF6)', boxShadow: '0 8px 32px rgba(56,126,209,0.4)' }}
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={22} className="text-white" /></motion.div>
            : <motion.div key="ai" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles size={22} className="text-white" />
            </motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-6 w-[380px] rounded-2xl overflow-hidden z-50 flex flex-col"
            style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)', height: 520,
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 shrink-0"
              style={{ background: 'linear-gradient(135deg, #387ED1, #8B5CF6)' }}>
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white text-[13px] font-bold">StockSim AI</p>
                <p className="text-white/70 text-[10px]">Investment Assistant · NSE/BSE Expert</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/70 text-[10px]">Online</span>
              </div>
            </div>

            {/* Quick prompts */}
            {messages.length <= 1 && (
              <div className="px-3 py-2 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text3)' }}>Quick Actions</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map(({ icon: Icon, label, q }) => (
                    <button key={label} onClick={() => send(q)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all hover:scale-105"
                      style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
                      <Icon size={10} style={{ color: 'var(--accent)' }} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px]" style={{
                    background: m.role === 'ai' ? 'linear-gradient(135deg, #387ED1, #8B5CF6)' : 'var(--bg3)',
                    border: m.role === 'user' ? '1px solid var(--border)' : 'none',
                  }}>
                    {m.role === 'ai' ? <Bot size={13} className="text-white" /> : <User size={13} style={{ color: 'var(--text3)' }} />}
                  </div>
                  <div className="max-w-[82%]">
                    <div className="rounded-2xl px-3 py-2.5 text-[11px] leading-relaxed whitespace-pre-wrap"
                      style={{
                        background: m.role === 'ai' ? 'var(--bg3)' : 'linear-gradient(135deg, #387ED1, #8B5CF6)',
                        color: m.role === 'ai' ? 'var(--text)' : '#fff',
                        borderRadius: m.role === 'ai' ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                      }}>
                      {m.text}
                    </div>
                    <p className="text-[9px] mt-0.5 px-1" style={{ color: 'var(--text3)' }}>{m.ts}</p>
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, #387ED1, #8B5CF6)' }}>
                    <Bot size={13} className="text-white" />
                  </div>
                  <div className="rounded-2xl px-4 py-3 flex items-center gap-1.5"
                    style={{ background: 'var(--bg3)', borderRadius: '4px 18px 18px 18px' }}>
                    <div className="w-2 h-2 rounded-full typing-dot" style={{ background: 'var(--text3)' }} />
                    <div className="w-2 h-2 rounded-full typing-dot" style={{ background: 'var(--text3)' }} />
                    <div className="w-2 h-2 rounded-full typing-dot" style={{ background: 'var(--text3)' }} />
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="Ask about stocks, options, portfolio…"
                  className="flex-1 h-9 px-3 rounded-xl text-[12px] outline-none transition-all"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
                />
                <button
                  onClick={() => send()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #387ED1, #8B5CF6)' }}
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
