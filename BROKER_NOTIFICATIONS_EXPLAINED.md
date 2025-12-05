# Broker Notifications - Where They Appear ✅

## 📍 Where Broker Notifications Appear

Brokers see notifications in **3 places**:

### **1. Toast Notifications (Top-Right Corner)**

**When:**
- When broker connects wallet
- When broker performs actions

**What Shows:**
- 🔔 Info notification: "As a Broker, you can verify transfers assigned to you. Use the 'View Transfer' feature to find transfers that need your verification."

**Location:** Top-right corner of screen (auto-dismisses after 5 seconds)

---

### **2. Broker Notification Banner (Transfers Tab)**

**When:**
- Broker is logged in and viewing Transfers tab

**What Shows:**
- Orange banner with bell icon
- Message: "You have transfers assigned to you that need verification. Use the 'View Transfer' section below to enter a Transfer ID and verify transfers where you are the assigned broker."

**Location:** Top of Transfers tab (always visible when broker is logged in)

---

### **3. Transfer Details Page**

**When:**
- Broker views a transfer where they are the assigned broker
- Transfer status is "Initiated"

**What Shows:**
- Action card: "🤝 Your Action Required: Verify this transaction as the assigned broker."
- "✓ Verify as Broker" button

**Location:** Transfer details page (when viewing a transfer)

---

## 🔄 How It Works

### **When Broker Connects:**

1. **Toast Notification Appears:**
   ```
   🔔 As a Broker, you can verify transfers assigned to you.
   Use the "View Transfer" feature to find transfers that need your verification.
   ```

2. **Banner Appears on Transfers Tab:**
   - Orange banner with instructions
   - Always visible when broker is on Transfers tab

### **When Transfer is Initiated:**

1. **Seller initiates transfer** with broker address
2. **Broker gets notification** (if they're connected):
   - Toast: "Broker [address]... has been notified to verify this transfer."
3. **Broker can view transfer** by entering Transfer ID

### **When Broker Views Transfer:**

1. **Broker enters Transfer ID** in "View Transfer" section
2. **If broker is assigned** and status is "Initiated":
   - Action card appears
   - "Verify as Broker" button appears
3. **Broker clicks button** → Verifies transfer
4. **Success notification** appears
5. **Next role notification** appears (Registrar)

---

## 🎯 How to See Notifications as Broker

### **Step 1: Connect Wallet as Broker**
1. Connect MetaMask with Broker account
2. **Toast notification appears** (top-right)
3. Go to **Transfers** tab

### **Step 2: View Broker Banner**
- **Orange banner** appears at top of Transfers tab
- Shows instructions for finding transfers

### **Step 3: Find Transfer to Verify**
1. Seller initiates transfer with your broker address
2. Get Transfer ID from seller
3. Enter Transfer ID in "View Transfer" section
4. Click "View Transfer"

### **Step 4: Verify Transfer**
1. Transfer details page opens
2. **Action card appears** if you're the assigned broker
3. Click "✓ Verify as Broker" button
4. Confirm transaction
5. **Success notification** appears

---

## 📱 Notification Locations Summary

| Location | When It Appears | What It Shows |
|----------|----------------|---------------|
| **Toast (Top-Right)** | When broker connects | Info about verifying transfers |
| **Banner (Transfers Tab)** | Always visible for brokers | Instructions for finding transfers |
| **Action Card (Transfer Details)** | When viewing assigned transfer | "Verify as Broker" button |

---

## ✅ Summary

**Brokers see notifications:**
1. ✅ **Toast notification** when connecting (top-right corner)
2. ✅ **Orange banner** on Transfers tab (always visible)
3. ✅ **Action card** when viewing assigned transfer (with verify button)

**All notifications are visible and functional!** 🎉

---

## 🔍 Troubleshooting

**If you don't see notifications:**

1. **Check your role:**
   - Make sure you're connected as Broker account
   - Check role badge in header

2. **Check Transfers tab:**
   - Orange banner should appear at top
   - If not, refresh page

3. **Check Transfer ID:**
   - Make sure transfer is assigned to your broker address
   - Transfer status should be "Initiated"

4. **Refresh browser:**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

---

## 🎯 Quick Reference

**Broker Notifications:**
- 🔔 Toast: Top-right corner (auto-dismisses)
- 📋 Banner: Transfers tab (always visible)
- ✅ Action: Transfer details page (when assigned)

**All notifications are working!** ✅

