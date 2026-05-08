import { motion, AnimatePresence } from 'framer-motion';
import {
  Vote, Shield, Users, Clock, CheckCircle, XCircle, Lock,
  TrendingUp, Plus, ExternalLink, Cpu, AlertTriangle, Info
} from 'lucide-react';
import { useGovernanceStore, useWalletStore, useUIStore } from '../stores';
import { useState } from 'react';

const STATUS_STYLES = {
  active:   { badge: 'badge-live', label: 'Active',   color: '#16C784' },
  passed:   { badge: 'badge-pending', label: 'Passed', color: '#3B82F6' },
  rejected: { badge: 'badge-closed', label: 'Rejected', color: '#EA3943' },
  pending:  { badge: 'badge-pending', label: 'Pending', color: '#F7A600' },
};

function VoteModal({ proposal, onClose }) {
  const castVote = useGovernanceStore((s) => s.castVote);
  const userVotingPower = useGovernanceStore((s) => s.userVotingPower);
  const addNotification = useUIStore((s) => s.addNotification);
  const [side, setSide] = useState('for');
  const [powerPercent, setPowerPercent] = useState(100);
  const [encrypting, setEncrypting] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const powerUsed = Math.floor((userVotingPower * powerPercent) / 100);

  const handleVote = async () => {
    setEncrypting(true);
    for (let i = 1; i <= 4; i++) {
      await new Promise((r) => setTimeout(r, 500));
      setStep(i);
    }
    castVote(proposal.id, side, powerUsed);
    setDone(true);
    setTimeout(() => {
      onClose();
      addNotification({
        id: `v${Date.now()}`,
        type: 'success',
        title: '🗳️ Vote Cast',
        message: `Voted ${side.toUpperCase()} on "${proposal.title.slice(0, 40)}..." with ${powerUsed.toLocaleString()} VP`,
        timestamp: Date.now(),
      });
    }, 1200);
  };

  const steps = ['Prepare', 'Encrypt Ballot', 'MXE Submit', 'Tally', 'Confirmed'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative glass-panel rounded-2xl p-6 max-w-md w-full border border-[rgba(0,240,255,0.15)]"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[rgba(0,240,255,0.1)] flex items-center justify-center">
            <Vote className="w-5 h-5 text-[#00F0FF]" />
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-white">Cast Encrypted Vote</h3>
            <p className="text-xs text-[#B1B5C3]">Powered by Arcium confidential compute</p>
          </div>
        </div>

        <p className="text-sm text-[#B1B5C3] mb-5 line-clamp-2">{proposal.title}</p>

        {/* Side */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {['for', 'against'].map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              disabled={encrypting}
              className={`py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${
                side === s
                  ? s === 'for'
                    ? 'bg-[rgba(22,199,132,0.15)] border-2 border-[#16C784] text-[#16C784]'
                    : 'bg-[rgba(234,57,67,0.15)] border-2 border-[#EA3943] text-[#EA3943]'
                  : 'bg-[#12161C] border border-[rgba(255,255,255,0.08)] text-[#B1B5C3] hover:bg-[#1A1F29]'
              }`}
            >
              {s === 'for' ? '✓ Vote For' : '✗ Vote Against'}
            </button>
          ))}
        </div>

        {/* Voting power */}
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <label className="text-xs text-[#B1B5C3]">Voting Power to Use</label>
            <span className="text-xs font-bold text-[#F7A600]">{powerUsed.toLocaleString()} VP ({powerPercent}%)</span>
          </div>
          <input
            type="range" min="1" max="100" value={powerPercent}
            onChange={(e) => setPowerPercent(parseInt(e.target.value))}
            disabled={encrypting}
            className="w-full"
          />
          <p className="text-[10px] text-[#B1B5C3] mt-1">Total Available: {userVotingPower.toLocaleString()} VP</p>
        </div>

        {/* Arcium steps */}
        {encrypting && (
          <div className="p-3 rounded-xl bg-[rgba(0,240,255,0.04)] border border-[rgba(0,240,255,0.12)] mb-4">
            <p className="text-xs font-semibold text-[#00F0FF] flex items-center gap-2 mb-2">
              <Cpu style={{ width: 13, height: 13 }} />
              {done ? 'Vote confirmed on-chain!' : 'Encrypting ballot via Arcium MXE...'}
            </p>
            <div className="flex items-center gap-1 flex-wrap">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    i < step ? 'bg-[rgba(0,240,255,0.2)] text-[#00F0FF]' :
                    i === step - 1 ? 'bg-[rgba(247,166,0,0.2)] text-[#F7A600]' :
                    'bg-[#1A1F29] text-[#B1B5C3]'
                  }`}>{s}</span>
                  {i < 4 && <div className={`w-2 h-0.5 ${i < step - 1 ? 'bg-[#00F0FF]' : 'bg-[#232A36]'}`} />}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 rounded-xl bg-[rgba(0,240,255,0.03)] border border-[rgba(0,240,255,0.08)] mb-4">
          <p className="text-[10px] text-[#B1B5C3] flex items-center gap-1.5">
            <Lock style={{ width: 10, height: 10 }} className="text-[#00F0FF]" />
            Your vote identity is hidden using Arcium FHE. Results are only revealed after voting closes.
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} disabled={encrypting} className="flex-1 h-11 rounded-xl border border-[rgba(255,255,255,0.12)] text-white font-semibold text-sm hover:bg-[#232A36] transition-colors disabled:opacity-40">
            Cancel
          </button>
          <button
            onClick={handleVote}
            disabled={encrypting}
            className="flex-1 h-11 rounded-xl bg-[#F7A600] hover:bg-[#FFB82E] text-[#0B0E11] font-bold text-sm transition-all disabled:opacity-60"
          >
            {encrypting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#0B0E11]/30 border-t-[#0B0E11] rounded-full animate-spin" />
                Encrypting...
              </span>
            ) : 'Cast Vote'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProposalCard({ proposal, index }) {
  const userVotes = useGovernanceStore((s) => s.userVotes);
  const connected = useWalletStore((s) => s.connected);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const hasVoted = !!userVotes[proposal.id];
  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPct = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const quorumPct = Math.min((totalVotes / proposal.quorum) * 100, 100);
  const status = STATUS_STYLES[proposal.status] || STATUS_STYLES.active;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06 }}
        className="glass-card p-5"
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`${status.badge} text-[10px] px-2 py-0.5 rounded-md uppercase font-bold`}>
                {status.label}
              </span>
              <span className="text-[10px] text-[#B1B5C3] bg-[#1A1F29] px-2 py-0.5 rounded-md">
                {proposal.category}
              </span>
              {hasVoted && (
                <span className="flex items-center gap-1 text-[10px] text-[#00F0FF] bg-[rgba(0,240,255,0.06)] border border-[rgba(0,240,255,0.12)] px-2 py-0.5 rounded-md">
                  <CheckCircle style={{ width: 9, height: 9 }} /> Voted
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-white leading-snug">{proposal.title}</h3>
            <p className="text-xs text-[#B1B5C3] mt-1.5 line-clamp-2">{proposal.description}</p>
          </div>
        </div>

        {/* Vote bars */}
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-[#16C784] font-medium">For</span>
              <span className="text-xs text-white num-display">{(proposal.votesFor / 1000).toFixed(0)}K VP ({forPct.toFixed(1)}%)</span>
            </div>
            <div className="h-2 rounded-full bg-[#12161C] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${forPct}%` }}
                transition={{ duration: 0.8, delay: index * 0.06 + 0.3 }}
                className="h-full bg-[#16C784] rounded-full"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-[#EA3943] font-medium">Against</span>
              <span className="text-xs text-white num-display">{((100 - forPct)).toFixed(1)}% ({((proposal.votesAgainst) / 1000).toFixed(0)}K VP)</span>
            </div>
            <div className="h-2 rounded-full bg-[#12161C] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${100 - forPct}%` }}
                transition={{ duration: 0.8, delay: index * 0.06 + 0.4 }}
                className="h-full bg-[#EA3943] rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Quorum */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-[#B1B5C3]">Quorum Progress</span>
            <span className="text-[10px] font-semibold text-white">{quorumPct.toFixed(1)}% of {(proposal.quorum / 1000000).toFixed(1)}M</span>
          </div>
          <div className="h-1 rounded-full bg-[#12161C] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${quorumPct}%` }}
              transition={{ duration: 1.0, delay: index * 0.06 + 0.5 }}
              className={`h-full rounded-full ${quorumPct >= 100 ? 'bg-[#16C784]' : 'bg-[#F7A600]'}`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[#B1B5C3]">
            <span className="flex items-center gap-1"><Clock style={{ width: 11, height: 11 }} /> {proposal.endDate}</span>
            <span className="flex items-center gap-1"><Users style={{ width: 11, height: 11 }} /> {(totalVotes / 1000).toFixed(0)}K VP</span>
          </div>
          <div className="flex items-center gap-2">
            <a href={proposal.discussion} target="_blank" rel="noreferrer"
              className="text-xs text-[#B1B5C3] hover:text-[#00F0FF] flex items-center gap-1 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink style={{ width: 11, height: 11 }} /> Discuss
            </a>
            {proposal.status === 'active' && !hasVoted && connected && (
              <button
                onClick={() => setShowVoteModal(true)}
                className="h-8 px-4 rounded-lg bg-[#F7A600] hover:bg-[#FFB82E] text-[#0B0E11] font-bold text-xs transition-all"
              >
                Vote
              </button>
            )}
            {proposal.status === 'active' && !connected && (
              <button className="h-8 px-4 rounded-lg border border-[rgba(247,166,0,0.3)] text-[#F7A600] font-bold text-xs">
                Connect to Vote
              </button>
            )}
            {hasVoted && (
              <span className="h-8 px-3 rounded-lg bg-[rgba(0,240,255,0.06)] text-[#00F0FF] font-semibold text-xs flex items-center gap-1">
                <Lock style={{ width: 10, height: 10 }} />
                {userVotes[proposal.id].side === 'for' ? 'Voted For' : 'Voted Against'}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showVoteModal && <VoteModal proposal={proposal} onClose={() => setShowVoteModal(false)} />}
      </AnimatePresence>
    </>
  );
}

function NewProposalModal({ onClose }) {
  const addProposal = useGovernanceStore((s) => s.addProposal);
  const addNotification = useUIStore((s) => s.addNotification);
  const [form, setForm] = useState({ title: '', description: '', category: 'Protocol', quorum: '1000000' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.title || !form.description) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    addProposal({
      id: `g${Date.now()}`,
      ...form,
      quorum: parseInt(form.quorum),
      votesFor: 0,
      votesAgainst: 0,
      status: 'active',
      proposer: 'You',
      createdAt: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      discussion: '#',
    });
    setSubmitting(false);
    onClose();
    addNotification({ id: `p${Date.now()}`, type: 'success', title: 'Proposal Created', message: 'Your governance proposal is now live for voting', timestamp: Date.now() });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="relative glass-panel rounded-2xl p-6 max-w-lg w-full border border-[rgba(247,166,0,0.2)]">
        <h3 className="text-lg font-display font-bold text-white mb-5 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#F7A600]" /> New Governance Proposal
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#B1B5C3] mb-1.5 block">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Short, clear proposal title..."
              className="w-full h-10 px-3 rounded-lg bg-[#12161C] border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-[#F7A600] transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-[#B1B5C3] mb-1.5 block">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Detailed description of the proposal, rationale, and expected impact..."
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-[#12161C] border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-[#F7A600] transition-colors resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#B1B5C3] mb-1.5 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg bg-[#12161C] border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-[#F7A600]"
              >
                {['Protocol', 'Fee Structure', 'Privacy', 'Market Quality', 'Settlement', 'Accessibility', 'Treasury'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#B1B5C3] mb-1.5 block">Quorum (VP)</label>
              <input
                type="number"
                value={form.quorum}
                onChange={(e) => setForm((f) => ({ ...f, quorum: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg bg-[#12161C] border border-[rgba(255,255,255,0.08)] text-white text-sm focus:outline-none focus:border-[#F7A600]"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-[rgba(255,255,255,0.12)] text-white font-semibold text-sm hover:bg-[#232A36] transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.title || !form.description || submitting}
            className="flex-1 h-11 rounded-xl bg-[#F7A600] hover:bg-[#FFB82E] text-[#0B0E11] font-bold text-sm transition-all disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Proposal'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GovernancePage() {
  const proposals = useGovernanceStore((s) => s.proposals);
  const userVotingPower = useGovernanceStore((s) => s.userVotingPower);
  const userVotes = useGovernanceStore((s) => s.userVotes);
  const connected = useWalletStore((s) => s.connected);
  const [filter, setFilter] = useState('all');
  const [showNewProposal, setShowNewProposal] = useState(false);

  const filtered = proposals.filter((p) => filter === 'all' || p.status === filter);
  const activeCount = proposals.filter((p) => p.status === 'active').length;
  const votedCount = Object.keys(userVotes).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">DAO Governance</h1>
          <p className="text-sm text-[#B1B5C3] mt-0.5">
            Shape the future of CipherMarket · Votes encrypted via Arcium MXE
          </p>
        </div>
        {connected && (
          <button
            onClick={() => setShowNewProposal(true)}
            className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#F7A600] hover:bg-[#FFB82E] text-[#0B0E11] font-bold text-sm transition-all flex-shrink-0"
          >
            <Plus style={{ width: 14, height: 14 }} /> Propose
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Your Voting Power', value: userVotingPower.toLocaleString() + ' VP', color: '#F7A600', icon: Vote },
          { label: 'Active Proposals', value: activeCount, color: '#16C784', icon: TrendingUp },
          { label: 'Votes Cast', value: votedCount, color: '#00F0FF', icon: CheckCircle },
          { label: 'Privacy Level', value: '100% Encrypted', color: '#BD00FF', icon: Lock },
        ].map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <div className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center" style={{ background: `${s.color}15` }}>
              <s.icon style={{ width: 15, height: 15, color: s.color }} />
            </div>
            <p className="text-lg font-bold text-white num-display">{s.value}</p>
            <p className="text-xs text-[#B1B5C3]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Privacy info banner */}
      <div className="p-4 rounded-xl bg-[rgba(0,240,255,0.04)] border border-[rgba(0,240,255,0.12)] flex items-start gap-3">
        <Shield className="w-5 h-5 text-[#00F0FF] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[#00F0FF]">Confidential Governance</p>
          <p className="text-xs text-[#B1B5C3] mt-0.5">
            All votes are encrypted using Arcium's Multi-Party Execution Environments. Vote tallies are only revealed after the voting period ends, preventing bandwagon effects and voter coercion.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'All Proposals' },
          { key: 'active', label: 'Active' },
          { key: 'passed', label: 'Passed' },
          { key: 'rejected', label: 'Rejected' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-shrink-0 h-8 px-4 rounded-lg text-xs font-medium transition-all ${
              filter === f.key
                ? 'bg-[rgba(247,166,0,0.15)] border border-[rgba(247,166,0,0.3)] text-[#F7A600]'
                : 'bg-[#1A1F29] border border-[rgba(255,255,255,0.08)] text-[#B1B5C3] hover:text-white'
            }`}
          >
            {f.label}
            {f.key === 'active' && activeCount > 0 && (
              <span className="ml-1.5 bg-[#16C784] text-[#0B0E11] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Proposals */}
      {filtered.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Vote className="w-10 h-10 text-[#B1B5C3] mx-auto mb-3" />
          <p className="text-sm font-medium text-white">No proposals found</p>
          <p className="text-xs text-[#B1B5C3] mt-1">Be the first to submit a governance proposal</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((proposal, i) => (
            <ProposalCard key={proposal.id} proposal={proposal} index={i} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showNewProposal && <NewProposalModal onClose={() => setShowNewProposal(false)} />}
      </AnimatePresence>
    </div>
  );
}
