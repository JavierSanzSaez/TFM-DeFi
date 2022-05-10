pragma solidity >=0.8.13;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/VaultContract.sol";
import "../contracts/EuriCoin.sol";

contract TestVaultContract {

    VaultContract vault = VaultContract(DeployedAddresses.VaultContract());
    address coin_address = address(DeployedAddresses.EuriCoin());

    function testMasterContract() public {

        address expected = tx.origin;

        Assert.equal(vault.masterContract(), expected, "masterContract should be deployer's address");

    }

    function testRegisterIndexWithNulls() public{

        address[] memory deposited_collateral;

        uint256[] memory deposited_quantities;

        try vault.register_index(coin_address, deposited_collateral, deposited_quantities){
            Assert.equal(int(0),int(1), "Sending nulls works (and it shouldn't!)");
        } catch{
            
        }
    }

    function testRegisterIndex() public{

        address[] memory deposited_collateral = new address[](2);
        deposited_collateral[0] = coin_address;
        deposited_collateral[1] = coin_address;

        uint256[] memory deposited_quantities = new uint256[](2);
        deposited_quantities[0] = uint256(1);
        deposited_quantities[1] = uint256(2);

        vault.register_index(coin_address, deposited_collateral, deposited_quantities);
        address[] memory collateral = vault.get_index(coin_address).collateral;
        uint256[] memory quantities = vault.get_index(coin_address).quantities;

        for (uint i = 0; i<deposited_collateral.length;i++){
            Assert.equal(collateral[i],deposited_collateral[i], "EuriCoin should appear as collateral");
            Assert.equal(quantities[i],deposited_quantities[i], "There should only be 1 EuriCoin");
        }
    }
}
