const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { ethers } = require('ethers');
const PropertyRegistryABI = require('../artifacts/contracts/PropertyRegistry.sol/PropertyRegistry.json');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// IPFS client - using dynamic import for ESM compatibility
let ipfs;
let useIPFS = false; // Set to true when IPFS is available

async function initializeIPFS() {
  try {
    // Option 1: Try local IPFS first
    const { create } = await import('ipfs-http-client');
    
    // Try connecting to local IPFS
    try {
      ipfs = create({
        host: process.env.IPFS_HOST || 'localhost',
        port: process.env.IPFS_PORT || 5001,
        protocol: process.env.IPFS_PROTOCOL || 'http'
      });
      
      // Test connection
      await ipfs.version();
      useIPFS = true;
      console.log('✅ IPFS initialized (local)');
      return;
    } catch (localError) {
      console.log('⚠️  Local IPFS not available. Using fallback mode.');
    }
    
    // Option 2: Try Infura IPFS (if configured)
    if (process.env.IPFS_INFURA_PROJECT_ID && process.env.IPFS_INFURA_PROJECT_SECRET) {
      try {
        ipfs = create({
          host: 'ipfs.infura.io',
          port: 5001,
          protocol: 'https',
          headers: {
            authorization: 'Basic ' + Buffer.from(
              process.env.IPFS_INFURA_PROJECT_ID + ':' + process.env.IPFS_INFURA_PROJECT_SECRET
            ).toString('base64')
          }
        });
        await ipfs.version();
        useIPFS = true;
        console.log('✅ IPFS initialized (Infura)');
        return;
      } catch (infuraError) {
        console.log('⚠️  Infura IPFS not available.');
      }
    }
    
    // Fallback: Use mock IPFS (for testing without IPFS)
    console.log('⚠️  IPFS not available. Using mock mode for testing.');
    console.log('   Documents will be stored with mock hashes.');
    console.log('   To enable IPFS: Start local IPFS daemon or configure Infura.');
    useIPFS = false;
    
  } catch (error) {
    console.error('IPFS initialization error:', error.message);
    console.log('⚠️  IPFS not available. Using mock mode for testing.');
    useIPFS = false;
  }
}

// Initialize IPFS on startup
initializeIPFS();

// File upload configuration
const upload = multer({ storage: multer.memoryStorage() });

// Ethereum provider configuration
let provider;
let contract;
let contractAddress;
let roleSigners = {}; // Store signers for each role
let defaultSigner; // Default signer (Seller)

// Initialize contract connection with multi-role support
async function initializeContract() {
  try {
    // Use local Hardhat network or configured network
    const networkUrl = process.env.NETWORK_URL || 'http://localhost:8545';
    provider = new ethers.JsonRpcProvider(networkUrl);
    
    // Disable ENS resolution for local networks
    provider.getResolver = async () => null;
    
    // Load contract address from deployment.json (in root directory)
    const fs = require('fs');
    const path = require('path');
    const deploymentPath = path.join(__dirname, '..', 'deployment.json');
    
    if (!fs.existsSync(deploymentPath)) {
      console.error('deployment.json not found at:', deploymentPath);
      console.log('Please deploy contracts first using: npm run deploy');
      return;
    }
    
    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    contractAddress = deploymentInfo.address;
    
    // Initialize signers for all roles
    // Default private keys (can be overridden in .env)
    const rolePrivateKeys = {
      seller: process.env.SELLER_PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      buyer: process.env.BUYER_PRIVATE_KEY || '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
      registrar: process.env.REGISTRAR_PRIVATE_KEY || '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
      municipal: process.env.MUNICIPAL_PRIVATE_KEY || '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
      broker: process.env.BROKER_PRIVATE_KEY || process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
    };
    
    // Create signers for each role
    for (const [role, privateKey] of Object.entries(rolePrivateKeys)) {
      if (ethers.isHexString(privateKey)) {
        try {
          const signer = new ethers.Wallet(privateKey, provider);
          const address = await signer.getAddress();
          roleSigners[role] = signer;
          console.log(`✓ ${role.charAt(0).toUpperCase() + role.slice(1)} signer: ${address}`);
        } catch (error) {
          console.warn(`⚠️  Could not create ${role} signer:`, error.message);
        }
      }
    }
    
    // Set default signer (Seller)
    defaultSigner = roleSigners.seller || roleSigners.broker;
    
    if (defaultSigner) {
      const defaultAddress = await defaultSigner.getAddress();
      console.log('Backend default account:', defaultAddress);
    }
    
    console.log('Contract initialized at:', contractAddress);
    console.log(`✅ Multi-role support enabled. Backend can handle all roles without restarting!`);
    
    // Create default contract instance (will be recreated with correct signer per request)
    contract = new ethers.Contract(contractAddress, PropertyRegistryABI.abi, defaultSigner);
  } catch (error) {
    console.error('Error initializing contract:', error.message);
    console.log('Make sure contracts are deployed and deployment.json exists in root directory');
  }
}

