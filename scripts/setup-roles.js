const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Setting up roles for PropertyRegistry...");

  // Load deployment info
  const deploymentInfo = JSON.parse(fs.readFileSync("./deployment.json", "utf8"));
  const contractAddress = deploymentInfo.address;

  const PropertyRegistry = await hre.ethers.getContractFactory("PropertyRegistry");
  const contract = await PropertyRegistry.attach(contractAddress);

  // Get signers
  const accounts = await hre.ethers.getSigners();
  console.log(`Found ${accounts.length} accounts`);

  // Role enum: None=0, Seller=1, Buyer=2, Registrar=3, Municipal=4, Broker=5
  const roles = {
    Seller: 1,
    Buyer: 2,
    Registrar: 3,
    Municipal: 4,
    Broker: 5
  };

  console.log("\nAssigning roles...\n");

  // Assign roles to different accounts
  try {
    // Account 0 - Admin (deployer, can also be Seller)
    await contract.assignRole(accounts[0].address, roles.Seller);
    console.log(`✓ Account 0 (${accounts[0].address}): Seller`);

    // Account 1 - Buyer
    await contract.assignRole(accounts[1].address, roles.Buyer);
    console.log(`✓ Account 1 (${accounts[1].address}): Buyer`);

    // Account 2 - Registrar
    await contract.assignRole(accounts[2].address, roles.Registrar);
    console.log(`✓ Account 2 (${accounts[2].address}): Registrar`);

    // Account 3 - Municipal
    await contract.assignRole(accounts[3].address, roles.Municipal);
    console.log(`✓ Account 3 (${accounts[3].address}): Municipal`);

    // Account 4 - Broker
    await contract.assignRole(accounts[4].address, roles.Broker);
    console.log(`✓ Account 4 (${accounts[4].address}): Broker`);

    console.log("\n✓ All roles assigned successfully!");
    console.log("\nYou can now use these accounts in MetaMask:");
    console.log("1. Import private keys from Hardhat node output");
    console.log("2. Connect to localhost:8545 network");
    console.log("3. Each account has its assigned role\n");
  } catch (error) {
    console.error("Error assigning roles:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

