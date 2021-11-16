import React, { Component } from "react";

class CryptoBoyNFTDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTokenPrice: "",
    };
  }

  callChangeTokenPriceFromApp = (tokenId, newPrice) => {
    this.props.changeTokenPrice(tokenId, newPrice);
  };

  render() {
    return (
      <div key={this.props.token.tokenId} className="mt-4">
        <p>
          <span className="font-weight-bold">Token Id</span> :{" "}
          {this.props.token.tokenId}
        </p>
        <p>
          <span className="font-weight-bold">Owned By</span> :{" "}
          {this.props.token.currentOwner.substr(0, 5) +
            "..." +
            this.props.token.currentOwner.slice(
              this.props.token.currentOwner.length - 5
            )}
        </p>
        <p>
          <span className="font-weight-bold">Price</span> :{" "}
          {this.props.token.price} Ξ
        </p>
        <div>
          {this.props.accountAddress === this.props.token.currentOwner ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.callChangeTokenPriceFromApp(
                  this.props.token.tokenId,
                  this.state.newTokenPrice
                );
              }}
            >
              <div className="form-group mt-4 ">
                <label htmlFor="newTokenPrice">
                  <span className="font-weight-bold">Change Token Price</span> :
                </label>{" "}
                <input
                  required
                  type="number"
                  name="newTokenPrice"
                  id="newTokenPrice"
                  value={this.state.newTokenPrice}
                  className="form-control w-50"
                  placeholder="Enter new price"
                  onChange={(e) =>
                    this.setState({
                      newTokenPrice: e.target.value,
                    })
                  }
                />
              </div>
              <button
                type="submit"
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                className="btn btn-outline-info mt-0 w-50"
              >
                change price
              </button>
            </form>
          ) : null}
        </div>
        <div>
          {this.props.accountAddress === this.props.token.currentOwner ? (
            this.props.token.forSale ? (
              <button
                className="btn btn-outline-danger mt-4 w-50"
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                onClick={() =>
                  this.props.toggleForSale(this.props.cryptoboy.tokenId)
                }
              >
                Remove from sale
              </button>
            ) : (
              <button
                className="btn btn-outline-success mt-4 w-50"
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                onClick={() =>
                  this.props.toggleForSale(this.props.cryptoboy.tokenId)
                }
              >
                Keep for sale
              </button>
            )
          ) : null}
        </div>
        <div>
          {this.props.accountAddress !== this.props.token.currentOwner ? (
            this.props.token.forSale ? (
              <button
                className="btn btn-outline-primary mt-3 w-50"
                value={this.props.token.price}
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                onClick={(e) =>
                  this.props.buyToken(this.props.token.tokenId, e.target.value)
                }
              >
                Buy For {this.props.token.price} Ξ
              </button>
            ) : (
              <>
                <button
                  disabled
                  style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                  className="btn btn-outline-primary mt-3 w-50"
                >
                  Buy For {this.props.token.price.toString()} Ξ
                </button>
                <p className="mt-2">Currently not for sale!</p>
              </>
            )
          ) : null}
        </div>
      </div>
    );
  }
}

export default CryptoBoyNFTDetails;
