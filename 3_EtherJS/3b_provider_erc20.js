
// Loading path module for operations with file paths.
const path = require('path');

// Ethers JS: Providers.
////////////////////////

// A Provider is a read-only connection to the blockchain, which allows
// querying the blockchain state, such as accout, block or transaction
// details, querying event logs or evaluating read-only code using call.

// See: https://docs.ethers.org/v6/getting-started/

// Exercise 0. Require the `dotenv` and `ethers` package.
/////////////////////////////////////////////////////////

// Hint: As you did in file 2_wallet.

// Require packages.

pathToDotEnv = path.join(__dirname,'..','.env'); // 指定 .env 檔案的路徑

require("dotenv").config({ path: pathToDotEnv }); // 1.require("dotenv") → 引入 dotenv 套件 2..config() → dotenv 的初始化方法，負責將 .env 檔案中的變數載入到 process.env 3.{ path: pathToDotEnv } → 指定 .env 檔案的位置

// console.log(pathToDotEnv); // 確認 pathToDotEnv 是否正確
// console.log("🔍 ALCHEMY_KEY:", process.env.ALCHEMY_KEY); // 驗證 .env 變數是否成功加載
// console.log("🔍 ALCHEMY_SEPOLIA_API_URL:", process.env.ALCHEMY_SEPOLIA_API_URL); // 驗證 .env 變數是否成功加載

const ethers = require("ethers"); // 在 Node.js 環境中引入 Ethers.js 函式庫的標準寫法

const providerKey = process.env.ALCHEMY_KEY; // process.env 是 Node.js 的內建全域 (global) 物件 — process 的屬性之一

const sepoliaUrl = `${process.env.ALCHEMY_SEPOLIA_API_URL}${providerKey}`; //JavaScript模板字串：1.使用 反引號 (``) 而非普通引號 (' 或 ") 2.${} 用來將變數或運算結果嵌入到字串中
// console.log(sepoliaUrl);
const sepoliaProvider = new ethers.JsonRpcProvider(sepoliaUrl);

// Exercise 1. Bonus. Get ERC20 Balance.
////////////////////////////////////////

// To get the balance of ERC20 tokens the procedure is a bit more complex.
// ETH is the native currency of Ethereum, so it's "simply there". Instead,
// ERC20 tokens are added to Ethereum via smart contracts. So, we need to 
// interact with the smart contract of the specific token we want to know
// the balance of.

// We need to know the address of the smart contract. We can use the 
// LINK contract. What is it? 
// Hint: First, get some LINK ERC20 tokens:
// https://faucets.chain.link/sepolia
// Then check the transaction: with which contract did it interact?

const linkAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789"; // https://sepolia.etherscan.io/tx/0xfbb47910022ab41a746030b02903515dab858e5d84581690ef07fe1db4a040cb

// At the address, there is only bytecode. So we need to tell Ethers JS, what
// methods can be invoked. To do so, we pass the Application Binary Interface
// (ABI) of the contract, available at Etherscan. For your convenience, 
// the LINK ABI is stored in this directory, under "link_abi.json";

const linkABI = require('./link_abi.json');

// Now your task. Get the balance for LINK for "unima.eth" and "vitalik.eth".
// Hint: you need first to create a Contract object via `ethers.Contract`, 
// then invoke the appropriate smart contract method.
// Hint2: want to try it with your own address? Get some LINK ERC20 tokens: 
// https://faucets.chain.link/sepolia

// const link = async () => {
   
//     // Your code here!
// };

const link = async () => {
    try {
        // 創建 LINK 合約實例
        const linkContract = new ethers.Contract(linkAddress, linkABI, sepoliaProvider);

        // 查詢 ENS 名稱轉換成以太坊地址
        const unimaAddress = await sepoliaProvider.resolveName("unima.eth");
        const vitalikAddress = await sepoliaProvider.resolveName("vitalik.eth");

        // 檢查 ENS 是否成功解析
        if (!unimaAddress || !vitalikAddress) {
            console.error("ENS 名稱解析失敗，請確認 ENS 名稱是否正確。");
            return;
        }

        // 查詢 LINK 餘額
        const unimaBalance = await linkContract.balanceOf(unimaAddress);
        const vitalikBalance = await linkContract.balanceOf(vitalikAddress);

        // 格式化並輸出結果
        console.log(`LINK 餘額 (unima.eth): ${ethers.formatUnits(unimaBalance, 18)} LINK`);
        console.log(`LINK 餘額 (vitalik.eth): ${ethers.formatUnits(vitalikBalance, 18)} LINK`);
        
    } catch (error) {
        console.error("❗ 錯誤: ", error);
    }
};

// 執行函數
link();

