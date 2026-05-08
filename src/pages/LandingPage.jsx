import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Zap, TrendingUp, ArrowRight, Globe, Eye, Check } from 'lucide-react';

const FEATURES = [
  { icon: Lock, title: 'Encrypted Predictions', desc: 'Your positions are hidden using Arcium MXE confidential computation — not even nodes can see your bet.', color: '#00F0FF' },
  { icon: Shield, title: 'Arcium MXE Privacy', desc: 'Multi-Party Execution Environments ensure computation happens on encrypted data end-to-end.', color: '#BD00FF' },
  { icon: Zap, title: 'Solana Speed', desc: 'Sub-second finality with 65,000+ TPS. Trades settle instantly with zero gas surprises.', color: '#F7A600' },
  { icon: Globe, title: 'Open Markets', desc: 'Anyone can create prediction markets. Community-curated, DAO-governed, globally accessible.', color: '#16C784' },
];

const STATS = [
  { label: 'Total Volume', value: '$48.2M' },
  { label: 'Active Markets', value: '1,847' },
  { label: 'Participants', value: '23,400+' },
  { label: 'Avg. Privacy Score', value: '99.8%' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white overflow-x-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-[rgba(0,240,255,0.08)] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-radial from-[rgba(189,0,255,0.06)] to-transparent rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F0FF] to-[#BD00FF] flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg">CipherMarket</span>
          <span className="hidden sm:block text-xs text-[#00F0FF] bg-[rgba(0,240,255,0.08)] border border-[rgba(0,240,255,0.2)] px-2 py-0.5 rounded-full">
            Powered by Arcium
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="hidden sm:block text-sm text-[#B1B5C3] hover:text-white transition-colors"
          >
            Markets
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="h-9 px-4 rounded-lg bg-[#F7A600] hover:bg-[#FFB82E] text-[#0B0E11] font-semibold text-sm transition-all"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-4 pt-20 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(0,240,255,0.06)] border border-[rgba(0,240,255,0.15)] mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
            <span className="text-xs text-[#00F0FF] font-medium">Privacy-first prediction markets on Solana</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-6 max-w-4xl mx-auto">
            Predict the Future,{' '}
            <span className="gradient-text">In Private</span>
          </h1>

          <p className="text-lg text-[#B1B5C3] max-w-2xl mx-auto mb-10 leading-relaxed">
            CipherMarket combines Solana's speed with Arcium's confidential computation.
            Your predictions, stake sizes, and positions are fully encrypted — no one can front-run you.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 h-12 px-8 rounded-xl bg-[#F7A600] hover:bg-[#FFB82E] text-[#0B0E11] font-bold text-base transition-all hover:shadow-xl hover:shadow-[#F7A600]/30"
            >
              Start Predicting
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/create')}
              className="flex items-center gap-2 h-12 px-8 rounded-xl border border-[rgba(255,255,255,0.15)] text-white font-semibold text-base hover:bg-[#1A1F29] transition-all"
            >
              Create a Market
            </button>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-16 px-8 py-5 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)]"
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-display font-bold text-white num-display">{s.value}</p>
              <p className="text-xs text-[#B1B5C3] mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-4 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center text-white mb-12">
            Why CipherMarket?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="glass-card p-6 hover:border-[rgba(255,255,255,0.15)] transition-all"
              >
                <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center" style={{ backgroundColor: `${f.color}15` }}>
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-[#B1B5C3] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-4 md:px-12 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">How It Works</h2>
          <p className="text-[#B1B5C3] mb-12">Your prediction never touches the chain in plaintext</p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            {['Input Prediction', 'FHE Encrypt', 'Arcium MXE', 'Aggregate', 'Reveal Result'].map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgba(0,240,255,0.1)] to-[rgba(189,0,255,0.1)] border border-[rgba(0,240,255,0.2)] flex items-center justify-center">
                    <span className="text-sm font-bold text-[#00F0FF]">{i + 1}</span>
                  </div>
                  <p className="text-xs text-white font-medium mt-2 max-w-[80px] text-center">{step}</p>
                </div>
                {i < 4 && <div className="w-8 h-0.5 bg-gradient-to-r from-[#00F0FF] to-[#BD00FF] hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 pb-24">
        <div className="max-w-2xl mx-auto text-center glass-card p-12 border border-[rgba(247,166,0,0.15)]">
          <Eye className="w-10 h-10 text-[#F7A600] mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold text-white mb-3">Ready to Predict?</h2>
          <p className="text-[#B1B5C3] mb-6">Join 23,000+ traders predicting the future — privately.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {['No front-running', 'Encrypted positions', 'DAO-governed'].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-sm text-[#16C784]">
                <Check className="w-4 h-4" /> {t}
              </span>
            ))}
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-8 flex items-center gap-2 h-12 px-8 rounded-xl bg-[#F7A600] hover:bg-[#FFB82E] text-[#0B0E11] font-bold mx-auto transition-all hover:shadow-xl hover:shadow-[#F7A600]/30"
          >
            Launch App <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <footer className="relative z-10 text-center py-8 border-t border-[rgba(255,255,255,0.05)]">
        <p className="text-xs text-[#B1B5C3]">© 2026 CipherMarket · Built on Solana · Powered by Arcium Confidential Computation</p>
      </footer>
    </div>
  );
}
