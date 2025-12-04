# How to View Registered Property on Blockchain

## ✅ Property Registered Successfully!

Your property was registered on the blockchain. Now let's verify and view it.

---

## 🔍 Step 1: Check Which Account Owns the Property

When you registered the property, you entered an **Owner Address** in the form. That's the account that owns the property.

**Common scenarios:**
- If you used Account #0 address → Property is owned by Account #0
- If you used Account #2 address → Property is owned by Account #2

---

## 📱 Step 2: View Property in Frontend

### Option A: Connect with Owner Account

1. **Check the Owner Address** you used when registering
   - Look at the registration form - what address did you put in "Owner Address" field?

2. **Switch to that account in MetaMask**
   - Import that account in MetaMask (if not already)
   - Switch to that account in MetaMask

3. **Refresh Frontend Page**
   - Refresh: `http://localhost:3000`
   - Click "Connect Wallet"
   - Select the owner account

4. **Go to Properties Tab**
   - Click "Properties" tab
   - You should see your property listed!

### Option B: View All Properties (Add Feature)

If you want to see all properties regardless of owner, we can add a feature for that.

---

## 🔗 Step 3: Verify on Blockchain Directly

You can also verify the property exists on the blockchain:

### Using Browser Console

1. Open browser console (F12)
2. Run this command (replace with your property ID):
```javascript
fetch('http://localhost:3001/api/properties/1')
  .then(r => r.json())
  .then(data => console.log(data))
```

### Using Backend API

You can test with curl:
```bash
curl http://localhost:3001/api/properties/1
```

---

## 📊 Step 4: Check Property Details

The property should show:
- Property ID
- Property Address
- Property Type
- Area
- Current Owner
- IPFS Hash (for documents)

---

## 🎯 Quick Checklist

1. ✅ Property registered (you got success message)
2. ⬜ Connected MetaMask with owner account
3. ⬜ Refreshed frontend page
4. ⬜ Clicked "Properties" tab
5. ⬜ Property should be visible

---

## 💡 Troubleshooting

**Property not showing?**
- Make sure you're connected with the **owner account** (the address you used in registration form)
- Refresh the page
- Check browser console for errors
- Try disconnecting and reconnecting wallet

**Want to see property by ID?**
- You can add a "View Property by ID" feature
- Or check the backend logs for the Property ID when you registered

---

## 🔍 Finding Property ID

When you registered the property, you should have received:
- Success message with Property ID
- Or check backend logs for Property ID

If you don't know the Property ID, properties are numbered starting from 1, so try Property ID: 1

