# Quick Role Reference - All Accounts & Private Keys

## ✅ Backend Currently Configured

**Account:** #0 (Seller)
**Address:** `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
**Private Key:** `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

**✅ Can do:**
- Register properties
- Initiate transfers
- Cancel transfers

---

## 📋 All Hardhat Accounts (From Your Setup)

### **Account #0 - Seller** ✅ (Currently Active)
- **Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **Private Key**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- **Role**: Seller
- **Use for**: Register properties, Initiate transfers, Cancel transfers

### **Account #1 - Buyer**
- **Address**: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- **Private Key**: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
- **Role**: Buyer
- **Use for**: Accept transfers

### **Account #2 - Registrar**
- **Address**: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- **Private Key**: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`
- **Role**: Registrar
- **Use for**: Register properties (for any owner), Verify transfers

### **Account #3 - Municipal**
- **Address**: `0x90F79bf6EB2c4f870365E785982E1f101E93b906`
- **Private Key**: `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6`
- **Role**: Municipal
- **Use for**: Approve transfers

### **Account #4 - Broker** ⚠️
- **Address**: `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`
- **Private Key**: **Get from Hardhat node output (Terminal 1)**
- **Role**: Broker
- **Use for**: Verify transfers

---

## 🔍 How to Get Account #4 Private Key

**Check Terminal 1** (where you ran `npm run node`):

Look for:
```
Account #4: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (10000 ETH)
Private Key: 0x[64-character hex string]
```

**Copy that private key** and use it in `backend/.env` for broker actions.

---

## 🎯 Current Setup Status

✅ **Backend**: Using Seller (Account #0)
✅ **Can initiate transfers**: Yes
✅ **Can register properties**: Yes
✅ **Can cancel transfers**: Yes

⏳ **For broker verification**: 
- Option 1: Get Account #4 private key from Hardhat node, update backend .env, restart
- Option 2: Uncheck "Use Backend API", connect MetaMask with Account #4

---

## 🚀 Next Steps

1. **Restart backend** (if not already restarted):
   ```bash
   cd backend
   npm start
   ```

2. **Try initiating transfer** - should work now! ✅

3. **For broker verification**:
   - Get Account #4 private key from Hardhat node
   - Update `backend/.env`
   - Restart backend
   - Or use MetaMask instead

---

**Backend is now configured correctly for Seller actions!** 🎉

