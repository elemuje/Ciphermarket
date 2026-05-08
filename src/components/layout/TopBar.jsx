import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Wallet, X } from 'lucide-react';
import { useUIStore, useWalletStore } from '../../stores';
import { useState, useEffect, useRef } from 'react';
import WalletConnectModal from '../WalletConnectModal';

export default function TopBar() {
  const navigate = useNavigate();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);
  const notifications = useUIStore((s) => s.notifications);
  const removeNotification = useUIStore((s) => s.removeNotification);
  const connected = useWalletStore((s) => s.connected);
  const balance = useWalletStore((s) => s.balance);
  const walletType = useWalletStore((s) => s.walletType);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-30 h-16 glass-panel border-b border-[rgba(255,255,255,0.08)] flex items-center px-4 md:px-6 gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden w-9 h-9 rounded-lg bg-[#232A36] flex items-center justify-center hover:bg-[#2d3645] transition-colors"
        >
          <Menu className="text-[#B1B5C3]" style={{ width: 18, height: 18 }} />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B1B5C3]" style={{ width: 15, height: 15 }} />
          <input
            type="text"
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg bg-[#1A1F29] border border-[rgba(255,255,255,0.08)] text-sm text-white placeholder-[#B1B5C3] focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]/20 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="text-[#B1B5C3]" style={{ width: 13, height: 13 }} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-9 h-9 rounded-lg bg-[#1A1F29] border border-[rgba(255,255,255,0.08)] flex items-center justify-center hover:bg-[#232A36] transition-colors"
            >
              <Bell style={{ width: 15, height: 15 }} className="text-[#B1B5C3]" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F7A600] text-[10px] font-bold text-[#0B0E11] flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 glass-panel rounded-xl border border-[rgba(255,255,255,0.1)] shadow-2xl overflow-hidden z-50">
                <div className="p-3 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Notifications</p>
                  {notifications.length > 0 && (
                    <button onClick={() => notifications.forEach(n => removeNotification(n.id))} className="text-xs text-[#B1B5C3] hover:text-white">Clear all</button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center text-xs text-[#B1B5C3] py-6">No notifications</p>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <div key={n.id} className="p-3 border-b border-[rgba(255,255,255,0.05)] hover:bg-[#1A1F29] transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={`text-xs font-semibold ${n.type === 'success' ? 'text-[#16C784]' : n.type === 'error' ? 'text-[#EA3943]' : 'text-[#F7A600]'}`}>{n.title}</p>
                            <p className="text-xs text-[#B1B5C3] mt-0.5">{n.message}</p>
                          </div>
                          <button onClick={() => removeNotification(n.id)} className="text-[#B1B5C3] hover:text-white flex-shrink-0">
                            <X style={{ width: 12, height: 12 }} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Wallet Button */}
          {connected ? (
            <button
              onClick={() => navigate('/portfolio')}
              className="flex items-center gap-2 h-10 px-3 rounded-lg bg-[rgba(22,199,132,0.08)] border border-[rgba(22,199,132,0.2)] hover:bg-[rgba(22,199,132,0.12)] transition-colors"
            >
              <Wallet style={{ width: 14, height: 14 }} className="text-[#16C784]" />
              <span className="text-sm font-semibold text-[#16C784] num-display hidden sm:block">
                {balance.toFixed(2)} SOL
              </span>
              <span className="text-[10px] text-[#16C784]/70 hidden md:block capitalize">{walletType}</span>
            </button>
          ) : (
            <button
              onClick={() => setWalletModalOpen(true)}
              className="h-10 px-4 rounded-lg bg-[#F7A600] hover:bg-[#FFB82E] text-[#0B0E11] font-semibold text-sm transition-all hover:shadow-lg hover:shadow-[#F7A600]/20"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <WalletConnectModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </>
  );
}
