const EarlyAccessGame = artifacts.require("EarlyAccessGame");

module.exports = async function(deployer) {
  await deployer.deploy(EarlyAccessGame, "EarlyAccessGame", "EAG", "https://bafybeicyscc7nsotmk5fk7ru4l3f3mzfyectvl35kqwgsqqjdmd4gykeqa.ipfs.infura-ipfs.io/?token=", web3.utils.toWei("0.001", "Ether"));
};
