# Blockchain Land Registry System

A decentralized land registry system built on Ethereum blockchain that facilitates secure and transparent property deed transfers.

## Features

- **Property Registration**: Register new properties with documents
- **Deed Transfer**: Transfer property ownership with multi-party approval workflow
- **Document Management**: Upload and store property documents on IPFS
- **Role-Based Access**: Different roles (Seller, Buyer, Registrar, Municipal, Broker)
- **Chain of Ownership**: Complete history of property ownership
- **Verification Workflow**: Multi-step approval process matching real-world procedures

## Tech Stack

- **Blockchain**: Ethereum (Solidity)
- **Smart Contracts**: Solidity with Hardhat
- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Document Storage**: IPFS (InterPlanetary File System)
- **Web3**: ethers.js

## Project Structure

```
Blockchain/
├── contracts/          # Solidity smart contracts
├── backend/            # Node.js backend server
├── frontend/           # React frontend application
├── scripts/            # Deployment and utility scripts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask or similar Ethereum wallet
- IPFS node (local or use Infura/Pinata)

### Quick Start

See [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed instructions.

**Quick commands:**

1. Install dependencies:
```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

2. Start local blockchain (Hardhat):
```bash
npm run node
```

3. Deploy contracts (in new terminal):
```bash
npm run deploy
```

4. Setup roles (assign roles to test accounts):
```bash
npm run setup-roles
```

5. Start backend:
```bash
cd backend
npm start
```

6. Start frontend (in new terminal):
```bash
cd frontend
npm start
```

## User Roles

- **Seller**: Current property owner who initiates transfer
- **Buyer**: New property owner receiving the deed
- **Registrar**: Government office verifying documents and ownership
- **Municipal**: Municipal corporation approving property transfer
- **Broker**: Real estate broker facilitating the transaction

## Workflow

1. Seller initiates transfer request
2. Documents uploaded to IPFS
3. Broker verifies transaction details
4. Registrar office verifies documents and ownership
5. Municipal office approves transfer
6. Buyer accepts transfer
7. Property ownership transferred on blockchain

## License

MIT

