Step 3: Approve safely
If you're on Hardhat Local (Chain ID: 1337):
Scroll down in MetaMask.
Check "I have acknowledged the risk and still want to proceed".
Click "Approve" or "Confirm".
Transaction will process.# How to Approve/Verify Transfer as Broker

## 📋 Step-by-Step Guide

### **Prerequisites:**
1. ✅ Transfer must be initiated by Seller
2. ✅ Transfer status must be "Initiated"
3. ✅ You must be assigned as the broker in the transfer
4. ✅ Your MetaMask account must have the Broker role
5. ✅ You must be connected to Hardhat Local network

---

## 🔧 Step 1: Setup Broker Account

### **Get Broker Account Details:**
When you run `npm run node`, Account #4 is assigned as Broker:
- **Address**: `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`
- **Private Key**: `0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f873d9e259c9c0f8439cd`
- **Role**: Broker

### **Import Broker Account to MetaMask:**
1. Open MetaMask extension
2. Click account icon → "Import Account"
3. Paste private key: `0x47e179ec197488593b187f80a00eb0d91f1b9d0b13f873d9e259c9c0f8439cd`
4. Click "Import"
5. Switch to "Hardhat Local" network

---

## 🏠 Step 2: Initiate Transfer with Broker

### **When Seller Initiates Transfer:**
The seller must include the broker address in the transfer form:

```json
{
  "propertyId": "1",
  "buyer": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "price": "100",
  "broker": "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",  // ← Broker address
  "documentsHash": "QmXxx..."
}
```

**Important:** The broker address must match your MetaMask account address!

---

## ✅ Step 3: Verify Transfer as Broker

### **Method 1: Using the Frontend UI**

1. **Connect MetaMask as Broker:**
   - Open the application (http://localhost:3000)
   - Click "Connect Wallet"
   - Select the Broker account in MetaMask
   - Approve connection

2. **Navigate to Transfers Tab:**
   - Click on "🔄 Transfers" tab

3. **View Transfer Details:**
   - Enter the Transfer ID in the search box
   - Click "🔍 Load Transfer"
   - You'll see the transfer details

4. **Verify as Broker:**
   - If you're the assigned broker and status is "Initiated"
   - You'll see a button: **"✓ Verify as Broker"**
   - Click the button
   - Approve transaction in MetaMask
   - Wait for confirmation

5. **Verify Success:**
   - Status changes to "BrokerVerified"
   - Verification status shows "✓ Verified" for Broker
   - Transfer moves to next step (Registrar Verification)

### **Method 2: Using Backend API Directly**

If you want to verify via API:

```bash
POST http://localhost:3001/api/transfers/{transferId}/broker-verify
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/transfers/1/broker-verify
```

**Note:** Backend must be configured with broker's private key in `.env`:
```
PRIVATE_KEY=0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f873d9e259c9c0f8439cd
```

---

## 🔍 Verification Requirements

The smart contract checks these conditions:

1. **Role Check:**
   ```solidity
   require(userRoles[msg.sender] == UserRole.Broker, "Only broker can verify");
   ```
   - Your account must have Broker role assigned

2. **Authorization Check:**
   ```solidity
   require(transferRequests[_transferId].broker == msg.sender, "Unauthorized broker");
   ```
   - You must be the broker assigned to this transfer

3. **Status Check:**
   ```solidity
   require(transferRequests[_transferId].status == TransferStatus.Initiated, 
           "Transfer not in Initiated status");
   ```
   - Transfer must be in "Initiated" status

---

## 🚨 Common Issues & Solutions

### **Issue 1: "Only broker can verify"**
**Problem:** Your account doesn't have Broker role

**Solution:**
```bash
# Make sure roles are set up
npm run setup-roles

# Verify your account has Broker role
# Account #4 should be Broker: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
```

### **Issue 2: "Unauthorized broker"**
**Problem:** You're not the broker assigned to this transfer

**Solution:**
- Check the transfer details - see who is assigned as broker
- Make sure you're using the correct MetaMask account
- The broker address in transfer must match your account

### **Issue 3: "Transfer not in Initiated status"**
**Problem:** Transfer is already verified or in wrong status

**Solution:**
- Check transfer status
- Broker can only verify when status is "Initiated"
- If already verified, move to next step (Registrar)

### **Issue 4: Button Not Showing**
**Problem:** UI doesn't show "Verify as Broker" button

**Possible Reasons:**
- Wrong account connected (not broker account)
- Transfer status is not "Initiated"
- You're not the assigned broker
- Transfer already verified

**Solution:**
- Verify you're connected with Broker account
- Check transfer status
- Refresh the page and reload transfer details

---

## 📊 Complete Workflow

```
1. Seller Initiates Transfer
   └─ Includes broker address: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
   └─ Status: "Initiated"

2. Broker Verifies Transfer
   └─ Broker connects with Account #4
   └─ Views transfer details
   └─ Clicks "Verify as Broker"
   └─ Approves in MetaMask
   └─ Status: "BrokerVerified"

3. Next Step: Registrar Verification
   └─ Registrar can now verify
```

---

## 🎯 Quick Checklist

Before verifying as broker, ensure:

- [ ] Transfer is initiated (status = "Initiated")
- [ ] You're connected with Broker account (Account #4)
- [ ] Your account has Broker role assigned
- [ ] You're the broker assigned in the transfer
- [ ] You're on Hardhat Local network
- [ ] Backend is running (if using API)

---

## 💡 Tips

1. **Always check transfer details first** - Make sure you're the assigned broker
2. **Use correct account** - Account #4 is the Broker account
3. **Check status** - Can only verify when status is "Initiated"
4. **Wait for confirmation** - Transaction needs to be confirmed on blockchain
5. **Refresh after verification** - Reload transfer to see updated status

---

## 🔗 Related Actions

After broker verification:
- **Registrar** can verify (next step)
- **Seller** can still cancel transfer
- **Buyer** cannot accept yet (needs more approvals)

---

**Need help?** Check the transfer details to see current status and who can take action next!

