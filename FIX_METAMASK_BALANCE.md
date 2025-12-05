# Fix: MetaMask and UI Showing 0 ETH

## Problem
You can see accounts have 10,000 ETH when running `npm run show-accounts`, but:
- MetaMask shows 0 ETH
- UI shows 0 ETH

## Why This Happens
Your MetaMask account is **different** from the Hardhat accounts. The Hardhat accounts have ETH, but your MetaMask account doesn't.

---

## ✅ Solution: Import a Hardhat Account into MetaMask

This is the **easiest and fastest** solution!

### Step 1: Get Account Details
Run this command to see all accounts:
```bash
npm run show-accounts
```

You'll see:
```
Account #0 (Seller)
  Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  Balance: 10000.0 ETH
  Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### Step 2: Import Account into MetaMask

1. **Open MetaMask**
2. **Click the account icon** (top right, circle with account name)
3. **Click "Import Account"**
4. **Select "Private Key"** (or it may auto-detect)
5. **Paste the private key** from Step 1
   - Example: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
6. **Click "Import"**

### Step 3: Switch to Hardhat Network

1. In MetaMask, click the **network dropdown** (top, usually shows "Ethereum Mainnet")
2. Select **"Hardhat Local"**
   - If you don't see it, add it:
     - Click "Add Network" → "Add a network manually"
     - Network Name: `Hardhat Local`
     - RPC URL: `http://localhost:8545`
     - Chain ID: `1337`
     - Currency Symbol: `ETH`
     - Click "Save"

### Step 4: Refresh the Frontend

1. **Refresh your browser** (http://localhost:3000)
2. **Click "Connect Wallet"** again
3. **Select the imported account** in MetaMask
4. You should now see **10,000 ETH** in both MetaMask and the UI!

---

## Alternative Solution: Fund Your Current MetaMask Account

If you want to keep using your current MetaMask account:

### Step 1: Get Your MetaMask Address
1. Open MetaMask
2. Click on your account name
3. Click **"Copy address"**

### Step 2: Fund the Account
**Make sure Hardhat node is running** (Terminal 1: `npm run node`)

**In a new terminal:**
```bash
cd /Users/I578052/Desktop/Blockchain
RECIPIENT=<your-metamask-address> AMOUNT=100 npm run fund-account
```

**Example:**
```bash
RECIPIENT=0xYourMetaMaskAddressHere AMOUNT=100 npm run fund-account
```

### Step 3: Refresh
1. Refresh MetaMask
2. Refresh the frontend
3. You should see the ETH balance!

---

## Quick Reference: Which Account to Import?

| Account | Role | Use For |
|---------|------|---------|
| #0 | Seller | Register properties, Initiate transfers |
| #1 | Buyer | Accept transfers |
| #2 | Registrar | Register properties, Verify transfers |
| #3 | Municipal | Approve transfers |
| #4 | Broker | Verify transfers |

**Recommendation:** Start with **Account #0 (Seller)** - it's the most versatile!

---

## Troubleshooting

### Still showing 0 ETH after importing?
1. ✅ Make sure you're on **"Hardhat Local"** network in MetaMask
2. ✅ Make sure Hardhat node is running (`npm run node`)
3. ✅ Refresh the browser page
4. ✅ Click the refresh balance button (🔄) in the UI header

### Can't see "Hardhat Local" network?
1. Make sure Hardhat node is running
2. Add the network manually (see Step 3 above)
3. Check the RPC URL is correct: `http://localhost:8545`

### Balance not updating in UI?
1. Click the refresh button (🔄) next to the balance in the header
2. Check browser console (F12) for errors
3. Make sure the frontend is connected to the correct network

---

## Verify It's Working

After importing an account:
1. **MetaMask** should show: `10,000 ETH` (or the amount you funded)
2. **UI Header** should show: `10,000.0000 ETH` (or your balance)
3. **Dashboard** should show: `10,000.0000 ETH` in the Wallet Balance card

---

## Important Notes

✅ **All ETH on Hardhat network is FREE** - no real money!
✅ **You can import multiple accounts** - switch between them in MetaMask
✅ **Each Hardhat account has 10,000 ETH** by default
✅ **Transactions are FREE** on Hardhat network (no gas fees)

