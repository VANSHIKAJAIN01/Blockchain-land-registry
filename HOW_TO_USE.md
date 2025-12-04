# How to Use the Blockchain Land Registry Application

## Current Status: 0 Properties ✅

**This is normal!** You haven't registered any properties yet. Let's walk through the complete workflow.

---

## 🎯 Complete Workflow Overview

```
1. Register Property (Registrar) 
   ↓
2. Initiate Transfer (Seller)
   ↓
3. Broker Verification (Broker)
   ↓
4. Registrar Verification (Registrar)
   ↓
5. Municipal Approval (Municipal)
   ↓
6. Buyer Acceptance (Buyer)
   ↓
7. Transfer Complete! ✅
```

---

## Step 1: Register Your First Property (As Registrar)

### Prerequisites:
- Hardhat node running
- MetaMask connected
- Account with Registrar role (Account #2)

### Steps:

1. **Import Registrar Account in MetaMask**
   - In Terminal 1 (Hardhat node), find Account #2:
     ```
     Account #2: [address] (10000 ETH)
     Private Key: [private key]
     ```
   - In MetaMask: Account menu → Import Account → Paste private key

2. **Switch to Registrar Account**
   - Click account icon in MetaMask
   - Select Account #2 (Registrar account)

3. **Refresh Frontend Page**
   - Make sure you're on Hardhat Local network
   - Refresh: http://localhost:3000

4. **Connect Wallet**
   - Click "Connect Wallet"
   - Select Account #2 (Registrar)
   - You should see: "Role: Registrar"

5. **Register Property**
   - Click "Register Property" tab (should be visible for Registrar)
   - Fill in the form:
     ```
     Owner Address: [Enter Account #0 address - the Seller]
     Property Address: 123 Main Street, City
     Property Type: Residential
     Area: 1500
     ```
   - Upload a document (any PDF/image file)
   - Click "Register Property"
   - MetaMask will ask to approve transaction
   - Click "Confirm"
   - Wait for confirmation

6. **Verify Property Registered**
   - Go to "Properties" tab
   - You should see your property listed!
   - Note the Property ID (you'll need it for transfers)

---

## Step 2: Initiate Property Transfer (As Seller)

### Switch to Seller Account:

1. **Switch Account in MetaMask**
   - Click account icon
   - Select Account #0 (Seller account)

2. **Refresh Frontend Page**
   - Click "Connect Wallet" again
   - Select Account #0
   - You should see: "Role: Seller"

3. **Initiate Transfer**
   - Go to "Transfers" tab
   - Fill in the form:
     ```
     Property ID: 1 (from Step 1)
     Buyer Address: [Account #1 address - the Buyer]
     Price: 5.5 (ETH)
     Broker Address: [Account #4 address - optional]
     ```
   - Upload transfer documents (PDF/image)
   - Click "Initiate Transfer"
   - Approve transaction in MetaMask
   - Note the Transfer ID shown in alert

---

## Step 3: Broker Verification

### Switch to Broker Account:

1. **Switch to Account #4 (Broker) in MetaMask**
   - Refresh frontend
   - Connect wallet with Broker account

2. **Verify Transfer**
   - Go to "Transfers" tab
   - Click "View Transfer Details"
   - Enter Transfer ID (from Step 2)
   - Click "Load Transfer"
   - You should see transfer details
   - Click "Verify as Broker" button
   - Approve transaction

---

## Step 4: Registrar Verification

### Switch to Registrar Account:

1. **Switch to Account #2 (Registrar) in MetaMask**
   - Refresh frontend
   - Connect wallet with Registrar account

2. **Verify Transfer**
   - Go to "Transfers" tab
   - Enter Transfer ID
   - Click "Load Transfer"
   - You should see status: "BrokerVerified"
   - Click "Verify as Registrar" button
   - Approve transaction

---

## Step 5: Municipal Approval

### Switch to Municipal Account:

1. **Switch to Account #3 (Municipal) in MetaMask**
   - Refresh frontend
   - Connect wallet with Municipal account

2. **Approve Transfer**
   - Go to "Transfers" tab
   - Enter Transfer ID
   - Click "Load Transfer"
   - You should see status: "RegistrarVerified"
   - Click "Approve as Municipal" button
   - Approve transaction

---

## Step 6: Buyer Acceptance

### Switch to Buyer Account:

1. **Switch to Account #1 (Buyer) in MetaMask**
   - Refresh frontend
   - Connect wallet with Buyer account

2. **Accept Transfer**
   - Go to "Transfers" tab
   - Enter Transfer ID
   - Click "Load Transfer"
   - You should see status: "MunicipalApproved"
   - Upload buyer acceptance documents
   - Click "Accept Transfer & Upload Documents"
   - Approve transaction

3. **Transfer Complete!**
   - Status should change to "Completed"
   - Property ownership transferred!
   - Check "Properties" tab - Buyer should now own the property

---

## 📋 Quick Reference: Account Roles

| Account # | Role | What They Can Do |
|-----------|------|------------------|
| #0 | Seller | Initiate transfers, cancel transfers |
| #1 | Buyer | Accept transfers |
| #2 | Registrar | Register properties, verify transfers |
| #3 | Municipal | Approve transfers |
| #4 | Broker | Verify transfers |

---

## 🔍 Understanding the Dashboard

### Dashboard Tab:
- Shows your statistics
- Number of properties you own
- Your role
- Wallet address

### Properties Tab:
- Lists all properties you own
- Shows property details
- Links to view documents on IPFS

### Transfers Tab:
- Initiate new transfers (if you're Seller)
- View transfer details
- Take actions based on your role

### Register Property Tab:
- Only visible to Registrar
- Form to register new properties

---

## 💡 Tips for Testing

1. **Use Multiple Browser Windows**
   - Open different accounts in different windows
   - Easier to switch between roles

2. **Keep Terminal 1 Running**
   - Hardhat node must stay running
   - Keep it in a separate terminal

3. **Note IDs**
   - Write down Property IDs and Transfer IDs
   - You'll need them for next steps

4. **Check Status**
   - Always check transfer status before taking action
   - Status shows what step comes next

5. **View Documents**
   - Click IPFS links to view uploaded documents
   - Documents are stored on IPFS network

---

## 🐛 Common Issues & Solutions

### "No properties found"
- **Normal**: You haven't registered any yet
- **Solution**: Register a property as Registrar first

### "Transfer not found"
- **Cause**: Wrong Transfer ID
- **Solution**: Check the ID from the alert when you initiated transfer

### "Insufficient role permissions"
- **Cause**: Wrong account selected
- **Solution**: Switch to correct account for that action

### "Transfer not in correct status"
- **Cause**: Previous step not completed
- **Solution**: Complete workflow steps in order

### Can't see action buttons
- **Cause**: Wrong account or wrong status
- **Solution**: Check your role and transfer status

---

## 🎬 Complete Example Walkthrough

**Scenario**: Transfer Property #1 from Seller to Buyer

1. **Registrar** registers Property #1 → Owner: Account #0
2. **Seller** (Account #0) initiates transfer → Transfer ID: 1
3. **Broker** (Account #4) verifies → Status: BrokerVerified
4. **Registrar** (Account #2) verifies → Status: RegistrarVerified
5. **Municipal** (Account #3) approves → Status: MunicipalApproved
6. **Buyer** (Account #1) accepts → Status: Completed ✅
7. Property ownership transferred to Buyer!

---

## 📊 What You'll See at Each Step

- **Dashboard**: Shows your role and property count
- **Properties**: Lists properties you own
- **Transfer Details**: Shows status, parties, documents, verification status
- **Status Badge**: Color-coded status indicator

---

## ✨ Next Steps

1. Start with registering a property (Registrar)
2. Then try initiating a transfer (Seller)
3. Complete the workflow step by step
4. Check property ownership after completion

**Remember**: Start with registering a property first - that's why you see 0 properties! 🏠

