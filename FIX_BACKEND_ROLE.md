# Fix: Backend Role Error

## Problem
Error: "Only broker can verify"
- Backend is using Account #0 (Seller) instead of Account #4 (Broker)
- Transaction from: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` (Seller)
- Should be from: `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65` (Broker)

## ✅ Solution: Update Backend Private Key

I've updated your `backend/.env` file with the Broker's private key.

### **Now Restart Backend:**

1. **Stop backend** (in backend terminal, press Ctrl+C)

2. **Restart backend:**
   ```bash
   cd backend
   npm start
   ```

3. **Verify it's using Broker account:**
   - Look for: `Backend using account: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`
   - This confirms Broker account is active

4. **Try broker verification again** - should work now!

---

## 🔄 Quick Role Switching Guide

### **For Broker Actions:**
```bash
# backend/.env
PRIVATE_KEY=0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f873d9e259c9c0f8439cd
```
**Account:** `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`

### **For Registrar Actions:**
```bash
PRIVATE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```
**Account:** `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`

### **For Municipal Actions:**
```bash
PRIVATE_KEY=0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
```
**Account:** `0x90F79bf6EB2c4f870365E785982E1f101E93b906`

### **For Seller Actions:**
```bash
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
**Account:** `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

### **For Buyer Actions:**
```bash
PRIVATE_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```
**Account:** `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`

---

## 📋 Steps After Updating .env

1. ✅ **Update `backend/.env`** with correct private key
2. ✅ **Stop backend** (Ctrl+C)
3. ✅ **Restart backend** (`npm start`)
4. ✅ **Check console** - should show correct account
5. ✅ **Try action again**

---

## 🎯 Current Status

✅ **Backend .env updated** with Broker private key
⏳ **You need to restart backend** for changes to take effect

**After restart, broker verification will work!** 🎉

