# Quick Fix: Transfer Owner Error

## The Problem
- Property #1 is owned by: **Account #2** (0x3C44...)
- Backend is signing with: **Account #0** (0xf39F...)
- Smart contract requires: **Property owner must sign**

## Solution: Check Property Owner First

### Step 1: Check Who Owns Property #1
1. Go to frontend "Properties" tab
2. Search for Property ID: 1
3. Check the "Owner" field
4. Note the owner address

### Step 2: Update Backend to Use Owner Account

**If Property is owned by Account #2:**
1. Update `.env` with Account #2's private key
2. Restart backend
3. Now backend can initiate transfers

**If Property is owned by Account #0:**
- Backend already using Account #0
- Should work, but check if property actually exists

### Step 3: Alternative - Register Property with Account #0 as Owner

If you want to use Account #0 (current backend account):
1. Register a NEW property
2. Use Account #0 address as owner: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
3. Then you can transfer with current backend setup

---

## Recommended: Use Frontend Signing (Future)

For production, transactions should be signed by frontend user's MetaMask, not backend. This allows any owner to initiate transfers.

