import { motion } from 'framer-motion';
import {
  Award, Zap, Star, Trophy, Target, Flame,
  TrendingUp, CheckCircle, Lock, Gift, Users, Crown
} from 'lucide-react';
import { useRewardsStore, useWalletStore, useUIStore } from '../stores';

const LEVEL_COLORS = {
  Novice: '#B1B5C3',
  Apprentice: '#3B82F6',
  Expert: '#F7A600',
  Master: '#BD00FF',
  Legend: '#00F0FF',
};

const LEADERBOARD = [
  { rank: 1, name: '0xOracle', xp: 98400, accuracy: 87, badge: '🏆', streak: 32 },
  { rank: 2, name: 'SolWhale', xp: 87200, accuracy: 84, badge: '🥈', streak: 28 },
  { rank: 3, name: 'CipherMind', xp: 76500, accuracy: 81, badge: '🥉', streak: 21 },
  { rank: 4, name: 'ArciumSeer', xp: 65300, accuracy: 79, badge: '4', streak: 18 },
  { rank: 5, name: 'PrivacyFox', xp: 54100, accuracy: 76, badge: '5', streak: 14 },
  { rank: 6, name: 'You (Demo)', xp: 12450, accuracy: 72, badge: '6', streak: 5, isYou: true },
];

const ACHIEVEMENT_ICONS = {
  'First Prediction': Target,
  '7-Day Streak': Flame,
  'Speed Trader': Zap,
  'Privacy Advocate': Lock,
  'Perfect Call': Trophy,
  'Market Maker': TrendingUp,
  'Top 10': Crown,
  'Governance Voter': Star,
};

