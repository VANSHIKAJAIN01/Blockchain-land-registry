# Use Backend API Instead of MetaMask

## ✅ Solution: Backend API Mode

I've added an option to use **Backend API** instead of MetaMask popups. This way, transactions are signed by the backend, and you don't need to approve in MetaMask.

---

## 🎯 How to Use

### **Step 1: Enable Backend API Mode**

1. Go to **Transfers** tab
2. You'll see a checkbox at the top: **"Use Backend API"**
3. **Check the box** ✅
4. Now all transactions will go through backend (no MetaMask popup)

### **Step 2: Configure Backend for Your Role**

The backend needs the **correct private key** for your role in `backend/.env`:

#### **For Broker Actions:**
```bash
# backend/.env
PRIVATE_KEY=0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f873d9e259c9c0f8439cd
```
This is Account #4 (Broker)

#### **For Registrar Actions:**
```bash
# backend/.env
PRIVATE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```
This is Account #2 (Registrar)

#### **For Municipal Actions:**
```bash
# backend/.env
PRIVATE_KEY=0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
```
This is Account #3 (Municipal)

#### **For Seller Actions (Cancel Transfer):**
```bash
# backend/.env
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
This is Account #0 (Seller)

#### **For Buyer Actions:**
```bash
# backend/.env
PRIVATE_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```
This is Account #1 (Buyer)

---

## 🔄 How to Switch Roles

### **Option 1: Update .env File**

1. **Stop backend** (Ctrl+C in backend terminal)
2. **Edit `backend/.env`**
3. **Change `PRIVATE_KEY`** to the role you need
4. **Restart backend**: `npm start`

### **Option 2: Quick Switch Script**

Create a script to quickly switch roles:

```bash
# backend/switch-role.sh
#!/bin/bash

ROLE=$1

case $ROLE in
  seller)
    sed -i '' 's/PRIVATE_KEY=.*/PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80/' .env
    ;;
  buyer)
    sed -i '' 's/PRIVATE_KEY=.*/PRIVATE_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d/' .env
    ;;
  registrar)
    sed -i '' 's/PRIVATE_KEY=.*/PRIVATE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a/' .env
    ;;
  municipal)
    sed -i '' 's/PRIVATE_KEY=.*/PRIVATE_KEY=0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6/' .env
    ;;
  broker)
    sed -i '' 's/PRIVATE_KEY=.*/PRIVATE_KEY=0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f873d9e259c9c0f8439cd/' .env
    ;;
  *)
    echo "Usage: ./switch-role.sh [seller|buyer|registrar|municipal|broker]"
    exit 1
    ;;
esac

echo "Switched to $ROLE role. Restart backend to apply changes."
```

---

## 📋 Quick Reference: Private Keys

| Role | Account | Address | Private Key |
|------|---------|---------|------------|
| **Seller** | #0 | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| **Buyer** | #1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` |
| **Registrar** | #2 | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a` |
| **Municipal** | #3 | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` | `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6` |
| **Broker** | #4 | `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65` | `0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f873d9e259c9c0f8439cd` |

---

## 🎯 Usage Example

### **To Verify as Broker:**

1. **Update backend/.env:**
   ```bash
   PRIVATE_KEY=0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f873d9e259c9c0f8439cd
   ```

2. **Restart backend:**
   ```bash
   cd backend
   npm start
   ```

3. **In frontend:**
   - Check "Use Backend API" checkbox ✅
   - Click "Verify as Broker"
   - **No MetaMask popup!** ✅
   - Transaction completes automatically

---

## ⚠️ Important Notes

### **Backend Signs Transactions:**
- Backend uses the private key from `.env`
- Transactions are signed automatically
- **No MetaMask popup required**
- **No user approval needed**

### **Security Consideration:**
- Private keys are stored in `.env` file
- **Never commit `.env` to git**
- **Only use test accounts** (not real wallets)
- This is fine for local development

### **Role Switching:**
- You need to **restart backend** after changing `.env`
- Backend can only use **one role at a time**
- Switch roles by updating `PRIVATE_KEY` and restarting

---

## 🔄 Workflow

### **Using Backend API:**

1. **Enable Backend API** (check checkbox in UI)
2. **Set correct private key** in `backend/.env`
3. **Restart backend**
4. **Perform action** (no MetaMask popup!)
5. **Transaction completes** automatically

### **Using MetaMask (if you prefer):**

1. **Uncheck "Use Backend API"**
2. **Connect MetaMask** with correct account
3. **Perform action**
4. **Approve in MetaMask**

---

## ✅ Benefits of Backend API

- ✅ **No MetaMask popups**
- ✅ **Faster transactions**
- ✅ **No approval needed**
- ✅ **Better for testing**
- ✅ **Automated workflow**

## ⚠️ Limitations

- ⚠️ **One role at a time** (need to restart backend to switch)
- ⚠️ **Less secure** (private key in backend)
- ⚠️ **Not for production** (use MetaMask for real apps)

---

## 🎯 Quick Start

1. **Check "Use Backend API"** in frontend
2. **Update `backend/.env`** with role's private key
3. **Restart backend**
4. **Done!** No more MetaMask popups!

---

**Now you can approve/disapprove transactions without MetaMask!** 🎉

