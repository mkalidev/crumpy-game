# Setup Guide

## Prerequisites Installation

Before running the application, you need to install the following:

### 1. Install Node.js and npm

**Option A: Download from Official Website (Recommended)**

1. Visit https://nodejs.org/
2. Download the LTS (Long Term Support) version for Windows
3. Run the installer and follow the setup wizard
4. Make sure to check "Add to PATH" during installation
5. Restart your terminal/PowerShell after installation

**Option B: Using Chocolatey (if you have Chocolatey installed)**

```powershell
choco install nodejs-lts
```

**Option C: Using Winget (Windows Package Manager)**

```powershell
winget install OpenJS.NodeJS.LTS
```

**Verify Installation:**
After installation, restart your terminal and run:

```powershell
node --version
npm --version
```

Both commands should return version numbers.

### 2. Install MongoDB

**Option A: MongoDB Community Server (Local)**

1. Visit https://www.mongodb.com/try/download/community
2. Download MongoDB Community Server for Windows
3. Run the installer
4. Choose "Complete" installation
5. Install MongoDB as a Windows Service (recommended)
6. MongoDB will run automatically on `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud - Free)**

1. Visit https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/crumpy-game`)

### 3. Install Git (for auto-commit feature)

**Option A: Download from Official Website**

1. Visit https://git-scm.com/download/win
2. Download and run the installer
3. Use default settings (Git will be added to PATH)
4. Restart your terminal after installation

**Option B: Using Chocolatey**

```powershell
choco install git
```

**Option C: Using Winget**

```powershell
winget install Git.Git
```

**Verify Installation:**

```powershell
git --version
```

## After Installation

Once Node.js, npm, and MongoDB are installed:

1. **Install all dependencies:**

   ```powershell
   npm run install-all
   ```

2. **Set up environment variables:**
   - Copy `server/.env.example` to `server/.env`
   - Edit `server/.env` and update:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/crumpy-game
     # Or for MongoDB Atlas:
     # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/crumpy-game
     JWT_SECRET=your-secret-jwt-key-change-this-in-production
     ```

3. **Initialize Git (if not already done):**

   ```powershell
   git init
   git config user.name "Your Name"
   git config user.email "your.email@example.com"
   ```

4. **Start MongoDB** (if using local installation):
   - MongoDB should start automatically as a Windows service
   - Or run manually: `mongod` in a terminal

5. **Run the application:**

   ```powershell
   npm run dev
   ```

6. **Auto-commit script** (optional, in a separate terminal):
   ```powershell
   npm run auto-commit
   ```

## Troubleshooting

### npm/node not recognized after installation

- **Solution:** Restart your terminal/PowerShell window
- Make sure Node.js was added to PATH during installation
- Check PATH manually: `$env:PATH` should include Node.js installation directory

### MongoDB connection errors

- Make sure MongoDB is running (for local installation)
- Check if the port 27017 is not blocked by firewall
- Verify the MONGO_URI in `server/.env` is correct
- For MongoDB Atlas: Make sure your IP is whitelisted in Atlas settings

### Git not found

- Restart your terminal after Git installation
- Git should be in PATH automatically, but you can verify with: `where.exe git`

## Next Steps

Once everything is installed:

- Open http://localhost:3000 in your browser
- Connect your Web3 wallet (MetaMask recommended)
- Start playing the 2405 game!
