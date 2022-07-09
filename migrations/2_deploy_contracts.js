const VaultContract = artifacts.require("VaultContract")
const StorageContract = artifacts.require("StorageContract")
const MasterContract = artifacts.require("MasterContract")
const FactoryContract = artifacts.require("FactoryContract")

module.exports = async function(deployer,network, accounts) {
  await deployer.deploy(MasterContract, {from: accounts[0],  overwrite: true})
  await deployer.deploy(FactoryContract, {from: accounts[0], overwrite: true})
  await deployer.deploy(VaultContract, {from: accounts[0], overwrite: true})
  await deployer.deploy(StorageContract, {from: accounts[0], overwrite: true})
};
