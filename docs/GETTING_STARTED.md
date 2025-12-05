# Getting Started Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- IPFS node (optional, can use Infura/Pinata)

## Installation Steps

### 1. Install Root Dependencies

```bash
npm install
```

This installs Hardhat and other blockchain development tools.

### 2. Install Backend Dependencies

```bash
cd backend
npm install
cp env.example .env
```

Edit `.env` file with your configuration:
- Set `PRIVATE_KEY` to your Ethereum wallet private key
- Configure IPFS settings (use Infura for production)

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Start IPFS (if using local node)

```bash
# Install IPFS globally
npm install -g ipfs

# Initialize and start IPFS daemon
ipfs init
ipfs daemon
```

Or use Infura/Pinata IPFS service (recommended for production).

## Running the Application

### Step 1: Start Local Blockchain

In the root directory:
```bash
npx hardhat node
```

This starts a local Ethereum network on `http://localhost:8545`

### Step 2: Deploy Smart Contracts

In a new terminal, from the root directory:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

This will:
- Deploy the PropertyRegistry contract
- Save the contract address to `deployment.json`

### Step 3: Configure Roles (Important!)

After deployment, you need to assign roles to addresses. Use Hardhat console:

```bash
npx hardhat console --network localhost
```

Then in the console:
```javascript
const PropertyRegistry = await ethers.getContractFactory("PropertyRegistry");
const contract = await PropertyRegistry.attach("CONTRACT_ADDRESS_FROM_DEPLOYMENT_JSON");

// Get accounts
const accounts = await ethers.getSigners();

// Assign roles (role IDs: 1=Seller, 2=Buyer, 3=Registrar, 4=Municipal, 5=Broker)
await contract.assignRole(accounts[0].address, 1); // Seller
await contract.assignRole(accounts[1].address, 2); // Buyer
await contract.assignRole(accounts[2].address, 3); // Registrar
await contract.assignRole(accounts[3].address, 4); // Municipal
await contract.assignRole(accounts[4].address, 5); // Broker
```

**Note:** The deployer account (accounts[0]) is automatically the admin.

### Step 4: Start Backend Server

```bash
cd backend
npm start
```

Backend runs on `http://localhost:3001`

### Step 5: Start Frontend

```bash
cd frontend
npm start
```

Frontend runs on `http://localhost:3000`

## Using MetaMask

1. Install MetaMask browser extension
2. Import one of the Hardhat accounts:
   - Go to MetaMask Settings > Networks > Add Network
   - Network Name: Hardhat Local
   - RPC URL: http://localhost:8545
   - Chain ID: 1337
   - Currency Symbol: ETH
3. Import private key from Hardhat (accounts are shown when you start `hardhat node`)

## Workflow Example

1. **Register Property** (as Registrar):
   - Connect wallet with Registrar role
   - Go to "Register Property" tab
   - Fill form and upload property documents
   - Submit transaction

2. **Initiate Transfer** (as Seller/Property Owner):
   - Connect wallet as property owner
   - Go to "Transfers" tab
   - Enter property ID, buyer address, price
   - Upload transfer documents
   - Submit transaction

3. **Broker Verification** (as Broker):
   - Connect wallet as Broker
   - Verify the transfer request

4. **Registrar Verification** (as Registrar):
   - Connect wallet as Registrar
   - Verify documents and ownership

5. **Municipal Approval** (as Municipal):
   - Connect wallet as Municipal
   - Approve the transfer

6. **Buyer Acceptance** (as Buyer):
   - Connect wallet as Buyer
   - Accept the transfer
   - Ownership automatically transfers!

## Troubleshooting

### Contract not found
- Make sure you've deployed the contract
- Check `deployment.json` has the correct address
- Verify backend can connect to the blockchain

### IPFS upload fails
- Check IPFS daemon is running (if using local)
- Or configure Infura/Pinata credentials in `.env`

### Transaction fails
- Check account has enough ETH (use Hardhat faucet)
- Verify account has correct role
- Check contract is deployed correctly

### Frontend can't connect
- Make sure backend is running on port 3001
- Check CORS settings in backend
- Verify API_URL in frontend matches backend URL

## Production Deployment

For production:
1. Deploy to a testnet (Goerli, Sepolia) or mainnet
2. Use Infura/Alchemy for IPFS and Ethereum RPC
3. Update environment variables
4. Build frontend: `npm run build`
5. Deploy frontend to hosting (Vercel, Netlify, etc.)

## Security Notes

- Never commit `.env` files with real private keys
- Use environment variables for sensitive data
- Test thoroughly on testnets before mainnet
- Consider using OpenZeppelin's security best practices

