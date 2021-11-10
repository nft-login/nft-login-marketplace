const EarlyAccessGame = artifacts.require("EarlyAccessGame");

module.exports = async function(deployer) {
  await deployer.deploy(EarlyAccessGame, "EarlyAccessGame", "EAG", "https://example.com/", web3.utils.toWei("0.001", "Ether"));
};
