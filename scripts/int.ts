import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");


async function main() {


    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const WETHaddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const amountIn = ethers.utils.parseUnits("500", "18");
    const amountOut = ethers.utils.parseUnits("500", "18");

    const holder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";
    await helpers.impersonateAccount(holder);
    const impersonatedSigner = await ethers.getSigner(holder);


      const DAI = await ethers.getContractAt("IERC20", DAIAddress, impersonatedSigner);
      const ROUTER = await ethers.getContractAt(
        "IUniswap",
        UNIRouter,
        impersonatedSigner
      );


      console.log("-------------------------------- TOKEN for ether");
      

      await DAI.approve(UNIRouter, amountIn);

      const allowance = await DAI.allowance(holder, UNIRouter)
      console.log("Allowance", allowance);

        //   bal
        const provider = ethers.provider;
        const etherBalanceBS = await provider.getBalance(holder);
        
      const daiBal = await DAI.balanceOf(holder);
      console.log("DAI before swap", daiBal);
      console.log("ETHER balance after swap", etherBalanceBS);
      
    

      await ROUTER.swapExactTokensForETH(
        amountIn, 
        ethers.utils.parseUnits("0", "18"), 
        [DAIAddress, WETHaddress],
        holder,
        Math.floor(Date.now() /1000) + (60 * 10)
      );
    
      
      const daiBalAfter = await DAI.balanceOf(holder);
      const etherBalance = await provider.getBalance(holder);      
  
      console.log("DAI after swap", daiBalAfter);
      console.log("ETHER balance after swap", etherBalance);


      console.log("------------------------------------------------- ETHER to token");
    
      // Balance before
      const etherBalanceBS2 = await provider.getBalance(holder);
      const daiBal1 = await DAI.balanceOf(holder);
      console.log("DAI before swap", daiBal1);
      console.log("ETHER balance after swap", etherBalanceBS2);

      await ROUTER.swapETHForExactTokens(
        amountOut, 
        [WETHaddress, DAIAddress],
        holder,
        Math.floor(Date.now() /1000) + (60 * 10), { value: amountIn}
      );      

      const daiBalAfter2 = await DAI.balanceOf(holder);
      const etherBalance2 = await provider.getBalance(holder);      
  
      console.log("DAI after swap", daiBalAfter2);
      console.log("ETHER balance after swap", etherBalance2);      
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });