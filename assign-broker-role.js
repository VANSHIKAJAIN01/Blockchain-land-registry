const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Assigning Broker role to account...");

  // Load deployment info
  const deploymentInfo = JSON.parse(fs.readFileSync("./deployment.json", "utf8"));
  const contractAddress = deploymentInfo.address;

  const PropertyRegistry = await hre.ethers.getContractFactory("PropertyRegistry");
  const contract = await PropertyRegistry.attach(contractAddress);

  // Get signers
  const accounts = await hre.ethers.getSigners();
  
  // The account that needs Broker role (from the error)
  const brokerAddress = "0xB25761E7d82Dfa006A65C5208EB95937f59C74d6";
  
  // Use admin account (Account #0) to assign role
  const admin = accounts[0];
  const contractWithAdmin = contract.connect(admin);
  
  // Role enum: Broker = 5
  const BrokerRole = 5;
  
  try {
    console.log(`Assigning Broker role to ${brokerAddress}...`);
    const tx = await contractWithAdmin.assignRole(brokerAddress, BrokerRole);
    await tx.wait();
    console.log(`✅ Broker role assigned successfully!`);
    console.log(`Account ${brokerAddress} now has Broker role.`);
  } catch (error) {
    console.error("Error assigning role:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

