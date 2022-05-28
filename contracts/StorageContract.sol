// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.13;

contract StorageContract {
    address public masterContract;
    address payable public vaultContract;
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

    // Setters
    function setMasterContract(address _masterContract) external onlyAdmins{
        masterContract = _masterContract;
    }
    function setVaultContract(address payable _vaultContract) external onlyAdmins{
        vaultContract = _vaultContract;
    }    
    function setFactoryContract(address _factoryContract) external onlyAdmins{
        factoryContract = _factoryContract;
    }
    function addAdmin(address new_admin) external onlyAdmins{
        is_admin[new_admin] = true;
    }

    function checkIfAdmin(address _address) external onlyAdmins view returns(bool _is_admin){
        _is_admin = is_admin[_address]; 
    }

    function addNewIndex(address _index, address creator) external onlyAdmins{
        indices.push(_index);
        index_creators[_index] = creator;
    }

    function getIndexCreator(address _index) external onlyAdmins view returns(address creator){
        creator = index_creators[_index];
    }

    function getIndicesLength() external onlyAdmins view returns(uint length){
        length = indices.length;
    }
}