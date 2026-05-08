import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Lock, Users, TrendingUp, Clock, Shield, Info,
  AlertTriangle, Zap, BarChart3, CheckCircle, Cpu
} from 'lucide-react';
import { useMarketStore, useWalletStore, useUIStore, usePrivacyStore } from '../stores';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { useState, useMemo } from 'react';

const generateHistory = (baseProb) => {
  const data = [];
  let prob = baseProb - 10;
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    prob += (Math.random() - 0.4) * 4;
    prob = Math.max(5, Math.min(95, prob));
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      probability: Math.round(prob),
      volume: Math.round(50000 + Math.random() * 200000),
    });
  }
  return data;
};

// Arcium computation step indicator
function ArciumSteps({ step }) {
  const steps = ['Input', 'FHE Encrypt', 'MXE Compute', 'Aggregate', 'Submit'];
  return (
    <div className="flex items-center gap-1 mt-3">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${
            i < step ? 'bg-[rgba(0,240,255,0.15)] text-[#00F0FF]' :
            i === step ? 'bg-[rgba(247,166,0,0.15)] text-[#F7A600] animate-pulse' :
            'bg-[#1A1F29] text-[#B1B5C3]'
          }`}>
            {i < step && <CheckCircle style={{ width: 10, height: 10 }} />}
            {i === step && <div className="w-2 h-2 rounded-full bg-[#F7A600] animate-ping" />}
            <span>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-3 h-0.5 rounded-full ${i < step ? 'bg-[#00F0FF]' : 'bg-[#232A36]'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function MarketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const markets = useMarketStore((s) => s.markets);
  const placePosition = useMarketStore((s) => s.placePosition);
  const connected = useWalletStore((s) => s.connected);
  const balance = useWalletStore((s) => s.balance);
  const addNotification = useUIStore((s) => s.addNotification);
  const privacyMode = usePrivacyStore((s) => s.privacyMode);
  const setEncryptionStatus = usePrivacyStore((s) => s.setEncryptionStatus);

  const [side, setSide] = useState('yes');
  const [amount, setAmount] = useState('');
  const [confidence, setConfidence] = useState(75);
  const [privateMode, setPrivateMode] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [arciumStep, setArciumStep] = useState(-1);
  const [submitted, setSubmitted] = useState(false);

  const market = useMemo(() => markets.find((m) => m.id === id), [markets, id]);
  const chartData = useMemo(() => market ? generateHistory(market.probability) : [], [market]);

  if (!market) {
    return (
      <div className="glass-card p-12 text-center">
        <AlertTriangle className="w-12 h-12 text-[#F7A600] mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Market Not Found</h2>
        <p className="text-[#B1B5C3] mb-6">This market doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/dashboard')} className="h-10 px-6 rounded-lg bg-[#F7A600] text-[#0B0E11] font-semibold">
          Back to Markets
        </button>
      </div>
    );
  }

  const numAmount = parseFloat(amount) || 0;
  const potentialReturn = numAmount * (side === 'yes' ? (1 / market.yesPrice) : (1 / market.noPrice));
  const profit = potentialReturn - numAmount;

  const handleSubmitPosition = async () => {
    if (!connected) {
      addNotification({ id: `n${Date.now()}`, type: 'error', title: 'Wallet Not Connected', message: 'Please connect your wallet first', timestamp: Date.now() });
      return;
    }
    if (!numAmount || numAmount <= 0) {
      addNotification({ id: `n${Date.now()}`, type: 'error', title: 'Invalid Amount', message: 'Enter a valid stake amount', timestamp: Date.now() });
      return;
    }

    setSubmitting(true);
    setShowConfirm(false);
    setEncryptionStatus('encrypting');

    // Arcium computation simulation steps
    for (let i = 0; i <= 4; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setArciumStep(i);
    }

    setEncryptionStatus('encrypted');
    await new Promise((r) => setTimeout(r, 400));

    placePosition({
      marketId: market.id,
      marketTitle: market.title,
      side,
      amount: numAmount,
      confidence,
      entryPrice: side === 'yes' ? market.yesPrice : market.noPrice,
      currentPrice: side === 'yes' ? market.yesPrice : market.noPrice,
      pnl: 0,
    });

    setEncryptionStatus('revealed');
    setSubmitting(false);
    setArciumStep(-1);
    setSubmitted(true);
    setAmount('');

    addNotification({
      id: `n${Date.now()}`,
      type: 'success',
      title: '🔐 Position Encrypted & Submitted',
      message: `${side.toUpperCase()} position of ${numAmount} SOL submitted via Arcium MXE`,
      timestamp: Date.now(),
    });

    setTimeout(() => { setEncryptionStatus('idle'); setSubmitted(false); }, 4000);
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[#B1B5C3] hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Markets
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Market info + chart */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-[#232A36] text-[#B1B5C3]">{market.category}</span>
                  <span className="badge-live text-[10px] px-2 py-0.5 rounded-md uppercase">Live</span>
                  {privacyMode && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[rgba(0,240,255,0.08)] border border-[rgba(0,240,255,0.15)] text-[10px] text-[#00F0FF]">
                      <Lock style={{ width: 10, height: 10 }} /> Private
                    </span>
                  )}
                </div>
                <h1 className="text-xl md:text-2xl font-display font-bold text-white leading-tight">{market.title}</h1>
              </div>
            </div>
            <p className="text-sm text-[#B1B5C3] leading-relaxed mb-4">{market.description}</p>
            <div className="flex flex-wrap gap-4 text-xs text-[#B1B5C3]">
              <div className="flex items-center gap-1.5"><Users style={{ width: 12, height: 12 }} /><span>{market.participants.toLocaleString()} participants</span></div>
              <div className="flex items-center gap-1.5"><TrendingUp style={{ width: 12, height: 12 }} /><span>${(market.volume / 1000000).toFixed(2)}M volume</span></div>
              <div className="flex items-center gap-1.5"><Clock style={{ width: 12, height: 12 }} /><span>Ends {market.endDate}</span></div>
              <div className="flex items-center gap-1.5"><Shield style={{ width: 12, height: 12 }} /><span>{market.resolutionSource}</span></div>
            </div>
          </motion.div>

          {/* Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <BarChart3 style={{ width: 16, height: 16 }} className="text-[#00F0FF]" />
                  Probability History
                </h3>
                <p className="text-xs text-[#B1B5C3] mt-0.5">30-day movement</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold num-display ${market.probability >= 50 ? 'text-[#16C784]' : 'text-[#EA3943]'}`}>
                  {market.probability}%
                </p>
                <p className="text-[10px] text-[#B1B5C3]">YES probability</p>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="probGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={market.probability >= 50 ? '#16C784' : '#EA3943'} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={market.probability >= 50 ? '#16C784' : '#EA3943'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fill: '#B1B5C3', fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#B1B5C3', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{ background: '#1A1F29', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(v) => [`${v}%`, 'Probability']}
                  />
                  <ReferenceLine y={50} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="probability" stroke={market.probability >= 50 ? '#16C784' : '#EA3943'} strokeWidth={2} fill="url(#probGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {market.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-[#1A1F29] text-xs text-[#B1B5C3] border border-[rgba(255,255,255,0.06)]">{tag}</span>
            ))}
          </div>
        </div>

        {/* Right: Trade Panel */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-5">
          {/* Success state */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-5 border border-[rgba(22,199,132,0.3)] bg-[rgba(22,199,132,0.04)]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-[#16C784]" />
                  <p className="text-sm font-semibold text-[#16C784]">Position Submitted!</p>
                </div>
                <p className="text-xs text-[#B1B5C3]">Your encrypted prediction was processed by Arcium MXE and recorded on Solana.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Order Entry */}
          <div className="glass-card p-5 border border-[rgba(247,166,0,0.1)]">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Zap style={{ width: 16, height: 16 }} className="text-[#F7A600]" /> Place Position
            </h3>

            {/* Side Selection */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {['yes', 'no'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  disabled={submitting}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${
                    side === s
                      ? s === 'yes'
                        ? 'bg-[rgba(22,199,132,0.15)] border-2 border-[#16C784] text-[#16C784]'
                        : 'bg-[rgba(234,57,67,0.15)] border-2 border-[#EA3943] text-[#EA3943]'
                      : 'bg-[#12161C] border border-[rgba(255,255,255,0.08)] text-[#B1B5C3] hover:bg-[#1A1F29]'
                  }`}
                >
                  {s === 'yes' ? `YES $${market.yesPrice.toFixed(2)}` : `NO $${market.noPrice.toFixed(2)}`}
                </button>
              ))}
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="text-xs text-[#B1B5C3] mb-1.5 block">Stake Amount (SOL)</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  disabled={submitting}
                  className="w-full h-12 px-4 pr-14 rounded-xl bg-[#12161C] border border-[rgba(255,255,255,0.08)] text-white text-lg font-bold num-display focus:outline-none focus:border-[#F7A600] focus:ring-1 focus:ring-[#F7A600]/20 transition-all disabled:opacity-50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#B1B5C3] font-medium">SOL</span>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-[#B1B5C3]">Balance: {balance.toFixed(2)} SOL</span>
                <div className="flex gap-2">
                  {[0.1, 0.5, 1].map((pct) => (
                    <button key={pct} onClick={() => setAmount((balance * pct).toFixed(2))} className="text-[10px] text-[#F7A600] bg-[rgba(247,166,0,0.08)] px-1.5 py-0.5 rounded hover:bg-[rgba(247,166,0,0.15)]">
                      {pct * 100}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Confidence Slider */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-[#B1B5C3]">Confidence Level</label>
                <span className="text-xs font-bold text-[#00F0FF]">{confidence}%</span>
              </div>
              <input type="range" min="1" max="100" value={confidence} onChange={(e) => setConfidence(parseInt(e.target.value))} disabled={submitting} className="w-full" />
            </div>

            {/* Private Mode */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#12161C] border border-[rgba(255,255,255,0.06)] mb-4">
              <div className="flex items-center gap-2">
                <Lock style={{ width: 14, height: 14 }} className="text-[#00F0FF]" />
                <div>
                  <p className="text-xs font-medium text-white">Arcium Privacy</p>
                  <p className="text-[10px] text-[#B1B5C3]">Encrypt via MXE</p>
                </div>
              </div>
              <button
                onClick={() => setPrivateMode(!privateMode)}
                disabled={submitting}
                className={`w-10 h-6 rounded-full transition-all relative ${privateMode ? 'bg-[#00F0FF]' : 'bg-[#232A36]'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${privateMode ? 'left-5' : 'left-1'}`} />
              </button>
            </div>

            {/* Potential Return */}
            {numAmount > 0 && (
              <div className="p-3 rounded-xl bg-[#12161C] border border-[rgba(255,255,255,0.06)] mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-[#B1B5C3]">Potential Payout</span>
                  <span className="text-sm font-bold text-[#16C784] num-display">
                    {potentialReturn.toFixed(2)} SOL
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#B1B5C3]">Profit if correct</span>
                  <span className="text-xs font-semibold text-[#16C784] num-display">+{profit.toFixed(2)} SOL</span>
                </div>
              </div>
            )}

            {/* Arcium computation animation */}
            {submitting && arciumStep >= 0 && (
              <div className="p-3 rounded-xl bg-[rgba(0,240,255,0.04)] border border-[rgba(0,240,255,0.12)] mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu style={{ width: 14, height: 14 }} className="text-[#00F0FF]" />
                  <p className="text-xs font-semibold text-[#00F0FF]">Arcium MXE Processing</p>
                </div>
                <ArciumSteps step={arciumStep} />
              </div>
            )}

            {/* Submit */}
            <button
              onClick={() => {
                if (!connected) { addNotification({ id: `n${Date.now()}`, type: 'error', title: 'Connect Wallet', message: 'Please connect your wallet first', timestamp: Date.now() }); return; }
                if (!amount || numAmount <= 0) return;
                setShowConfirm(true);
              }}
              disabled={!amount || numAmount <= 0 || submitting}
              className={`w-full h-12 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                side === 'yes' ? 'bg-[#16C784] hover:bg-[#14b474] text-white' : 'bg-[#EA3943] hover:bg-[#d42f38] text-white'
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing via Arcium...
                </span>
              ) : (
                `Buy ${side.toUpperCase()} — ${numAmount > 0 ? numAmount.toFixed(2) : '0.00'} SOL`
              )}
            </button>
            <p className="text-center text-[10px] text-[#B1B5C3] mt-2 flex items-center justify-center gap-1">
              <Info style={{ width: 10, height: 10 }} />
              Position hidden until market settlement
            </p>
          </div>

          {/* Market Stats */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Market Stats</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Liquidity', value: `$${(market.liquidity / 1000).toFixed(0)}K` },
                { label: '24h Volume', value: `$${(market.volume / 1000000).toFixed(2)}M` },
                { label: 'Participants', value: market.participants.toLocaleString() },
                { label: 'Confidence Index', value: `${market.confidence}%` },
                { label: 'Creator', value: market.creator || '0xAnon' },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between py-1.5 border-b border-[rgba(255,255,255,0.05)] last:border-0">
                  <span className="text-xs text-[#B1B5C3]">{s.label}</span>
                  <span className="text-xs font-semibold text-white num-display">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowConfirm(false)}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative glass-panel rounded-2xl p-6 max-w-md w-full border border-[rgba(247,166,0,0.2)]"
            >
              <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#00F0FF]" /> Confirm Encrypted Position
              </h3>
              <div className="space-y-2 mb-5">
                {[
                  ['Market', market.title.slice(0, 50) + '...'],
                  ['Position', side.toUpperCase()],
                  ['Stake', `${numAmount} SOL`],
                  ['Confidence', `${confidence}%`],
                  ['Privacy', privateMode ? '🔐 Arcium Encrypted' : '🌐 Public'],
                  ['Potential Return', `${potentialReturn.toFixed(2)} SOL`],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-2 border-b border-[rgba(255,255,255,0.06)]">
                    <span className="text-sm text-[#B1B5C3]">{l}</span>
                    <span className={`text-sm font-semibold ${l === 'Position' ? (side === 'yes' ? 'text-[#16C784]' : 'text-[#EA3943]') : 'text-white'}`}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-[rgba(0,240,255,0.04)] border border-[rgba(0,240,255,0.1)] mb-4">
                <p className="text-xs text-[#00F0FF] flex items-center gap-2">
                  <Cpu style={{ width: 12, height: 12 }} />
                  Position will be encrypted via Arcium MXE before submission
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 h-11 rounded-xl border border-[rgba(255,255,255,0.12)] text-white font-semibold text-sm hover:bg-[#232A36] transition-colors">
                  Cancel
                </button>
                <button onClick={handleSubmitPosition} className="flex-1 h-11 rounded-xl bg-[#F7A600] hover:bg-[#FFB82E] text-[#0B0E11] font-bold text-sm transition-all">
                  Confirm & Encrypt
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