// Get contract instance with specific role signer
function getContractForRole(role) {
  const signer = roleSigners[role] || defaultSigner;
  if (!signer) {
    throw new Error(`No signer available for role: ${role}`);
  }
  return new ethers.Contract(contractAddress, PropertyRegistryABI.abi, signer);
}

// Initialize on startup
initializeContract();

// Routes

/**
 * Upload document to IPFS
 */
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // If IPFS is not available, use mock hash for testing
    if (!useIPFS || !ipfs) {
      // Generate a mock IPFS hash for testing
      const mockHash = 'Qm' + Buffer.from(req.file.buffer).toString('base64').substring(0, 42);
      console.log('⚠️  Using mock IPFS hash for testing:', mockHash);
      
      return res.json({
        success: true,
        ipfsHash: mockHash,
        url: `https://ipfs.io/ipfs/${mockHash}`,
        note: 'Mock hash - IPFS not configured. Install IPFS for real storage.'
      });
    }

    // Initialize IPFS if not already done
    if (!ipfs) {
      await initializeIPFS();
      if (!ipfs || !useIPFS) {
        // Still use mock hash
        const mockHash = 'Qm' + Buffer.from(req.file.buffer).toString('base64').substring(0, 42);
        return res.json({
          success: true,
          ipfsHash: mockHash,
          url: `https://ipfs.io/ipfs/${mockHash}`,
          note: 'Mock hash - IPFS not configured.'
        });
      }
    }

    const fileBuffer = req.file.buffer;
    const fileExtension = req.file.originalname.split('.').pop();
    
    // Add file to IPFS
    const result = await ipfs.add({
      content: fileBuffer,
      path: `property-documents/${Date.now()}.${fileExtension}`
    });

    const ipfsHash = result.cid.toString();
    
    res.json({
      success: true,
      ipfsHash: ipfsHash,
      url: `https://ipfs.io/ipfs/${ipfsHash}`
    });
  } catch (error) {
    console.error('IPFS upload error:', error);
    
    // Fallback to mock hash if IPFS fails
    const mockHash = 'Qm' + Buffer.from(req.file.buffer).toString('base64').substring(0, 42);
    console.log('⚠️  IPFS failed, using mock hash:', mockHash);
    
    res.json({
      success: true,
      ipfsHash: mockHash,
      url: `https://ipfs.io/ipfs/${mockHash}`,
      note: 'Mock hash - IPFS connection failed. Install IPFS for real storage.'
    });
  }
});

/**
 * Register a new property
 */
