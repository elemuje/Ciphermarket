import { motion } from 'framer-motion';
import {
  Shield, Lock, Eye, EyeOff, Cpu, Activity, CheckCircle,
  AlertTriangle, Info, ToggleLeft, ToggleRight, Zap, Globe, Key
} from 'lucide-react';
import { usePrivacyStore, useWalletStore, useMarketStore } from '../stores';
import { useState } from 'react';

const ARCIUM_EXPLAINER = [
  {
    icon: Key,
    title: 'Fully Homomorphic Encryption (FHE)',
    desc: 'Your position data is encrypted before it leaves your browser. Even Arcium validators cannot see your individual bet size or direction.',
    color: '#00F0FF',
  },
  {
    icon: Cpu,
    title: 'Multi-Party Execution Environments',
    desc: 'Arcium MXE runs computations on encrypted data using multiple independent parties. Collusion is cryptographically impossible.',
    color: '#BD00FF',
  },
  {
    icon: Globe,
    title: 'Threshold Reveal',
    desc: 'Results are only revealed after a market closes using a threshold decryption scheme — requiring agreement from the majority of MXE nodes.',
    color: '#F7A600',
  },
  {
    icon: Shield,
    title: 'Zero-Knowledge Proofs',
    desc: 'Every settlement transaction includes a ZK proof verifying that computation was performed correctly, without revealing underlying data.',
    color: '#16C784',
  },
];

function PrivacyToggle({ enabled, onToggle, icon: Icon, label, desc, color }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[#12161C] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] transition-all">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon style={{ width: 16, height: 16, color }} />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-[#B1B5C3]">{desc}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ml-3 ${enabled ? 'bg-[#00F0FF]' : 'bg-[#232A36]'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 shadow-md ${enabled ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );
}

function ScoreRing({ score }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const color = score >= 80 ? '#16C784' : score >= 50 ? '#F7A600' : '#EA3943';
  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#232A36" strokeWidth="8" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - dash }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold num-display" style={{ color }}>{score}</p>
        <p className="text-[9px] text-[#B1B5C3]">/ 100</p>
      </div>
    </div>
  );
}

