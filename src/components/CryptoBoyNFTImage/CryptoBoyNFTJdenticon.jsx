import React from "react";
import Jdenticon from 'react-jdenticon';

const CryptoBoyNFTJdenticon = ({ name }) => {
  console.log(name);
  return(<Jdenticon size="144" value={name} />);
};

export default CryptoBoyNFTJdenticon;
