require("babel-register");
require("babel-polyfill");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const MNEMONIC = process.env.MNEMONIC;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(
          MNEMONIC,
          `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
        );
      },
      network_id: 42,
    },
    okt: {
      provider: () =>
        new HDWalletProvider(MNEMONIC, `wss://exchaintestws.okex.org:8443`),
      network_id: 65,
      confirmations: 5,
      timeoutBlocks: 2000,
    },
    heco: {
      provider: () =>
        new HDWalletProvider(MNEMONIC, `wss://ws-testnet.hecochain.com`),
      network_id: 256,
      confirmations: 5,
      timeoutBlocks: 200,
    },
    clover: {
      provider: () =>
        new HDWalletProvider(MNEMONIC, `https://rpc.clover.finance`),
      network_id: 1023,
      confirmations: 2,
      timeoutBlocks: 200,
    },
    celo: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `https://alfajores-forno.celo-testnet.org`
        ),
      network_id: 44787,
      confirmations: 5,
      timeoutBlocks: 200,
    },
    polygon: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `https://matic-mumbai.chainstacklabs.com/`
        ),
      network_id: 80001,
    },
    metis: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `https://stardust.metis.io/?owner=588`
        ),
      network_id: 588,
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      version: "pragma",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
