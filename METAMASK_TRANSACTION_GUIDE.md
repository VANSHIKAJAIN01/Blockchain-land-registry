# How to Approve Transactions in MetaMask

## 🎯 Step-by-Step Guide

### When Transaction Appears:

1. **MetaMask Popup Opens Automatically**
   ```
   ┌─────────────────────────────────────┐
   │  MetaMask                           │
   ├─────────────────────────────────────┤
   │  💼 Sign Transaction                │
   │                                     │
   │  📋 Transaction Details:           │
   │  • To: 0x5FbDB... (Contract)      │
   │  • Data: 0x6080...                 │
   │  • Value: 0 ETH                    │
   │                                     │
   │  ⛽ Estimated Gas Fee:            │
   │     0.000XXX ETH                   │
   │                                     │
   │  [✕ Reject]  [✓ Confirm] ← Click │
   └─────────────────────────────────────┘
   ```

2. **Review the Details**
   - Check the "To" address (should be your contract)
   - Check the value (usually 0 ETH)
   - Gas fee is fake on Hardhat (free)

3. **Click "Confirm" Button**
   - Bottom right of MetaMask popup
   - May also say "Approve" or "Sign"

---

## ⏳ Waiting for Confirmation

### What Happens Next:

1. **MetaMask Shows Processing**
   ```
   ┌─────────────────────────────────────┐
   │  MetaMask                           │
   ├─────────────────────────────────────┤
   │  ⏳ Processing...                   │
   │                                     │
   │  Transaction is being processed    │
   │                                     │
   │  [Spinner animation]                │
   └─────────────────────────────────────┘
   ```

2. **Wait for Status Change**
   - Processing → Confirming → Confirmed
   - Usually takes 1-3 seconds on Hardhat
   - On real networks, can take 15-60 seconds

3. **Success Message**
   ```
   ┌─────────────────────────────────────┐
   │  MetaMask                           │
   ├─────────────────────────────────────┤
   │  ✅ Transaction Confirmed          │
   │                                     │
   │  View on block explorer            │
   │  [Close]                            │
   └─────────────────────────────────────┘
   ```

4. **Popup Closes Automatically**
   - Or click "Close"
   - Return to your application

---

## 🔍 Different Types of Popups

### Type 1: Sign Transaction
- **When:** Registering property, initiating transfer
- **Action:** Click "Confirm"
- **What it does:** Sends transaction to blockchain

### Type 2: Sign Message
- **When:** Sometimes for authentication
- **Action:** Click "Sign"
- **What it does:** Signs a message (not a transaction)

### Type 3: Connect Request
- **When:** First time connecting wallet
- **Action:** Click "Connect" or "Next"
- **What it does:** Grants app access to your account

---

## ⚠️ Common Scenarios

### Scenario 1: Transaction Stuck
**Problem:** MetaMask shows "Processing" for too long

**Solutions:**
- Wait a bit longer (Hardhat is usually fast)
- Check if Hardhat node is still running
- Try refreshing the page
- Check browser console for errors

### Scenario 2: Transaction Failed
**Problem:** MetaMask shows "Failed" or error

**Solutions:**
- Check Hardhat node is running
- Check you have enough ETH (fake ETH on Hardhat)
- Check you're on correct network (Hardhat Local)
- Review error message in MetaMask

### Scenario 3: Popup Doesn't Appear
**Problem:** No MetaMask popup when clicking action

**Solutions:**
- Check MetaMask is unlocked
- Check correct network selected (Hardhat Local)
- Refresh the page
- Check browser console for errors
- Try disconnecting and reconnecting wallet

### Scenario 4: Wrong Network
**Problem:** Error about wrong network

**Solutions:**
- Click network dropdown in MetaMask
- Select "Hardhat Local"
- Refresh app page

---

## ✅ Quick Checklist

Before approving transaction:
- [ ] Hardhat node is running
- [ ] Correct network selected (Hardhat Local)
- [ ] Correct account selected
- [ ] Transaction details look correct
- [ ] Gas fee is reasonable (on Hardhat, it's free)

---

## 🎬 Complete Example Flow

**Example: Registering a Property**

1. **Fill form** → Click "Register Property"
2. **MetaMask opens** → Shows transaction details
3. **Review details** → Check contract address, value
4. **Click "Confirm"** → Transaction submitted
5. **Wait for processing** → MetaMask shows "Processing..."
6. **Confirmation** → "Transaction Confirmed" message
7. **Return to app** → Property appears in list!

---

## 💡 Tips

1. **On Hardhat**: Transactions are instant (1-2 seconds)
2. **On Real Networks**: Can take 15-60 seconds
3. **Always Review**: Check transaction details before confirming
4. **Gas Fees**: On Hardhat, fees are fake/free
5. **Multiple Transactions**: Approve each one as it appears

---

## 🔐 Security Note

- **Always review** transaction details
- **Never approve** transactions you don't understand
- **On Hardhat**: Safe to test (fake money)
- **On Mainnet**: Real money, be careful!

---

## 📱 Mobile MetaMask

If using mobile MetaMask:
- Same process
- Push notifications for transactions
- Approve on phone
- Same confirmation flow

---

## 🐛 Troubleshooting

**Can't see MetaMask popup?**
- Check browser settings (popup blocker)
- Check MetaMask is unlocked
- Refresh page

**Transaction keeps failing?**
- Check Hardhat node is running
- Check network is Hardhat Local
- Check account has ETH (fake ETH on Hardhat)

**Too slow?**
- Hardhat should be fast (1-2 seconds)
- If slow, check Hardhat node status
- Check browser console for errors

