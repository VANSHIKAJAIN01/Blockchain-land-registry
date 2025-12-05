# How to Delete All Stored Records

## 📍 Where Records Are Stored

Your system stores data in **3 main locations**:

### **1. Blockchain Records (Ethereum/Hardhat)**
**Location:** Hardhat local blockchain node (in-memory when running)

**What's stored:**
- ✅ All property records
- ✅ All transfer requests
- ✅ Ownership history
- ✅ User roles
- ✅ Property counters

**Storage Type:** Blockchain state (immutable once written)

---

### **2. Uploaded Documents (Backend Files)**
**Location:** `backend/uploads/` directory

**What's stored:**
- ✅ Property documents (PDFs, images, etc.)
- ✅ Transfer documents
- ✅ Buyer acceptance documents

**Storage Type:** Physical files on disk

---

### **3. File Mapping (Backend Memory)**
**Location:** Backend server memory (`fileStorage` Map)

**What's stored:**
- ✅ Hash → filename mapping
- ✅ Document metadata

**Storage Type:** In-memory (cleared when backend restarts)

---

## 🗑️ How to Delete Everything

### **Method 1: Complete Reset (Recommended)**

This will delete **ALL** records and start fresh:

#### **Step 1: Stop All Services**
```bash
# Stop Hardhat node (Terminal 1)
# Press Ctrl+C

# Stop Backend (Terminal 2)
# Press Ctrl+C

# Stop Frontend (Terminal 3)
# Press Ctrl+C
```

#### **Step 2: Delete Uploaded Files**
```bash
cd backend
rm -rf uploads/
mkdir uploads
```

#### **Step 3: Delete Deployment Info (Optional)**
```bash
cd ..
rm deployment.json
```

#### **Step 4: Restart Everything**
```bash
# Terminal 1: Start Hardhat node (fresh blockchain)
npm run node

# Terminal 2: Deploy contracts (fresh contract)
npm run deploy

# Terminal 3: Setup roles (assign roles again)
npm run setup-roles

# Terminal 4: Start backend
cd backend
npm start

# Terminal 5: Start frontend
cd frontend
npm start
```

**Result:** ✅ Completely fresh start - no records, no files, new contract deployment

---

### **Method 2: Quick Reset (Keep Contract, Delete Data)**

If you want to keep the contract but delete all data:

#### **Step 1: Stop Hardhat Node**
```bash
# In Terminal 1 (Hardhat node)
# Press Ctrl+C
```

#### **Step 2: Delete Uploaded Files**
```bash
cd backend
rm -rf uploads/
mkdir uploads
```

#### **Step 3: Restart Hardhat Node**
```bash
# Terminal 1: Start fresh Hardhat node
npm run node
```

**Note:** This clears blockchain state, but you'll need to redeploy contracts and reassign roles.

---

### **Method 3: Delete Only Files (Keep Blockchain Data)**

If you only want to delete uploaded documents:

```bash
cd backend
rm -rf uploads/
mkdir uploads
```

**Note:** This only deletes files. Blockchain records remain.

---

## 📂 Storage Locations Summary

| Storage Type | Location | How to Delete |
|-------------|----------|---------------|
| **Blockchain Records** | Hardhat node (in-memory) | Stop and restart Hardhat node |
| **Uploaded Documents** | `backend/uploads/` | Delete directory: `rm -rf backend/uploads/` |
| **File Mappings** | Backend memory | Restart backend |
| **Deployment Info** | `deployment.json` | Delete file: `rm deployment.json` |

---

## 🔍 Detailed Storage Locations

### **1. Blockchain Storage (Smart Contract)**

**Contract:** `PropertyRegistry.sol`

**Stored in mappings:**
```solidity
mapping(uint256 => Property) public properties;
mapping(uint256 => TransferRequest) public transferRequests;
mapping(uint256 => OwnershipHistory[]) public ownershipHistory;
mapping(address => UserRole) public userRoles;
mapping(address => uint256[]) public userProperties;
```

**Location:** Hardhat local blockchain (in-memory when node is running)

**To Delete:** Stop Hardhat node → All blockchain state is cleared

---

### **2. File Storage (Backend)**

**Directory:** `backend/uploads/`

**Example files:**
```
backend/uploads/
  ├── 1764914366914-337596340-image (2).png
  ├── 1764914366915-123456789-document.pdf
  └── ...
```

**To Delete:**
```bash
cd backend
rm -rf uploads/
mkdir uploads
```

---

### **3. File Mapping (Backend Memory)**

**Variable:** `fileStorage` Map in `backend/server.js`

