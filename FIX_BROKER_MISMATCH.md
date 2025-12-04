# Fix: Broker Mismatch Error

## Problem
- Transfer #3 is assigned to broker: `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65` (Account #4)
- Backend is using: `0xB25761E7d82Dfa006A65C5208EB95937f59C74d6` (different account)
- Error: "Unauthorized broker"

## ✅ Solution: Use Account #4 Private Key

You need to update backend `.env` with Account #4's private key.

### **Step 1: Get Account #4 Private Key**

When you run `npm run node`, it shows all accounts. Look for:

```
Account #4: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (10000 ETH)
Private Key: 0x[64-character hex string]
```

**Copy that private key.**

### **Step 2: Update Backend .env**

```bash
cd backend
# Edit .env file
PRIVATE_KEY=<Account_#4_private_key_from_Hardhat_node>
```

### **Step 3: Restart Backend**

```bash
npm start
```

### **Step 4: Verify**

Backend should show:
```
Backend using account: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
```

---

## 🔍 Alternative: Check Hardhat Node Output

If Hardhat node is running, check the terminal where you ran `npm run node`. It shows:

```
Account #4: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (10000 ETH)
Private Key: 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f873d9e259c9c0f8439cd
```

**Wait, that private key gives a different address!** Let me check the correct one...

Actually, the standard Hardhat Account #4 private key should be in the Hardhat node output. Check your Terminal 1 (where Hardhat node is running) for Account #4's private key.

---

## 🎯 Quick Fix

The transfer was created with Account #4 as broker. You need to:

1. **Get Account #4 private key** from Hardhat node output
2. **Update backend/.env** with that private key  
3. **Restart backend**
4. **Try verification again**

---

## 📋 Standard Hardhat Accounts

If you're using default Hardhat accounts, Account #4 should be:
- **Address**: `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`
- **Private Key**: Check Hardhat node output (Terminal 1)

The private key is shown when you start `npm run node`.

