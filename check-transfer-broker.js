const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const deploymentInfo = JSON.parse(fs.readFileSync("./deployment.json", "utf8"));
  const contractAddress = deploymentInfo.address;

  const PropertyRegistry = await hre.ethers.getContractFactory("PropertyRegistry");
  const contract = await PropertyRegistry.attach(contractAddress);

  const transferId = 3; // The transfer ID from error
  
  try {
    const transfer = await contract.getTransferRequest(transferId);
    
    console.log("\n=== Transfer #" + transferId + " Details ===");
    console.log("Transfer ID:", transfer.transferId.toString());
    console.log("Property ID:", transfer.propertyId.toString());
    console.log("Seller:", transfer.seller);
    console.log("Buyer:", transfer.buyer);
    console.log("Broker:", transfer.broker);
    console.log("Status:", transfer.status);
    console.log("Broker Verified:", transfer.brokerVerified);
    
    console.log("\n=== Broker Assignment ===");
    if (transfer.broker === "0x0000000000000000000000000000000000000000") {
      console.log("❌ No broker assigned to this transfer!");
      console.log("The transfer was initiated without a broker.");
    } else {
      console.log("✅ Broker assigned:", transfer.broker);
      console.log("Backend is using:", "0xB25761E7d82Dfa006A65C5208EB95937f59C74d6");
      
      if (transfer.broker.toLowerCase() !== "0xB25761E7d82Dfa006A65C5208EB95937f59C74d6".toLowerCase()) {
        console.log("\n❌ MISMATCH!");
        console.log("Transfer broker:", transfer.broker);
        console.log("Backend broker:", "0xB25761E7d82Dfa006A65C5208EB95937f59C74d6");
        console.log("\nSolution: Update backend .env to use the broker assigned to this transfer.");
      } else {
        console.log("\n✅ Broker matches!");
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

