// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.13;

import {IndexContract} from "./IndexContract.sol";
import {StorageContract} from "./StorageContract.sol";

contract FactoryContract{

    address private storageContract;
    StorageContract storageContractInstance;
    mapping(address => bool) is_admin;
    address private masterContract;

    modifier onlyAdmins{
        require(
            is_admin[msg.sender],
            "Factory Contract - Only an Admin can interact with this function"
        );
        _;
    }    

    constructor(){
        is_admin[msg.sender] = true;
    }

    function addAdmin(address new_admin) external onlyAdmins{
        require(new_admin != address(0x0),"Address args cannot be null");
        is_admin[new_admin] = true;
    }
    function removeAdmin(address _admin) external onlyAdmins{
        require(_admin != address(0x0),"Address args cannot be null");
        is_admin[_admin] = false;
    }

    function setMasterContract() external onlyAdmins{
        address _masterContract = storageContractInstance.masterContract();
        is_admin[masterContract] = false;
        is_admin[_masterContract] = true;
    }
    function setStorageContract(address _storageContract) external onlyAdmins {
        storageContract = _storageContract;
        storageContractInstance = StorageContract(storageContract);
    }

    function createIndex(string calldata name, string calldata symbol, address creator) external onlyAdmins returns(address index){
        address vault = storageContractInstance.vaultContract();
        IndexContract new_index = new IndexContract(vault, name, symbol);

        storageContractInstance.addNewIndex(address(new_index), creator);

        new_index.mint(creator, 1);
        new_index.transferOwnership(vault);

        return address(new_index);
    }
}