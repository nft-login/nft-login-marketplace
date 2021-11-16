import React from "react";

const MyCryptoBoyNFTDetails = (props) => {
  const {
    tokenId,
    price,
  } = props.token;
  return (
    <div key={tokenId} className="mt-4 ml-3">
      <p>
        <span className="font-weight-bold">Token Id</span> :{" "}
        {tokenId}
      </p>
      <p>
        <span className="font-weight-bold">Price</span> :{" "}
        {price.toString()} Ξ
      </p>
    </div>
  );
};

export default MyCryptoBoyNFTDetails;
