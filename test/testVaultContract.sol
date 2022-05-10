pragma solidity >=0.8.13;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/VaultContract.sol";
import "../contracts/EuriCoin.sol";

contract TestVaultContract {

    event EventDebugMasterContract(address masterContract);

    function testMasterContract() public {
        VaultContract vault = VaultContract(DeployedAddresses.VaultContract());

        address expected = tx.origin;

        emit EventDebugMasterContract(vault.masterContract());

        Assert.equal(vault.masterContract(), expected, "masterContract should be deployer's address");

    }

    function testRegisterIndex() public{
        address coin_address = DeployedAddresses.EuriCoin();
        VaultContract vault = VaultContract(DeployedAddresses.VaultContract());

        address[] memory deposited_collateral;
        deposited_collateral[0] = coin_address;
        deposited_collateral[1] = coin_address;

        uint256[] memory deposited_quantitites;
        deposited_quantitites[0] = 1;
        deposited_quantitites[1] = 2;

        vault.register_index(coin_address, deposited_collateral, deposited_quantitites);
        address[] memory collateral = vault.get_index(coin_address).index_collateral;
        uint256[] memory quantities = vault.get_index(coin_address).index_quantities;

        Assert.equal(collateral,[coin_address, coin_address], "EuriCoin should appear as collateral");
        Assert.equal(quantities,[1,2], "There should only be 1 EuriCoin");
    }

    function testMintIndex() public{

    }

}
