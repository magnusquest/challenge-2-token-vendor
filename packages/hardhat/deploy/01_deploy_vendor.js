// deploy/01_deploy_vendor.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // You might need the previously deployed yourToken:
  const yourToken = await ethers.getContract("YourToken", deployer);

   await deploy("Vendor", {
     from: deployer,
     args: [yourToken.address], // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
     log: true,
   });
  
   const vendor = await ethers.getContract("Vendor", deployer);

   console.log("\n ๐ต  Sending all 1000 tokens to the vendor...\n");
  
   const transferTransaction = await yourToken.transfer(
     vendor.address,
     ethers.utils.parseEther("1000")
   );

  console.log("\n    โ confirming...\n");
  await sleep(5000); // wait 5 seconds for transaction to propagate

   console.log("\n ๐คน  Sending ownership to frontend address...\n")
   const ownershipTransaction = await vendor.transferOwnership("0xa7B72C25D803E5C59aB2Ebc51fc94054809C054F");
   console.log("\n    โ confirming...\n");
   const ownershipResult = await ownershipTransaction.wait();

  // ToDo: Verify your contract with Etherscan for public chains
  // if (chainId !== "31337") {
  //   try {
  //     console.log(" ๐ซ Verifing Contract on Etherscan... ");
  //     await sleep(5000); // wait 5 seconds for deployment to propagate
  //     await run("verify:verify", {
  //       address: vendor.address,
  //       contract: "contracts/Vendor.sol:Vendor",
  //       contractArguments: [yourToken.address],
  //     });
  //   } catch (e) {
  //     console.log(" โ ๏ธ Failed to verify contract on Etherscan ");
  //   }
  // }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports.tags = ["Vendor"];
