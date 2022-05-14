// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.13;

contract MasterTools{
    function checkEmptyInAddressArray(address[] calldata addressArray) internal pure returns(bool empty){
        for(uint i=0; i<addressArray.length;i++){
            if(addressArray[i]==address(0x0)){
                return false;
            }
        }
        return true;
    }
    function checkEmptyInUintArray(uint[] calldata addressArray) internal pure returns(bool empty){
    for(uint i=0; i<addressArray.length;i++){
        if(addressArray[i]== 0){
            return false;
        }
    }
    return true;
    }
}

abstract contract  VaultContract {

    struct Index{
        address[] collateral; // Which tokens the index references to
        uint256[] quantities; // How many of each token the index references to
    }

    function get_index(address _index) virtual external view returns(Index memory __index);
    function redeem_index(address _index, address receiver, uint index_amount_to_redeem) virtual external;
    function register_index(address _index, address[] calldata _collateral, uint256[] calldata _quantities ) virtual external;
    function mint_index(address _index, address receiver, uint256[] calldata _collateral) virtual external returns(bool result);
    function setMasterContract(address _masterContract) virtual external;

}

abstract contract StorageContract {
    address public masterContract;
    address public vaultContract;
    address public factoryContract;
    address[] public indices;

    function setMasterContract(address _masterContract) virtual external;
    function setVaultContract(address _vaultContract) virtual external;
    function setFactoryContract(address _factoryContract) virtual external;
    function addNewIndex(address _index, address creator) virtual external;
    function getIndexCreator(address _index) virtual external view returns(address creator);
    function addAdmin(address new_admin) virtual external;
    function getIndicesLength() virtual external view returns(uint length);

}

abstract contract FactoryContract {
    function createIndex(string calldata name, string calldata symbol, address creator) virtual external returns(address index);
    function setStorageContract(address _storageContract) virtual external;
    function setMasterContract(address _masterContract) virtual external;
}

contract MasterContract is MasterTools{

    address public storageContract;
    StorageContract storageContractInstance;
    address public vaultContract;
    VaultContract vaultContractInstance;
    address public factoryContract;
    FactoryContract factoryContractInstance;
    
    mapping (address=>bool) public isAdmin;

    constructor(){
        isAdmin[address(msg.sender)] = true;
    }

    modifier onlyAdmins(){
        require(isAdmin[msg.sender],"Only Admins can execute this function");
        _;
    }

    function initMasterContract(address _storageContract) external onlyAdmins{
        // We load the addresses of the rest of the contracts
        storageContract = _storageContract;
        storageContractInstance = StorageContract(_storageContract);

        vaultContract = storageContractInstance.vaultContract();
        vaultContractInstance = VaultContract(vaultContract);

        factoryContract = storageContractInstance.factoryContract();
        factoryContractInstance = FactoryContract(factoryContract);
    }

    function addAdmin(address _admin) external onlyAdmins{
        require(_admin != address(0x0),"Address args cannot be null");
        isAdmin[_admin] = true;

        storageContractInstance.addAdmin(_admin);

    }

    function removeAdmin(address _admin) external onlyAdmins{
        require(_admin != address(0x0),"Address args cannot be null");
        isAdmin[_admin] = false;
    }

    // Updaters

    function updateStorageContract (address _storageContract) external onlyAdmins{
        require(_storageContract != address(0x0),"Address args cannot be null");
        storageContract = _storageContract;
        storageContractInstance = StorageContract(storageContract);
    }

    function updateFactoryContract (address _factoryContract) external onlyAdmins{
        require(_factoryContract != address(0x0),"Address args cannot be null");
        factoryContract = _factoryContract;
        
        storageContractInstance.setFactoryContract(_factoryContract);
    }    
    
    function updateVaultContract (address _vaultContract) external onlyAdmins{
        require(_vaultContract != address(0x0),"Address args cannot be null");
        vaultContract = _vaultContract;

        storageContractInstance.setVaultContract(_vaultContract);
    }

    function setMasterContract(address _masterContract) external onlyAdmins{
        require(_masterContract != address(0x0),"Address args cannot be null");

        vaultContractInstance.setMasterContract(_masterContract);
        storageContractInstance.setMasterContract(_masterContract);
        factoryContractInstance.setMasterContract(_masterContract);
    }

    // Interacting specifically with the Vault

    function mint_index(address _index, address receiver, uint256[] calldata _collateral) external  returns(bool result){
        require((_index != address(0x0))&&(receiver != address(0x0)),"Address args cannot be null");
        require(_collateral.length!=0,"Array args cannot be null/empty");
        require(checkEmptyInUintArray(_collateral),"Collateral array cannot have an empty token");

        result =  vaultContractInstance.mint_index(_index, receiver, _collateral);       
    }

    function redeem_index(address _index, address receiver, uint index_amount_to_redeem) external{
        require((_index != address(0x0))&&(receiver != address(0x0)),"Address args cannot be null");
        require(index_amount_to_redeem != 0 , "Cannot redeem none index. Maybe you sent decimals without transforming?");

        vaultContractInstance.redeem_index(_index, receiver, index_amount_to_redeem); 
    }

    // Interacting specifically with the Storage

    function getIndexCreator(address _index) public view onlyAdmins returns(address creator) {
        require(_index != address(0x0),"Address args cannot be null");
        return storageContractInstance.getIndexCreator(_index);
    }

    function getAllIndexCreators() external view onlyAdmins returns(address[] memory _array){
        uint length = storageContractInstance.getIndicesLength();
        for (uint index = 0; index < length; index++) {
            _array[index] = storageContractInstance.indices(index);
        }
        return _array;
    }

    // Bulk interactions

    function create_index(address _creator, address[] calldata _collateral, uint256[] calldata _quantities, string calldata name, string calldata symbol) external returns(address _index){
        require(_creator != address(0x0),"Address args cannot be null");
        
        require((_collateral.length!=0)&&(_quantities.length!=0),"Array args cannot be null/empty");
        require(checkEmptyInAddressArray(_collateral),"Collateral array cannot have an empty token");
        require(checkEmptyInUintArray(_quantities),"Quantities array cannot have an empty token");

        return factoryContractInstance.createIndex(name, symbol, _creator);
    }
}