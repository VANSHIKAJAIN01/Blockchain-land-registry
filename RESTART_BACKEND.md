# Critical: Backend Still Using Account #0

## Problem
Error shows: `"from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"` (Account #0)
This means backend is still using Account #0's private key.

## Solution: Restart Backend

### Step 1: Stop Backend
In the terminal where backend is running:
- Press `Ctrl+C` to stop it

### Step 2: Verify .env File
Make sure `/Users/I578052/Desktop/Blockchain/backend/.env` has:
```
PRIVATE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

**Important:** This should be Account #2's private key from your Hardhat terminal, not Account #0.

### Step 3: Start Backend Again
```bash
cd /Users/I578052/Desktop/Blockchain/backend
npm start
```

### Step 4: Check Backend Logs
When backend starts, you should see:
```
Contract initialized at: [address]
```

### Step 5: Verify Account
Check which account backend is using - it should show Account #2's address when you try to register.

---

## Alternative: Use Frontend with MetaMask

Instead of using backend to sign, you can:
1. Connect MetaMask with Account #2 (Registrar)
2. Frontend will use MetaMask to sign transactions
3. This way backend's .env doesn't matter

But current architecture uses backend signing, so we need to fix .env.

---

## Quick Debug

To verify which account backend is using:
1. Check backend logs when it starts
2. Look for wallet address in logs
3. Should be Account #2's address, not Account #0

