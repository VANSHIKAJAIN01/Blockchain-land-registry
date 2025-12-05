# How to Get ETH in Your MetaMask Wallet (Hardhat Network)

## Problem
Your MetaMask wallet shows 0 ETH even though Hardhat accounts have 10,000 ETH.

## Why This Happens
- Hardhat creates 20 default accounts with 10,000 ETH each
- Your MetaMask account is **different** from these Hardhat accounts
- You need to either:
  1. **Import a Hardhat account** into MetaMask (easiest)
  2. **Fund your MetaMask account** from a Hardhat account

---

## Solution 1: Import Hardhat Account into MetaMask (Recommended)

This is the easiest way - you'll get an account with 10,000 ETH instantly!

### Step 1: Get Account Details from Hardhat
When you run `npm run node`, you'll see:
```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### Step 2: Import into MetaMask
1. Open MetaMask
2. Click the account icon (top right)
3. Click **"Import Account"**
4. Select **"Private Key"**
5. Paste the private key from Hardhat (the long hex string starting with `0x`)
6. Click **"Import"**

### Step 3: Switch to Hardhat Network
1. In MetaMask, click the network dropdown (top, usually shows "Ethereum Mainnet")
2. Select **"Hardhat Local"** (or add it if you haven't)
3. You should now see **10,000 ETH** in your account!

---

## Solution 2: Fund Your Current MetaMask Account

If you want to keep using your current MetaMask account, fund it from a Hardhat account.

### Step 1: Get Your MetaMask Address
1. Open MetaMask
2. Click on your account name
3. Click **"Copy address"** or click the account icon
4. Your address is copied (starts with `0x`)

### Step 2: Run the Fund Script
**Make sure Hardhat node is running** (Terminal 1: `npm run node`)

**In a new terminal:**
```bash
cd /Users/I578052/Desktop/Blockchain
RECIPIENT=<your-metamask-address> AMOUNT=100 npm run fund-account
```

**Example:**
```bash
RECIPIENT=0x70997970c51812dc3a010c7d01b50e0d17dc79c8 AMOUNT=100 npm run fund-account
```

**Note:** 
- `RECIPIENT` is your MetaMask address (required)
- `AMOUNT` is the ETH amount to send (optional, defaults to 100)

This will send 100 ETH from Hardhat Account #0 to your MetaMask account.

### Step 3: Check Your Balance
1. Refresh your MetaMask
2. You should now see the ETH balance!

---

## Quick Reference: Hardhat Default Accounts

All these accounts have **10,000 ETH** each:

| Account | Address | Role | Private Key (from Hardhat terminal) |
|---------|---------|------|-------------------------------------|
| #0 | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | Seller | Copy from Hardhat terminal |
| #1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | Buyer | Copy from Hardhat terminal |
| #2 | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | Registrar | Copy from Hardhat terminal |
| #3 | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` | Municipal | Copy from Hardhat terminal |
| #4 | `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65` | Broker | Copy from Hardhat terminal |

---

## Troubleshooting

### "Insufficient funds" error
- Make sure Hardhat node is running
- Check that Account #0 has ETH (it should have 10,000 ETH)

### Still showing 0 ETH
- Make sure you're on **"Hardhat Local"** network in MetaMask
- Refresh MetaMask (close and reopen)
- Check the address you funded matches your MetaMask address

### Can't import account
- Make sure you copied the **entire private key** (66 characters including `0x`)
- Private key should start with `0x` and be 66 characters total

---

## Important Notes

✅ **On Hardhat network, all ETH is FREE** - no real money needed!
✅ **You can fund accounts as many times as you want**
✅ **All transactions are free** (no gas fees)
✅ **This only works on local Hardhat network** - not on mainnet!

