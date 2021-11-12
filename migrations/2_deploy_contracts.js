const EarlyAccessGame = artifacts.require("EarlyAccessGame");

module.exports = async function(deployer) {
  await deployer.deploy(EarlyAccessGame, "Hextris Early Access Demo", "EAG", "https://bafybeie4jymhtanwfv6uuij4rqqdikwhdb4ymi6gauaumkm37ycjoy6udy.ipfs.infura-ipfs.io/?token=", web3.utils.toWei("0.001", "Ether"));
};
