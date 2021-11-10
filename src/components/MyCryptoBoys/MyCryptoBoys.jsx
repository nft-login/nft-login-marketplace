import React, { useState, useEffect } from "react";
import CryptoBoyNFTJdenticon from "../CryptoBoyNFTImage/CryptoBoyNFTJdenticon";
import MyCryptoBoyNFTDetails from "../MyCryptoBoyNFTDetails/MyCryptoBoyNFTDetails";
import Loading from "../Loading/Loading";

const MyCryptoBoys = ({
  accountAddress,
  tokens,
  totalTokensOwnedByAccount,
}) => {
  const [loading, setLoading] = useState(false);
  const [myTokens, setMyTokens] = useState([]);

  useEffect(() => {
    if (tokens.length !== 0) {
      if (tokens[0].uri !== undefined) {
        setLoading(loading);
      } else {
        setLoading(false);
      }
    }
    const my_tokens = tokens.filter(
      (token) => token.currentOwner === accountAddress
    );
    setMyTokens(my_tokens);
  }, [tokens]);

  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            Total No. of Early Access's You Own : {totalTokensOwnedByAccount}
          </h5>
        </div>
      </div>
      <div className="d-flex flex-wrap mb-2">
        {myTokens.map((token) => {
          return (
            <div
              key={token.tokenId}
              className="w-50 p-4 mt-1 border"
            >
              <div className="row">
                <div className="col-md-6">
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
                </div>
                <div className="col-md-6 text-center">
                  <MyCryptoBoyNFTDetails
                    token={token}
                    accountAddress={accountAddress}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyCryptoBoys;
