import { create } from 'zustand';

// ========== Wallet Store ==========
export const useWalletStore = create((set) => ({
  connected: false,
  walletType: null,
  publicKey: null,
  balance: 0,
  connecting: false,
  connect: (walletType, publicKey) =>
    set({
      connected: true,
      walletType,
      publicKey: publicKey || `${walletType.slice(0,4)}...${Math.random().toString(36).slice(-4)}`,
      balance: 142.58 + Math.random() * 50,
      connecting: false,
    }),
  disconnect: () =>
    set({ connected: false, walletType: null, publicKey: null, balance: 0, connecting: false }),
  setConnecting: (val) => set({ connecting: val }),
  setBalance: (val) => set({ balance: val }),
}));

// ========== UI Store ==========
export const useUIStore = create((set) => ({
  sidebarOpen: false,
  activeRoute: '/',
  searchQuery: '',
  notifications: [],
  modalOpen: null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setRoute: (route) => set({ activeRoute: route }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  addNotification: (n) =>
    set((s) => ({ notifications: [n, ...s.notifications].slice(0, 50) })),
  removeNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
  openModal: (id) => set({ modalOpen: id }),
  closeModal: () => set({ modalOpen: null }),
}));

// ========== Market Store ==========
const DEMO_MARKETS = [
  {
    id: '1',
    title: 'Will Bitcoin exceed $150K by end of 2026?',
    category: 'Crypto',
    probability: 62,
    volume: 2847500,
    liquidity: 892000,
    endDate: '2026-12-31',
    status: 'live',
    resolutionSource: 'CoinGecko',
    description: 'Market resolves YES if the price of Bitcoin (BTC) exceeds $150,000 USD on any major exchange before December 31, 2026 23:59 UTC.',
    yesPrice: 0.62,
    noPrice: 0.38,
    participants: 1247,
    confidence: 78,
    tags: ['Bitcoin', 'Price', '2026'],
    creator: '8xDtV...3kLp9',
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    title: 'Will Ethereum ETF be approved in Q3 2026?',
    category: 'Finance',
    probability: 45,
    volume: 1923000,
    liquidity: 654000,
    endDate: '2026-09-30',
    status: 'live',
    resolutionSource: 'SEC.gov',
    description: 'Market resolves YES if the US Securities and Exchange Commission approves a spot Ethereum ETF by September 30, 2026.',
    yesPrice: 0.45,
    noPrice: 0.55,
    participants: 892,
    confidence: 64,
    tags: ['Ethereum', 'ETF', 'SEC'],
    creator: '3xAb2...9mKp7',
    createdAt: '2026-02-01',
  },
  {
    id: '3',
    title: 'Will the Fed cut rates at the July 2026 meeting?',
    category: 'Finance',
    probability: 71,
    volume: 4567800,
    liquidity: 1234000,
    endDate: '2026-07-29',
    status: 'live',
    resolutionSource: 'FederalReserve.gov',
    description: 'Market resolves YES if the Federal Open Market Committee announces a rate cut at the July 2026 meeting.',
    yesPrice: 0.71,
    noPrice: 0.29,
    participants: 2156,
    confidence: 82,
    tags: ['Fed', 'Rates', 'Macro'],
    creator: '7yQw4...2nLv8',
    createdAt: '2026-01-20',
  },
  {
    id: '4',
    title: 'Will AI achieve AGI by 2030?',
    category: 'AI',
    probability: 28,
    volume: 8912000,
    liquidity: 2345000,
    endDate: '2030-12-31',
    status: 'live',
    resolutionSource: 'Expert Consensus Panel',
    description: 'Market resolves YES if artificial general intelligence (AGI) is achieved and publicly demonstrated by December 31, 2030.',
    yesPrice: 0.28,
    noPrice: 0.72,
    participants: 5634,
    confidence: 45,
    tags: ['AI', 'AGI', 'Technology'],
    creator: '5kMn3...1pRs6',
    createdAt: '2026-01-05',
  },
  {
    id: '5',
    title: 'Will the 2026 World Cup final have >150M viewers?',
    category: 'Sports',
    probability: 83,
    volume: 678900,
    liquidity: 198000,
    endDate: '2026-07-19',
    status: 'live',
    resolutionSource: 'FIFA / Nielsen',
    description: 'Market resolves YES if the final match of the 2026 FIFA World Cup has more than 150 million global viewers.',
    yesPrice: 0.83,
    noPrice: 0.17,
    participants: 445,
    confidence: 71,
    tags: ['World Cup', 'Soccer', 'Viewership'],
    creator: '2wEr9...7tYu4',
    createdAt: '2026-03-10',
  },
  {
    id: '6',
    title: 'Will Solana reach 100K TPS sustained by end of 2026?',
    category: 'Crypto',
    probability: 55,
    volume: 1567000,
    liquidity: 567000,
    endDate: '2026-12-31',
    status: 'live',
    resolutionSource: 'Solana Explorer',
    description: 'Market resolves YES if Solana mainnet-beta achieves and sustains 100,000 transactions per second for a 24-hour period.',
    yesPrice: 0.55,
    noPrice: 0.45,
    participants: 987,
    confidence: 61,
    tags: ['Solana', 'TPS', 'Performance'],
    creator: '9hJk8...3mNp5',
    createdAt: '2026-02-14',
  },
  {
    id: '7',
    title: 'Will there be a US-China trade agreement in 2026?',
    category: 'Politics',
    probability: 34,
    volume: 2345600,
    liquidity: 789000,
    endDate: '2026-12-31',
    status: 'live',
    resolutionSource: 'White House / Xinhua',
    description: 'Market resolves YES if the United States and China sign a formal trade agreement during calendar year 2026.',
    yesPrice: 0.34,
    noPrice: 0.66,
    participants: 1567,
    confidence: 52,
    tags: ['US', 'China', 'Trade'],
    creator: '1aZx6...5cVb2',
    createdAt: '2026-01-30',
  },
  {
    id: '8',
    title: 'Will Arcium confidential compute go mainnet in 2026?',
    category: 'Crypto',
    probability: 76,
    volume: 987000,
    liquidity: 345000,
    endDate: '2026-12-31',
    status: 'live',
    resolutionSource: 'Arcium Blog',
    description: 'Market resolves YES if Arcium launches its confidential computation network on mainnet during calendar year 2026.',
    yesPrice: 0.76,
    noPrice: 0.24,
    participants: 623,
    confidence: 79,
    tags: ['Arcium', 'Privacy', 'Mainnet'],
    creator: '4dFg7...8hIj3',
    createdAt: '2026-02-20',
  },
];

const DEMO_POSITIONS = [
  {
    id: 'p1',
    marketId: '1',
    marketTitle: 'Will Bitcoin exceed $150K by end of 2026?',
    side: 'yes',
    amount: 500,
    confidence: 85,
    timestamp: Date.now() - 86400000 * 3,
    status: 'active',
    pnl: 45.2,
    entryPrice: 0.58,
    currentPrice: 0.62,
  },
  {
    id: 'p2',
    marketId: '3',
    marketTitle: 'Will the Fed cut rates at the July 2026 meeting?',
    side: 'yes',
    amount: 1200,
    confidence: 72,
    timestamp: Date.now() - 86400000 * 7,
    status: 'active',
    pnl: -89.4,
    entryPrice: 0.74,
    currentPrice: 0.71,
  },
  {
    id: 'p3',
    marketId: '4',
    marketTitle: 'Will AI achieve AGI by 2030?',
    side: 'no',
    amount: 300,
    confidence: 90,
    timestamp: Date.now() - 86400000 * 14,
    status: 'active',
    pnl: 28.7,
    entryPrice: 0.69,
    currentPrice: 0.72,
  },
];

export const useMarketStore = create((set, get) => ({
  markets: DEMO_MARKETS,
  activeMarket: null,
  positions: DEMO_POSITIONS,
  filters: { category: null, status: null, sortBy: 'volume' },
  loading: false,
  setActiveMarket: (m) => set({ activeMarket: m }),
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  addMarket: (market) =>
    set((s) => ({ markets: [market, ...s.markets] })),
  placePosition: (p) =>
    set((s) => ({
      positions: [
        { ...p, id: `p${Date.now()}`, timestamp: Date.now(), status: 'active' },
        ...s.positions,
      ],
    })),
  getFilteredMarkets: () => {
    const { markets, filters } = get();
    let result = [...markets];
    if (filters.category) result = result.filter((m) => m.category === filters.category);
    if (filters.status) result = result.filter((m) => m.status === filters.status);
    switch (filters.sortBy) {
      case 'volume': result.sort((a, b) => b.volume - a.volume); break;
      case 'probability': result.sort((a, b) => b.probability - a.probability); break;
      case 'participants': result.sort((a, b) => b.participants - a.participants); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
    }
    return result;
  },
}));

// ========== Privacy Store ==========
export const usePrivacyStore = create((set) => ({
  privacyMode: true,
  encryptionStatus: 'idle',
  sealedRoundActive: false,
  revealPhase: false,
  enablePrivacyMode: () => set({ privacyMode: true }),
  disablePrivacyMode: () => set({ privacyMode: false }),
  setEncryptionStatus: (s) => set({ encryptionStatus: s }),
}));

// ========== Governance Store ==========
const DEMO_PROPOSALS = [
  {
    id: 'g1',
    title: 'Increase Market Creation Fee to 5 SOL',
    description: 'Proposal to increase the minimum fee for creating new markets from 1 SOL to 5 SOL to reduce spam markets and improve overall quality. The extra revenue will fund oracle providers and dispute resolvers.',
    status: 'active',
    votesFor: 1247000,
    votesAgainst: 432000,
    quorum: 2000000,
    endDate: '2026-06-15',
    category: 'Fee Structure',
    proposer: '8xDtV...3kLp9',
    createdAt: '2026-05-01',
    discussion: 'https://forum.ciphermarket.io/proposal/1',
  },
  {
    id: 'g2',
    title: 'Enable Confidential Voting for All Proposals',
    description: 'Use Arcium confidential computation to encrypt governance votes, ensuring voter privacy and preventing vote manipulation based on live tally visibility.',
    status: 'active',
    votesFor: 2103000,
    votesAgainst: 89000,
    quorum: 2500000,
    endDate: '2026-06-10',
    category: 'Privacy',
    proposer: '3xAb2...9mKp7',
    createdAt: '2026-04-28',
    discussion: 'https://forum.ciphermarket.io/proposal/2',
  },
  {
    id: 'g3',
    title: 'Add AI-Generated Market Verification',
    description: 'Implement automated market description and resolution criteria verification using AI to ensure market clarity and reduce disputes.',
    status: 'active',
    votesFor: 892000,
    votesAgainst: 156000,
    quorum: 1500000,
    endDate: '2026-06-20',
    category: 'Market Quality',
    proposer: '7yQw4...2nLv8',
    createdAt: '2026-05-05',
    discussion: 'https://forum.ciphermarket.io/proposal/3',
  },
  {
    id: 'g4',
    title: 'Extend Market Settlement Period to 48h',
    description: 'Extend the default market settlement period from 24 hours to 48 hours to allow more time for oracle verification and dispute resolution.',
    status: 'passed',
    votesFor: 1567000,
    votesAgainst: 234000,
    quorum: 1500000,
    endDate: '2026-05-01',
    category: 'Settlement',
    proposer: '5kMn3...1pRs6',
    createdAt: '2026-04-01',
    discussion: 'https://forum.ciphermarket.io/proposal/4',
  },
  {
    id: 'g5',
    title: 'Reduce Minimum Stake to 0.1 SOL',
    description: 'Lower the minimum stake requirement from 1 SOL to 0.1 SOL to increase market participation and accessibility for retail users.',
    status: 'rejected',
    votesFor: 567000,
    votesAgainst: 1234000,
    quorum: 1500000,
    endDate: '2026-04-15',
    category: 'Accessibility',
    proposer: '9hJk8...3mNp5',
    createdAt: '2026-03-20',
    discussion: 'https://forum.ciphermarket.io/proposal/5',
  },
];

export const useGovernanceStore = create((set, get) => ({
  proposals: DEMO_PROPOSALS,
  userVotes: {},
  userVotingPower: 12450,
  delegatedTo: null,
  castVote: (proposalId, side, power) =>
    set((s) => ({
      userVotes: { ...s.userVotes, [proposalId]: { side, power, timestamp: Date.now() } },
      proposals: s.proposals.map((p) =>
        p.id === proposalId
          ? {
              ...p,
              votesFor: side === 'for' ? p.votesFor + power : p.votesFor,
              votesAgainst: side === 'against' ? p.votesAgainst + power : p.votesAgainst,
            }
          : p
      ),
    })),
  addProposal: (proposal) =>
    set((s) => ({ proposals: [proposal, ...s.proposals] })),
}));

// ========== Rewards Store ==========
export const useRewardsStore = create((set) => ({
  xp: 12450,
  level: 'Expert',
  nextLevel: 'Master',
  xpToNext: 7550,
  streak: 5,
  achievements: [
    { id: 'a1', name: 'First Prediction', earned: true, xp: 100 },
    { id: 'a2', name: '7-Day Streak', earned: true, xp: 500 },
    { id: 'a3', name: 'Speed Trader', earned: true, xp: 300 },
    { id: 'a4', name: 'Privacy Advocate', earned: true, xp: 400 },
    { id: 'a5', name: 'Perfect Call', earned: false, xp: 1000 },
    { id: 'a6', name: 'Market Maker', earned: false, xp: 800 },
    { id: 'a7', name: 'Top 10', earned: false, xp: 1500 },
    { id: 'a8', name: 'Governance Voter', earned: false, xp: 600 },
  ],
  claimableRewards: [
    { id: 'r1', type: 'accuracy', amount: 2.5, label: 'Accuracy Bonus (Week 18)' },
    { id: 'r2', type: 'streak', amount: 1.0, label: '5-Day Streak Reward' },
    { id: 'r3', type: 'governance', amount: 0.5, label: 'Governance Participation' },
  ],
  claimReward: (id) =>
    set((s) => ({ claimableRewards: s.claimableRewards.filter((r) => r.id !== id) })),
}));

// ========== Settings Store ==========
export const useSettingsStore = create((set) => ({
  notifications: {
    marketSettlement: true,
    priceAlerts: true,
    governance: true,
    rewards: false,
  },
  soundEnabled: true,
  language: 'en',
  slippageTolerance: 0.5,
  gasPreset: 'normal',
  twoFactorEnabled: false,
  setNotification: (key, val) =>
    set((s) => ({ notifications: { ...s.notifications, [key]: val } })),
  setSoundEnabled: (val) => set({ soundEnabled: val }),
  setLanguage: (val) => set({ language: val }),
  setSlippage: (val) => set({ slippageTolerance: val }),
  setGasPreset: (val) => set({ gasPreset: val }),
  setTwoFactor: (val) => set({ twoFactorEnabled: val }),
}));
