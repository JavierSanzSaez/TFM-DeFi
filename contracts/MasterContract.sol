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

}

abstract contract FactoryContract {
    function setMasterContract(address _masterContract) virtual public;

}

contract MasterContract is MasterTools{
    address public storageContract;
    address public vaultContract;
    address public factoryContract;
    
    mapping (address=>bool) isAdmin;

    constructor(){
        isAdmin[msg.sender] = true;
    }

    modifier onlyAdmins(){
        require(isAdmin[msg.sender],"Only Admins can execute this function");
        _;
    }

    function initMasterContract(address _storageContract) external onlyAdmins{
        // We load the addresses of the rest of the contracts
        storageContract = _storageContract;
        StorageContract storageContInstance = StorageContract(_storageContract);
        vaultContract = storageContInstance.vaultContract();
        factoryContract = storageContInstance.factoryContract();
    }

    function addAdmin(address _admin) external onlyAdmins{
        require(_admin != address(0x0),"Address args cannot be null");
        isAdmin[_admin] = true;

        StorageContract storageContInstance = StorageContract(storageContract);
        storageContInstance.addAdmin(_admin);

    }

    function removeAdmin(address _admin) external onlyAdmins{
        require(_admin != address(0x0),"Address args cannot be null");
        isAdmin[_admin] = false;
    }

    // Updaters

    function updateStorageContract (address _storageContract) external onlyAdmins{
        require(_storageContract != address(0x0),"Address args cannot be null");
        storageContract = _storageContract;
    }

    function updateFactoryContract (address _factoryContract) external onlyAdmins{
        require(_factoryContract != address(0x0),"Address args cannot be null");
        factoryContract = _factoryContract;
        
        StorageContract _storageContract = StorageContract(storageContract);
        _storageContract.setFactoryContract(_factoryContract);
    }    
    
    function updateVaultContract (address _vaultContract) external onlyAdmins{
        require(_vaultContract != address(0x0),"Address args cannot be null");
        vaultContract = _vaultContract;

        StorageContract _storageContract = StorageContract(storageContract);
        _storageContract.setVaultContract(_vaultContract);
    }

    function setMasterContract(address _masterContract) external onlyAdmins{
        require(_masterContract != address(0x0),"Address args cannot be null");

        VaultContract _vaultContract = VaultContract(vaultContract);
        _vaultContract.setMasterContract(_masterContract);

        StorageContract _storageContract = StorageContract(storageContract);
        _storageContract.setMasterContract(_masterContract);

        FactoryContract _factoryContract = FactoryContract(factoryContract);
        _factoryContract.setMasterContract(_masterContract);
    }

    // Interacting specifically with the Vault

    function mint_index(address _index, address receiver, uint256[] calldata _collateral) external {
        require((_index != address(0x0))&&(receiver != address(0x0)),"Address args cannot be null");
        require(_collateral.length!=0,"Array args cannot be null/empty");
        require(checkEmptyInUintArray(_collateral),"Collateral array cannot have an empty token");

        VaultContract _vaultContract = VaultContract(vaultContract);
        _vaultContract.mint_index(_index, receiver, _collateral);       
    }

    function redeem_index(address _index, address receiver, uint index_amount_to_redeem) external{
        require((_index != address(0x0))&&(receiver != address(0x0)),"Address args cannot be null");
        require(index_amount_to_redeem != 0 , "Cannot redeem none index. Maybe you sent decimals without transforming?");

        VaultContract _vaultContract = VaultContract(vaultContract);
        _vaultContract.redeem_index(_index, receiver, index_amount_to_redeem); 
    }

    // Interacting specifically with the Storage

    function getIndexCreator(address _index) public view onlyAdmins returns(address creator) {
        StorageContract _storageContract = StorageContract(storageContract);
        return _storageContract.getIndexCreator(_index);
    }

    function getAllIndexCreators() external view onlyAdmins{
        StorageContract _storageContract = StorageContract(storageContract);
        address[] calldata _indices = _storageContract.indices();

    }

    // Bulk interactions

    function create_index(address _creator, address[] calldata _collateral, uint256[] calldata _quantities) external {
        require(_creator != address(0x0),"Address args cannot be null");
        
        require((_collateral.length!=0)&&(_quantities.length!=0),"Array args cannot be null/empty");
        require(checkEmptyInAddressArray(_collateral),"Collateral array cannot have an empty token");
        require(checkEmptyInUintArray(_quantities),"Quantities array cannot have an empty token");

        address _index; // TODO: _index should be the address given by the FactoryContract after calling it

        VaultContract _vaultContract = VaultContract(vaultContract);
        _vaultContract.register_index(_index, _collateral,_quantities);
    }
}