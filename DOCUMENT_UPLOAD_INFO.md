# Document Upload Capabilities

## ✅ YES - Both Seller and Buyer Can Upload Deeds/Documents!

### 📄 Seller Document Upload
**When:** During transfer initiation  
**What:** Seller uploads property deeds, ownership documents, sale agreement, etc.  
**How:**
1. Seller goes to "Transfers" tab
2. Fills transfer form (Property ID, Buyer Address, Price, Broker)
3. **Uploads document file** (PDF, image, etc.)
4. Document is uploaded to IPFS
5. IPFS hash is stored on blockchain
6. Transfer is initiated with seller's documents

### 📄 Buyer Document Upload  
**When:** When accepting the transfer (after Municipal approval)  
**What:** Buyer uploads acceptance documents, identity proof, payment confirmation, etc.  
**How:**
1. Buyer views transfer details
2. When status is "MunicipalApproved", buyer sees upload form
3. **Uploads acceptance documents** (PDF, image, etc.)
4. Document is uploaded to IPFS
5. Buyer accepts transfer with documents
6. Transfer completes and ownership transfers

## Document Storage

- **Storage Location:** IPFS (InterPlanetary File System)
- **What's on Blockchain:** Only hash (fingerprint) of documents
- **Benefits:** 
  - Cost-effective (avoiding expensive on-chain storage)
  - Decentralized storage
  - Immutable verification
  - Can view documents via IPFS gateway

## Document Access

Both seller and buyer documents are accessible via:
- IPFS gateway: `https://ipfs.io/ipfs/[HASH]`
- Displayed in transfer details page
- Links provided for easy access

## Workflow Summary

```
1. Seller initiates transfer → Uploads seller documents ✅
2. Broker verifies
3. Registrar verifies  
4. Municipal approves
5. Buyer accepts → Uploads buyer documents ✅
6. Transfer completes
```

Both parties' documents are permanently stored and linked to the transfer record!

