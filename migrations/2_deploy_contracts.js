const EuriCoin = artifacts.require("EuriCoin");

module.exports = function(deployer) {
  deployer.deploy(EuriCoin);
};
