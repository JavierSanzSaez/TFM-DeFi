// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.13;


contract StorageContract {
    address public masterContract;
    address public vaultContract;
    address public factoryContract;
    mapping(address => bool) is_admin;

    modifier onlyAdmins{
        require(
            is_admin[msg.sender],
            "Only an Admin can interact with this function"
        );
        _;
    }    

    constructor(){
        is_admin[msg.sender] = true;
    }

    function setMasterContract(address _masterContract) public onlyAdmins{
        masterContract = _masterContract;
    }
    function setVaultContract(address _vaultContract) public onlyAdmins{
        vaultContract = _vaultContract;
    }    
    function setFactoryContract(address _factoryContract) public onlyAdmins{
        factoryContract = _factoryContract;
    }
    function addAdmin(address new_admin) public onlyAdmins{
        is_admin[new_admin] = true;
    }
}