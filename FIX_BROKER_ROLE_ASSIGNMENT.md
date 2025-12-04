# Fix: Assign Broker Role to Backend Account

## Problem
Backend is using account `0xB25761E7d82Dfa006A65C5208EB95937f59C74d6` which doesn't have Broker role.

## ✅ Solution

I've created a script to assign Broker role to this account. Run:

```bash
cd /Users/I578052/Desktop/Blockchain
npx hardhat run assign-broker-role.js --network localhost
```

This will assign Broker role to `0xB25761E7d82Dfa006A65C5208EB95937f59C74d6`.

## Alternative: Use Correct Account #4 Private Key

If you want to use Account #4 (which already has Broker role):

1. **Get Account #4 private key from Hardhat node:**
   - When you run `npm run node`, it shows all accounts with private keys
   - Find Account #4: `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`
   - Copy its private key

2. **Update backend/.env:**
   ```bash
   PRIVATE_KEY=<Account_#4_private_key>
   ```

3. **Restart backend**

## Quick Fix: Assign Role to Current Account

Run the script I created - it will assign Broker role to the account backend is currently using.

