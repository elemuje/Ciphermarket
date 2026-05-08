import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, TrendingUp, TrendingDown, BarChart3, Clock,
  ArrowUpRight, ArrowDownRight, ExternalLink, Lock, Shield,
  RefreshCw, DollarSign, Activity
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useMarketStore, useWalletStore, usePrivacyStore } from '../stores';
import { useMemo } from 'react';

const PORTFOLIO_HISTORY = [
  { date: 'Apr 7', value: 820 }, { date: 'Apr 14', value: 900 },
  { date: 'Apr 21', value: 860 }, { date: 'Apr 28', value: 970 },
  { date: 'May 1', value: 1040 }, { date: 'May 3', value: 1010 },
  { date: 'May 5', value: 1125 }, { date: 'May 7', value: 1185 },
];

const PIE_COLORS = ['#16C784', '#EA3943', '#F7A600', '#00F0FF', '#BD00FF'];

function StatCard({ label, value, subValue, trend, icon: Icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon style={{ width: 17, height: 17, color }} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-bold flex items-center gap-0.5 ${trend >= 0 ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
            {trend >= 0 ? <ArrowUpRight style={{ width: 12, height: 12 }} /> : <ArrowDownRight style={{ width: 12, height: 12 }} />}
            {Math.abs(trend).toFixed(2)}%
          </span>
        )}
      </div>
      <p className="text-xl font-bold num-display text-white">{value}</p>
      <p className="text-xs text-[#B1B5C3] mt-0.5">{label}</p>
      {subValue && <p className="text-xs text-[#B1B5C3] mt-1">{subValue}</p>}
    </motion.div>
  );
}

