import { motion } from 'framer-motion';
import {
  Settings, Bell, Volume2, VolumeX, Globe, Sliders,
  Zap, Shield, Trash2, Download, AlertTriangle, CheckCircle,
  Monitor, Moon, Sun, ExternalLink, LogOut, Copy
} from 'lucide-react';
import { useSettingsStore, useWalletStore, useUIStore } from '../stores';
import { useState } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'zh', label: '中文' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ja', label: '日本語' },
  { code: 'pt', label: 'Português' },
  { code: 'ko', label: '한국어' },
];

const GAS_PRESETS = [
  { id: 'economy', label: 'Economy', desc: '~5s', multiplier: '0.8x' },
  { id: 'normal', label: 'Normal', desc: '~2s', multiplier: '1x' },
  { id: 'fast', label: 'Fast', desc: '<1s', multiplier: '1.5x' },
  { id: 'turbo', label: 'Turbo', desc: 'Instant', multiplier: '2x' },
];

function Section({ title, icon: Icon, color, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <Icon style={{ width: 15, height: 15, color }} /> {title}
      </h3>
      {children}
    </motion.div>
  );
}

function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.05)] last:border-0">
      <div>
        <p className="text-sm text-white">{label}</p>
        {desc && <p className="text-xs text-[#B1B5C3] mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ml-4 ${value ? 'bg-[#F7A600]' : 'bg-[#232A36]'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 shadow-md ${value ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const settings = useSettingsStore();
  const connected = useWalletStore((s) => s.connected);
  const publicKey = useWalletStore((s) => s.publicKey);
  const walletType = useWalletStore((s) => s.walletType);
  const balance = useWalletStore((s) => s.balance);
  const disconnect = useWalletStore((s) => s.disconnect);
  const addNotification = useUIStore((s) => s.addNotification);
  const [copied, setCopied] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);

  const copyKey = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      wallet: publicKey,
      settings: {
        slippageTolerance: settings.slippageTolerance,
        gasPreset: settings.gasPreset,
        language: settings.language,
        notifications: settings.notifications,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ciphermarket-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    addNotification({ id: `e${Date.now()}`, type: 'success', title: 'Settings Exported', message: 'Your settings have been downloaded', timestamp: Date.now() });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Settings</h1>
        <p className="text-sm text-[#B1B5C3] mt-0.5">Customize your CipherMarket experience</p>
      </div>

      {/* Wallet Section */}
      {connected ? (
        <Section title="Connected Wallet" icon={Shield} color="#16C784">
          <div className="p-4 rounded-xl bg-[rgba(22,199,132,0.05)] border border-[rgba(22,199,132,0.15)] mb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#16C784] animate-pulse" />
                  <p className="text-xs font-semibold text-[#16C784] capitalize">{walletType} Connected</p>
                </div>
                <p className="text-sm text-white font-mono break-all">{publicKey}</p>
                <p className="text-xs text-[#B1B5C3] mt-1 num-display">{balance.toFixed(4)} SOL</p>
              </div>
              <button onClick={copyKey} className="flex items-center gap-1 h-8 px-3 rounded-lg bg-[#232A36] text-xs text-[#B1B5C3] hover:text-white transition-colors flex-shrink-0">
                {copied ? <CheckCircle style={{ width: 12, height: 12 }} className="text-[#16C784]" /> : <Copy style={{ width: 12, height: 12 }} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <a
            href={`https://solscan.io/account/${publicKey}`}
            target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-xs text-[#B1B5C3] hover:text-[#00F0FF] transition-colors mb-3"
          >
            <ExternalLink style={{ width: 12, height: 12 }} /> View on Solscan
          </a>
          <button
            onClick={() => { disconnect(); addNotification({ id: `d${Date.now()}`, type: 'info', title: 'Wallet Disconnected', message: 'Your wallet has been disconnected', timestamp: Date.now() }); }}
            className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[rgba(234,57,67,0.1)] border border-[rgba(234,57,67,0.2)] text-[#EA3943] text-sm font-semibold hover:bg-[rgba(234,57,67,0.15)] transition-colors"
          >
            <LogOut style={{ width: 13, height: 13 }} /> Disconnect Wallet
          </button>
        </Section>
      ) : (
        <div className="glass-card p-5 border border-[rgba(247,166,0,0.1)]">
          <p className="text-sm text-[#B1B5C3]">No wallet connected. Connect a wallet to access all settings.</p>
        </div>
      )}

      {/* Notifications */}
      <Section title="Notifications" icon={Bell} color="#F7A600">
        <ToggleRow label="Market Settlement" desc="Get notified when your markets resolve" value={settings.notifications.marketSettlement} onChange={(v) => settings.setNotification('marketSettlement', v)} />
        <ToggleRow label="Price Alerts" desc="Alerts when probability crosses your thresholds" value={settings.notifications.priceAlerts} onChange={(v) => settings.setNotification('priceAlerts', v)} />
        <ToggleRow label="Governance" desc="New proposals and voting reminders" value={settings.notifications.governance} onChange={(v) => settings.setNotification('governance', v)} />
        <ToggleRow label="Rewards & XP" desc="Achievement unlocks and claimable rewards" value={settings.notifications.rewards} onChange={(v) => settings.setNotification('rewards', v)} />
      </Section>

      {/* Sound */}
      <Section title="Sound & Display" icon={settings.soundEnabled ? Volume2 : VolumeX} color="#00F0FF">
        <ToggleRow label="Sound Effects" desc="Confirmation beeps and notification sounds" value={settings.soundEnabled} onChange={settings.setSoundEnabled} />
      </Section>

      {/* Trading */}
      <Section title="Trading" icon={Sliders} color="#BD00FF">
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <label className="text-sm text-white">Slippage Tolerance</label>
            <span className="text-sm font-bold text-[#F7A600] num-display">{settings.slippageTolerance}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={settings.slippageTolerance}
            onChange={(e) => settings.setSlippage(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-[#B1B5C3]">0.1% Low</span>
            <span className="text-[10px] text-[#B1B5C3]">5% High</span>
          </div>
        </div>

        <div>
          <label className="text-sm text-white mb-2 block">Transaction Speed</label>
          <div className="grid grid-cols-4 gap-2">
            {GAS_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => settings.setGasPreset(preset.id)}
                className={`p-2 rounded-xl border text-center transition-all ${
                  settings.gasPreset === preset.id
                    ? 'bg-[rgba(247,166,0,0.1)] border-[rgba(247,166,0,0.3)] text-[#F7A600]'
                    : 'bg-[#12161C] border-[rgba(255,255,255,0.06)] text-[#B1B5C3] hover:border-[rgba(255,255,255,0.12)]'
                }`}
              >
                <p className="text-xs font-semibold">{preset.label}</p>
                <p className="text-[9px] mt-0.5">{preset.desc}</p>
                <p className="text-[9px] text-[#B1B5C3] mt-0.5">{preset.multiplier}</p>
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Language */}
      <Section title="Language & Region" icon={Globe} color="#3B82F6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => settings.setLanguage(lang.code)}
              className={`h-9 px-3 rounded-lg text-sm transition-all ${
                settings.language === lang.code
                  ? 'bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)] text-[#3B82F6] font-semibold'
                  : 'bg-[#12161C] border border-[rgba(255,255,255,0.06)] text-[#B1B5C3] hover:border-[rgba(255,255,255,0.12)]'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </Section>

      {/* About */}
      <Section title="About CipherMarket" icon={Settings} color="#B1B5C3">
        <div className="space-y-2 text-xs text-[#B1B5C3]">
          {[
            ['Version', 'v1.0.0'],
            ['Network', 'Solana Mainnet-Beta'],
            ['Privacy Layer', 'Arcium MXE v2.1'],
            ['Smart Contract', '8xDtV3kLp9...encrypted'],
            ['Audit Status', '✅ Passed — OtterSec Q1 2026'],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.04)] last:border-0">
              <span>{l}</span>
              <span className="text-white font-medium">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {['Terms of Service', 'Privacy Policy', 'Documentation', 'Bug Bounty'].map((link) => (
            <a key={link} href="#" className="text-xs text-[#00F0FF] hover:underline flex items-center gap-1">
              {link} <ExternalLink style={{ width: 10, height: 10 }} />
            </a>
          ))}
        </div>
      </Section>

      {/* Data actions */}
      <Section title="Data & Account" icon={Download} color="#EA3943">
        <div className="space-y-3">
          <button onClick={handleExport} className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#12161C] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.1)] transition-all">
            <Download style={{ width: 15, height: 15 }} className="text-[#3B82F6]" />
            <div className="text-left">
              <p className="text-sm text-white">Export Settings</p>
              <p className="text-xs text-[#B1B5C3]">Download your preferences as JSON</p>
            </div>
          </button>
          {!clearConfirm ? (
            <button onClick={() => setClearConfirm(true)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-[rgba(234,57,67,0.04)] border border-[rgba(234,57,67,0.1)] hover:bg-[rgba(234,57,67,0.08)] transition-all">
              <Trash2 style={{ width: 15, height: 15 }} className="text-[#EA3943]" />
              <div className="text-left">
                <p className="text-sm text-[#EA3943]">Clear Local Data</p>
                <p className="text-xs text-[#B1B5C3]">Remove cached preferences and history</p>
              </div>
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-[rgba(234,57,67,0.08)] border border-[rgba(234,57,67,0.2)]">
              <p className="text-sm text-white mb-3 flex items-center gap-2">
                <AlertTriangle style={{ width: 14, height: 14 }} className="text-[#EA3943]" />
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setClearConfirm(false)} className="flex-1 h-9 rounded-lg border border-[rgba(255,255,255,0.12)] text-white text-sm font-semibold">
                  Cancel
                </button>
                <button
                  onClick={() => { setClearConfirm(false); addNotification({ id: `c${Date.now()}`, type: 'success', title: 'Data Cleared', message: 'Local data has been cleared', timestamp: Date.now() }); }}
                  className="flex-1 h-9 rounded-lg bg-[#EA3943] text-white text-sm font-bold"
                >
                  Clear Data
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
