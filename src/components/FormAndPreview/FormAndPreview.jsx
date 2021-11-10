import React, { Component } from "react";

class FormAndPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "# Supergame\n",
      tokenCount: "10",
      price: ""
    };
  }

  componentDidMount = async () => {
    await this.props.setMintBtnTimer();
  };

  callMintMyNFTFromApp = (e) => {
    e.preventDefault();
    this.props.mintMyNFT(this.state.tokenCount);
  };

  callDeployMyNFTFromApp = (e) => {
    e.preventDefault();
    this.props.deployMyNFT(this.state.name, this.state.description, this.state.price);
  };

  render() {
    return (
      <div>
        <div className="card mt-1">
          <div className="card-body align-items-center d-flex justify-content-center">
            <h5>Mint more tokens</h5>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <form onSubmit={this.callDeployMyNFTFromApp} className="pt-4 mt-1">
            <div className="form-group">
                <label htmlFor="cryptoBoyName">Name</label>
                <input
                  required
                  type="text"
                  value={this.state.name}
                  className="form-control"
                  placeholder="Enter Your Game Name"
                  onChange={(e) =>
                    this.setState({ name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                    <label htmlFor="cryptoBoyName">Description</label>
                    <textarea
                      required
                      type="text"
                      value={this.state.description}
                      className="form-control"
                      placeholder="Enter Your Description"
                      onChange={(e) =>
                        this.setState({ description: e.target.value })
                      }
                    />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  required
                  type="number"
                  name="price"
                  id="tokenPrice"
                  value={this.state.price}
                  className="form-control"
                  placeholder="Enter Price In Ξ"
                  onChange={(e) =>
                    this.setState({ price: e.target.value })
                  }
                />
              </div>
              <button
                id="deployBtn"
                style={{ fontSize: "0.9rem", letterSpacing: "0.14rem" }}
                type="submit"
                className="btn mt-4 btn-block btn-outline-primary"
              >
                Deploy New Contract
              </button>
            </form>
          </div>

          <div className="col-md-3">
            <form onSubmit={this.callMintMyNFTFromApp} className="pt-4 mt-1">
              <div>
                <label htmlFor="price">Count</label>
                <input
                  required
                  type="number"
                  name="price"
                  id="tokenCount"
                  value={this.state.tokenCount}
                  className="form-control"
                  placeholder="Enter Number of Token"
                  onChange={(e) =>
                    this.setState({ tokenCount: e.target.value })
                  }
                />
              </div>
              <button
                id="mintBtn"
                style={{ fontSize: "0.9rem", letterSpacing: "0.14rem" }}
                type="submit"
                className="btn mt-4 btn-block btn-outline-primary"
              >
                Mint My Token
              </button>
              <div className="mt-4">
                {this.props.nameIsUsed ? (
                  <div className="alert alert-danger alert-dissmissible">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                    >
                      <span>&times;</span>
                    </button>
                    <strong>This name is taken!</strong>
                  </div>
                ) : this.props.colorIsUsed ? (
                  <>
                    <div className="alert alert-danger alert-dissmissible">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                      >
                        <span>&times;</span>
                      </button>
                      {this.props.colorsUsed.length > 1 ? (
                        <strong>These colors are taken!</strong>
                      ) : (
                        <strong>This color is taken!</strong>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        marginTop: "1rem",
                        marginBottom: "3rem",
                      }}
                    >
                      {this.props.colorsUsed.map((color, index) => (
                        <div
                          key={index}
                          style={{
                            background: `${color}`,
                            width: "50%",
                            height: "50px",
                          }}
                        ></div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default FormAndPreview;
