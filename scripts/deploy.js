const hre = require("hardhat");

async function main() {
  console.log("Deploying PropertyRegistry contract...");

  const PropertyRegistry = await hre.ethers.getContractFactory("PropertyRegistry");
  const propertyRegistry = await PropertyRegistry.deploy();

  await propertyRegistry.waitForDeployment();

  const address = await propertyRegistry.getAddress();
  console.log("PropertyRegistry deployed to:", address);
  console.log("Admin address:", await propertyRegistry.admin());
  
  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    address: address,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  };
  
  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

