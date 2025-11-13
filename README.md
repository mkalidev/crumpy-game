# 2405 Game

A modern puzzle game inspired by 2048, with Web3 wallet authentication and a MongoDB-based points system.

## Features

- 🎮 **2405 Game**: Play the classic sliding tile puzzle game with the goal of reaching 2405
- 🔐 **Wallet Authentication**: Connect your Web3 wallet (MetaMask, etc.) to play
- 💾 **Points System**: Earn and track points saved to MongoDB
- 🏆 **Leaderboard**: Compete with other players
- 🎨 **Clean UI**: Beautiful, modern interface with smooth animations

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- A Web3 wallet browser extension (MetaMask recommended)
- Git (for auto-commit feature)

## Installation

1. Install dependencies:
```bash
npm run install-all
```

2. Set up MongoDB:
   - Install MongoDB locally or use MongoDB Atlas (cloud)
   - Update the `MONGO_URI` in `server/.env`

3. Configure environment variables:
   - Copy `server/.env.example` to `server/.env`
   - Update the values:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/crumpy-game
     JWT_SECRET=your-secret-jwt-key-change-this-in-production
     ```

4. (Optional) Configure API URL for client:
   - Create `client/.env`:
     ```
     REACT_APP_API_URL=http://localhost:5000
     ```

## Running the Application

### Development Mode

Run both server and client concurrently:
```bash
npm run dev
```

Or run them separately:

**Server:**
```bash
npm run server
```

**Client:**
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Auto-Commit Script

The auto-commit script automatically commits changes every 30 seconds:

```bash
npm run auto-commit
```

**Note:** Make sure Git is initialized and configured before using the auto-commit script.

## Project Structure

```
crumpy-game/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Express backend
│   ├── index.js           # Server entry point
│   └── package.json
├── auto-commit.js         # Auto-commit script
├── package.json           # Root package.json
└── README.md
```

## How to Play

1. Connect your Web3 wallet when prompted
2. Sign the authentication message (no gas fee required)
3. Use arrow keys or on-screen buttons to move tiles
4. Merge tiles with the same number to create higher values
5. Try to reach 2405!
6. Earn points based on your score (1 point per 100 score)

## API Endpoints

- `POST /api/auth` - Authenticate with wallet
- `GET /api/points` - Get user points and high score
- `POST /api/points` - Update points after game
- `GET /api/leaderboard` - Get top players

## Technologies Used

- **Frontend**: React, Axios, Ethers.js
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, Web3 wallet signatures
- **Database**: MongoDB

## License

MIT

