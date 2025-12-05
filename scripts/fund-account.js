const hre = require("hardhat");

/**
 * Fund a MetaMask account with ETH from Hardhat Account #0
 * 
 * Usage:
 * RECIPIENT=0xYourAddress AMOUNT=100 npm run fund-account
 * 
 * Or:
 * RECIPIENT=0xYourAddress npm run fund-account (defaults to 100 ETH)
 * 
 * Example:
 * RECIPIENT=0x70997970c51812dc3a010c7d01b50e0d17dc79c8 AMOUNT=100 npm run fund-account
 */
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  // Get recipient address from environment variable
  const recipientAddress = process.env.RECIPIENT;
  const amountETH = process.env.AMOUNT || "100"; // Default 100 ETH
  
  if (!recipientAddress) {
    console.error("\n❌ Error: Please provide a recipient address");
    console.log("\nUsage:");
    console.log("  RECIPIENT=0xYourAddress AMOUNT=100 npm run fund-account");
    console.log("\nExample:");
    console.log("  RECIPIENT=0x70997970c51812dc3a010c7d01b50e0d17dc79c8 AMOUNT=100 npm run fund-account");
    console.log("\nTo get your MetaMask address:");
    console.log("  1. Open MetaMask");
    console.log("  2. Click on your account name");
    console.log("  3. Click 'Copy address'");
    process.exit(1);
  }
  
  // Validate address
  if (!hre.ethers.isAddress(recipientAddress)) {
    console.error(`\n❌ Error: Invalid Ethereum address: ${recipientAddress}`);
    console.log("Address must start with '0x' and be 42 characters long");
    process.exit(1);
  }
  
  const amount = hre.ethers.parseEther(amountETH);
  const deployerBalance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log("\n💰 Funding Account");
  console.log("==================");
  console.log(`From: ${deployer.address} (Account #0)`);
  console.log(`Balance: ${hre.ethers.formatEther(deployerBalance)} ETH`);
  console.log(`To: ${recipientAddress}`);
  console.log(`Amount: ${amountETH} ETH`);
  console.log("\nSending transaction...");
  
  try {
    // Send ETH
    const tx = await deployer.sendTransaction({
      to: recipientAddress,
      value: amount
    });
    
    console.log(`\n⏳ Transaction Hash: ${tx.hash}`);
    console.log("Waiting for confirmation...");
    
    const receipt = await tx.wait();
    
    console.log("\n✅ Success! Transaction confirmed!");
    console.log(`   Block Number: ${receipt.blockNumber}`);
    console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);
    
    // Check new balance
    const newBalance = await hre.ethers.provider.getBalance(recipientAddress);
    console.log(`\n💰 New Balance: ${hre.ethers.formatEther(newBalance)} ETH`);
    console.log("\n✅ Your MetaMask wallet should now show the ETH balance!");
    console.log("   (Refresh MetaMask if needed)");
    
  } catch (error) {
    console.error("\n❌ Error funding account:", error.message);
    if (error.message.includes("insufficient funds")) {
      console.log("\n💡 Tip: Make sure Hardhat node is running and Account #0 has ETH");
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

