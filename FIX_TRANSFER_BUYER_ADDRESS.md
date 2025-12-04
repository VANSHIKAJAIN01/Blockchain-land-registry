# Fix: Transfer Buyer Address Error

## Problem
You're getting a 400 error because you're using a **private key** instead of an **Ethereum address** for the buyer field.

## Difference Between Private Key and Address

### Private Key (66 characters)
```
0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```
- Used to sign transactions
- **NEVER share publicly**
- Used in backend `.env` file

### Ethereum Address (42 characters)
```
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```
- Public identifier
- Safe to share
- Used in forms and transactions

## Hardhat Test Account Addresses

When you run `npm run node`, you get these accounts:

### Account #0 (Seller)
- **Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **Private Key**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- **Role**: Seller

### Account #1 (Buyer)
- **Address**: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- **Private Key**: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
- **Role**: Buyer

### Account #2 (Registrar)
- **Address**: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- **Private Key**: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`
- **Role**: Registrar

### Account #3 (Municipal)
- **Address**: `0x90F79bf6EB2c4f870365E785982E1f101E93b906`
- **Private Key**: `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6`
- **Role**: Municipal

### Account #4 (Broker)
- **Address**: `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`
- **Private Key**: `0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f873d9e259c9c0f8439cd`
- **Role**: Broker

## How to Fix

### Option 1: Use Account #1 Address (Buyer)
In your transfer form, use:
```
Buyer Address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

### Option 2: Get Address from MetaMask
1. Open MetaMask
2. Select the account you want to use as buyer
3. Click on account name to copy address
4. Use that address in the form

### Option 3: Get Address from Private Key (Programmatically)
If you have a private key and need the address:
```javascript
const { ethers } = require('ethers');
const wallet = new ethers.Wallet('0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d');
console.log('Address:', wallet.address);
// Output: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

## Correct Request Format

### ✅ Correct
```json
{
  "propertyId": "1",
  "buyer": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "price": "100",
  "broker": null,
  "documentsHash": "QmJVBERi0xLjQKJfbk/N8KMSAwIG9iago8PAovVHlwZS"
}
```

### ❌ Wrong (Using Private Key)
```json
{
  "propertyId": "1",
  "buyer": "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  "price": "100",
  "broker": null,
  "documentsHash": "QmJVBERi0xLjQKJfbk/N8KMSAwIG9iago8PAovVHlwZS"
}
```

## Quick Reference

| Field | Format | Example | Length |
|-------|--------|---------|--------|
| **Address** | `0x` + 40 hex chars | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | 42 chars |
| **Private Key** | `0x` + 64 hex chars | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` | 66 chars |

## Steps to Test Transfer

1. **Make sure property is registered** (Property ID 1 exists)
2. **Use correct buyer address**: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
3. **Ensure backend is using property owner's private key** in `.env`
4. **Submit transfer request**

## Common Errors

### Error 1: Invalid buyer address format
**Cause**: Using private key instead of address
**Fix**: Use 42-character address, not 66-character private key

### Error 2: Property owner mismatch
**Cause**: Backend private key doesn't match property owner
**Fix**: Update `backend/.env` with property owner's private key

### Error 3: Missing required fields
**Cause**: One of the required fields is missing
**Fix**: Ensure all fields (propertyId, buyer, price, documentsHash) are provided

---

**Remember**: Always use **addresses** (42 chars) in forms, never **private keys** (66 chars)!

