const VaultContract = artifacts.require("VaultContract");
const EuriCoin = artifacts.require("EuriCoin")

contract('Testing VaultContract', (accounts) => {

  let vaultContractInstance;

  before(async () => {
    vaultContractInstance = await VaultContract.deployed();
    EuriCoinInstance = await EuriCoin.deployed();
  })

  it('should check that the masterContract is the deployer', async () => {

    masterContract = await vaultContractInstance.masterContract.call();
    assert.equal(masterContract, accounts[0], "masterContract (" + masterContract + ") is different than deployer (" + accounts[0] + ")");
  });

  it('should register a new index with EuriCoin as the index and also as a collateral with one unit as quantity', async () => {
    await vaultContractInstance.register_index(EuriCoinInstance.address, [EuriCoinInstance.address], [1], {from: accounts[0]});

    let index = await vaultContractInstance.get_index.call(EuriCoinInstance.address, {from: accounts[0]});

    assert.equal(index.collateral[0], EuriCoinInstance.address, 'EuriCoin Address was not correctly registered');
    assert.equal(index.quantities[0], '1', 'EuriCoin Quantities was not correctly registered');

  });

  it('should mint an index', async () => {
    let index_amount = 0;
    await vaultContractInstance.register_index(EuriCoinInstance.address, [EuriCoinInstance.address], [1], {from: accounts[0]});
    await EuriCoinInstance.approve(vaultContractInstance.address, 9999, {from: accounts[0]})
    .then( ()=>{
      address = vaultContractInstance.mint_index(EuriCoinInstance.address, accounts[0], [1], {from: accounts[0]})
       
    }
    )
    index_amount= await EuriCoinInstance.balanceOf(accounts[0]);
    assert.equal(index_amount, 1, 'The index was not minted correctly');

  });
});
