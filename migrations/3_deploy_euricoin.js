const EuriCoin = artifacts.require("EuriCoin")

module.exports = async function(deployer,network, accounts) {
    await deployer.deploy(EuriCoin, {from: accounts[0], overwrite: true} )
};