function PositionRow({ position, index }) {
  const navigate = useNavigate();
  const pnlPositive = position.pnl >= 0;
  const pnlPct = ((position.currentPrice - position.entryPrice) / position.entryPrice) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-[#12161C] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-all cursor-pointer group"
      onClick={() => navigate(`/market/${position.marketId}`)}
    >
      {/* Side badge */}
      <div className={`w-14 flex-shrink-0 py-1.5 rounded-lg text-center font-bold text-xs ${
        position.side === 'yes'
          ? 'bg-[rgba(22,199,132,0.12)] text-[#16C784] border border-[rgba(22,199,132,0.25)]'
          : 'bg-[rgba(234,57,67,0.12)] text-[#EA3943] border border-[rgba(234,57,67,0.25)]'
      }`}>
        {position.side.toUpperCase()}
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate group-hover:text-[#F7A600] transition-colors">
          {position.marketTitle}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[10px] text-[#B1B5C3] num-display">
            Entry: ${position.entryPrice?.toFixed(2)} → Current: ${position.currentPrice?.toFixed(2)}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] text-[#00F0FF]">
            <Lock style={{ width: 9, height: 9 }} /> Encrypted
          </span>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-white num-display">{position.amount} SOL</p>
        <p className="text-xs text-[#B1B5C3]">Staked</p>
      </div>

      {/* PnL */}
      <div className="text-right flex-shrink-0 w-20">
        <p className={`text-sm font-bold num-display ${pnlPositive ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
          {pnlPositive ? '+' : ''}{position.pnl?.toFixed(2)} SOL
        </p>
        <p className={`text-[10px] ${pnlPositive ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
          {pnlPositive ? '+' : ''}{pnlPct.toFixed(1)}%
        </p>
      </div>

      <ExternalLink style={{ width: 14, height: 14 }} className="text-[#B1B5C3] group-hover:text-[#F7A600] flex-shrink-0" />
    </motion.div>
  );
}

export default function PortfolioPage() {
  const connected = useWalletStore((s) => s.connected);
  const balance = useWalletStore((s) => s.balance);
  const walletType = useWalletStore((s) => s.walletType);
  const publicKey = useWalletStore((s) => s.publicKey);
  const positions = useMarketStore((s) => s.positions);
  const privacyMode = usePrivacyStore((s) => s.privacyMode);
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const totalStaked = positions.reduce((s, p) => s + p.amount, 0);
    const totalPnl = positions.reduce((s, p) => s + (p.pnl || 0), 0);
    const winCount = positions.filter((p) => (p.pnl || 0) > 0).length;
    const winRate = positions.length > 0 ? (winCount / positions.length) * 100 : 0;
    const portfolioValue = balance + totalStaked + totalPnl;
    return { totalStaked, totalPnl, winRate, portfolioValue, posCount: positions.length };
  }, [positions, balance]);

  const pieData = useMemo(() => {
    const byCategory = {};
    positions.forEach((p) => {
      const cat = p.side === 'yes' ? 'YES Positions' : 'NO Positions';
      byCategory[cat] = (byCategory[cat] || 0) + p.amount;
    });
    byCategory['Available SOL'] = balance;
    return Object.entries(byCategory).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
  }, [positions, balance]);

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(247,166,0,0.1)] flex items-center justify-center mb-5">
          <Wallet className="w-8 h-8 text-[#F7A600]" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-[#B1B5C3] max-w-sm mb-6">Connect your Solana wallet to see your portfolio, positions, and performance.</p>
        <button
          onClick={() => document.dispatchEvent(new CustomEvent('openWalletModal'))}
          className="h-11 px-8 rounded-xl bg-[#F7A600] hover:bg-[#FFB82E] text-[#0B0E11] font-bold transition-all"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Portfolio</h1>
          <p className="text-sm text-[#B1B5C3] mt-0.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16C784]" />
            {walletType && <span className="capitalize">{walletType}</span>}
            <span className="font-mono text-xs">{publicKey}</span>
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#1A1F29] border border-[rgba(255,255,255,0.08)] text-sm text-[#B1B5C3] hover:text-white hover:bg-[#232A36] transition-all"
        >
          <RefreshCw style={{ width: 13, height: 13 }} /> New Trade
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Portfolio Value" value={`${stats.portfolioValue.toFixed(2)} SOL`} trend={4.8} icon={DollarSign} color="#F7A600" />
        <StatCard label="Available Balance" value={`${balance.toFixed(2)} SOL`} subValue="Ready to deploy" icon={Wallet} color="#00F0FF" />
        <StatCard
          label="Total PnL"
          value={`${stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(2)} SOL`}
          trend={stats.totalPnl >= 0 ? 3.2 : -3.2}
          icon={stats.totalPnl >= 0 ? TrendingUp : TrendingDown}
          color={stats.totalPnl >= 0 ? '#16C784' : '#EA3943'}
        />
        <StatCard label="Win Rate" value={`${stats.winRate.toFixed(0)}%`} subValue={`${stats.posCount} positions`} icon={Activity} color="#BD00FF" />
      </div>

      {/* Privacy Banner */}
      {privacyMode && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(0,240,255,0.04)] border border-[rgba(0,240,255,0.15)]">
          <Shield className="w-5 h-5 text-[#00F0FF] flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#00F0FF]">Arcium Privacy Active</p>
            <p className="text-xs text-[#B1B5C3]">Position sizes and identities are encrypted. Only you can see your full details.</p>
          </div>
          <Lock className="w-4 h-4 text-[#00F0FF] flex-shrink-0 ml-auto" />
        </div>
      )}

      {/* Chart + Allocation */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Portfolio Performance Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart3 style={{ width: 15, height: 15 }} className="text-[#F7A600]" />
                Portfolio Performance
              </h3>
              <p className="text-xs text-[#B1B5C3] mt-0.5">30-day history</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-[#16C784] num-display">+{((stats.portfolioValue - 820) / 820 * 100).toFixed(1)}%</p>
              <p className="text-[10px] text-[#B1B5C3]">30-day return</p>
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PORTFOLIO_HISTORY}>
                <defs>
                  <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16C784" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#16C784" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: '#B1B5C3', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#B1B5C3', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1A1F29', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: 12 }}
                  formatter={(v) => [`${v} SOL`, 'Value']}
                />
                <Area type="monotone" dataKey="value" stroke="#16C784" strokeWidth={2} fill="url(#portGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation Pie */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Activity style={{ width: 15, height: 15 }} className="text-[#BD00FF]" />
            Asset Allocation
          </h3>
          {pieData.length > 0 ? (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1A1F29', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: 11 }}
                    formatter={(v) => [`${v} SOL`]}
                  />
                  <Legend iconSize={8} iconType="circle" formatter={(v) => <span style={{ color: '#B1B5C3', fontSize: 10 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-44 flex items-center justify-center">
              <p className="text-xs text-[#B1B5C3]">No positions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Positions */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Clock style={{ width: 15, height: 15 }} className="text-[#F7A600]" />
            Open Positions
            <span className="bg-[rgba(247,166,0,0.1)] text-[#F7A600] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {positions.length}
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold num-display ${stats.totalPnl >= 0 ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
              {stats.totalPnl >= 0 ? '+' : ''}{stats.totalPnl.toFixed(2)} SOL Total PnL
            </span>
          </div>
        </div>

        {positions.length === 0 ? (
          <div className="text-center py-10">
            <TrendingUp className="w-10 h-10 text-[#B1B5C3] mx-auto mb-3" />
            <p className="text-sm text-white font-medium mb-1">No Open Positions</p>
            <p className="text-xs text-[#B1B5C3] mb-5">Start predicting to see your positions here.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="h-10 px-6 rounded-xl bg-[#F7A600] text-[#0B0E11] font-semibold text-sm"
            >
              Browse Markets
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {positions.map((pos, i) => (
              <PositionRow key={pos.id} position={pos} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Account Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Staked', value: `${stats.totalStaked.toFixed(2)} SOL` },
            { label: 'Realized PnL', value: '+12.80 SOL', positive: true },
            { label: 'Unrealized PnL', value: `${stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(2)} SOL`, positive: stats.totalPnl >= 0 },
            { label: 'Accuracy Score', value: `${stats.winRate.toFixed(0)}%` },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-xl bg-[#12161C] border border-[rgba(255,255,255,0.06)]">
              <p className="text-[10px] text-[#B1B5C3] mb-1">{s.label}</p>
              <p className={`text-sm font-bold num-display ${s.positive === true ? 'text-[#16C784]' : s.positive === false ? 'text-[#EA3943]' : 'text-white'}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
