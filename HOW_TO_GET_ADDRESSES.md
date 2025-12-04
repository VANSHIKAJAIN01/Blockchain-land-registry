# How to Get Ethereum Addresses for Forms

## 🔍 Where to Find Addresses

### Method 1: From Hardhat Terminal
When you run `npm run node`, you'll see:
```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
```

**Copy the address** (the part starting with `0x`)

### Method 2: From MetaMask
1. Open MetaMask
2. Click on your account name
3. Click "Copy address" or click the account icon
4. Address will be copied to clipboard

### Method 3: Check Frontend
1. Connect wallet in the app
2. Your address is shown at the top: "Connected: 0xf39F..."
3. Click on it to copy

---

## ✅ Correct Address Format

**Must be:**
- Starts with `0x`
- 42 characters total (including `0x`)
- Example: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

**Examples:**
```
✅ Correct:
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC

❌ Wrong:
f39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (missing 0x)
0xf39F (too short)
Account #0 (not an address)
```

---

## 📝 Quick Reference: Account Addresses

**From Hardhat (Terminal 1):**
```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (Seller)
Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (Buyer)
Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (Registrar)
Account #3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906 (Municipal)
Account #4: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (Broker)
```

---

## 🎯 Common Use Cases

### Register Property (Registrar Form)
**Owner Address:** Use Account #0 address
```
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

### Initiate Transfer (Seller Form)
**Buyer Address:** Use Account #1 address
```
0x70997970C51812dc3A010C7d01b50e0d17dc79C8
```

**Broker Address (optional):** Use Account #4 address or leave empty
```
0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
```

---

## ⚠️ Troubleshooting

**Error: "Invalid owner address format"**
- Check address starts with `0x`
- Check address is 42 characters
- Copy from Hardhat terminal or MetaMask
- Don't include spaces or extra characters

**Address looks wrong?**
- Make sure you copied the full address
- Check for typos
- Use copy-paste, don't type manually

**Can't find address?**
- Check Hardhat terminal (Terminal 1)
- Check MetaMask account
- Check frontend "Connected" display

---

## 💡 Tips

1. **Always copy-paste** addresses (don't type manually)
2. **Double-check** address format before submitting
3. **Keep Hardhat terminal open** to reference addresses
4. **Use MetaMask** to copy addresses easily

