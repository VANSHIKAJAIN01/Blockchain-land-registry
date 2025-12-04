# Multi-Role Backend Solution - No More Restarting!

## ✅ Problem Solved!

**Before:** Had to change `PRIVATE_KEY` in `.env` and restart backend for each role
**Now:** Backend automatically uses the correct account for each action - **NO RESTART NEEDED!**

---

## 🎯 How It Works

The backend now stores **all role private keys** and automatically selects the correct one for each action:

- **Register Property** → Uses Registrar (or Seller)
- **Initiate Transfer** → Uses Seller
- **Broker Verify** → Uses Broker
- **Registrar Verify** → Uses Registrar
- **Municipal Approve** → Uses Municipal
- **Buyer Accept** → Uses Buyer
- **Cancel Transfer** → Uses Seller

---

## 📋 Updated Backend .env

Your `backend/.env` now has all role private keys:

```bash
# Seller (Account #0)
SELLER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Buyer (Account #1)
BUYER_PRIVATE_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

# Registrar (Account #2)
REGISTRAR_PRIVATE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

# Municipal (Account #3)
MUNICIPAL_PRIVATE_KEY=0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6

# Broker (Account #4)
BROKER_PRIVATE_KEY=<Get from Hardhat node output>
```

---

## 🚀 How to Use

### **Step 1: Update Broker Private Key**

Get Account #4 private key from **Terminal 1** (Hardhat node output) and update:

```bash
# backend/.env
BROKER_PRIVATE_KEY=<Account_#4_private_key_from_Hardhat_node>
```

### **Step 2: Restart Backend (One Time Only!)**

```bash
cd backend
npm start
```

You should see:
```
✓ Seller signer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
✓ Buyer signer: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
✓ Registrar signer: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
✓ Municipal signer: 0x90F79bf6EB2c4f870365E785982E1f101E93b906
✓ Broker signer: 0x...
✅ Multi-role support enabled. Backend can handle all roles without restarting!
```

### **Step 3: Use All Roles - No Restart Needed!**

Now you can:
- ✅ Register properties (uses Registrar/Seller automatically)
- ✅ Initiate transfers (uses Seller automatically)
- ✅ Broker verify (uses Broker automatically)
- ✅ Registrar verify (uses Registrar automatically)
- ✅ Municipal approve (uses Municipal automatically)
- ✅ Buyer accept (uses Buyer automatically)
- ✅ Cancel transfer (uses Seller automatically)

**All without changing .env or restarting backend!**

---

## 🎯 Benefits

✅ **No more restarting** - Backend handles all roles
✅ **Automatic role selection** - Uses correct account for each action
✅ **One-time setup** - Configure all keys once
✅ **Faster workflow** - No delays switching roles
✅ **Better for testing** - Test all roles seamlessly

---

## 📝 Current Status

**Backend .env updated with:**
- ✅ Seller private key
- ✅ Buyer private key
- ✅ Registrar private key
- ✅ Municipal private key
- ⏳ Broker private key (needs Account #4 key from Hardhat node)

**After updating Broker key and restarting once, all roles will work!**

---

## 🔍 How to Get Account #4 Private Key

1. **Check Terminal 1** (where Hardhat node is running)
2. **Look for Account #4:**
   ```
   Account #4: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (10000 ETH)
   Private Key: 0x[64-character hex string]
   ```
3. **Copy the private key**
4. **Update `backend/.env`:**
   ```bash
   BROKER_PRIVATE_KEY=<paste_private_key_here>
   ```
5. **Restart backend** (one last time!)

---

## ✅ Summary

**Before:**
- Change `.env` → Restart backend → Use role → Change `.env` → Restart → Repeat 😫

**Now:**
- Configure all keys once → Restart once → Use all roles! 🎉

**No more changing private keys and restarting!** 🚀

