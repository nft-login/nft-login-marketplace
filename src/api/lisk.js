// source: https://github.com/LiskHQ/lisk-sdk-examples/blob/development/tutorials/nft/frontend_app/src/api/index.js

import { cryptography } from "@liskhq/lisk-client";

function getContract() {
  const search = window.location.search;
  const contract = new URLSearchParams(search).get("contract");
  console.log(contract);
  return contract;
}

function getAccount() {
  const search = window.location.search;
  const account = new URLSearchParams(search).get("account");
  console.log(account);
  return account;
}

export class Lisk {
  constructor() {
    this.contract = undefined;
    this.url = "http://localhost:8080/";
    this.nodeInfo = undefined;
  }

  init = async () => {
    this.nodeInfo = await this.fetchNodeInfo();
  };

  fetchNodeInfo = async () => {
    return fetch(`${this.url}api/node/info`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        return res.data;
      });
  };

  fetchAccountInfo = async (address) => {
    console.log(address);
    const base32UIAddress = cryptography
      .getAddressFromBase32Address(address)
      .toString("hex");
    return fetch(`${this.url}api/accounts/${base32UIAddress}`)
      .then((res) => res.json())
      .then((res) => res.data);
  };

  fetchAllNFTTokens = async () => {
    return fetch(`${this.url}api/nft_tokens`)
      .then((res) => res.json())
      .then((res) => res.data);
  };

  fetchNFTToken = async (id) => {
    return fetch(`${this.url}api/nft_tokens/${id}`)
      .then((res) => res.json())
      .then((res) => res.data);
  };

  contractAddress = async () => {
    const contractAddress = getContract() || "http://localhost:8080/";
    return contractAddress;
  };

  loadContract = async (contractAddress) => {
    this.url = contractAddress;
  };

  getAccounts = async () => {
    const account = getAccount() || "lsk9muuyf5u5673bpfonq83zmvkp55o48bpspgpkw";
    return [account];
  };

  getBalance = async (account) => {
    return (await this.fetchAccountInfo(account))["token"]["balance"];
  };

  networkId = async () => {
    return this.nodeInfo["networkIdentifier"];
  };

  loadTokenByIndex = async (index) => {
    return (await this.fetchAllNFTTokens())[index];
  };

  loadToken = async (tokenId) => {
    let token = await this.loadTokenByIndex(tokenId);
    let owner = cryptography.getBase32AddressFromAddress(
      Buffer.from(token["ownerAddress"], "hex")
    );
    console.log(token);
    token = {
      tokenId: token["id"],
      uri: await this.tokenURI(tokenId),
      price: token["value"],
      currentOwner: owner,
      forSale: true,
    };
    console.log(token);
    return token;
  };

  deployNew = async (name, symbol, tokenURI, price, account) => {
    return true;
  };

  mint = async (tokenCount, account) => {
    return true;
  };

  toggleForSale = async (tokenId, account) => {};

  changeTokenPrice = async (tokenId, newPrice, account) => {};

  buyToken = async (tokenId, price, account) => {};

  tokenCount = async () => {
    return (await this.fetchAllNFTTokens()).length;
  };

  totalSupply = async () => {
    return this.tokenCount();
  };

  balanceOf = async (account) => {
    return (await this.fetchAccountInfo(account))["token"]["balance"];
  };

  name = async () => {
    return this.nodeInfo["genesisConfig"]["communityIdentifier"];
  };

  symbol = async () => {
    return this.name();
  };

  baseURI = async () => {
    return "https://bafybeidg3ngosh2kwkppj2emdugna5bvanib7gijutju7q7dorefllf7qa.ipfs.infura-ipfs.io/?token=";
  };

  ownerOf = async (tokenId) => {
    let owner = (await this.loadTokenByIndex(tokenId))["ownerAddress"];
    owner = cryptography.getBase32AddressFromAddress(Buffer.from(owner, "hex"));
    return owner;
  };

  tokenURI = async (tokenId) => {
    return `${await this.baseURI()}${tokenId}`;
  };
}
