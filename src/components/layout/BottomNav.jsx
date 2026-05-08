import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, Vote, Award, Plus } from 'lucide-react';

const NAV = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Markets' },
  { path: '/portfolio', icon: Wallet, label: 'Portfolio' },
  { path: '/create', icon: Plus, label: 'Create', special: true },
  { path: '/governance', icon: Vote, label: 'Govern' },
  { path: '/rewards', icon: Award, label: 'Rewards' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-[rgba(255,255,255,0.08)]">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV.map((item) => {
          const active = location.pathname === item.path;
          if (item.special) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F7A600] to-[#FFB82E] flex items-center justify-center shadow-lg shadow-[#F7A600]/25 -mt-4"
              >
                <item.icon className="text-[#0B0E11]" style={{ width: 22, height: 22 }} />
              </button>
            );
          }
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                active ? 'text-[#F7A600]' : 'text-[#B1B5C3]'
              }`}
            >
              <item.icon style={{ width: 18, height: 18 }} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