**Stored:**
```javascript
fileStorage = {
  'QmMockabc123...': {
    filename: '1764914366914-337596340-image.png',
    originalName: 'image.png',
    mimeType: 'image/png',
    path: 'backend/uploads/1764914366914-337596340-image.png'
  },
  ...
}
```

**To Delete:** Restart backend (clears in-memory Map)

---

### **4. Deployment Information**

**File:** `deployment.json` (in root directory)

**Contains:**
```json
{
  "address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "abi": [...]
}
```

**To Delete:**
```bash
rm deployment.json
```

**Note:** You'll need to redeploy contracts after deleting this.

---

## 🎯 Complete Reset Script

Create a script to reset everything:

```bash
#!/bin/bash
# reset-all.sh

echo "🔄 Resetting all data..."

# Stop services (if running)
echo "Stopping services..."
pkill -f "hardhat node" || true
pkill -f "node server.js" || true
pkill -f "react-scripts" || true

# Delete uploaded files
echo "Deleting uploaded files..."
rm -rf backend/uploads/
mkdir -p backend/uploads

# Delete deployment (optional - uncomment if you want fresh contract)
# echo "Deleting deployment info..."
# rm -f deployment.json

echo "✅ Reset complete!"
echo ""
echo "Next steps:"
echo "1. Start Hardhat node: npm run node"
echo "2. Deploy contracts: npm run deploy"
echo "3. Setup roles: npm run setup-roles"
echo "4. Start backend: cd backend && npm start"
echo "5. Start frontend: cd frontend && npm start"
```

**Save as:** `reset-all.sh`

**Make executable:**
```bash
chmod +x reset-all.sh
```

**Run:**
```bash
./reset-all.sh
```

---

## ⚠️ Important Notes

### **Blockchain Records:**
- ✅ **Immutable** - Once written, cannot be deleted
- ✅ **Hardhat Local** - State is in-memory (cleared when node stops)
- ✅ **Restart Node** - Clears all blockchain data

### **File Storage:**
- ✅ **Physical Files** - Stored on disk
- ✅ **Can Delete** - Safe to delete `uploads/` directory
- ✅ **Recreated** - Directory auto-created on backend start

### **File Mappings:**
- ✅ **In-Memory** - Cleared when backend restarts
- ✅ **No Persistence** - Not saved to disk
- ⚠️ **After Restart** - Old file mappings will be lost (files still exist)

---

## 🔄 Step-by-Step: Complete Reset

### **1. Stop Everything**
```bash
# Stop all terminals running:
# - Hardhat node
# - Backend
# - Frontend
```

### **2. Delete Files**
```bash
cd backend
rm -rf uploads/
mkdir uploads
```

### **3. Delete Deployment (Optional)**
```bash
cd ..
rm deployment.json
```

### **4. Restart Hardhat Node**
```bash
npm run node
# Wait for accounts to appear
```

### **5. Deploy Contracts**
```bash
# New terminal
npm run deploy
```

### **6. Setup Roles**
```bash
# Same terminal
npm run setup-roles
```

### **7. Start Backend**
```bash
cd backend
npm start
```

### **8. Start Frontend**
```bash
cd frontend
npm start
```

**Result:** ✅ Fresh start with no records!

---

## 📊 What Gets Deleted

| Item | Deleted? | How |
|------|----------|-----|
| **Properties** | ✅ Yes | Stop Hardhat node |
| **Transfers** | ✅ Yes | Stop Hardhat node |
| **Ownership History** | ✅ Yes | Stop Hardhat node |
| **User Roles** | ✅ Yes | Stop Hardhat node |
| **Uploaded Files** | ✅ Yes | Delete `uploads/` directory |
| **File Mappings** | ✅ Yes | Restart backend |
| **Deployment Info** | ✅ Yes | Delete `deployment.json` |

---

## 🎯 Quick Commands

### **Delete Everything:**
```bash
# Stop Hardhat node (Ctrl+C)
rm -rf backend/uploads/ && mkdir backend/uploads
rm deployment.json
# Then restart everything
```

### **Delete Only Files:**
```bash
rm -rf backend/uploads/ && mkdir backend/uploads
```

### **Reset Blockchain Only:**
```bash
# Stop Hardhat node (Ctrl+C)
# Restart: npm run node
# Redeploy: npm run deploy
# Setup roles: npm run setup-roles
```

---

## ✅ Summary

**Records are stored in:**
1. **Blockchain** (Hardhat node) - Properties, transfers, roles
2. **Files** (`backend/uploads/`) - Document files
3. **Memory** (Backend) - File mappings

**To delete everything:**
1. Stop Hardhat node (clears blockchain)
2. Delete `backend/uploads/` (clears files)
3. Restart everything (fresh start)

**That's it!** 🎉

