import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Info, Shield, Lock, Clock, Tag, DollarSign,
  FileText, CheckCircle, AlertTriangle, Cpu
} from 'lucide-react';
import { useMarketStore, useWalletStore, useUIStore } from '../stores';
import { useState } from 'react';

const CATEGORIES = ['Crypto', 'Finance', 'AI', 'Politics', 'Sports', 'Science', 'Technology', 'Entertainment', 'Economics', 'Other'];

const RESOLUTION_SOURCES = [
  'CoinGecko', 'CoinMarketCap', 'SEC.gov', 'FederalReserve.gov',
  'Expert Consensus Panel', 'Polymarket', 'Reuters', 'Bloomberg',
  'Official Government Source', 'Solana Explorer', 'Other'
];

const TIPS = [
  'Be specific about resolution criteria — ambiguity leads to disputes',
  'Set a clear resolution source that is publicly verifiable',
  'End dates should give enough time for the event to resolve',
  'Include exact thresholds (e.g. "above $100K" not "high price")',
  'Consider both YES and NO scenarios in your description',
];

export default function CreateMarketPage() {
  const navigate = useNavigate();
  const connected = useWalletStore((s) => s.connected);
  const addMarket = useMarketStore((s) => s.addMarket);
  const addNotification = useUIStore((s) => s.addNotification);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Crypto',
    endDate: '',
    resolutionSource: 'CoinGecko',
    minStake: '0.1',
    initialLiquidity: '100',
    tags: '',
    privateMarket: true,
    allowAnonymous: true,
  });

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [arciumStep, setArciumStep] = useState(-1);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim() || form.title.length < 10) e.title = 'Title must be at least 10 characters';
    if (!form.description.trim() || form.description.length < 30) e.description = 'Description must be at least 30 characters';
    if (!form.endDate) e.endDate = 'End date is required';
    else if (new Date(form.endDate) <= new Date()) e.endDate = 'End date must be in the future';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (!connected) {
      addNotification({ id: `n${Date.now()}`, type: 'error', title: 'Connect Wallet', message: 'You must connect your wallet to create a market', timestamp: Date.now() });
      return;
    }
    setSubmitting(true);
    for (let i = 0; i <= 4; i++) {
      await new Promise((r) => setTimeout(r, 500));
      setArciumStep(i);
    }
    const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
    const market = {
      id: `m${Date.now()}`,
      title: form.title,
      description: form.description,
      category: form.category,
      endDate: form.endDate,
      resolutionSource: form.resolutionSource,
      probability: 50,
      yesPrice: 0.5,
      noPrice: 0.5,
      volume: parseFloat(form.initialLiquidity) * 1000,
      liquidity: parseFloat(form.initialLiquidity) * 1000,
      participants: 1,
      status: 'live',
      confidence: 50,
      tags: tags.length > 0 ? tags : [form.category],
      creator: 'You',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    addMarket(market);
    setSubmitting(false);
    setArciumStep(-1);
    addNotification({
      id: `n${Date.now()}`,
      type: 'success',
      title: '🎉 Market Created!',
      message: `"${form.title.slice(0, 40)}..." is now live`,
      timestamp: Date.now(),
    });
    navigate('/dashboard');
  };

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(247,166,0,0.1)] flex items-center justify-center mb-5">
          <Plus className="w-8 h-8 text-[#F7A600]" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">Connect Wallet to Create</h2>
        <p className="text-[#B1B5C3] max-w-sm mb-6">Creating a market requires a connected Solana wallet to sign the transaction and pay the creation fee.</p>
        <div className="p-4 rounded-xl bg-[rgba(247,166,0,0.06)] border border-[rgba(247,166,0,0.15)] max-w-sm">
          <p className="text-sm text-[#F7A600] font-semibold">Market Creation Fee</p>
          <p className="text-xs text-[#B1B5C3] mt-1">2 SOL + initial liquidity contribution</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Create Prediction Market</h1>
        <p className="text-sm text-[#B1B5C3] mt-0.5">Launch your own encrypted prediction market on CipherMarket</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setStep(s)}
              className={`w-7 h-7 rounded-full font-bold text-xs transition-all flex items-center justify-center ${
                s < step ? 'bg-[#16C784] text-white' :
                s === step ? 'bg-[#F7A600] text-[#0B0E11]' :
                'bg-[#232A36] text-[#B1B5C3]'
              }`}
            >
              {s < step ? <CheckCircle style={{ width: 14, height: 14 }} /> : s}
            </button>
            <span className={`text-xs ${s === step ? 'text-white font-medium' : 'text-[#B1B5C3]'}`}>
              {s === 1 ? 'Question' : s === 2 ? 'Details' : 'Privacy & Launch'}
            </span>
            {s < 3 && <div className="w-6 h-px bg-[#232A36]" />}
          </div>
        ))}
      </div>

      {/* Step 1: Question */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <FileText style={{ width: 15, height: 15 }} className="text-[#F7A600]" /> Market Question
          </h3>
          <div>
            <label className="text-xs text-[#B1B5C3] mb-1.5 block">Question Title *</label>
            <input
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Will [subject] [verb] by [date]?"
              className={`w-full h-11 px-4 rounded-xl bg-[#12161C] border text-white text-sm focus:outline-none focus:border-[#F7A600] transition-colors ${errors.title ? 'border-[#EA3943]' : 'border-[rgba(255,255,255,0.08)]'}`}
            />
            {errors.title && <p className="text-xs text-[#EA3943] mt-1">{errors.title}</p>}
            <p className="text-[10px] text-[#B1B5C3] mt-1">{form.title.length}/200 characters</p>
          </div>
          <div>
            <label className="text-xs text-[#B1B5C3] mb-1.5 block">Description & Resolution Criteria *</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe exactly how this market resolves. Include the YES scenario, the NO scenario, and the primary resolution source..."
              rows={5}
              className={`w-full px-4 py-3 rounded-xl bg-[#12161C] border text-white text-sm focus:outline-none focus:border-[#F7A600] transition-colors resize-none ${errors.description ? 'border-[#EA3943]' : 'border-[rgba(255,255,255,0.08)]'}`}
            />
            {errors.description && <p className="text-xs text-[#EA3943] mt-1">{errors.description}</p>}
          </div>
          <div>
            <label className="text-xs text-[#B1B5C3] mb-1.5 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => update('category', cat)}
                  className={`h-7 px-3 rounded-lg text-xs font-medium transition-all ${
                    form.category === cat
                      ? 'bg-[rgba(247,166,0,0.15)] border border-[rgba(247,166,0,0.3)] text-[#F7A600]'
                      : 'bg-[#1A1F29] border border-[rgba(255,255,255,0.06)] text-[#B1B5C3] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="p-3 rounded-xl bg-[rgba(0,240,255,0.04)] border border-[rgba(0,240,255,0.1)]">
            <p className="text-xs font-semibold text-[#00F0FF] mb-2 flex items-center gap-1.5">
              <Info style={{ width: 12, height: 12 }} /> Writing Tips
            </p>
            <ul className="space-y-1">
              {TIPS.map((t, i) => (
                <li key={i} className="text-[10px] text-[#B1B5C3] flex items-start gap-1.5">
                  <span className="text-[#00F0FF] flex-shrink-0 mt-0.5">•</span> {t}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => { const e = {}; if (!form.title.trim() || form.title.length < 10) e.title = 'Title must be at least 10 characters'; if (!form.description.trim() || form.description.length < 30) e.description = 'Description must be at least 30 characters'; setErrors(e); if (Object.keys(e).length === 0) setStep(2); }}
            className="w-full h-11 rounded-xl bg-[#F7A600] hover:bg-[#FFB82E] text-[#0B0E11] font-bold text-sm transition-all">
            Continue →
          </button>
        </motion.div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 space-y-4">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Clock style={{ width: 15, height: 15 }} className="text-[#F7A600]" /> Market Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#B1B5C3] mb-1.5 block">End Date *</label>
              <input
                type="date"
                value={form.endDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => update('endDate', e.target.value)}
                className={`w-full h-10 px-3 rounded-xl bg-[#12161C] border text-white text-sm focus:outline-none focus:border-[#F7A600] transition-colors ${errors.endDate ? 'border-[#EA3943]' : 'border-[rgba(255,255,255,0.08)]'}`}
              />
              {errors.endDate && <p className="text-xs text-[#EA3943] mt-1">{errors.endDate}</p>}
            </div>
            <div>
              <label className="text-xs text-[#B1B5C3] mb-1.5 block">Resolution Source</label>
              <select
                value={form.resolutionSource}
                onChange={(e) => update('resolutionSource', e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#12161C] border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-[#F7A600]"
              >
                {RESOLUTION_SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#B1B5C3] mb-1.5 block">Min Stake (SOL)</label>
              <div className="relative">
                <DollarSign style={{ width: 13, height: 13 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B1B5C3]" />
                <input
                  type="number"
                  value={form.minStake}
                  min="0.01"
                  step="0.01"
                  onChange={(e) => update('minStake', e.target.value)}
                  className="w-full h-10 pl-8 pr-3 rounded-xl bg-[#12161C] border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-[#F7A600]"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#B1B5C3] mb-1.5 block">Initial Liquidity (SOL)</label>
              <div className="relative">
                <DollarSign style={{ width: 13, height: 13 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B1B5C3]" />
                <input
                  type="number"
                  value={form.initialLiquidity}
                  min="1"
                  onChange={(e) => update('initialLiquidity', e.target.value)}
                  className="w-full h-10 pl-8 pr-3 rounded-xl bg-[#12161C] border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-[#F7A600]"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs text-[#B1B5C3] mb-1.5 block flex items-center gap-1.5">
              <Tag style={{ width: 11, height: 11 }} /> Tags (comma-separated)
            </label>
            <input
              value={form.tags}
              onChange={(e) => update('tags', e.target.value)}
              placeholder="Bitcoin, Price, 2026"
              className="w-full h-10 px-4 rounded-xl bg-[#12161C] border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-[#F7A600] transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 h-11 rounded-xl border border-[rgba(255,255,255,0.12)] text-white font-semibold text-sm hover:bg-[#232A36] transition-colors">
              ← Back
            </button>
            <button onClick={() => setStep(3)} className="flex-1 h-11 rounded-xl bg-[#F7A600] hover:bg-[#FFB82E] text-[#0B0E11] font-bold text-sm transition-all">
              Continue →
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Privacy & Launch */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 space-y-5">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Shield style={{ width: 15, height: 15 }} className="text-[#00F0FF]" /> Privacy & Launch
          </h3>

          {/* Privacy toggles */}
          {[
            { key: 'privateMarket', label: 'Arcium Encrypted Market', desc: 'All positions encrypted via MXE — no one can see individual stakes', icon: Lock, color: '#00F0FF' },
            { key: 'allowAnonymous', label: 'Allow Anonymous Trading', desc: 'Participants can trade without revealing their wallet', icon: Shield, color: '#BD00FF' },
          ].map((opt) => (
            <div key={opt.key} className="flex items-center justify-between p-4 rounded-xl bg-[#12161C] border border-[rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${opt.color}15` }}>
                  <opt.icon style={{ width: 14, height: 14, color: opt.color }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{opt.label}</p>
                  <p className="text-xs text-[#B1B5C3]">{opt.desc}</p>
                </div>
              </div>
              <button
                onClick={() => update(opt.key, !form[opt.key])}
                className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${form[opt.key] ? 'bg-[#00F0FF]' : 'bg-[#232A36]'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${form[opt.key] ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          ))}

          {/* Cost breakdown */}
          <div className="p-4 rounded-xl bg-[#12161C] border border-[rgba(255,255,255,0.06)]">
            <p className="text-xs font-semibold text-white mb-3">Cost Summary</p>
            <div className="space-y-1.5">
              {[
                ['Creation Fee', '2 SOL'],
                ['Initial Liquidity', `${form.initialLiquidity} SOL`],
                ['Network Fee', '~0.002 SOL'],
                ['Privacy Premium', form.privateMarket ? '0.5 SOL' : '0 SOL'],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-xs">
                  <span className="text-[#B1B5C3]">{l}</span>
                  <span className="text-white font-semibold num-display">{v}</span>
                </div>
              ))}
              <div className="border-t border-[rgba(255,255,255,0.06)] pt-2 mt-2 flex justify-between text-sm">
                <span className="text-white font-semibold">Total</span>
                <span className="text-[#F7A600] font-bold num-display">
                  {(2.502 + parseFloat(form.initialLiquidity || 0) + (form.privateMarket ? 0.5 : 0)).toFixed(3)} SOL
                </span>
              </div>
            </div>
          </div>

          {/* Arcium processing animation during submit */}
          {submitting && arciumStep >= 0 && (
            <div className="p-4 rounded-xl bg-[rgba(0,240,255,0.04)] border border-[rgba(0,240,255,0.12)]">
              <p className="text-xs font-semibold text-[#00F0FF] flex items-center gap-2 mb-2">
                <Cpu style={{ width: 13, height: 13 }} className="animate-spin" />
                Deploying market via Arcium...
              </p>
              <div className="flex items-center gap-1 flex-wrap">
                {['Init', 'Encrypt', 'Deploy', 'Verify', 'Live'].map((s, i) => (
                  <div key={s} className="flex items-center gap-1">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      i < arciumStep ? 'bg-[rgba(0,240,255,0.2)] text-[#00F0FF]' :
                      i === arciumStep ? 'bg-[rgba(247,166,0,0.2)] text-[#F7A600] animate-pulse' :
                      'bg-[#1A1F29] text-[#B1B5C3]'
                    }`}>{s}</span>
                    {i < 4 && <div className={`w-2 h-0.5 ${i < arciumStep ? 'bg-[#00F0FF]' : 'bg-[#232A36]'}`} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} disabled={submitting} className="flex-1 h-11 rounded-xl border border-[rgba(255,255,255,0.12)] text-white font-semibold text-sm hover:bg-[#232A36] transition-colors disabled:opacity-40">
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 h-11 rounded-xl bg-[#F7A600] hover:bg-[#FFB82E] text-[#0B0E11] font-bold text-sm transition-all disabled:opacity-60"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0B0E11]/30 border-t-[#0B0E11] rounded-full animate-spin" />
                  Deploying...
                </span>
              ) : 'Launch Market 🚀'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Market preview */}
      {form.title && (
        <div className="glass-card p-4 border border-[rgba(255,255,255,0.06)]">
          <p className="text-xs text-[#B1B5C3] mb-2">Preview</p>
          <h4 className="text-sm font-semibold text-white mb-1">{form.title || 'Your question here...'}</h4>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] bg-[#232A36] text-[#B1B5C3] px-2 py-0.5 rounded-md">{form.category}</span>
            <span className="badge-live text-[10px] px-2 py-0.5 rounded-md uppercase">Live</span>
            {form.privateMarket && <span className="text-[10px] text-[#00F0FF] bg-[rgba(0,240,255,0.06)] border border-[rgba(0,240,255,0.12)] px-2 py-0.5 rounded-md flex items-center gap-1"><Lock style={{ width: 9, height: 9 }} /> Encrypted</span>}
            {form.endDate && <span className="text-[10px] text-[#B1B5C3] flex items-center gap-1"><Clock style={{ width: 9, height: 9 }} /> Ends {form.endDate}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