app.post('/api/properties/register', async (req, res) => {
  try {
    const { owner, propertyAddress, propertyType, area, ipfsHash } = req.body;

    if (!owner || !propertyAddress || !propertyType || !area || !ipfsHash) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate and normalize owner address format
    let ownerAddress;
    try {
      if (!ethers.isAddress(owner)) {
        return res.status(400).json({ error: 'Invalid owner address format. Must be a valid Ethereum address (0x...)' });
      }
      ownerAddress = ethers.getAddress(owner);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid owner address format: ' + error.message });
    }

    console.log('Registering property for owner:', ownerAddress);

    // Use Registrar signer if available (can register for anyone), otherwise use Seller
    const contractInstance = roleSigners.registrar 
      ? getContractForRole('registrar')
      : getContractForRole('seller');

    const tx = await contractInstance.registerProperty(
      ownerAddress,
      propertyAddress,
      propertyType,
      area,
      ipfsHash
    );

    const receipt = await tx.wait();
    
    res.json({
      success: true,
      transactionHash: receipt.hash,
      propertyId: receipt.logs[0]?.args?.propertyId?.toString()
    });
  } catch (error) {
    console.error('Register property error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Initiate property transfer
 */
app.post('/api/transfers/initiate', async (req, res) => {
  try {
    const { propertyId, buyer, price, broker, documentsHash } = req.body;

    if (!propertyId || !buyer || !price || !documentsHash) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate and normalize address formats (must be hex strings, not ENS)
    let buyerAddress, brokerAddress;
    
    try {
      // Check if user accidentally provided a private key (66 chars) instead of address (42 chars)
      if (buyer.length === 66 && buyer.startsWith('0x')) {
        return res.status(400).json({ 
          error: 'Invalid buyer field: You provided a private key instead of an Ethereum address. ' +
                 'Private keys are 66 characters (0x + 64 hex chars). ' +
                 'Ethereum addresses are 42 characters (0x + 40 hex chars). ' +
                 'Please use the buyer\'s Ethereum address, not their private key. ' +
                 'Example address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
        });
      }
      
      if (!ethers.isAddress(buyer)) {
        return res.status(400).json({ 
          error: 'Invalid buyer address format. Must be a valid Ethereum address (42 characters starting with 0x). ' +
                 'Example: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
        });
      }
      buyerAddress = ethers.getAddress(buyer);
      
      if (broker && broker !== ethers.ZeroAddress && broker !== '') {
        // Check if user accidentally provided a private key
        if (broker.length === 66 && broker.startsWith('0x')) {
          return res.status(400).json({ 
            error: 'Invalid broker field: You provided a private key instead of an Ethereum address. ' +
                   'Please use the broker\'s Ethereum address (42 characters) or leave empty.'
          });
        }
        
        if (!ethers.isAddress(broker)) {
          return res.status(400).json({ 
            error: 'Invalid broker address format. Must be a valid Ethereum address (42 characters starting with 0x) or leave empty'
          });
        }
        brokerAddress = ethers.getAddress(broker);
      } else {
        brokerAddress = ethers.ZeroAddress;
      }
    } catch (error) {
      return res.status(400).json({ error: 'Invalid address format: ' + error.message });
    }

    console.log('Initiating transfer - Buyer:', buyerAddress, 'Broker:', brokerAddress);

    // Check property owner and use appropriate signer
    try {
      const property = await contract.getProperty(propertyId);
      const propertyOwner = property.currentOwner;
      
      console.log('Property owner:', propertyOwner);
      
      // Use Seller signer (should own the property)
      const contractInstance = getContractForRole('seller');
      const signerAddress = await contractInstance.signer.getAddress();
      
      console.log('Backend signer:', signerAddress);
      
      if (propertyOwner.toLowerCase() !== signerAddress.toLowerCase()) {
        return res.status(400).json({ 
          error: `Property is owned by ${propertyOwner}, but backend Seller account is ${signerAddress}. ` +
                 `Property must be owned by Seller account to initiate transfer.` 
        });
      }

      const tx = await contractInstance.initiateTransfer(
        propertyId,
        buyerAddress,
        ethers.parseEther(price.toString()),
        brokerAddress,
        documentsHash
      );

      const receipt = await tx.wait();
      
      res.json({
        success: true,
        transactionHash: receipt.hash,
        transferId: receipt.logs[0]?.args?.transferId?.toString()
      });
    } catch (error) {
      console.error('Initiate transfer error:', error);
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error('Initiate transfer error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Broker verify transfer
 */
app.post('/api/transfers/:transferId/broker-verify', async (req, res) => {
  try {
    const { transferId } = req.params;

    // Use Broker signer
    const contractInstance = getContractForRole('broker');
    const tx = await contractInstance.brokerVerify(transferId);
    const receipt = await tx.wait();

    res.json({
      success: true,
      transactionHash: receipt.hash
    });
  } catch (error) {
    console.error('Broker verify error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Registrar verify transfer
 */
app.post('/api/transfers/:transferId/registrar-verify', async (req, res) => {
  try {
    const { transferId } = req.params;

    // Use Registrar signer
    const contractInstance = getContractForRole('registrar');
    const tx = await contractInstance.registrarVerify(transferId);
    const receipt = await tx.wait();

    res.json({
      success: true,
      transactionHash: receipt.hash
    });
  } catch (error) {
    console.error('Registrar verify error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Municipal approve transfer
 */
app.post('/api/transfers/:transferId/municipal-approve', async (req, res) => {
  try {
    const { transferId } = req.params;

    // Use Municipal signer
    const contractInstance = getContractForRole('municipal');
    const tx = await contractInstance.municipalApprove(transferId);
    const receipt = await tx.wait();

    res.json({
      success: true,
      transactionHash: receipt.hash
    });
  } catch (error) {
    console.error('Municipal approve error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Buyer accept transfer
 */
app.post('/api/transfers/:transferId/buyer-accept', upload.single('file'), async (req, res) => {
  try {
    const { transferId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Buyer documents file required' });
    }

    const fileBuffer = req.file.buffer;
    const fileExtension = req.file.originalname.split('.').pop();
    let buyerDocumentsHash;

    // If IPFS is not available, use mock hash
    if (!useIPFS || !ipfs) {
      await initializeIPFS();
      if (!ipfs || !useIPFS) {
        // Use mock hash for testing
        buyerDocumentsHash = 'Qm' + Buffer.from(fileBuffer).toString('base64').substring(0, 42);
        console.log('⚠️  Using mock IPFS hash for buyer documents:', buyerDocumentsHash);
      } else {
        // IPFS is now available, upload for real
        const result = await ipfs.add({
          content: fileBuffer,
          path: `buyer-documents/${Date.now()}.${fileExtension}`
        });
        buyerDocumentsHash = result.cid.toString();
      }
    } else {
      // IPFS is available, upload for real
      const result = await ipfs.add({
        content: fileBuffer,
        path: `buyer-documents/${Date.now()}.${fileExtension}`
      });
      buyerDocumentsHash = result.cid.toString();
    }

    // Use Buyer signer
    const contractInstance = getContractForRole('buyer');
    const tx = await contractInstance.buyerAccept(transferId, buyerDocumentsHash);
    const receipt = await tx.wait();

    res.json({
      success: true,
      transactionHash: receipt.hash,
      buyerDocumentsHash: buyerDocumentsHash
    });
  } catch (error) {
    console.error('Buyer accept error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Cancel transfer
 */
app.post('/api/transfers/:transferId/cancel', async (req, res) => {
  try {
    const { transferId } = req.params;

    // Use Seller signer (only seller can cancel)
    const contractInstance = getContractForRole('seller');
    const tx = await contractInstance.cancelTransfer(transferId);
    const receipt = await tx.wait();

    res.json({
      success: true,
      transactionHash: receipt.hash
    });
  } catch (error) {
    console.error('Cancel transfer error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get property details
 */
app.get('/api/properties/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const property = await contract.getProperty(propertyId);

    res.json({
      propertyId: property.propertyId.toString(),
      currentOwner: property.currentOwner,
      propertyAddress: property.propertyAddress,
      propertyType: property.propertyType,
      area: property.area.toString(),
      ipfsHash: property.ipfsHash,
      registrationDate: property.registrationDate.toString(),
      isActive: property.isActive
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get transfer request details
 */
app.get('/api/transfers/:transferId', async (req, res) => {
  try {
    const { transferId } = req.params;
    const transfer = await contract.getTransferRequest(transferId);

    const statusMap = {
      0: 'Initiated',
      1: 'BrokerVerified',
      2: 'RegistrarVerified',
      3: 'MunicipalApproved',
      4: 'BuyerAccepted',
      5: 'Completed',
      6: 'Cancelled'
    };

    res.json({
      transferId: transfer.transferId.toString(),
      propertyId: transfer.propertyId.toString(),
      seller: transfer.seller,
      buyer: transfer.buyer,
      price: ethers.formatEther(transfer.price),
      documentsHash: transfer.documentsHash,
      buyerDocumentsHash: transfer.buyerDocumentsHash,
      status: statusMap[transfer.status] || 'Unknown',
      broker: transfer.broker,
      brokerVerified: transfer.brokerVerified,
      registrarVerified: transfer.registrarVerified,
      municipalApproved: transfer.municipalApproved,
      buyerAccepted: transfer.buyerAccepted,
      createdAt: transfer.createdAt.toString(),
      completedAt: transfer.completedAt.toString()
    });
  } catch (error) {
    console.error('Get transfer error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get ownership history
 */
app.get('/api/properties/:propertyId/history', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const history = await contract.getOwnershipHistory(propertyId);

    res.json({
      owners: history.owners,
      transferIds: history.transferIds.map(id => id.toString()),
      timestamps: history.timestamps.map(ts => ts.toString()),
      ipfsHashes: history.ipfsHashes
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get user properties
 */
app.get('/api/users/:address/properties', async (req, res) => {
  try {
    const { address } = req.params;
    const propertyIds = await contract.getUserProperties(address);

    res.json({
      properties: propertyIds.map(id => id.toString())
    });
  } catch (error) {
    console.error('Get user properties error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Assign role to user
 */
app.post('/api/users/assign-role', async (req, res) => {
  try {
    const { userAddress, role } = req.body;

    if (!userAddress || role === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate and normalize address
    let normalizedAddress;
    try {
      if (!ethers.isAddress(userAddress)) {
        return res.status(400).json({ error: 'Invalid user address format. Must be a valid Ethereum address (0x...)' });
      }
      normalizedAddress = ethers.getAddress(userAddress);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid address format: ' + error.message });
    }

    const tx = await contract.assignRole(normalizedAddress, role);
    const receipt = await tx.wait();

    res.json({
      success: true,
      transactionHash: receipt.hash
    });
  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get user role
 */
app.get('/api/users/:address/role', async (req, res) => {
  try {
    const { address } = req.params;
    const role = await contract.userRoles(address);

    const roleMap = {
      0: 'None',
      1: 'Seller',
      2: 'Buyer',
      3: 'Registrar',
      4: 'Municipal',
      5: 'Broker'
    };

    res.json({
      role: roleMap[role] || 'Unknown',
      roleId: role.toString()
    });
  } catch (error) {
    console.error('Get role error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', contractAddress });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

