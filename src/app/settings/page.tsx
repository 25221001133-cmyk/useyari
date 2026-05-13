'use client';
import { Settings, Sun, Moon, Palette, Bell, Shield, RefreshCw, User } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useTrading } from "@/lib/trading";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { balance } = useTrading();

  return (
    <div className="p-5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
          <Settings size={18} style={{ color: 'var(--text2)' }} />
        </div>
        <div>
          <h1 className="text-[20px] font-black" style={{ color: 'var(--text)' }}>Settings</h1>
          <p className="text-[12px]" style={{ color: 'var(--text3)' }}>Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile card */}
      <div className="max-w-2xl mb-5 p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(56,126,209,0.15), rgba(139,92,246,0.15))', border: '1px solid var(--accent)' }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-[18px] font-black"
            style={{ background: 'linear-gradient(135deg, #387ED1, #8B5CF6)' }}>YS</div>
          <div>
            <h2 className="text-[16px] font-black" style={{ color: 'var(--text)' }}>Yash Sharma</h2>
            <p className="text-[12px]" style={{ color: 'var(--text2)' }}>sharma23yash@gmail.com</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(56,126,209,0.2)', color: 'var(--accent)' }}>Pro Trader</span>
              <span className="text-[11px] font-semibold" style={{ color: 'var(--text3)' }}>
                Balance: ₹{(balance / 1e5).toFixed(1)}L
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* Appearance */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="text-[12px] font-bold uppercase tracking-wider flex items-center gap-2"
              style={{ color: 'var(--text3)' }}>
              <Palette size={13} /> Appearance
            </h3>
          </div>
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>Dark Mode</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text3)' }}>Switch between light and dark interface</p>
            </div>
            <motion.button
              onClick={toggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold"
              style={{ background: theme === 'dark' ? 'rgba(96,165,250,0.15)' : 'var(--bg3)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </motion.button>
          </div>
        </div>

        {/* Account */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="text-[12px] font-bold uppercase tracking-wider flex items-center gap-2"
              style={{ color: 'var(--text3)' }}>
              <User size={13} /> Account
            </h3>
          </div>
          {['Profile Information', 'Change Password', 'Two-Factor Authentication'].map((item, i, arr) => (
            <div key={item}
              className="flex items-center justify-between px-5 py-3.5 cursor-pointer transition-colors"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border2)' : 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}>
              <span className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{item}</span>
              <span style={{ color: 'var(--text3)' }}>›</span>
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="text-[12px] font-bold uppercase tracking-wider flex items-center gap-2"
              style={{ color: 'var(--text3)' }}>
              <Bell size={13} /> Notifications
            </h3>
          </div>
          {['Price Alerts', 'Order Updates', 'Market News', 'Portfolio Summary'].map((item, i, arr) => (
            <div key={item}
              className="flex items-center justify-between px-5 py-3.5 cursor-pointer"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border2)' : 'none' }}>
              <span className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{item}</span>
              <div className="w-10 h-5 rounded-full relative cursor-pointer transition-all"
                style={{ background: 'var(--accent)' }}>
                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
              </div>
            </div>
          ))}
        </div>

        {/* Simulator */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="text-[12px] font-bold uppercase tracking-wider flex items-center gap-2"
              style={{ color: 'var(--text3)' }}>
              <RefreshCw size={13} /> Simulator
            </h3>
          </div>
          {['Reset Portfolio', 'Virtual Balance', 'Trade History Export'].map((item, i, arr) => (
            <div key={item}
              className="flex items-center justify-between px-5 py-3.5 cursor-pointer transition-colors"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border2)' : 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}>
              <span className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{item}</span>
              <span style={{ color: 'var(--text3)' }}>›</span>
            </div>
          ))}
        </div>

        {/* Security */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="text-[12px] font-bold uppercase tracking-wider flex items-center gap-2"
              style={{ color: 'var(--text3)' }}>
              <Shield size={13} /> Security
            </h3>
          </div>
          {['Privacy Settings', 'Data Export', 'Delete Account'].map((item, i, arr) => (
            <div key={item}
              className="flex items-center justify-between px-5 py-3.5 cursor-pointer transition-colors"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border2)' : 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}>
              <span className="text-[13px] font-medium" style={{ color: item === 'Delete Account' ? 'var(--red)' : 'var(--text)' }}>{item}</span>
              <span style={{ color: 'var(--text3)' }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
