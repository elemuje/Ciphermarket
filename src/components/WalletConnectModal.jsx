import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Zap, Shield, ExternalLink, CheckCircle } from 'lucide-react';
import { useWalletStore, useUIStore } from '../stores';
import { useState } from 'react';

const WALLETS = [
  {
    id: 'phantom',
    name: 'Phantom',
    description: 'Most popular Solana wallet',
    color: '#AB9FF2',
    installUrl: 'https://phantom.app',
    detectKey: 'solana',
    logo: (
      <svg viewBox="0 0 128 128" className="w-7 h-7" fill="none">
        <rect width="128" height="128" rx="24" fill="#AB9FF2"/>
        <path d="M110.584 64.9142H99.142C99.142 41.8248 80.5179 23.2 57.4286 23.2C34.6252 23.2 16.1677 41.3699 15.7227 64.0082C15.2655 87.0993 34.1943 106.8 57.2967 106.8H64.4694C85.085 106.8 107.34 90.0308 111.852 69.8161C112.23 68.1449 111.038 64.9142 110.584 64.9142Z" fill="white"/>
        <ellipse cx="79.5" cy="60" rx="6.5" ry="6.5" fill="#AB9FF2"/>
        <ellipse cx="95.5" cy="60" rx="6.5" ry="6.5" fill="#AB9FF2"/>
      </svg>
    ),
  },
  {
    id: 'solflare',
    name: 'Solflare',
    description: 'Advanced Solana features & staking',
    color: '#FC5125',
    installUrl: 'https://solflare.com',
    detectKey: 'solflare',
    logo: (
      <svg viewBox="0 0 32 32" className="w-7 h-7">
        <circle cx="16" cy="16" r="16" fill="#FC5125"/>
        <path d="M16 5L27 16L16 22L5 16L16 5Z" fill="white" opacity="0.9"/>
        <path d="M16 22L27 16L16 27L5 16L16 22Z" fill="white" opacity="0.6"/>
      </svg>
    ),
  },
  {
    id: 'backpack',
    name: 'Backpack',
    description: 'xNFT-powered multi-chain wallet',
    color: '#E33E3F',
    installUrl: 'https://backpack.app',
    detectKey: 'backpack',
    logo: (
      <svg viewBox="0 0 32 32" className="w-7 h-7">
        <rect width="32" height="32" rx="8" fill="#E33E3F"/>
        <rect x="10" y="7" width="12" height="3" rx="1.5" fill="white"/>
        <rect x="7" y="10" width="18" height="15" rx="3" fill="white"/>
        <circle cx="16" cy="18" r="3" fill="#E33E3F"/>
      </svg>
    ),
  },
];

function detectWallet(key) {
  if (key === 'solana') return typeof window !== 'undefined' && window?.solana?.isPhantom;
  if (key === 'solflare') return typeof window !== 'undefined' && window?.solflare?.isSolflare;
  if (key === 'backpack') return typeof window !== 'undefined' && (window?.backpack || window?.xnft);
  return false;
}

async function connectPhantom() {
  const provider = window.solana;
  if (!provider?.isPhantom) return null;
  const response = await provider.connect();
  return response.publicKey.toString();
}

async function connectSolflare() {
  const provider = window.solflare;
  if (!provider?.isSolflare) return null;
  await provider.connect();
  return provider.publicKey?.toString() || null;
}

async function connectBackpack() {
  const provider = window.backpack || window.xnft?.solana;
  if (!provider) return null;
  await provider.connect();
  return provider.publicKey?.toString() || null;
}

