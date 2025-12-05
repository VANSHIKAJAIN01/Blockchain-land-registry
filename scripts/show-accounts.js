const hre = require("hardhat");
const { ethers } = require("ethers");

/**
 * Show all Hardhat accounts with their addresses and balances
 * 
 * Usage:
 * npm run show-accounts
 * 
 * Note: To see private keys, run 'npm run node' - it shows all accounts automatically
 */
async function main() {
  console.log("\n📋 Hardhat Accounts");
  console.log("==================\n");
  
  // Standard Hardhat deterministic accounts
  // These are the default accounts Hardhat creates
  const standardAccounts = [
    { index: 0, role: "Seller", address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" },
    { index: 1, role: "Buyer", address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" },
    { index: 2, role: "Registrar", address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a" },
    { index: 3, role: "Municipal", address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", privateKey: "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6" },
    { index: 4, role: "Broker", address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", privateKey: "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f873d9e259c9c0f8439cd" }
  ];
  
  console.log("Standard Hardhat Accounts (First 5):\n");
  
  try {
    // Try to connect to the network to get balances
    const provider = hre.ethers.provider;
    
    for (const acc of standardAccounts) {
      try {
        const balance = await provider.getBalance(acc.address);
        console.log(`Account #${acc.index} (${acc.role})`);
        console.log(`  Address: ${acc.address}`);
        console.log(`  Balance: ${hre.ethers.formatEther(balance)} ETH`);
        console.log(`  Private Key: ${acc.privateKey}`);
        console.log("");
      } catch (e) {
        // If network not available, just show address
        console.log(`Account #${acc.index} (${acc.role})`);
        console.log(`  Address: ${acc.address}`);
        console.log(`  Private Key: ${acc.privateKey}`);
        console.log(`  Balance: (Connect to network to see balance)`);
        console.log("");
      }
    }
    
    console.log("💡 Tip: When you run 'npm run node', Hardhat automatically shows");
    console.log("   all 20 accounts with their private keys and balances.\n");
    console.log("   To see accounts, just run: npm run node\n");
    
  } catch (error) {
    console.log("⚠️  Could not connect to network. Showing account info only:\n");
    
    for (const acc of standardAccounts) {
      console.log(`Account #${acc.index} (${acc.role})`);
      console.log(`  Address: ${acc.address}`);
      console.log(`  Private Key: ${acc.privateKey}`);
      console.log("");
    }
    
    console.log("💡 To see balances, make sure Hardhat node is running:");
    console.log("   npm run node\n");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

