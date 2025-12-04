# Fix: "Insufficient role permissions" Error

## Two Issues to Fix:

### Issue 1: Backend Still Using Wrong Account
The backend is still signing with Account #0 (Seller) instead of Account #2 (Registrar).

**Fix:**
1. Make sure `.env` has Account #2's private key
2. **Restart the backend** (this is important!)

### Issue 2: Roles May Not Be Assigned
The accounts might not have roles assigned yet.

**Fix:**
Run the setup-roles script:
```bash
cd /Users/I578052/Desktop/Blockchain
npm run setup-roles
```

---

## Step-by-Step Fix:

### Step 1: Check Roles Are Assigned
Run this command (in root directory):
```bash
cd /Users/I578052/Desktop/Blockchain
npm run setup-roles
```

Expected output:
```
✓ Account 0 (...): Seller
✓ Account 1 (...): Buyer
✓ Account 2 (...): Registrar
✓ Account 3 (...): Municipal
✓ Account 4 (...): Broker
```

### Step 2: Update Backend .env
Edit `/Users/I578052/Desktop/Blockchain/backend/.env`:

1. Get Account #2 private key from Hardhat terminal
2. Update PRIVATE_KEY to Account #2's private key
3. Save the file

### Step 3: Restart Backend
```bash
cd /Users/I578052/Desktop/Blockchain/backend
# Stop current backend (Ctrl+C)
npm start
```

### Step 4: Verify
Check backend logs - should show:
```
Contract initialized at: [address]
```

---

## Quick Check: Verify Roles

You can check if roles are assigned by calling:
```bash
curl http://localhost:3001/api/users/0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC/role
```

Should return: `{"role":"Registrar","roleId":"3"}`

---

## If Still Not Working:

1. **Check Hardhat node is running** (Terminal 1)
2. **Check contracts are deployed** (`npm run deploy`)
3. **Check roles are assigned** (`npm run setup-roles`)
4. **Check .env has correct private key**
5. **Restart backend after .env change**

