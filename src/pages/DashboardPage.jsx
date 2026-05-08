import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Clock, Filter, Search, Plus, Shield, Lock } from 'lucide-react';
import { useMarketStore, useUIStore } from '../stores';
import { useMemo } from 'react';

const CATEGORIES = ['All', 'Crypto', 'Finance', 'AI', 'Politics', 'Sports', 'Science'];
const SORT_OPTIONS = [
  { value: 'volume', label: 'Volume' },
  { value: 'probability', label: 'Probability' },
  { value: 'participants', label: 'Participants' },
  { value: 'newest', label: 'Newest' },
];

function MarketCard({ market, index }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={() => navigate(`/market/${market.id}`)}
      className="glass-card glass-card-hover p-5 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-[#232A36] text-[#B1B5C3]">
              {market.category}
            </span>
            <span className="badge-live text-[10px] px-2 py-0.5 rounded-md uppercase">Live</span>
            <span className="flex items-center gap-1 text-[10px] text-[#00F0FF] bg-[rgba(0,240,255,0.06)] border border-[rgba(0,240,255,0.12)] px-2 py-0.5 rounded-md">
              <Lock style={{ width: 10, height: 10 }} /> Encrypted
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white leading-snug group-hover:text-[#F7A600] transition-colors line-clamp-2">
            {market.title}
          </h3>
        </div>
        <div className="text-right flex-shrink-0">
          <p className={`text-xl font-bold num-display ${market.probability >= 50 ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
            {market.probability}%
          </p>
          <p className="text-[10px] text-[#B1B5C3]">Yes probability</p>
        </div>
      </div>

      {/* Probability bar */}
      <div className="h-1.5 rounded-full bg-[#232A36] overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${market.probability}%` }}
          transition={{ duration: 0.8, delay: index * 0.04 + 0.2 }}
          className="h-full rounded-full"
          style={{ background: market.probability >= 50 ? '#16C784' : '#EA3943' }}
        />
      </div>

      {/* Yes/No prices */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-[rgba(22,199,132,0.06)] border border-[rgba(22,199,132,0.15)] rounded-lg px-3 py-2 text-center">
          <p className="text-xs text-[#B1B5C3]">Yes</p>
          <p className="text-sm font-bold text-[#16C784] num-display">${market.yesPrice.toFixed(2)}</p>
        </div>
        <div className="bg-[rgba(234,57,67,0.06)] border border-[rgba(234,57,67,0.15)] rounded-lg px-3 py-2 text-center">
          <p className="text-xs text-[#B1B5C3]">No</p>
          <p className="text-sm font-bold text-[#EA3943] num-display">${market.noPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between text-xs text-[#B1B5C3]">
        <div className="flex items-center gap-1">
          <TrendingUp style={{ width: 12, height: 12 }} />
          <span>${(market.volume / 1000000).toFixed(2)}M vol</span>
        </div>
        <div className="flex items-center gap-1">
          <Users style={{ width: 12, height: 12 }} />
          <span>{market.participants.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock style={{ width: 12, height: 12 }} />
          <span>{market.endDate}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const getFilteredMarkets = useMarketStore((s) => s.getFilteredMarkets);
  const filters = useMarketStore((s) => s.filters);
  const setFilters = useMarketStore((s) => s.setFilters);
  const searchQuery = useUIStore((s) => s.searchQuery);

  const markets = useMemo(() => {
    const all = getFilteredMarkets();
    if (!searchQuery) return all;
    const q = searchQuery.toLowerCase();
    return all.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [getFilteredMarkets, searchQuery, filters]);

  const totalVolume = markets.reduce((s, m) => s + m.volume, 0);
  const totalParticipants = markets.reduce((s, m) => s + m.participants, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Prediction Markets</h1>
          <p className="text-sm text-[#B1B5C3] mt-0.5">
            {markets.length} markets · ${(totalVolume / 1000000).toFixed(1)}M total volume
          </p>
        </div>
        <button
          onClick={() => navigate('/create')}
          className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#F7A600] hover:bg-[#FFB82E] text-[#0B0E11] font-bold text-sm transition-all flex-shrink-0"
        >
          <Plus style={{ width: 16, height: 16 }} />
          <span className="hidden sm:block">Create Market</span>
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Active Markets', value: markets.length, color: '#00F0FF' },
          { label: 'Total Volume', value: `$${(totalVolume / 1000000).toFixed(1)}M`, color: '#F7A600' },
          { label: 'Participants', value: totalParticipants.toLocaleString(), color: '#16C784' },
          { label: 'Privacy Level', value: '99.8%', color: '#BD00FF', icon: Shield },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            {s.icon && <s.icon style={{ width: 16, height: 16, color: s.color, marginBottom: 8 }} />}
            <p className="text-lg font-bold text-white num-display" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#B1B5C3]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
          <Filter style={{ width: 14, height: 14 }} className="text-[#B1B5C3] flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters({ category: cat === 'All' ? null : cat })}
              className={`flex-shrink-0 h-8 px-3 rounded-lg text-xs font-medium transition-all ${
                (cat === 'All' && !filters.category) || filters.category === cat
                  ? 'bg-[rgba(247,166,0,0.15)] border border-[rgba(247,166,0,0.3)] text-[#F7A600]'
                  : 'bg-[#1A1F29] border border-[rgba(255,255,255,0.08)] text-[#B1B5C3] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ sortBy: e.target.value })}
          className="h-8 px-3 rounded-lg bg-[#1A1F29] border border-[rgba(255,255,255,0.08)] text-sm text-[#B1B5C3] focus:outline-none focus:border-[#F7A600] flex-shrink-0"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Market Grid */}
      {markets.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Search className="w-10 h-10 text-[#B1B5C3] mx-auto mb-3" />
          <p className="text-white font-semibold">No markets found</p>
          <p className="text-sm text-[#B1B5C3] mt-1">Try adjusting your filters or create a new market</p>
          <button
            onClick={() => navigate('/create')}
            className="mt-4 h-10 px-6 rounded-xl bg-[#F7A600] text-[#0B0E11] font-semibold text-sm"
          >
            Create Market
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {markets.map((market, i) => (
            <MarketCard key={market.id} market={market} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
