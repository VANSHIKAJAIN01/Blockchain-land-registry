# Quick Fix: Change Backend Private Key

## Problem
Backend is using Account #0 (Seller) to sign transactions, but only Registrar can register properties.

## Solution: Update .env File

**Option 1: Use Registrar Account (for registering properties)**

Edit `/Users/I578052/Desktop/Blockchain/backend/.env`:

Change:
```
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

To (Account #2 - Registrar):
```
PRIVATE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

**Option 2: Use Different Accounts for Different Actions**

For now, use Account #2 (Registrar) in `.env` so backend can register properties.

## After Changing .env

1. Restart backend:
   ```bash
   # Stop backend (Ctrl+C)
   npm start
   ```

2. Now backend will use Registrar account
3. Try registering property again

## Account Reference

From Hardhat terminal:
- Account #0: 0xf39F... → Seller (current backend account)
- Account #1: 0x7099... → Buyer  
- Account #2: 0x3C44... → Registrar (needed for registration)
- Account #3: 0x90F7... → Municipal
- Account #4: 0x15d3... → Broker

Private keys (from Hardhat output):
- Account #0: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
- Account #2: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

