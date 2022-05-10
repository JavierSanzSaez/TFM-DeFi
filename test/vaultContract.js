const VaultContract = artifacts.require("VaultContract");
const EuriCoin = artifacts.require("EuriCoin")

contract('Testing VaultContract', (accounts) => {
    
    let vaultContractinstance;

    before(async ()=>{
        vaultContractinstance = await VaultContract.deployed();
        EuriCoinInstance = await EuriCoin.deployed();
    })

  it('should check that the masterContract is the deployer', async () => {
    
    masterContract = await vaultContractinstance.masterContract.call();
    assert.equal(masterContract, accounts[0], "masterContract (" +masterContract+") is different than deployer ("+accounts[0]+")");
  }); 

  it('should register a new index with EuriCoin as the index and also as a collateral with one unit as quantity', async () => { 
        vaultContractinstance.register_index.call(EuriCoinInstance.address, [EuriCoinInstance.address],[1]);

        let index_collateral = vaultContractinstance.index_collateral.call(EuriCoinInstance.address);
        let index_quantities = vaultContractinstance.index_quantities.call(EuriCoinInstance.address);

        assert.equal(index_collateral, EuriCoinInstance.address, 'EuriCoin Address was not correctly registered');
        assert.equal(index_quantities, 1, 'EuriCoin Quantities was not correctly registered');

  });
//   it('should send coin correctly', async () => {
//         const metaCoinInstance = await MetaCoin.deployed();

//         // Setup 2 accounts.
//         const accountOne = accounts[0];
//         const accountTwo = accounts[1];

//         // Get initial balances of first and second account.
//         const accountOneStartingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
//         const accountTwoStartingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();

//         // Make transaction from first account to second.
//         const amount = 10;
//         await metaCoinInstance.sendCoin(accountTwo, amount, { from: accountOne });

//         // Get balances of first and second account after the transactions.
//         const accountOneEndingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
//         const accountTwoEndingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();


//         assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
//         assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
//   });
});