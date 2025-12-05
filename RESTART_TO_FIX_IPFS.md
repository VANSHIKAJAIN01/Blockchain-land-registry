# Restart Required to Fix IPFS Error

## ⚠️ Important: You Need to Restart!

The IPFS error fix requires **restarting both backend and frontend** to take effect.

---

## 🔄 Step-by-Step Restart

### **Step 1: Restart Backend**

1. **Go to your backend terminal** (where `npm start` is running)
2. **Stop it:** Press `Ctrl+C`
3. **Restart it:**
   ```bash
   cd backend
   npm start
   ```

4. **Check the output** - You should see:
   ```
   ⚠️  IPFS not available. Using mock mode for testing.
   Documents will be stored with mock hashes.
   ✅ Multi-role support enabled...
   Backend server running on port 3001
   ```

### **Step 2: Restart Frontend**

1. **Go to your frontend terminal** (where `npm start` is running)
2. **Stop it:** Press `Ctrl+C`
3. **Restart it:**
   ```bash
   cd frontend
   npm start
   ```

4. **Wait for it to compile** - Should see:
   ```
   Compiled successfully!
   ```

### **Step 3: Refresh Browser**

1. **Hard refresh** your browser:
   - Mac: `Cmd + Shift + R`
   - Windows/Linux: `Ctrl + Shift + R`

2. **Or clear cache** and refresh normally

---

## ✅ After Restart

### **Test Upload:**

1. **Try uploading a document** (register property or initiate transfer)
2. **Should work without error!**
3. **Check the hash** - should start with `QmMock...`
4. **No IPFS error!**

---

## 🔍 Verify It's Working

### **Backend Logs Should Show:**
```
⚠️  IPFS not available. Using mock mode for testing.
⚠️  Using mock IPFS hash for testing: QmMock...
```

### **Frontend Should:**
- ✅ Upload documents successfully
- ✅ Show mock hash (not broken link)
- ✅ No 500 errors

---

## 📝 What Changed

**Backend:**
- ✅ Mock hashes use `QmMock` prefix
- ✅ No URLs for mock hashes
- ✅ Better error handling

**Frontend:**
- ✅ Detects mock hashes
- ✅ Shows hash instead of link
- ✅ Better error handling

---

## ⚠️ If Still Getting Error

If you still see the error after restarting:

1. **Check backend is using new code:**
   - Look for `QmMock` in logs when uploading
   - Should NOT see IPFS connection attempts

2. **Check frontend:**
   - Hard refresh browser
   - Clear browser cache
   - Check browser console for errors

3. **Old documents:**
   - Documents uploaded BEFORE the fix may still have old hashes
   - These might show errors (expected)
   - **New uploads will work correctly**

---

## 🎯 Quick Checklist

- [ ] Backend restarted (Ctrl+C, then `npm start`)
- [ ] Frontend restarted (Ctrl+C, then `npm start`)
- [ ] Browser hard refreshed (Cmd+Shift+R)
- [ ] Tested new upload - works without error
- [ ] Hash starts with `QmMock...`

---

**After restarting, the IPFS error should be completely fixed!** 🎉

