# How to Assign a Broker to a Transfer

## 📋 Overview

Brokers are assigned **during transfer initiation** by the Seller. The broker field is **optional** - you can initiate a transfer with or without a broker.

---

## 🎯 Step-by-Step Guide

### **Step 1: Get Broker Address**

First, you need the Ethereum address of the broker account.

#### **Option A: Use Hardhat Test Account (Account #4)**
When you run `npm run node`, Account #4 is assigned as Broker:
- **Address**: `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`
- **Role**: Broker

#### **Option B: Get Address from MetaMask**
1. Have the broker connect their MetaMask
2. Click on their account name
3. Copy the address (starts with `0x`, 42 characters)

#### **Option C: Get Address from Private Key**
If you have the broker's private key:
```javascript
const { ethers } = require('ethers');
const wallet = new ethers.Wallet('PRIVATE_KEY_HERE');
console.log('Address:', wallet.address);
```

---

### **Step 2: Initiate Transfer with Broker**

#### **Method 1: Using Frontend UI**

1. **Navigate to Transfers Tab:**
   - Go to "🔄 Transfers" tab
   - Scroll to "Initiate New Transfer" section

2. **Fill in Transfer Form:**
   - **Property ID**: Enter the property ID (e.g., `1`)
   - **Buyer Address**: Enter buyer's Ethereum address (42 chars)
   - **Price (ETH)**: Enter price (e.g., `100`)
   - **Broker Address (Optional)**: Enter broker's address
     ```
     0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
     ```
   - **Property Documents**: Upload deed/title document

3. **Submit Transfer:**
   - Click "🚀 Initiate Transfer"
   - Approve transaction in MetaMask
   - Transfer is created with broker assigned

#### **Method 2: Using API Directly**

Send POST request to `/api/transfers/initiate`:

```bash
POST http://localhost:3001/api/transfers/initiate
Content-Type: application/json

{
  "propertyId": "1",
  "buyer": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "price": "100",
  "broker": "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
  "documentsHash": "QmXxx..."
}
```

**Example with curl:**
```bash
curl -X POST http://localhost:3001/api/transfers/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "1",
    "buyer": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "price": "100",
    "broker": "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    "documentsHash": "QmJVBERi0xLjQKJfbk/N8KMSAwIG9iago8PAovVHlwZS"
  }'
```

---

## ✅ Verification

### **Check Transfer Details:**

1. **View Transfer:**
   - Go to Transfers tab
   - Enter Transfer ID
   - Click "Load Transfer"

2. **Verify Broker Assignment:**
   - Look for "Broker" field in transfer details
   - Should show: `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`
   - Status should be "Initiated"

3. **Broker Can Now Verify:**
   - Broker connects with their account
   - Sees "Verify as Broker" button
   - Can verify the transfer

---

## 🔍 Important Notes

### **Broker Field is Optional:**
- You can leave broker field **empty** or **null**
- Transfer will work without broker verification
- Broker verification step will be skipped

### **Broker Must Have Broker Role:**
- The broker address must have Broker role assigned
- Run `npm run setup-roles` to assign roles
- Account #4 is automatically assigned as Broker

### **Broker Address Format:**
- Must be valid Ethereum address (42 characters)
- Format: `0x` + 40 hex characters
- Example: `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`

### **Cannot Change Broker After Initiation:**
- Once transfer is initiated, broker cannot be changed
- If wrong broker assigned, cancel and re-initiate

---

## 📊 Complete Example

### **Scenario: Seller Initiates Transfer with Broker**

**1. Seller's Form:**
```
Property ID: 1
Buyer: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Price: 100 ETH
Broker: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65  ← Broker assigned here
Documents: [Upload file]
```

**2. Transfer Created:**
```json
{
  "transferId": 1,
  "propertyId": 1,
  "seller": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "buyer": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "broker": "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
  "status": "Initiated"
}
```

**3. Broker Can Verify:**
- Broker connects with Account #4
- Sees transfer in "Initiated" status
- Clicks "Verify as Broker"
- Status changes to "BrokerVerified"

---

## 🚨 Common Issues

### **Issue 1: Broker Not Showing in Transfer**
**Problem:** Broker field is empty or null

**Solution:**
- Make sure you entered broker address when initiating transfer
- Check transfer details - broker field should show address
- If empty, broker verification step will be skipped

### **Issue 2: "Unauthorized broker" Error**
**Problem:** Broker address doesn't match broker's account

**Solution:**
- Verify broker address matches broker's MetaMask account
- Broker must connect with the exact address assigned
- Check for typos in address

### **Issue 3: Broker Doesn't Have Broker Role**
**Problem:** Broker account doesn't have Broker role assigned

**Solution:**
```bash
# Run setup-roles script
npm run setup-roles

# Verify Account #4 has Broker role
# Address: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
```

### **Issue 4: Wrong Address Format**
**Problem:** Using private key instead of address

**Solution:**
- Use 42-character address, not 66-character private key
- Address format: `0x` + 40 hex chars
- Example: `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`

---

## 🔄 Workflow with Broker

```
1. Seller Initiates Transfer
   └─ Includes broker address: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
   └─ Status: "Initiated"

2. Broker Verifies ✅
   └─ Broker connects with assigned account
   └─ Verifies transaction
   └─ Status: "BrokerVerified"

3. Registrar Verifies ✅
   └─ Status: "RegistrarVerified"

4. Municipal Approves ✅
   └─ Status: "MunicipalApproved"

5. Buyer Accepts ✅
   └─ Status: "Completed"
```

---

## 🎯 Quick Reference

### **Hardhat Test Accounts:**

| Account | Role | Address | Use For |
|---------|------|---------|---------|
| #0 | Seller | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | Initiate transfers |
| #1 | Buyer | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | Accept transfers |
| #2 | Registrar | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | Verify transfers |
| #3 | Municipal | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` | Approve transfers |
| **#4** | **Broker** | **`0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`** | **Verify transfers** |

### **Transfer Without Broker:**

If you don't want to use a broker:
- Leave broker field **empty** or **null**
- Transfer will skip broker verification
- Goes directly to Registrar verification

---

## 💡 Tips

1. **Always verify broker address** before initiating transfer
2. **Use Account #4** for testing (already has Broker role)
3. **Broker is optional** - transfers work without broker
4. **Cannot change broker** after transfer initiation
5. **Broker must have Broker role** to verify

---

## 📝 Summary

**To assign a broker:**
1. Get broker's Ethereum address (42 chars)
2. Enter address in "Broker Address" field when initiating transfer
3. Submit transfer
4. Broker can now verify the transfer

**Broker Address Example:**
```
0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
```

**Remember:** Broker field is optional - you can leave it empty if you don't need broker verification!

