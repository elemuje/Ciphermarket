import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, TrendingUp, Wallet, Vote, Award,
  Plus, Lock, Settings, Shield, ChevronRight
} from 'lucide-react';
import { useUIStore, useWalletStore } from '../../stores';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Markets' },
  { path: '/portfolio', icon: Wallet, label: 'Portfolio' },
  { path: '/create', icon: Plus, label: 'Create Market' },
  { path: '/governance', icon: Vote, label: 'Governance' },
  { path: '/rewards', icon: Award, label: 'Rewards' },
  { path: '/privacy', icon: Lock, label: 'Privacy' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const connected = useWalletStore((s) => s.connected);
  const publicKey = useWalletStore((s) => s.publicKey);

  return (
    <div className="h-full glass-panel border-r border-[rgba(255,255,255,0.08)] flex flex-col py-4">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 mb-6 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-display font-bold text-white">CipherMarket</p>
            <p className="text-[10px] text-[#B1B5C3]">Encrypted Markets</p>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={toggleSidebar}
            className="ml-auto w-6 h-6 rounded-md bg-[#232A36] flex items-center justify-center hover:bg-[#2d3645] transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5 text-[#B1B5C3] rotate-180" />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (window.innerWidth < 1024) useUIStore.getState().toggleSidebar();
              }}
              className={`
                w-full flex items-center gap-3 rounded-xl transition-all duration-200
                ${collapsed ? 'justify-center p-3' : 'px-3 py-2.5'}
                ${active
                  ? 'bg-[rgba(247,166,0,0.1)] border border-[rgba(247,166,0,0.2)] text-[#F7A600]'
                  : 'text-[#B1B5C3] hover:bg-[#1A1F29] hover:text-white'
                }
              `}
              title={collapsed ? item.label : ''}
            >
              <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${active ? 'text-[#F7A600]' : ''}`} style={{ width: 18, height: 18 }} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {!collapsed && item.path === '/create' && (
                <span className="ml-auto text-[10px] bg-[rgba(247,166,0,0.15)] text-[#F7A600] px-1.5 py-0.5 rounded-md font-semibold">
                  NEW
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Wallet status at bottom */}
      {!collapsed && connected && (
        <div className="mx-2 mt-4 p-3 rounded-xl bg-[rgba(22,199,132,0.05)] border border-[rgba(22,199,132,0.15)]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#16C784] pulse-ring flex-shrink-0" />
            <p className="text-xs text-[#16C784] font-medium truncate">{publicKey}</p>
          </div>
        </div>
      )}

      {/* Arcium badge */}
      {!collapsed && (
        <div className="mx-2 mt-3 p-2 rounded-xl bg-[rgba(0,240,255,0.04)] border border-[rgba(0,240,255,0.1)]">
          <p className="text-[10px] text-center text-[#B1B5C3]">
            Powered by <span className="text-[#00F0FF] font-semibold">Arcium</span> MXE
          </p>
        </div>
      )}
    </div>
  );
}
