const VaultContract = artifacts.require("VaultContract")
const EuriCoin = artifacts.require("EuriCoin")

module.exports = async function(deployer,network, accounts) {
    vaultInstance = await VaultContract.deployed();
    console.log(vaultInstance.address)

    await deployer.deploy(EuriCoin, vaultInstance.address,{from: accounts[0], overwrite: true} )
};





