# CipherMarket 🔐

> Privacy-first prediction markets powered by Arcium confidential computation on Solana

## Features

- 🔐 **Arcium MXE Encryption** — All positions encrypted using Fully Homomorphic Encryption
- 📊 **Live Prediction Markets** — Browse, filter, and trade on 1800+ active markets
- 💼 **Portfolio Tracking** — Full PnL tracking with asset allocation charts
- 🗳️ **DAO Governance** — World-class encrypted voting with confidential ballots
- 🎁 **XP & Rewards** — Gamified trading with achievements and leaderboard
- ➕ **Create Markets** — 3-step wizard to launch your own prediction market
- 🛡️ **Privacy Center** — Granular privacy controls powered by Arcium
- ⚙️ **Settings** — Notifications, slippage, gas, language settings

## Wallet Support

- ✅ **Phantom** — Most popular Solana wallet
- ✅ **Solflare** — Advanced Solana features & staking
- ✅ **Backpack** — xNFT-powered multi-chain wallet

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

### GitHub Pages
```bash
npm run build
# Deploy dist/ folder
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 7 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion |
| State | Zustand |
| Charts | Recharts |
| Routing | React Router v7 |
| Icons | Lucide React |
| Privacy | Arcium MXE (FHE + MPC) |
| Blockchain | Solana |

## Architecture

```
src/
├── pages/           # All route pages
│   ├── LandingPage.jsx
│   ├── DashboardPage.jsx
│   ├── MarketDetailPage.jsx
│   ├── PortfolioPage.jsx
│   ├── GovernancePage.jsx
│   ├── RewardsPage.jsx
│   ├── CreateMarketPage.jsx
│   ├── PrivacyCenterPage.jsx
│   └── SettingsPage.jsx
├── components/
│   ├── layout/      # DashboardLayout, Sidebar, TopBar, BottomNav
│   ├── WalletConnectModal.jsx
│   └── NotificationToast.jsx
├── stores/
│   └── index.js     # Zustand stores (wallet, market, governance, etc.)
├── lib/
│   └── utils.js     # Utility functions
├── App.jsx          # Router setup
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Privacy Model

CipherMarket uses Arcium's Multi-Party Execution Environments:

1. **Input** — User submits position
2. **FHE Encrypt** — Data encrypted client-side before transmission
3. **MXE Compute** — Computation runs on encrypted data across distributed nodes
4. **Aggregate** — Results aggregated without revealing individual inputs
5. **Threshold Reveal** — Final result revealed only after market closes via threshold decryption

---

Built with ❤️ on Solana · Powered by Arcium Confidential Computation
