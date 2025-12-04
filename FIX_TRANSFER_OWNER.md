# Fix: "Only owner can initiate transfer" Error

## Problem
The backend is using Account #0 to sign transactions, but Property #1 is owned by Account #2 (the address you used when registering).

**Error:** "Only owner can initiate transfer"
**Cause:** Backend signing with wrong account (not the property owner)

---

## Solution Options

### Option 1: Use Property Owner Account in Backend (Quick Fix)

**For Property #1:**
- Property owner: Account #2 (0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC)
- Backend needs to use Account #2's private key

**Steps:**
1. Update `.env` with Account #2's private key (from Hardhat terminal)
2. Restart backend
3. Now backend can initiate transfers for properties owned by Account #2

**Note:** This only works if all properties are owned by Account #2

---

### Option 2: Use Frontend with MetaMask (Recommended)

**Better approach:** Use the frontend, which signs with MetaMask (the connected account)

1. **Connect MetaMask with Property Owner Account**
   - Import Account #2 in MetaMask (if not already)
   - Switch to Account #2 in MetaMask

2. **Initiate Transfer from Frontend**
   - Frontend will use MetaMask to sign
   - MetaMask uses the connected account (Account #2)
   - Transaction signed by property owner ✅

**However:** Current architecture uses backend signing, so we need to modify it.

---

### Option 3: Modify Backend to Accept User Account (Best Solution)

We need to change the backend to NOT sign transactions, but instead return them to the frontend for MetaMask signing.

---

## Quick Fix for Now: Use Property Owner Account

Since Property #1 is owned by Account #2:

1. **Update backend .env:**
   ```
   PRIVATE_KEY=[Account #2's private key from Hardhat]
   ```

2. **Restart backend:**
   ```bash
   # Stop backend (Ctrl+C)
   npm start
   ```

3. **Verify:**
   - Check backend logs show: "Backend using account: 0x3C44..."
   - Now you can initiate transfers for Property #1

---

## Future Improvement

For a production system, transactions should be signed by the frontend user's MetaMask, not the backend. This allows:
- Any property owner to initiate transfers
- Better security (user controls their own transactions)
- More flexible system

---

## Current Workaround

**For testing:**
- Use Account #2's private key in backend .env
- This allows transfers for properties owned by Account #2
- For other properties, update .env to that property owner's account

**Note:** This is just for testing. Production should use frontend signing.

