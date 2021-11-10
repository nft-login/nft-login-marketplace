import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";
import "./App.css";
import Web3 from "web3";
import EarlyAccessGame from "../abis/EarlyAccessGame.json";

import FormAndPreview from "../components/FormAndPreview/FormAndPreview";
import AllCryptoBoys from "./AllCryptoBoys/AllCryptoBoys";
import AccountDetails from "./AccountDetails/AccountDetails";
import ContractNotDeployed from "./ContractNotDeployed/ContractNotDeployed";
import ConnectToMetamask from "./ConnectMetamask/ConnectToMetamask";
import Loading from "./Loading/Loading";
import Navbar from "./Navbar/Navbar";
import MyCryptoBoys from "./MyCryptoBoys/MyCryptoBoys";
import Queries from "./Queries/Queries";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

function getContract() {
  const search = window.location.search;
  const contract = new URLSearchParams(search).get("contract");
  console.log(contract);
  return contract;
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountAddress: "",
      accountBalance: "",
      earlyAccessGameContract: null,
      tokensCount: 0,
      tokens: [],
      loading: true,
      metamaskConnected: false,
      contractDetected: false,
      totalTokensMinted: 0,
      totalTokensOwnedByAccount: 0,
      nameIsUsed: false,
      colorIsUsed: false,
      colorsUsed: [],
      lastMintTime: null,
    };
  }

  componentWillMount = async () => {
    await this.loadWeb3();
  };

  componentDidMount = async () => {
    await this.loadBlockchainData();
    await this.setMetaData();
    await this.setMintBtnTimer();
  };

  setMintBtnTimer = () => {
    const mintBtn = document.getElementById("mintBtn");
    if (mintBtn !== undefined && mintBtn !== null) {
      this.setState({
        lastMintTime: localStorage.getItem(this.state.accountAddress),
      });
      this.state.lastMintTime === undefined || this.state.lastMintTime === null
        ? (mintBtn.innerHTML = "Mint My Early Access")
        : this.checkIfCanMint(parseInt(this.state.lastMintTime));
    }
  };

  checkIfCanMint = (lastMintTime) => {
    const mintBtn = document.getElementById("mintBtn");
    const timeGap = 60000; //1min in milliseconds
    const countDownTime = lastMintTime + timeGap;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = countDownTime - now;
      if (diff < 0) {
        mintBtn.removeAttribute("disabled");
        mintBtn.innerHTML = "Mint My Early Access";
        localStorage.removeItem(this.state.accountAddress);
        clearInterval(interval);
      } else {
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        mintBtn.setAttribute("disabled", true);
        mintBtn.innerHTML = `Next mint in ${minutes}m ${seconds}s`;
      }
    }, 1000);
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

  loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      this.setState({ metamaskConnected: false });
    } else {
      this.setState({ metamaskConnected: true });
      this.setState({ loading: true });
      this.setState({ accountAddress: accounts[0] });
      let accountBalance = await web3.eth.getBalance(accounts[0]);
      accountBalance = web3.utils.fromWei(accountBalance, "Ether");
      this.setState({ accountBalance });
      this.setState({ loading: false });
      const networkId = await web3.eth.net.getId();
      const networkData = EarlyAccessGame.networks[networkId];
      const contractAddress = getContract() || networkData.address;
      if (networkData) {
        this.setState({ loading: true });
        const earlyAccessGameContract = web3.eth.Contract(
          EarlyAccessGame.abi,
          contractAddress
        );
        this.setState({ earlyAccessGameContract });
        this.setState({ contractDetected: true });
        const count = await earlyAccessGameContract.methods
          .totalSupply()
          .call();
        this.setState({ count });
        for (var i = 0; i < count; i++) {
          const token = {
            tokenId: i,
            uri: await earlyAccessGameContract.methods.tokenURI(i).call(),
            price: await earlyAccessGameContract.methods.priceOf(i).call(),
            currentOwner: await earlyAccessGameContract.methods
              .ownerOf(i)
              .call(),
            forSale: await earlyAccessGameContract.methods.isForSale(i).call(),
          };
          console.log(token);
          this.setState({
            tokens: [...this.state.tokens, token],
          });
        }
        let totalTokensMinted = await earlyAccessGameContract.methods
          .totalSupply()
          .call();
        totalTokensMinted = totalTokensMinted.toNumber();
        this.setState({ totalTokensMinted });
        let totalTokensOwnedByAccount = await earlyAccessGameContract.methods
          .balanceOf(this.state.accountAddress)
          .call();
        totalTokensOwnedByAccount = totalTokensOwnedByAccount.toNumber();
        this.setState({ totalTokensOwnedByAccount });
        this.setState({ loading: false });
      } else {
        this.setState({ contractDetected: false });
      }
    }
  };

  connectToMetamask = async () => {
    await window.ethereum.enable();
    this.setState({ metamaskConnected: true });
    window.location.reload();
  };

  setMetaData = async () => {
    if (this.state.tokens.length !== 0) {
      this.state.tokens.map(async (token) => {
        const result = await fetch(token.tokenURI);
        const metaData = await result.text();
        this.setState({
          tokens: this.state.tokens.map((token) =>
            true
              ? {
                  ...token,
                  metaData,
                }
              : token
          ),
        });
      });
    }
  };

  mintMyNFT = async (tokenCount) => {
    this.setState({ loading: true });
    this.state.earlyAccessGameContract.methods
      .mintMultiple(this.state.accountAddress, tokenCount)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        localStorage.setItem(this.state.accountAddress, new Date().getTime());
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  deployMyNFT = async (name, description, price) => {
    this.setState({ loading: true });

    const cid = await ipfs.add(description);
    let tokenURI = `https://ipfs.infura.io/ipfs/${cid.path}/?token=`;
    console.log(tokenURI);
    this.state.earlyAccessGameContract
      .deploy({
        data: EarlyAccessGame.bytecode,
        arguments: [
          name,
          "EAG",
          tokenURI,
          window.web3.utils.toWei(price, "Ether"),
        ],
      })
      .send({ from: this.state.accountAddress })
      .on("error", function(error) {})
      .on("confirmation", (confirmationNumber, receipt) => {
        let newContractInstance = this.state.earlyAccessGameContract.clone();
        newContractInstance.options.address = receipt.contractAddress;
        console.log(receipt.contractAddress);
        localStorage.setItem(this.state.accountAddress, new Date().getTime());
        var searchParams = new URLSearchParams(window.location.search);
        searchParams.set("contract", receipt.contractAddress);
        window.location.search = searchParams.toString();
        this.setState({
          loading: false,
          earlyAccessGameContract: newContractInstance,
        });
        var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
        window.history.pushState(null, "", newRelativePathQuery)     
        window.location.reload();
      });
  };

  toggleForSale = (tokenId) => {
    this.setState({ loading: true });
    this.state.earlyAccessGameContract.methods
      .toggleForSale(tokenId)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  changeTokenPrice = (tokenId, newPrice) => {
    this.setState({ loading: true });
    const newTokenPrice = window.web3.utils.toWei(newPrice, "Ether");
    this.state.earlyAccessGameContract.methods
      .setPrice(tokenId, newTokenPrice)
      .send({ from: this.state.accountAddress })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  buyCryptoBoy = (tokenId, price) => {
    this.setState({ loading: true });
    this.state.earlyAccessGameContract.methods
      .buy(tokenId)
      .send({ from: this.state.accountAddress, value: price })
      .on("confirmation", () => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  render() {
    return (
      <div className="container">
        {!this.state.metamaskConnected ? (
          <ConnectToMetamask connectToMetamask={this.connectToMetamask} />
        ) : !this.state.contractDetected ? (
          <ContractNotDeployed />
        ) : this.state.loading ? (
          <Loading />
        ) : (
          <>
            <HashRouter basename="/">
              <Navbar />
              <Route
                path="/"
                exact
                render={() => (
                  <AccountDetails
                    accountAddress={this.state.accountAddress}
                    accountBalance={this.state.accountBalance}
                  />
                )}
              />
              <Route
                path="/mint"
                render={() => (
                  <FormAndPreview
                    mintMyNFT={this.mintMyNFT}
                    deployMyNFT={this.deployMyNFT}
                    nameIsUsed={this.state.nameIsUsed}
                    colorIsUsed={this.state.colorIsUsed}
                    colorsUsed={this.state.colorsUsed}
                    setMintBtnTimer={this.setMintBtnTimer}
                  />
                )}
              />
              <Route
                path="/marketplace"
                render={() => (
                  <AllCryptoBoys
                    accountAddress={this.state.accountAddress}
                    tokens={this.state.tokens}
                    totalTokensMinted={this.state.totalTokensMinted}
                    changeTokenPrice={this.changeTokenPrice}
                    toggleForSale={this.toggleForSale}
                    buyCryptoBoy={this.buyCryptoBoy}
                  />
                )}
              />
              <Route
                path="/my-tokens"
                render={() => (
                  <MyCryptoBoys
                    accountAddress={this.state.accountAddress}
                    tokens={this.state.tokens}
                    totalTokensOwnedByAccount={
                      this.state.totalTokensOwnedByAccount
                    }
                  />
                )}
              />
              <Route
                path="/queries"
                render={() => (
                  <Queries
                    earlyAccessGameContract={this.state.earlyAccessGameContract}
                  />
                )}
              />
            </HashRouter>
          </>
        )}
      </div>
    );
  }
}

export default App;
