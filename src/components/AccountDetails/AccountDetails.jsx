import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const AccountDetails = ({ baseURI, name, accountAddress, accountBalance }) => {
  const [data, setData] = useState({ markdown: "" });

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(baseURI);
      setData({ markdown: await result.text() });
    };

    fetchData();
  }, "");

  return (
    <div>
      <div className="jumbotron">
        <h1 className="display-5">{name} NFT Marketplace</h1>
        <p className="lead">
          This is an NFT marketplace where you can mint ERC721 implemented{" "}
          <i>Early Access NFTs</i> and manage them.
        </p>
        <hr className="my-4" />
        <p className="lead">Account address :</p>
        <h4>{accountAddress}</h4>
        <p className="lead">Account balance :</p>
        <h4>{accountBalance} Ξ</h4>
        <hr className="my-4" />
        <ReactMarkdown escapeHtml={false} children={data.markdown} />
      </div>
    </div>
  );
};

export default AccountDetails;
