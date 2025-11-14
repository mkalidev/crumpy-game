# 2405 Game - Next.js Application

A modern puzzle game inspired by 2048, built with Next.js, featuring Web3 wallet authentication and a MongoDB-based points system. Built with a clean component architecture and dark theme design.

## Features

- 🎮 **2405 Game**: Play the classic sliding tile puzzle game with the goal of reaching 2405
- 🔐 **Wallet Authentication**: Connect your Web3 wallet using Reown AppKit (formerly WalletConnect) - supports MetaMask, WalletConnect, Coinbase, and many more
- 💾 **Dual Points System**: Earn points saved to MongoDB and on-chain rewards via smart contract
- 🏆 **Leaderboard**: Compete with other players in real-time (both on-chain and off-chain)
- 🎨 **Dark Theme UI**: Beautiful, modern dark-themed interface with smooth animations
- ⚡ **Next.js**: Built with Next.js for optimal performance and SSR
- 📦 **Component Architecture**: Clean, modular component structure for easy maintenance
- 🔗 **Smart Contract Integration**: Seamless blockchain integration for game sessions, rewards, and leaderboard
- 🤖 **Auto-Commit**: Automatic git commits with file-based commit messages

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- A Web3 wallet browser extension (MetaMask recommended)
- Git (for auto-commit feature)

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   - Create `.env.local` file in the root directory
   - Add the following variables:
     ```
     MONGO_URI=mongodb://localhost:27017/crumpy-game
     # Or for MongoDB Atlas:
     # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/crumpy-game
     JWT_SECRET=your-secret-jwt-key-change-this-in-production
     NEXT_PUBLIC_PROJECT_ID=your-reown-project-id
     NEXT_PUBLIC_CONTRACT_ADDRESS=0xF566eAa0B8470817aB0A1A0846A8B9E9f3325885
     ```

   **Getting your Reown Project ID:**
   - Visit https://dashboard.reown.com
   - Create a new project or use an existing one
   - Copy your Project ID
   - Add it to `.env.local` as `NEXT_PUBLIC_PROJECT_ID`

   **Contract Address:**
   - Default contract address: `0xF566eAa0B8470817aB0A1A0846A8B9E9f3325885`
   - To use a different contract, set `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

### Auto-Commit Script

The auto-commit script automatically commits changes every 30 seconds with file-based commit messages:

```bash
npm run auto-commit
```

The script will detect changed files and create commit messages in the format:

```
- updated - filename1.js
- updated - filename2.js
```

**Note:** Make sure Git is initialized and configured before using the auto-commit script.

## Project Structure

```
crumpy-game/
├── components/          # React components
│   ├── Game2048.js          # Main game component with contract integration
│   ├── GameHeader.js        # Page header/title
│   ├── GameLayout.js        # Layout for game + leaderboard
│   ├── GameContainer.js     # Main game container
│   ├── AuthHandler.js       # Custom hook for authentication logic
│   ├── WalletAuth.js        # Wallet connection component
│   ├── PointsDisplay.js     # User points, rewards, and wallet info display
│   └── Leaderboard.js       # Top players leaderboard
├── constants/          # Contract and configuration constants
│   ├── contractABI.js  # Smart contract ABI
│   └── index.js        # Exports for constants
├── config/             # Configuration files
│   └── index.js        # Wagmi/Reown AppKit configuration
├── context/            # React context providers
│   └── index.js        # Wagmi and QueryClient providers
├── lib/                 # Utility libraries
│   ├── hooks/          # Custom React hooks
│   │   └── useContract.js  # Contract interaction hooks
│   ├── mongodb.js      # MongoDB connection
│   ├── auth.js         # JWT authentication
│   └── models/         # Mongoose models
│       └── User.js
├── pages/              # Next.js pages and API routes
│   ├── api/            # API routes
│   │   ├── auth.js     # Wallet authentication endpoint
│   │   ├── points.js   # Points management endpoint
│   │   └── leaderboard.js  # Leaderboard endpoint
│   ├── index.js        # Home page (main route)
│   └── _app.js         # App wrapper with providers
├── styles/             # Global styles
│   └── globals.css     # Global styles with Tailwind CSS
├── public/             # Static files
├── auto-commit.js      # Auto-commit script
├── next.config.js      # Next.js configuration
└── package.json
```

## How to Play

1. Connect your Web3 wallet when prompted
2. Sign the authentication message (no gas fee required)
3. A new game session will automatically start on the smart contract
4. Use arrow keys or on-screen buttons to move tiles
5. Merge tiles with the same number to create higher values
6. Try to reach 2405!
7. Earn points on MongoDB (1 point per 100 score) and on-chain rewards via the contract
8. When the game ends, your score is automatically recorded on the blockchain
9. Claim your rewards when you're ready (gas fee required for claiming)

## API Endpoints

All API routes are in the `pages/api/` directory:

- `POST /api/auth` - Authenticate with wallet
- `GET /api/points` - Get user points and high score
- `POST /api/points` - Update points after game
- `GET /api/leaderboard` - Get top players

## Component Architecture

The application is built with a clean, modular component structure:

- **`pages/index.js`**: Main page component that orchestrates the app
- **`components/AuthHandler.js`**: Custom hook managing all authentication logic
- **`components/GameContainer.js`**: Main container component for game UI
- **`components/GameLayout.js`**: Layout component organizing game and leaderboard
- **`components/GameHeader.js`**: Page header with title
- **`components/Game2048.js`**: Core game component
- **`components/WalletAuth.js`**: Wallet connection UI
- **`components/PointsDisplay.js`**: User stats display
- **`components/Leaderboard.js`**: Top players display

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, Reown AppKit (WalletConnect), Wagmi
- **Blockchain**: Wagmi, Viem
- **Wallet Integration**: Reown AppKit (supports MetaMask, WalletConnect, Coinbase, etc.)

## License

MIT
