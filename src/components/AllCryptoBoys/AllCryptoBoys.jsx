import React, { useState, useEffect } from "react";
import CryptoBoyNFTJdenticon from "../CryptoBoyNFTImage/CryptoBoyNFTJdenticon";
import CryptoBoyNFTDetails from "../CryptoBoyNFTDetails/CryptoBoyNFTDetails";
import Loading from "../Loading/Loading";

const AllCryptoBoys = ({
  tokens,
  accountAddress,
  totalTokensMinted,
  changeTokenPrice,
  toggleForSale,
  buyToken,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tokens.length !== 0) {
      if (tokens[0].url !== undefined) {
        setLoading(loading);
      } else {
        setLoading(false);
      }
    }
  }, [tokens]);

  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            Total No. of Early Access's Minted On The Platform :{" "}
            {totalTokensMinted}
          </h5>
        </div>
      </div>
      <div className="d-flex flex-wrap mb-2">
        {tokens.map((token) => {
          return (
            <div
              key={token.tokenId}
              className="w-50 p-4 mt-1 border"
            >
              {!loading ? (
                <CryptoBoyNFTJdenticon
                  uri={
                    token.uri !== undefined
                      ? token.uri
                      : ""
                  }
                />
              ) : (
                <Loading />
              )}
              <CryptoBoyNFTDetails
                token={token}
                accountAddress={accountAddress}
                changeTokenPrice={changeTokenPrice}
                toggleForSale={toggleForSale}
                buyToken={buyToken}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllCryptoBoys;
