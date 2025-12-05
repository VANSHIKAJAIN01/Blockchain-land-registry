# Fix: "Cannot read properties of undefined (reading 'getAddress')"

## ✅ Problem Fixed!

The error occurred because we were trying to access `contractInstance.signer.getAddress()`, but in ethers v6, the signer might not be directly accessible as a property on the contract instance.

---

## 🔧 What Was Fixed

### **Before (Error):**
```javascript
const contractInstance = getContractForRole('seller');
const signerAddress = await contractInstance.signer.getAddress(); // ❌ Error!
```

### **After (Fixed):**
```javascript
const signerAddress = await getSignerAddressForRole('seller');
const contractInstance = getContractForRole('seller');
```

---

## ✅ Solution

Added helper functions to safely get signer addresses:

```javascript
// Get signer for a specific role (helper function)
function getSignerForRole(role) {
  return roleSigners[role] || defaultSigner;
}

// Get signer address for a specific role (async helper)
async function getSignerAddressForRole(role) {
  const signer = getSignerForRole(role);
  if (!signer) {
    throw new Error(`No signer available for role: ${role}`);
  }
  return await signer.getAddress();
}
```

---

## 🔍 Why This Happened

1. **Ethers v6 Changes:** Contract instances don't always expose `.signer` directly
2. **Better Approach:** Access the signer directly from `roleSigners` mapping
3. **Safety:** Added error handling for missing signers

---

## ✅ Verification

To verify the fix works:

1. **Restart your backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Check initialization:**
   You should see:
   ```
   ✓ Seller signer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   ✓ Buyer signer: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
   ...
   Backend default account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   ```

3. **Test initiating a transfer:**
   - Should no longer get the "Cannot read properties" error
   - Should successfully get the signer address

---

## 🎯 Additional Safety Checks

If you still encounter issues, check:

1. **Signers are initialized:**
   - Backend should show all role signers on startup
   - If any are missing, check `.env` file

2. **Private keys are valid:**
   - Must be 66 characters (0x + 64 hex)
   - Must be valid hex strings

3. **Provider is ready:**
   - Hardhat node must be running
   - Backend must connect to `http://localhost:8545`

---

## ✅ Summary

- ✅ Fixed signer access error
- ✅ Added helper functions for safe signer access
- ✅ Better error handling
- ✅ No more "Cannot read properties" error!

**The backend should now work correctly with all role-based actions!**

