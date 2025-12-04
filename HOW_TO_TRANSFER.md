# Complete Guide: How to Transfer Property

## 🔄 Complete Transfer Workflow

```
1. Seller Initiates Transfer
   ↓
2. Broker Verifies
   ↓
3. Registrar Verifies
   ↓
4. Municipal Approves
   ↓
5. Buyer Accepts
   ↓
6. Transfer Complete! ✅
```

---

## Step 1: Seller Initiates Transfer

### Prerequisites:
- Property must be registered
- You must be the property owner (Seller)
- Buyer address ready
- Transfer documents ready

### Steps:

1. **Connect with Seller Account**
   - Switch to Account #0 (Seller) in MetaMask
   - Refresh frontend page
   - Connect wallet

2. **Get Property ID**
   - Go to "Properties" tab
   - Find your property
   - Note the Property ID (e.g., 1, 2, 3...)

3. **Get Buyer Address**
   - Buyer's Ethereum address (Account #1: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`)
   - Or any other buyer address

4. **Initiate Transfer**
   - Go to "Transfers" tab
   - Fill in the form:
     ```
     Property ID: 1 (your property ID)
     Buyer Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
     Price: 5.5 (in ETH)
     Broker Address: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (optional)
     ```
   - Upload transfer documents (PDF/image)
   - Click "Initiate Transfer"
   - Approve transaction in MetaMask

5. **Save Transfer ID**
   - You'll get a success message with Transfer ID
   - **Write it down!** (e.g., Transfer ID: 1)
   - You'll need it for next steps

---

## Step 2: Broker Verification

### Prerequisites:
- Transfer must be in "Initiated" status
- Broker account must match the one in transfer

### Steps:

1. **Switch to Broker Account**
   - Switch to Account #4 (Broker) in MetaMask
   - Refresh frontend page
   - Connect wallet

2. **View Transfer**
   - Go to "Transfers" tab
   - Enter the Transfer ID (from Step 1)
   - Click "Load Transfer"

3. **Verify Transfer**
   - Review transfer details
   - Check status shows "Initiated"
   - Click "Verify as Broker" button
   - Approve transaction in MetaMask

4. **Status Updates**
   - Status should change to "BrokerVerified"
   - Verification status shows: Broker: ✓ Verified

---

## Step 3: Registrar Verification

### Prerequisites:
- Transfer must be in "BrokerVerified" status

### Steps:

1. **Switch to Registrar Account**
   - Switch to Account #2 (Registrar) in MetaMask
   - Refresh frontend page
   - Connect wallet

2. **View Transfer**
   - Go to "Transfers" tab
   - Enter the Transfer ID
   - Click "Load Transfer"

3. **Verify Transfer**
   - Review transfer details
   - Check status shows "BrokerVerified"
   - Click "Verify as Registrar" button
   - Approve transaction in MetaMask

4. **Status Updates**
   - Status should change to "RegistrarVerified"
   - Verification status shows: Registrar: ✓ Verified

---

## Step 4: Municipal Approval

### Prerequisites:
- Transfer must be in "RegistrarVerified" status

### Steps:

1. **Switch to Municipal Account**
   - Switch to Account #3 (Municipal) in MetaMask
   - Refresh frontend page
   - Connect wallet

2. **View Transfer**
   - Go to "Transfers" tab
   - Enter the Transfer ID
   - Click "Load Transfer"

3. **Approve Transfer**
   - Review transfer details
   - Check status shows "RegistrarVerified"
   - Click "Approve as Municipal" button
   - Approve transaction in MetaMask

4. **Status Updates**
   - Status should change to "MunicipalApproved"
   - Verification status shows: Municipal: ✓ Approved

---

## Step 5: Buyer Acceptance (Final Step!)

### Prerequisites:
- Transfer must be in "MunicipalApproved" status
- Buyer must accept

### Steps:

1. **Switch to Buyer Account**
   - Switch to Account #1 (Buyer) in MetaMask
   - Refresh frontend page
   - Connect wallet

2. **View Transfer**
   - Go to "Transfers" tab
   - Enter the Transfer ID
   - Click "Load Transfer"

3. **Accept Transfer**
   - Review transfer details
   - Check status shows "MunicipalApproved"
   - Upload buyer acceptance documents (PDF/image)
   - Click "Accept Transfer & Upload Documents"
   - Approve transaction in MetaMask

4. **Transfer Complete!**
   - Status automatically changes to "Completed"
   - Property ownership transferred to buyer!
   - Transfer is now complete ✅

---

## Step 6: Verify Transfer Complete

### Check Property Ownership:

1. **View Property**
   - Go to "Properties" tab
   - Search for the Property ID
   - Check "Owner" field - should now show buyer's address

2. **Check Buyer's Properties**
   - Switch to Buyer account (Account #1)
   - Go to "Properties" tab
   - Property should appear in "Properties I Own"

---

## 📋 Quick Reference: Account Roles

| Account | Address (Example) | Role | Action |
|---------|------------------|------|--------|
| #0 | 0xf39F... | Seller | Initiate transfer |
| #1 | 0x7099... | Buyer | Accept transfer |
| #2 | 0x3C44... | Registrar | Verify transfer |
| #3 | 0x90F7... | Municipal | Approve transfer |
| #4 | 0x15d3... | Broker | Verify transfer |

---

## 🔍 Transfer Status Reference

- **Initiated** → Seller started transfer
- **BrokerVerified** → Broker verified
- **RegistrarVerified** → Registrar verified
- **MunicipalApproved** → Municipal approved
- **BuyerAccepted** → Buyer accepted
- **Completed** → Transfer complete! ✅
- **Cancelled** → Transfer cancelled

---

## 💡 Tips

1. **Write Down Transfer ID** - You'll need it for all steps
2. **Complete Steps in Order** - Can't skip steps
3. **Check Status** - Always check current status before taking action
4. **Use Correct Accounts** - Each role needs specific account
5. **Documents Required** - Seller and Buyer need to upload documents

---

## ⚠️ Common Issues

**"Transfer not found"**
- Check Transfer ID is correct
- Make sure transfer was initiated

**"Insufficient role permissions"**
- Wrong account selected
- Switch to correct account for that role

**"Transfer not in correct status"**
- Previous step not completed
- Complete workflow steps in order

**Can't see action button**
- Check your role matches the required role
- Check transfer status

---

## 🎬 Example Transfer Flow

**Scenario:** Transfer Property #1 from Seller to Buyer

1. **Seller** (Account #0) initiates → Transfer ID: 1
2. **Broker** (Account #4) verifies → Status: BrokerVerified
3. **Registrar** (Account #2) verifies → Status: RegistrarVerified
4. **Municipal** (Account #3) approves → Status: MunicipalApproved
5. **Buyer** (Account #1) accepts → Status: Completed ✅
6. Property ownership transferred to Buyer!

---

## 📝 Quick Checklist

For Seller:
- [ ] Property registered
- [ ] Know Property ID
- [ ] Have Buyer address
- [ ] Transfer documents ready

For Each Role:
- [ ] Correct account connected
- [ ] Know Transfer ID
- [ ] Check current status
- [ ] Take appropriate action

---

Now you can transfer properties! Start with Step 1: Seller Initiates Transfer 🚀

