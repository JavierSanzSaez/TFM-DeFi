// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.13;

import {IndexContract} from "./IndexContract.sol";
import {StorageContract} from "./StorageContract.sol";

contract FactoryContract{

    address masterContract;
    address storageContract;
    StorageContract storageContractInstance;

    constructor(){
        masterContract = msg.sender; // Initially the deployer is the "master contract". We will then change that with "setMasterContract"
    }

    modifier onlyMasterContract{
        require(
            msg.sender == masterContract,
            "Only the Master Contract can interact with me"
        );
        _;
    }

    function setMasterContract() external onlyMasterContract{
        masterContract = storageContractInstance.masterContract();
    }

    function setStorageContract(address _storageContract) external onlyMasterContract {
        storageContract = _storageContract;
        storageContractInstance = StorageContract(storageContract);
    }

    function createIndex(string calldata name, string calldata symbol, address creator) external onlyMasterContract returns(address index){
        address vault = storageContractInstance.vaultContract();
        IndexContract new_index = new IndexContract(vault, name, symbol);

        storageContractInstance.addNewIndex(address(new_index), creator);

        new_index.mint(creator, 1);
        new_index.transferOwnership(vault);

        return address(new_index);
    }
}