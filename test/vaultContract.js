const VaultContract = artifacts.require("VaultContract");
const EuriCoin = artifacts.require("EuriCoin")

contract('Testing VaultContract', (accounts) => {

  it('should check that the masterContract is the deployer', async() => {
    const vaultPromise = await VaultContract.deployed();
    const vaultContractInstance = vaultPromise;

    const masterContract = await vaultContractInstance.masterContract.call();
    
    assert.equal(
      masterContract,
      accounts[0],
      "masterContract (" + masterContract + ") is different than deployer (" + accounts[0] + ")");
  });

  it('should register a new index with EuriCoin as the index and also as a collateral with one unit as quantity', async() => {
    const vaultPromise = await VaultContract.deployed();
    const vaultContractInstance = vaultPromise;

    const CoinPromise = await EuriCoin.deployed();
    const CoinInstance = CoinPromise;
    console.log("####################################################################################################")
    console.log(CoinInstance.address)
    console.log("####################################################################################################")
    console.log(vaultContractInstance.address)

    const allowed = await CoinInstance.allowance.call(accounts[0], vaultContractInstance.address, { from: accounts[0] });
    console.log("####################################################################################################")
    console.log(allowed.toNumber())

    await vaultContractInstance.register_index.call(CoinInstance.address, [CoinInstance.address], [1], { from: accounts[0] });

    let index = await vaultContractInstance.get_index.call(CoinInstance.address, { from: accounts[0] });

    assert.equal(index.collateral[0], CoinInstance.address, 'EuriCoin Address was not correctly registered');
    assert.equal(index.quantities[0], '1', 'EuriCoin Quantities was not correctly registered');

  });

  it('should mint an index', async () => {
    let index_amount = 0;
    await vaultContractInstance.register_index(EuriCoinInstance.address, [EuriCoinInstance.address], [1], { from: accounts[0] });
    address = await vaultContractInstance.mint_index(EuriCoinInstance.address, accounts[0], [1], { from: accounts[0] })
    index_amount = await EuriCoinInstance.balanceOf(accounts[0]);
    assert.equal(index_amount, 1, 'The index was not minted correctly');

  });
});