export default function WalletConnectModal({ open, onClose }) {
  const connect = useWalletStore((s) => s.connect);
  const setConnecting = useWalletStore((s) => s.setConnecting);
  const addNotification = useUIStore((s) => s.addNotification);
  const [connectingWallet, setConnectingWallet] = useState(null);
  const [error, setError] = useState(null);

  const handleConnect = async (wallet) => {
    setError(null);
    setConnectingWallet(wallet.id);
    setConnecting(true);

    try {
      let publicKey = null;

      if (wallet.id === 'phantom') {
        if (!detectWallet('solana')) {
          window.open(wallet.installUrl, '_blank');
          setConnectingWallet(null);
          setConnecting(false);
          return;
        }
        publicKey = await connectPhantom();
      } else if (wallet.id === 'solflare') {
        if (!detectWallet('solflare')) {
          window.open(wallet.installUrl, '_blank');
          setConnectingWallet(null);
          setConnecting(false);
          return;
        }
        publicKey = await connectSolflare();
      } else if (wallet.id === 'backpack') {
        if (!detectWallet('backpack')) {
          window.open(wallet.installUrl, '_blank');
          setConnectingWallet(null);
          setConnecting(false);
          return;
        }
        publicKey = await connectBackpack();
      }

      if (!publicKey) throw new Error('Connection rejected or failed');

      connect(wallet.id, publicKey);
      onClose();

      addNotification({
        id: `conn-${Date.now()}`,
        type: 'success',
        title: 'Wallet Connected',
        message: `Connected to ${wallet.name}: ${publicKey.slice(0, 8)}...${publicKey.slice(-4)}`,
        timestamp: Date.now(),
      });
    } catch (err) {
      const msg = err.message || 'Connection failed';
      setError(msg);
      addNotification({
        id: `err-${Date.now()}`,
        type: 'error',
        title: 'Connection Failed',
        message: msg,
        timestamp: Date.now(),
      });
    } finally {
      setConnectingWallet(null);
      setConnecting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md glass-panel rounded-2xl p-6 shadow-2xl border border-[rgba(247,166,0,0.15)]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#232A36] flex items-center justify-center hover:bg-[#2d3645] transition-colors"
            >
              <X className="w-4 h-4 text-[#B1B5C3]" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F7A600] to-[#BD00FF] flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-white">Connect Wallet</h2>
                <p className="text-sm text-[#B1B5C3]">Solana wallets supported</p>
              </div>
            </div>

            <div className="flex gap-3 mb-5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(0,240,255,0.08)] border border-[rgba(0,240,255,0.15)]">
                <Shield className="w-3 h-3 text-[#00F0FF]" />
                <span className="text-xs text-[#00F0FF]">Non-custodial</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(22,199,132,0.08)] border border-[rgba(22,199,132,0.15)]">
                <Zap className="w-3 h-3 text-[#16C784]" />
                <span className="text-xs text-[#16C784]">Instant connect</span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-[rgba(234,57,67,0.1)] border border-[rgba(234,57,67,0.2)]">
                <p className="text-xs text-[#EA3943]">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              {WALLETS.map((wallet) => {
                const isInstalled = detectWallet(wallet.detectKey);
                const isConnecting = connectingWallet === wallet.id;

                return (
                  <button
                    key={wallet.id}
                    onClick={() => handleConnect(wallet)}
                    disabled={!!connectingWallet}
                    className={`
                      w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200
                      ${isConnecting
                        ? 'bg-[#232A36] border-[rgba(247,166,0,0.4)] ring-1 ring-[#F7A600]/30'
                        : 'bg-[#1A1F29] border-[rgba(255,255,255,0.08)] hover:bg-[#232A36] hover:border-[rgba(255,255,255,0.15)]'
                      }
                      disabled:opacity-60
                    `}
                  >
                    <div className="w-11 h-11 rounded-lg bg-[#232A36] flex items-center justify-center flex-shrink-0">
                      {wallet.logo}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-white">{wallet.name}</p>
                      <p className="text-xs text-[#B1B5C3]">{wallet.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isConnecting && (
                        <div className="w-4 h-4 border-2 border-[#F7A600] border-t-transparent rounded-full animate-spin" />
                      )}
                      {!isConnecting && isInstalled && (
                        <span className="flex items-center gap-1 text-[10px] text-[#16C784] font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          Installed
                        </span>
                      )}
                      {!isConnecting && !isInstalled && (
                        <span className="flex items-center gap-1 text-[10px] text-[#B1B5C3] bg-[#232A36] px-2 py-1 rounded-md">
                          <ExternalLink className="w-3 h-3" />
                          Install
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mt-5 text-center text-xs text-[#B1B5C3]">
              By connecting, you agree to the{' '}
              <span className="text-[#00F0FF] cursor-pointer hover:underline">Terms of Service</span>
              {' '}and{' '}
              <span className="text-[#00F0FF] cursor-pointer hover:underline">Privacy Policy</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
