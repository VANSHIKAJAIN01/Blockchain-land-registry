# Complete Role Setup Guide - Make All Roles Work Perfectly

## 🎯 Overview

This guide ensures **all roles work correctly** by configuring the backend with the right account for each action.

---

## 📋 Standard Hardhat Accounts (From Your Setup)

Based on your `npm run setup-roles` output:

| Account | Role | Address | Private Key |
|---------|------|---------|-------------|
| **#0** | **Seller** | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| **#1** | **Buyer** | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` |
| **#2** | **Registrar** | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a` |
| **#3** | **Municipal** | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` | `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6` |
| **#4** | **Broker** | `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65` | **Get from Hardhat node output** |

---

## ✅ Current Backend Configuration

**Backend is now set to:** Account #0 (Seller)
- **Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **Private Key**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

**This allows:**
- ✅ Registering properties (as Seller)
- ✅ Initiating transfers (as property owner)
- ✅ Cancelling transfers (as Seller)

---

## 🔄 How to Use Different Roles

### **Option 1: Use Backend API (Recommended for Testing)**

The backend can only use **one account at a time**. To switch roles:

#### **For Seller Actions (Default - Already Set):**
```bash
# backend/.env
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
**Actions:** Register property, Initiate transfer, Cancel transfer

#### **For Broker Actions:**
```bash
# backend/.env
PRIVATE_KEY=<Account_#4_private_key_from_Hardhat_node>
```
**Get Account #4 private key from Terminal 1 (Hardhat node output)**
**Actions:** Verify transfers

#### **For Registrar Actions:**
```bash
# backend/.env
PRIVATE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```
**Actions:** Register properties (for any owner), Verify transfers

#### **For Municipal Actions:**
```bash
# backend/.env
PRIVATE_KEY=0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
```
**Actions:** Approve transfers

#### **For Buyer Actions:**
```bash
# backend/.env
PRIVATE_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```
**Actions:** Accept transfers

**After changing .env, restart backend:**
```bash
cd backend
npm start
```

### **Option 2: Use MetaMask (No Backend Changes Needed)**

1. **Uncheck "Use Backend API"** in frontend
2. **Connect MetaMask** with the correct account for your role
3. **Perform action** - MetaMask will sign
4. **No backend restart needed**

---

## 🎯 Recommended Workflow

### **For Testing All Roles:**

1. **Start with Seller (Default):**
   - Backend uses Account #0
   - Register properties ✅
   - Initiate transfers ✅

2. **Switch to Broker:**
   - Update `backend/.env` with Account #4 private key
   - Restart backend
   - Verify transfers ✅

3. **Switch to Registrar:**
   - Update `backend/.env` with Account #2 private key
   - Restart backend
   - Verify transfers ✅

4. **Switch to Municipal:**
   - Update `backend/.env` with Account #3 private key
   - Restart backend
   - Approve transfers ✅

5. **Switch to Buyer:**
   - Update `backend/.env` with Account #1 private key
   - Restart backend
   - Accept transfers ✅

---

## 🚀 Quick Role Switching Script

Create `backend/switch-role.sh`:

```bash
#!/bin/bash

ROLE=$1

case $ROLE in
  seller)
    sed -i '' 's/PRIVATE_KEY=.*/PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80/' .env
    echo "✅ Switched to Seller (Account #0)"
    ;;
  buyer)
    sed -i '' 's/PRIVATE_KEY=.*/PRIVATE_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d/' .env
    echo "✅ Switched to Buyer (Account #1)"
    ;;
  registrar)
    sed -i '' 's/PRIVATE_KEY=.*/PRIVATE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a/' .env
    echo "✅ Switched to Registrar (Account #2)"
    ;;
  municipal)
    sed -i '' 's/PRIVATE_KEY=.*/PRIVATE_KEY=0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6/' .env
    echo "✅ Switched to Municipal (Account #3)"
    ;;
  broker)
    echo "⚠️  Broker private key needed from Hardhat node output"
    echo "Account #4 address: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
    echo "Get private key from Terminal 1 (Hardhat node) and update .env manually"
    ;;
  *)
    echo "Usage: ./switch-role.sh [seller|buyer|registrar|municipal|broker]"
    exit 1
    ;;
esac

echo "⚠️  Restart backend to apply changes: npm start"
```

**Make it executable:**
```bash
chmod +x backend/switch-role.sh
```

**Use it:**
```bash
cd backend
./switch-role.sh seller
npm start
```

---

## 📝 Step-by-Step: Complete Transfer Workflow

### **1. Register Property (Seller)**
- ✅ Backend already using Seller account
- Register property → Works!

### **2. Initiate Transfer (Seller)**
- ✅ Backend already using Seller account
- Initiate transfer → Works!

### **3. Broker Verify**
**Option A - Backend:**
- Update `backend/.env`: `PRIVATE_KEY=<Account_#4_key>`
- Restart backend
- Verify → Works!

**Option B - MetaMask:**
- Uncheck "Use Backend API"
- Connect MetaMask with Account #4
- Verify → Works!

### **4. Registrar Verify**
**Option A - Backend:**
- Update `backend/.env`: `PRIVATE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`
- Restart backend
- Verify → Works!

**Option B - MetaMask:**
- Connect MetaMask with Account #2
- Verify → Works!

### **5. Municipal Approve**
**Option A - Backend:**
- Update `backend/.env`: `PRIVATE_KEY=0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6`
- Restart backend
- Approve → Works!

**Option B - MetaMask:**
- Connect MetaMask with Account #3
- Approve → Works!

### **6. Buyer Accept**
**Option A - Backend:**
- Update `backend/.env`: `PRIVATE_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
- Restart backend
- Accept → Works!

**Option B - MetaMask:**
- Connect MetaMask with Account #1
- Accept → Works!

---

## ✅ Current Status

**Backend Configuration:**
- ✅ Using Account #0 (Seller)
- ✅ Can register properties
- ✅ Can initiate transfers
- ✅ Can cancel transfers

**To use other roles:**
- Update `backend/.env` with role's private key
- Restart backend
- Or use MetaMask (uncheck "Use Backend API")

---

## 🎯 Quick Reference

| Action | Required Account | Backend .env Private Key |
|--------|------------------|--------------------------|
| Register Property | Seller (#0) or Registrar (#2) | `0xac0974...` (Seller) or `0x5de4111...` (Registrar) |
| Initiate Transfer | Seller (#0) - must own property | `0xac0974...` (Seller) |
| Broker Verify | Broker (#4) - must be assigned | Get from Hardhat node |
| Registrar Verify | Registrar (#2) | `0x5de4111...` (Registrar) |
| Municipal Approve | Municipal (#3) | `0x7c85211...` (Municipal) |
| Buyer Accept | Buyer (#1) - must be buyer | `0x59c6995...` (Buyer) |
| Cancel Transfer | Seller (#0) - must be seller | `0xac0974...` (Seller) |

---

## 🚨 Important Notes

1. **Backend can only use ONE account at a time**
2. **Restart backend after changing .env**
3. **Account #4 (Broker) private key** - Get from Hardhat node output (Terminal 1)
4. **For testing**, use MetaMask option (no backend restart needed)
5. **For automation**, use backend API (update .env and restart)

---

**Now all roles should work perfectly!** 🎉

**Current setup:** Backend using Seller account - can register and initiate transfers ✅

