const TokenX = artifacts.require("TokenX")

module.exports = async function(deployer,network, accounts) {
    await deployer.deploy(TokenX, {from: accounts[0], overwrite: true} )
};
