import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";
import "./App.css";
import { Web3Blockchain } from "../api/web3_blockchain";

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockchain: new Web3Blockchain(),
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
      name: "",
      symbol: "",
      baseURI: "https://example.com",
      nameIsUsed: false,
      colorIsUsed: false,
      colorsUsed: [],
      lastMintTime: null,
    };
  }

  componentWillMount = async () => {
  };

  componentDidMount = async () => {
    await this.state.blockchain.init();
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

  loadBlockchainData = async () => {
    const blockchain = this.state.blockchain;
    const accounts = await blockchain.getAccounts();
    if (accounts.length === 0) {
      this.setState({ metamaskConnected: false });
    } else {
      this.setState({ metamaskConnected: true });
      this.setState({ loading: true });
      this.setState({ accountAddress: accounts[0] });
      let accountBalance = await blockchain.getBalance(accounts[0]);
      this.setState({ accountBalance });
      this.setState({ loading: false });
      const networkId = await blockchain.networkId();
      console.log(networkId);
      const contractAddress = await this.state.blockchain.contractAddress();
      if (contractAddress) {
        this.setState({ loading: true });
        const earlyAccessGameContract = this.state.blockchain.loadContract(
          contractAddress
        );
        this.setState({ earlyAccessGameContract });
        this.setState({ contractDetected: true });
        const count = await this.state.blockchain.tokenCount();

        console.log(count);
        this.setState({ count });
        for (var i = 0; i < count; i++) {
          this.state.blockchain.loadToken(i).then((token) => {
            this.setState({
              tokens: [...this.state.tokens, token],
            });
          });
        }
        let totalTokensMinted = await this.state.blockchain.totalSupply();
        this.setState({ totalTokensMinted });
        let totalTokensOwnedByAccount = await this.state.blockchain.balanceOf(
          this.state.accountAddress
        );
        this.setState({ totalTokensOwnedByAccount });
        let name = await this.state.blockchain.name();
        this.setState({ name });
        let symbol = await this.state.blockchain.symbol();
        this.setState({ symbol });
        let baseURI = await this.state.blockchain.baseURI();
        this.setState({ baseURI });
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
    this.state.blockchain.mint(tokenCount).then(() => {
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
    this.state.blockchain.deployNew(name, "EAG", tokenURI, price, this.state.accountAddress);
  };

  toggleForSale = (tokenId) => {
    this.setState({ loading: true });
    this.state.blockchain
      .toggleForSale(tokenId, this.state.accountAddress)
      .then(() => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  changeTokenPrice = (tokenId, newPrice) => {
    this.setState({ loading: true });
    this.state.blockchain
      .changeTokenPrice(tokenId, newPrice, this.state.accountAddress)
      .then(() => {
        this.setState({ loading: false });
        window.location.reload();
      });
  };

  buyToken = (tokenId, price) => {
    this.setState({ loading: true });
    this.state.blockchain.buyToken(tokenId, price, this.state.accountAddress).then(() => {
      this.setState({ loading: false });
      window.location.reload();
    })
  }

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
              <Navbar symbol={this.state.symbol} />
              <Route
                path="/"
                exact
                render={() => (
                  <AccountDetails
                    name={this.state.name}
                    baseURI={this.state.baseURI}
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
                    buyToken={this.buyToken}
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
                  ownerOf={this.state.blockchain.ownerOf}
                    tokenURI={this.state.blockchain.tokenURI}
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
