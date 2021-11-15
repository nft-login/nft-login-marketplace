// source: https://github.com/LiskHQ/lisk-sdk-examples/blob/development/tutorials/nft/frontend_app/src/api/index.js

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
    this.url1 = "http://localhost:4000/";
    this.url2 = "http://localhost:8080/";
    this.nodeInfo = undefined;
  }

  init = async () => {
    this.nodeInfo = await this.fetchNodeInfo();
  };

  fetchNodeInfo = async () => {
    return fetch(`${this.url1}api/node/info`)
      .then((res) => res.json())
      .then((res) => res.data);
  };

  fetchAccountInfo = async (address) => {
    return fetch(`${this.url1}api/accounts/${address}`)
      .then((res) => res.json())
      .then((res) => res.data);
  };

  fetchAllNFTTokens = async () => {
    return fetch(`${this.url2}api/nft_tokens`)
      .then((res) => res.json())
      .then((res) => res.data);
  };

  fetchNFTToken = async (id) => {
    return fetch(`${this.url2}api/nft_tokens/${id}`)
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
    const account = getAccount() || "696108f9705a9c8313cc3d5e80145422d6c4bcc4";
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
  }

  loadToken = async (tokenId) => {
    let token = await this.loadTokenByIndex(tokenId);
    console.log(token);
    token = {
      tokenId: token['id'],
      uri: (await this.tokenURI(tokenId)),
      price: token["value"],
      currentOwner: token["ownerAddress"],
      forSale: true
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
    return (await this.loadTokenByIndex(tokenId))["ownerAddress"];
  };

  tokenURI = async (tokenId) => {
    return `${await this.baseURI()}${tokenId}`;
  };
}
