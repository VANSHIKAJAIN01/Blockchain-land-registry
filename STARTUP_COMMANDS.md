# Step-by-Step Startup Commands

## Prerequisites Check
Make sure you have Node.js installed:
```bash
node --version
npm --version
```

## Step 1: Navigate to Project Directory
```bash
cd /Users/I578052/Desktop/Blockchain
```

## Step 2: Install Root Dependencies
```bash
npm install
```

## Step 3: Install Backend Dependencies
```bash
cd backend
npm install
```

## Step 4: Setup Backend Environment
```bash
cp env.example .env
```

Edit `.env` file with your configuration (or use defaults for local testing)

## Step 5: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## Step 6: Go Back to Root Directory
```bash
cd ..
```

## Step 7: Start Hardhat Local Blockchain (Terminal 1)
Keep this terminal running!
```bash
npm run node
```

You'll see output showing:
- 20 accounts with addresses and private keys
- Network running on http://127.0.0.1:8545

**IMPORTANT:** Copy the first account's private key for MetaMask!

## Step 8: Deploy Smart Contracts (Terminal 2)
Open a NEW terminal, navigate to project:
```bash
cd /Users/I578052/Desktop/Blockchain
npm run deploy
```

Expected output:
- Contract deployed address
- Deployment info saved to deployment.json

## Step 9: Setup User Roles (Terminal 2)
Still in Terminal 2:
```bash
npm run setup-roles
```

This assigns roles to accounts:
- Account 0: Seller
- Account 1: Buyer
- Account 2: Registrar
- Account 3: Municipal
- Account 4: Broker

## Step 10: Setup IPFS (Terminal 3 - Optional)
If using local IPFS:
```bash
npm install -g ipfs
ipfs init
ipfs daemon
```

OR skip this and use Infura/Pinata IPFS service (configure in backend/.env)

## Step 11: Start Backend Server (Terminal 4)
Open a NEW terminal:
```bash
cd /Users/I578052/Desktop/Blockchain/backend
npm start
```

Expected output:
- Server running on port 3001
- Contract initialized at [address]

## Step 12: Start Frontend Application (Terminal 5)
Open a NEW terminal:
```bash
cd /Users/I578052/Desktop/Blockchain/frontend
npm start
```

Browser should automatically open at http://localhost:3000

## Step 13: Configure MetaMask

1. Install MetaMask browser extension (if not installed)

2. Add Hardhat Network:
   - Click MetaMask icon → Settings → Networks → Add Network
   - Network Name: Hardhat Local
   - RPC URL: http://localhost:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

3. Import Account:
   - Click MetaMask icon → Account menu → Import Account
   - Paste private key from Terminal 1 (first account)
   - Repeat for other accounts (Account 1, 2, 3, 4) if needed

## Step 14: Test the System

1. Open http://localhost:3000 in browser
2. Click "Connect Wallet" in MetaMask
3. Select the account you imported
4. Start using the system!

---

## Quick Reference: All Commands Summary

```bash
# Terminal 1 - Blockchain Node (keep running)
cd /Users/I578052/Desktop/Blockchain
npm run node

# Terminal 2 - Deploy & Setup
cd /Users/I578052/Desktop/Blockchain
npm run deploy
npm run setup-roles

# Terminal 3 - IPFS (optional, if using local)
ipfs daemon

# Terminal 4 - Backend (keep running)
cd /Users/I578052/Desktop/Blockchain/backend
npm start

# Terminal 5 - Frontend (keep running)
cd /Users/I578052/Desktop/Blockchain/frontend
npm start
```

---

## Troubleshooting

### Port already in use
- Backend: Change PORT in backend/.env
- Frontend: React will ask to use different port automatically

### Contract not found
- Make sure you ran `npm run deploy` after starting Hardhat node

### IPFS errors
- If using local IPFS, make sure `ipfs daemon` is running
- Or configure Infura/Pinata in backend/.env

### MetaMask connection fails
- Make sure Hardhat node is running
- Check network is set to Hardhat Local (Chain ID: 1337)
- Verify RPC URL is http://localhost:8545

