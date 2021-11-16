import Web3 from "web3";
import EarlyAccessGame from "../abis/EarlyAccessGame.json";

function getContract() {
  const search = window.location.search;
  const contract = new URLSearchParams(search).get("contract");
  console.log(contract);
  return contract;
}

export class Web3Blockchain {
  constructor() {
    this.loadWeb3();
    this.contract = undefined;
  }

  init = async () => {
    await this.loadWeb3();
  };

  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  contractAddress = async () => {
    const networkId = await this.networkId();
    const networkData = EarlyAccessGame.networks[networkId];
    if (!networkData) {
      return false;
    }
    const contractAddress = getContract() || networkData.address;
    return contractAddress;
  };

  loadContract = async (contractAddress) => {
    this.contract = window.web3.eth.Contract(
      EarlyAccessGame.abi,
      contractAddress
    );
    return this.contract;
  };

  getAccounts = async () => {
    return window.web3.eth.getAccounts();
  };

  getBalance = async (account) => {
    let accountBalance = await window.web3.eth.getBalance(account);
    return window.web3.utils.fromWei(accountBalance, "Ether");
  };

  networkId = async () => {
    return await window.web3.eth.net.getId();
  };

  loadToken = async (tokenId) => {
    const contract = this.contract;
    let price = await contract.methods.priceOf(tokenId).call();
    price = window.web3.utils.fromWei(price.toString(), "Ether");
    const token = {
      tokenId: tokenId,
      uri: await contract.methods.tokenURI(tokenId).call(),
      price,
      currentOwner: await contract.methods.ownerOf(tokenId).call(),
      forSale: await contract.methods.isForSale(tokenId).call(),
    };
    console.log(token);
    return token;
  };

  deployNew = async (name, symbol, tokenURI, price, account) => {
    return new Promise((resolve, reject) => {
      this.contract
        .deploy({
          data: EarlyAccessGame.bytecode,
          arguments: [
            name,
            symbol,
            tokenURI,
            window.web3.utils.toWei(price, "Ether"),
          ],
        })
        .send({ from: account })
        .on("error", function(error) {
          reject(error);
        })
        .on("confirmation", (confirmationNumber, receipt) => {
          let newContractInstance = this.contract.clone();
          newContractInstance.options.address = receipt.contractAddress;
          console.log(receipt.contractAddress);
          localStorage.setItem(account, new Date().getTime());
          var searchParams = new URLSearchParams(window.location.search);
          searchParams.set("contract", receipt.contractAddress);
          window.location.search = searchParams.toString();
          /*this.setState({
          loading: false,
          earlyAccessGameContract: newContractInstance,
        });*/
          var newRelativePathQuery =
            window.location.pathname + "?" + searchParams.toString();
          window.history.pushState(null, "", newRelativePathQuery);
          window.location.reload();
          resolve();
        });
    });
  };

  mint = async (tokenCount, account) => {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .mintMultiple(account, tokenCount)
        .send({ from: account })
        .on("confirmation", resolve)
        .catch(reject);
    });
  };

  toggleForSale = async (tokenId, account) => {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .toggleForSale(tokenId)
        .send({ from: account })
        .on("confirmation", resolve)
        .catch(reject);
    });
  };

  changeTokenPrice = async (tokenId, newPrice, account) => {
    const newTokenPrice = window.web3.utils.toWei(newPrice, "Ether");
    return new Promise((resolve, reject) => {
      this.contract.methods
        .setPrice(tokenId, newTokenPrice)
        .send({ from: account })
        .on("confirmation", resolve)
        .catch(reject);
    });
  };

  buyToken = async (tokenId, price, account) => {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .buy(tokenId)
        .send({ from: account, value: window.web3.utils.toWei(price, "Ether") })
        .on("confirmation", resolve)
        .catch(reject);
    });
  };

  tokenCount = async () => {
    return await this.contract.methods.totalSupply().call();
  };

  totalSupply = async () => {
    const totalTokensMinted = await this.contract.methods.totalSupply().call();
    return totalTokensMinted.toNumber();
  };

  balanceOf = async (account) => {
    let totalTokensOwnedByAccount = await this.contract.methods
      .balanceOf(account)
      .call();
    return totalTokensOwnedByAccount.toNumber();
  };

  name = async () => {
    return this.contract.methods.name().call();
  };

  symbol = async () => {
    return this.contract.methods.symbol().call();
  };

  baseURI = async () => {
    return await this.contract.methods.baseURI().call();
  };

  ownerOf = async (tokenId) => {
    return this.contract.methods.ownerOf(tokenId).call();
  };

  tokenURI = async (tokenId) => {
    return this.contract.methods.tokenURI(tokenId).call();
  };
}
