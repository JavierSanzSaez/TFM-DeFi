// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.13;

contract StorageContract {
    address public masterContract;
    address payable public vaultContract;
    address public factoryContract;

    mapping(address => bool) public is_admin;

    mapping(address => address) index_creators;
    address[] public indices;

    struct Index{
        address[] collateral; // Which tokens the index references to
        uint256[] quantities; // How many of each token the index references to
    }

    mapping (address => Index) index;

    modifier onlyAdmins{
        require(
            is_admin[msg.sender],
            "Storage Contract - Only an Admin can interact with this function"
        );
        _;
    }    

    constructor(){
        is_admin[msg.sender] = true;
    }

    // Setters
    function setMasterContract(address _masterContract) external onlyAdmins{
        masterContract = _masterContract;
        is_admin[masterContract] = false;
        is_admin[_masterContract] = true;
    }
    function setVaultContract(address payable _vaultContract) external onlyAdmins{
        vaultContract = _vaultContract;
    }    
    function setFactoryContract(address _factoryContract) external onlyAdmins{
        factoryContract = _factoryContract;
    }

    function addAdmin(address new_admin) external onlyAdmins{
        require(new_admin != address(0x0),"Address args cannot be null");
        is_admin[new_admin] = true;
    }
    function removeAdmin(address _admin) external onlyAdmins{
        require(_admin != address(0x0),"Address args cannot be null");
        is_admin[_admin] = false;
    }
    function checkIfAdmin(address _address) external onlyAdmins view returns(bool _is_admin){
        _is_admin = is_admin[_address]; 
    }

    function addNewIndex(address _index, address creator, address[] calldata _collateral, uint256[] calldata _quantities) external onlyAdmins{
        indices.push(_index);
        index_creators[_index] = creator;
        index[_index] = Index({
            collateral: _collateral,
            quantities: _quantities
        });
    }

    function getIndexCreator(address _index) external onlyAdmins view returns(address creator){
        creator = index_creators[_index];
    }

    function getIndicesLength() external onlyAdmins view returns(uint length){
        length = indices.length;
    }

    function get_collateral(address _index) external view returns(address[] memory  _collateral, uint256[] memory _quantities){
        _collateral = index[_index].collateral;
        _quantities = index[_index].quantities;
    }
}