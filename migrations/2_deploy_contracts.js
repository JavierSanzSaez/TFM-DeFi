const VaultContract = artifacts.require("VaultContract")
const EuriCoin = artifacts.require("EuriCoin")

module.exports = async function(deployer,network, accounts) {
  await deployer.deploy(VaultContract, {from: accounts[0]})
  vaultContractInstance = await VaultContract.deployed();
  deployer.deploy(EuriCoin, vaultContractInstance.address)
};
