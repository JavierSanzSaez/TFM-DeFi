// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.13;


contract StorageContract {
    address public masterContract;
    address public vaultContract;
    address public factoryContract;
    mapping(address => bool) is_admin;
    mapping(address => address) index_creators;
    address[] public indices;

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
    function checkIfAdmin(address _address) public onlyAdmins view returns(bool _is_admin){
        _is_admin = is_admin[_address]; 
    }
    function addNewIndex(address _index, address creator) public onlyAdmins{
        indices.push(_index);
        index_creators[_index] = creator;

    }
    function getIndexCreator(address _index) public onlyAdmins view returns(address creator){
        creator = index_creators[_index];
    }
}