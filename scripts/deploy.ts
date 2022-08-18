import { ethers } from "hardhat";

async function main() {
  const KoloVast = await ethers.getContractFactory("KoloVest");
  const koloVast = await KoloVast.deploy();

  await koloVast.deployed();
  console.log(`Address ${koloVast.address}`);

  // interactting with the contract

  let res = await koloVast.makeVest(60, {value: ethers.utils.parseEther("0.001")});
  let rest = await res.wait();

  console.log(rest);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
