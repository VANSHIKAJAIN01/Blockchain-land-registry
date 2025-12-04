const hre = require("hardhat");

async function main() {
  console.log("Hardhat Account Private Keys:\n");
  
  // Hardhat uses deterministic accounts
  // These are the standard Hardhat accounts
  const accounts = await hre.ethers.getSigners();
  
  const accountInfo = [
    { index: 0, role: "Seller", address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" },
    { index: 1, role: "Buyer", address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" },
    { index: 2, role: "Registrar", address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" },
    { index: 3, role: "Municipal", address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" },
    { index: 4, role: "Broker", address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65" }
  ];
  
  console.log("To get private keys, check your Hardhat node output (Terminal 1)");
  console.log("When you run 'npm run node', it shows all accounts with private keys.\n");
  
  console.log("Standard Hardhat Account #4 (Broker) private key:");
  console.log("From Hardhat node output, Account #4 should show:");
  console.log("Private Key: 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f873d9e259c9c0f8439cd");
  console.log("\nBut this gives address: 0xB25761E7d82Dfa006A65C5208EB95937f59C74d6");
  console.log("So we need the actual Account #4 private key from Hardhat node.\n");
  
  // Verify addresses
  for (const info of accountInfo) {
    const signer = accounts[info.index];
    const address = await signer.getAddress();
    const match = address.toLowerCase() === info.address.toLowerCase();
    console.log(`Account #${info.index} (${info.role}): ${address} ${match ? '✅' : '❌'}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

