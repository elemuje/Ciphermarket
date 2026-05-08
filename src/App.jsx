import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useUIStore } from './stores';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import MarketDetailPage from './pages/MarketDetailPage';
import PortfolioPage from './pages/PortfolioPage';
import GovernancePage from './pages/GovernancePage';
import RewardsPage from './pages/RewardsPage';
import CreateMarketPage from './pages/CreateMarketPage';
import PrivacyCenterPage from './pages/PrivacyCenterPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const location = useLocation();
  const setRoute = useUIStore((s) => s.setRoute);

  useEffect(() => {
    setRoute(location.pathname);
  }, [location.pathname, setRoute]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/market/:id" element={<MarketDetailPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/governance" element={<GovernancePage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/create" element={<CreateMarketPage />} />
          <Route path="/privacy" element={<PrivacyCenterPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
