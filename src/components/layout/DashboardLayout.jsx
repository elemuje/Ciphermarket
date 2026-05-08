import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import NotificationToast from '../NotificationToast';
import { useUIStore } from '../../stores';

export default function DashboardLayout() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0B0E11] flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 h-screen z-40 transition-all duration-300 ease-out ${
          sidebarOpen ? 'w-[260px]' : 'w-[72px]'
        }`}
      >
        <Sidebar collapsed={!sidebarOpen} />
      </aside>

      {/* Sidebar overlay - Mobile */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => useUIStore.getState().toggleSidebar()}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed left-0 top-0 h-screen w-[260px] z-50 lg:hidden"
          >
            <Sidebar collapsed={false} />
          </motion.aside>
        </>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 lg:ml-[72px] ${
          sidebarOpen ? 'lg:ml-[260px]' : ''
        }`}
      >
        <TopBar />
        <div className="flex-1 p-4 md:p-6 pb-24 lg:pb-6 overflow-x-hidden">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>

      <BottomNav />
      <NotificationToast />
    </div>
  );
}