function AchievementCard({ achievement, index }) {
  const Icon = ACHIEVEMENT_ICONS[achievement.name] || Award;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl border transition-all ${
        achievement.earned
          ? 'bg-[rgba(247,166,0,0.06)] border-[rgba(247,166,0,0.2)]'
          : 'bg-[#12161C] border-[rgba(255,255,255,0.05)] opacity-50 grayscale'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
        achievement.earned
          ? 'bg-[rgba(247,166,0,0.15)]'
          : 'bg-[#1A1F29]'
      }`}>
        {achievement.earned
          ? <Icon style={{ width: 18, height: 18 }} className="text-[#F7A600]" />
          : <Lock style={{ width: 16, height: 16 }} className="text-[#B1B5C3]" />
        }
      </div>
      <p className={`text-xs font-semibold mb-0.5 ${achievement.earned ? 'text-white' : 'text-[#B1B5C3]'}`}>
        {achievement.name}
      </p>
      <p className="text-[10px] text-[#F7A600] font-bold">+{achievement.xp} XP</p>
    </motion.div>
  );
}

function RewardClaimCard({ reward, onClaim }) {
  const icons = { accuracy: TrendingUp, streak: Flame, governance: Star };
  const Icon = icons[reward.type] || Gift;
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-[rgba(22,199,132,0.05)] border border-[rgba(22,199,132,0.15)]"
    >
      <div className="w-9 h-9 rounded-xl bg-[rgba(22,199,132,0.1)] flex items-center justify-center flex-shrink-0">
        <Icon style={{ width: 16, height: 16 }} className="text-[#16C784]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{reward.label}</p>
        <p className="text-xs text-[#16C784] num-display font-bold">+{reward.amount} SOL</p>
      </div>
      <button
        onClick={() => onClaim(reward.id)}
        className="h-8 px-4 rounded-lg bg-[#16C784] hover:bg-[#14b474] text-white font-bold text-xs transition-all flex-shrink-0"
      >
        Claim
      </button>
    </motion.div>
  );
}

export default function RewardsPage() {
  const { xp, level, nextLevel, xpToNext, streak, achievements, claimableRewards, claimReward } = useRewardsStore();
  const connected = useWalletStore((s) => s.connected);
  const addNotification = useUIStore((s) => s.addNotification);
  const levelColor = LEVEL_COLORS[level] || '#F7A600';
  const xpProgress = (xp / (xp + xpToNext)) * 100;
  const earnedCount = achievements.filter((a) => a.earned).length;

  const handleClaim = (id) => {
    const r = claimableRewards.find((r) => r.id === id);
    if (!r) return;
    claimReward(id);
    addNotification({
      id: `r${Date.now()}`,
      type: 'success',
      title: '🎁 Reward Claimed!',
      message: `+${r.amount} SOL — ${r.label}`,
      timestamp: Date.now(),
    });
  };

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(247,166,0,0.1)] flex items-center justify-center mb-5">
          <Award className="w-8 h-8 text-[#F7A600]" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">Connect to View Rewards</h2>
        <p className="text-[#B1B5C3] max-w-sm">Your XP, achievements, and claimable rewards are tied to your wallet address.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Rewards & XP</h1>
        <p className="text-sm text-[#B1B5C3] mt-0.5">Earn rewards for accurate predictions and participation</p>
      </div>

      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 border"
        style={{ borderColor: `${levelColor}25` }}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${levelColor}15` }}>
                <Trophy style={{ width: 18, height: 18, color: levelColor }} />
              </div>
              <div>
                <p className="text-xs text-[#B1B5C3]">Current Level</p>
                <p className="text-xl font-display font-bold" style={{ color: levelColor }}>{level}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-display font-bold text-white num-display">{xp.toLocaleString()}</p>
            <p className="text-xs text-[#B1B5C3]">Total XP</p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-3">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-[#B1B5C3]">{level}</span>
            <span className="text-xs text-[#B1B5C3]">{nextLevel} ({xpToNext.toLocaleString()} XP to go)</span>
          </div>
          <div className="h-3 rounded-full bg-[#12161C] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${levelColor}, ${levelColor}99)` }}
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2">
            <Flame style={{ width: 14, height: 14 }} className="text-[#EA3943]" />
            <span className="text-sm font-bold text-white">{streak}</span>
            <span className="text-xs text-[#B1B5C3]">Day Streak</span>
          </div>
          <div className="flex items-center gap-2">
            <Star style={{ width: 14, height: 14 }} className="text-[#F7A600]" />
            <span className="text-sm font-bold text-white">{earnedCount}/{achievements.length}</span>
            <span className="text-xs text-[#B1B5C3]">Achievements</span>
          </div>
          <div className="flex items-center gap-2">
            <Gift style={{ width: 14, height: 14 }} className="text-[#16C784]" />
            <span className="text-sm font-bold text-white">{claimableRewards.length}</span>
            <span className="text-xs text-[#B1B5C3]">Pending Rewards</span>
          </div>
        </div>
      </motion.div>

      {/* Claimable Rewards */}
      {claimableRewards.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Gift style={{ width: 15, height: 15 }} className="text-[#16C784]" />
            Claimable Rewards
            <span className="bg-[rgba(22,199,132,0.15)] text-[#16C784] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {claimableRewards.length}
            </span>
          </h3>
          <div className="space-y-3">
            {claimableRewards.map((r) => (
              <RewardClaimCard key={r.id} reward={r} onClaim={handleClaim} />
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Award style={{ width: 15, height: 15 }} className="text-[#F7A600]" />
          Achievements
          <span className="text-xs text-[#B1B5C3]">({earnedCount}/{achievements.length} earned)</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map((a, i) => (
            <AchievementCard key={a.id} achievement={a} index={i} />
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Users style={{ width: 15, height: 15 }} className="text-[#BD00FF]" />
          Global Leaderboard
        </h3>
        <div className="space-y-2">
          {LEADERBOARD.map((entry, i) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                entry.isYou
                  ? 'bg-[rgba(247,166,0,0.06)] border border-[rgba(247,166,0,0.2)]'
                  : 'bg-[#12161C] border border-[rgba(255,255,255,0.05)] hover:bg-[#1A1F29]'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                entry.rank <= 3 ? 'text-lg' : 'bg-[#232A36] text-[#B1B5C3] text-xs'
              }`}>
                {entry.badge}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${entry.isYou ? 'text-[#F7A600]' : 'text-white'}`}>{entry.name}</p>
                <p className="text-[10px] text-[#B1B5C3]">{entry.streak}d streak</p>
              </div>
              <div className="text-center flex-shrink-0">
                <p className="text-xs font-bold text-white num-display">{entry.xp.toLocaleString()}</p>
                <p className="text-[9px] text-[#B1B5C3]">XP</p>
              </div>
              <div className="text-center flex-shrink-0">
                <p className="text-xs font-bold text-[#16C784]">{entry.accuracy}%</p>
                <p className="text-[9px] text-[#B1B5C3]">Accuracy</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How to earn */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-4">How to Earn XP</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { action: 'Correct prediction', xp: '+50–500 XP', icon: CheckCircle, color: '#16C784' },
            { action: 'Daily prediction streak', xp: '+100 XP/day', icon: Flame, color: '#EA3943' },
            { action: 'Create a market', xp: '+200 XP', icon: TrendingUp, color: '#F7A600' },
            { action: 'Governance vote', xp: '+75 XP', icon: Star, color: '#BD00FF' },
            { action: 'Privacy mode trade', xp: '+25 XP bonus', icon: Lock, color: '#00F0FF' },
            { action: 'Referral signup', xp: '+500 XP', icon: Users, color: '#3B82F6' },
          ].map((item) => (
            <div key={item.action} className="flex items-center gap-3 p-3 rounded-xl bg-[#12161C] border border-[rgba(255,255,255,0.05)]">
              <item.icon style={{ width: 14, height: 14, color: item.color }} />
              <span className="text-xs text-white flex-1">{item.action}</span>
              <span className="text-xs font-bold text-[#F7A600]">{item.xp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