export default function PrivacyCenterPage() {
  const privacyMode = usePrivacyStore((s) => s.privacyMode);
  const encryptionStatus = usePrivacyStore((s) => s.encryptionStatus);
  const enablePrivacyMode = usePrivacyStore((s) => s.enablePrivacyMode);
  const disablePrivacyMode = usePrivacyStore((s) => s.disablePrivacyMode);
  const connected = useWalletStore((s) => s.connected);
  const positions = useMarketStore((s) => s.positions);

  const [settings, setSettings] = useState({
    hidePositions: true,
    hideBalance: false,
    anonymousVoting: true,
    encryptedComms: true,
    privateCreation: true,
    stealth: false,
  });

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  const encryptedPositions = positions.length;
  const privacyScore = Math.round(
    (privacyMode ? 40 : 0) +
    (settings.hidePositions ? 20 : 0) +
    (settings.anonymousVoting ? 15 : 0) +
    (settings.encryptedComms ? 15 : 0) +
    (settings.privateCreation ? 10 : 0)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Privacy Center</h1>
        <p className="text-sm text-[#B1B5C3] mt-0.5">Manage your privacy settings and Arcium encryption preferences</p>
      </div>

      {/* Privacy score + master toggle */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* Score */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 text-center">
          <p className="text-sm font-semibold text-white mb-3">Privacy Score</p>
          <ScoreRing score={privacyScore} />
          <p className={`text-xs font-semibold mt-3 ${privacyScore >= 80 ? 'text-[#16C784]' : privacyScore >= 50 ? 'text-[#F7A600]' : 'text-[#EA3943]'}`}>
            {privacyScore >= 80 ? '🛡️ Maximum Privacy' : privacyScore >= 50 ? '⚡ Good Privacy' : '⚠️ Low Privacy'}
          </p>
        </motion.div>

        {/* Master toggle */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className={`glass-card p-5 border md:col-span-2 ${privacyMode ? 'border-[rgba(0,240,255,0.2)]' : 'border-[rgba(255,255,255,0.06)]'}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${privacyMode ? 'bg-[rgba(0,240,255,0.1)]' : 'bg-[#1A1F29]'}`}>
                {privacyMode ? <Shield className="w-5 h-5 text-[#00F0FF]" /> : <EyeOff className="w-5 h-5 text-[#B1B5C3]" />}
              </div>
              <div>
                <p className="text-base font-display font-bold text-white">Arcium Privacy Mode</p>
                <p className="text-xs text-[#B1B5C3]">
                  {privacyMode ? 'All positions encrypted via FHE + MXE' : 'Trading publicly — positions visible on-chain'}
                </p>
              </div>
            </div>
            <button
              onClick={privacyMode ? disablePrivacyMode : enablePrivacyMode}
              className={`w-14 h-7 rounded-full transition-all duration-300 relative flex-shrink-0 ml-4 ${privacyMode ? 'bg-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.4)]' : 'bg-[#232A36]'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all duration-300 shadow-md ${privacyMode ? 'left-8' : 'left-1'}`} />
            </button>
          </div>
          {privacyMode && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[rgba(0,240,255,0.06)] border border-[rgba(0,240,255,0.1)]">
              <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
              <p className="text-xs text-[#00F0FF] font-medium">Arcium MXE active · {encryptedPositions} positions encrypted</p>
            </div>
          )}
          {!privacyMode && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[rgba(234,57,67,0.06)] border border-[rgba(234,57,67,0.1)]">
              <AlertTriangle style={{ width: 13, height: 13 }} className="text-[#EA3943]" />
              <p className="text-xs text-[#EA3943]">Privacy mode disabled — your positions are publicly visible on-chain</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Privacy settings */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Lock style={{ width: 15, height: 15 }} className="text-[#00F0FF]" /> Privacy Controls
        </h3>
        <div className="space-y-3">
          <PrivacyToggle enabled={settings.hidePositions} onToggle={() => toggle('hidePositions')} icon={EyeOff} label="Hide Position Sizes" desc="Mask stake amounts — only you see exact amounts" color="#00F0FF" />
          <PrivacyToggle enabled={settings.hideBalance} onToggle={() => toggle('hideBalance')} icon={Eye} label="Hide Wallet Balance" desc="Conceal your SOL balance from the UI" color="#BD00FF" />
          <PrivacyToggle enabled={settings.anonymousVoting} onToggle={() => toggle('anonymousVoting')} icon={Shield} label="Anonymous Governance Voting" desc="Votes encrypted and not linkable to your wallet" color="#F7A600" />
          <PrivacyToggle enabled={settings.encryptedComms} onToggle={() => toggle('encryptedComms')} icon={Lock} label="Encrypted Communications" desc="All market-related messages routed through Arcium" color="#16C784" />
          <PrivacyToggle enabled={settings.privateCreation} onToggle={() => toggle('privateCreation')} icon={Key} label="Anonymous Market Creation" desc="Create markets without revealing your identity" color="#3B82F6" />
          <PrivacyToggle enabled={settings.stealth} onToggle={() => toggle('stealth')} icon={Zap} label="Stealth Mode" desc="Maximum obfuscation — uses Tor-like routing (experimental)" color="#EA3943" />
        </div>
      </div>

      {/* How Arcium works */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu style={{ width: 15, height: 15 }} className="text-[#BD00FF]" /> How Arcium Protects You
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {ARCIUM_EXPLAINER.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="p-4 rounded-xl bg-[#12161C] border border-[rgba(255,255,255,0.05)]"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: `${item.color}15` }}>
                <item.icon style={{ width: 15, height: 15, color: item.color }} />
              </div>
              <p className="text-xs font-semibold text-white mb-1">{item.title}</p>
              <p className="text-[10px] text-[#B1B5C3] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Privacy audit log */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Activity style={{ width: 15, height: 15 }} className="text-[#16C784]" /> Recent Privacy Events
        </h3>
        <div className="space-y-2">
          {[
            { action: 'Position encrypted', market: 'BTC > $150K', time: '2 mins ago', icon: Lock, color: '#00F0FF' },
            { action: 'Governance vote sealed', market: 'Proposal G2', time: '1 hour ago', icon: Shield, color: '#BD00FF' },
            { action: 'MXE computation completed', market: 'Fed Rate market', time: '3 hours ago', icon: Cpu, color: '#F7A600' },
            { action: 'Position decrypted (settled)', market: 'AGI by 2030', time: '1 day ago', icon: CheckCircle, color: '#16C784' },
          ].map((event, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#12161C] border border-[rgba(255,255,255,0.04)]">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${event.color}15` }}>
                <event.icon style={{ width: 13, height: 13, color: event.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white">{event.action}</p>
                <p className="text-[10px] text-[#B1B5C3]">{event.market}</p>
              </div>
              <p className="text-[10px] text-[#B1B5C3] flex-shrink-0">{event.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="p-4 rounded-xl bg-[rgba(0,240,255,0.03)] border border-[rgba(0,240,255,0.1)] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#00F0FF] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#B1B5C3]">
          CipherMarket uses Arcium's Multi-Party Execution Environments to provide cryptographic privacy guarantees.
          No centralized server stores your data. All computation happens on encrypted inputs distributed across Arcium's decentralized validator network.
          <a href="https://arcium.com" target="_blank" rel="noreferrer" className="text-[#00F0FF] ml-1 hover:underline">Learn more about Arcium →</a>
        </p>
      </div>
    </div>
  );
}
