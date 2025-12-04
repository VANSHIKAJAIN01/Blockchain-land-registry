# Step-by-Step: Starting the Application

## 📋 Complete Startup Guide

Follow these steps **in order** to start your blockchain land registry application.

---

## Step 1: Stop All Running Processes

If you have any terminals running:
- Press `Ctrl+C` in each terminal to stop them
- Close terminals if needed

---

## Step 2: Start Hardhat Blockchain (Terminal 1)

**Open Terminal 1:**

```bash
cd /Users/I578052/Desktop/Blockchain
npm run node
```

**Expected Output:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: ...

... (20 accounts listed)
```

**⚠️ IMPORTANT:** 
- **Keep this terminal running!** 
- Copy the private keys you need for MetaMask

---

## Step 3: Deploy Smart Contracts (Terminal 2)

**Open a NEW Terminal 2:**

```bash
cd /Users/I578052/Desktop/Blockchain
npm run deploy
```

**Expected Output:**
```
Compiling 1 file with 0.8.19
Compilation finished successfully
Deploying PropertyRegistry contract...
PropertyRegistry deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Admin address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Deployment info saved to deployment.json
```

**✅ Success!** Contracts are deployed.

---

## Step 4: Setup User Roles (Terminal 2)

**Still in Terminal 2:**

```bash
npm run setup-roles
```

**Expected Output:**
```
Setting up roles for PropertyRegistry...
Found 20 accounts

Assigning roles...

✓ Account 0 (0xf39F...): Seller
✓ Account 1 (0x7099...): Buyer
✓ Account 2 (0x3C44...): Registrar
✓ Account 3 (0x90F7...): Municipal
✓ Account 4 (0x15d3...): Broker

✓ All roles assigned successfully!
```

**✅ Success!** Roles are assigned.

---

## Step 5: Configure Backend (Terminal 2)

**Still in Terminal 2:**

```bash
cd backend
```

**Check if .env exists:**
```bash
ls -la .env
```

**If .env doesn't exist, create it:**
```bash
cp env.example .env
```

**Edit .env file:**
- Open `.env` in your editor
- Set `PRIVATE_KEY` to Account #2's private key (for Registrar) or Account #0 (for Seller)
- For testing, you can use Account #2: `PRIVATE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`
- Save the file

---

## Step 6: Start Backend Server (Terminal 3)

**Open a NEW Terminal 3:**

```bash
cd /Users/I578052/Desktop/Blockchain/backend
npm start
```

**Expected Output:**
```
⚠️  IPFS not available. Using mock mode for testing.
Backend using account: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Contract initialized at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Backend server running on port 3001
```

**✅ Success!** Backend is running.

**⚠️ Keep this terminal running!**

---

## Step 7: Configure MetaMask

**If MetaMask is not configured yet:**

1. **Open MetaMask** (browser extension)

2. **Add Hardhat Network:**
   - Click MetaMask icon
   - Click network dropdown (top)
   - Click "Add Network" → "Add a network manually"
   - Fill in:
     - **Network Name:** `Hardhat Local`
     - **RPC URL:** `http://localhost:8545`
     - **Chain ID:** `1337`
     - **Currency Symbol:** `ETH`
   - Click "Save"

3. **Import Accounts:**
   - Click account icon → "Import Account"
   - Paste private key from Terminal 1 (Account #0, #1, #2, etc.)
   - Click "Import"
   - Repeat for other accounts if needed

4. **Switch to Hardhat Network:**
   - Select "Hardhat Local" from network dropdown

---

## Step 8: Start Frontend (Terminal 4)

**Open a NEW Terminal 4:**

```bash
cd /Users/I578052/Desktop/Blockchain/frontend
npm start
```

**Expected Output:**
```
Compiling...
Compiled successfully!

You can now view blockchain-land-registry in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**✅ Success!** Frontend is running.

**Browser should open automatically** to http://localhost:3000

**⚠️ Keep this terminal running!**

---

## Step 9: Connect to Application

1. **Open Browser:**
   - Go to: http://localhost:3000
   - (Browser may have opened automatically)

2. **Connect Wallet:**
   - Click "Connect Wallet" button
   - MetaMask will pop up
   - Click "Connect" or "Next" → "Connect"
   - Select "Hardhat Local" network if prompted

3. **Verify Connection:**
   - You should see your wallet address at the top
   - You should see your role (Seller, Buyer, etc.)
   - Tabs should be visible: Dashboard, Properties, Transfers, Register Property

---

## Step 10: Verify Everything Works

### Test Registration:
1. Go to "Register Property" tab
2. Fill in property details
3. Upload a document
4. Click "Register Property"
5. Approve in MetaMask
6. Should see success message

### Test Property View:
1. Go to "Properties" tab
2. Search for Property ID: 1
3. Should see property details

---

## ✅ Quick Checklist

Before starting, make sure you have:
- [ ] Node.js installed
- [ ] All dependencies installed (`npm install` in root, backend, frontend)
- [ ] Hardhat node running (Terminal 1)
- [ ] Contracts deployed (Terminal 2)
- [ ] Roles assigned (Terminal 2)
- [ ] Backend .env configured (Terminal 2)
- [ ] Backend running (Terminal 3)
- [ ] Frontend running (Terminal 4)
- [ ] MetaMask configured with Hardhat network
- [ ] MetaMask accounts imported
- [ ] Browser connected to http://localhost:3000

---

## 🚀 All Commands Summary

**Terminal 1 (Keep Running):**
```bash
cd /Users/I578052/Desktop/Blockchain
npm run node
```

**Terminal 2:**
```bash
cd /Users/I578052/Desktop/Blockchain
npm run deploy
npm run setup-roles
```

**Terminal 3 (Keep Running):**
```bash
cd /Users/I578052/Desktop/Blockchain/backend
npm start
```

**Terminal 4 (Keep Running):**
```bash
cd /Users/I578052/Desktop/Blockchain/frontend
npm start
```

---

## 🔍 Verification Steps

After all services are running:

1. **Check Hardhat Node:**
   - Terminal 1 shows: "Started HTTP and WebSocket JSON-RPC server"

2. **Check Backend:**
   - Terminal 3 shows: "Backend server running on port 3001"
   - Shows: "Contract initialized at: [address]"

3. **Check Frontend:**
   - Terminal 4 shows: "Compiled successfully"
   - Browser opens to http://localhost:3000

4. **Check MetaMask:**
   - Network shows: "Hardhat Local"
   - Account imported and visible

---

## 🐛 Troubleshooting

**If something doesn't work:**

1. **Check all terminals are running:**
   - Terminal 1: Hardhat node
   - Terminal 3: Backend
   - Terminal 4: Frontend

2. **Check ports:**
   - Hardhat: 8545
   - Backend: 3001
   - Frontend: 3000

3. **Check contracts deployed:**
   - `deployment.json` exists in root directory
   - Contains contract address

4. **Check MetaMask:**
   - Network is "Hardhat Local"
   - Chain ID is 1337
   - Account has ETH (should show 10000 ETH)

5. **Restart if needed:**
   - Stop all processes (Ctrl+C)
   - Start again from Step 1

---

## 📝 Quick Reference

**4 Terminals Needed:**
- Terminal 1: Hardhat node (`npm run node`)
- Terminal 2: Deploy & setup (`npm run deploy`, `npm run setup-roles`)
- Terminal 3: Backend (`cd backend && npm start`)
- Terminal 4: Frontend (`cd frontend && npm start`)

**3 Services Running:**
- Hardhat blockchain (localhost:8545)
- Backend API (localhost:3001)
- Frontend app (localhost:3000)

**Ready to use!** 🎉


