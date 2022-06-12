// SPDX-License-Identifier: GPL-3.O
pragma solidity >=0.8.13;
 
import {IndexContract} from "./IndexContract.sol";
import {StorageContract} from "./StorageContract.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VaultContract{

    struct Index{
        address[] collateral; // Which tokens the index references to
        uint256[] quantities; // How many of each token the index references to
    }

    mapping (address => Index) index;
    address[] registered_indexes;

    address storageContract;
    StorageContract storageContractInstance;
    address private masterContract;


    mapping(address => bool) public is_admin;

    modifier onlyAdmins{
        require(
            is_admin[msg.sender],
            "Vault Contract - Only an Admin can interact with this function"
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

    function setStorageContract(address _storageContract) external onlyAdmins {
        storageContract = _storageContract;
        storageContractInstance = StorageContract(storageContract);
    }

    function setMasterContract() external onlyAdmins{
        address _masterContract = storageContractInstance.masterContract();
        is_admin[masterContract] = false;
        is_admin[_masterContract] = true;
        masterContract = _masterContract;

    }
    function get_index(address _index) external view returns(Index memory __index) {
        return index[_index];
    }

    //Safe Math Interface
    function safeMul(uint a, uint b) public pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
 
    function safeDiv(uint a, uint b) public pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
    //

    function redeem_index(address _index, address receiver, uint index_amount_to_redeem) external onlyAdmins{
        IndexContract index_ = IndexContract(_index);
        
        require(IndexContract(_index).balanceOf(receiver)>=index_amount_to_redeem, "Cannot ask for more index that the user already has"); // The ERC-20 token has the accounting of balances, so we call it

        index_.transferFrom(address(this),receiver, index_amount_to_redeem);

        for(uint i = 0; i< index[_index].collateral.length;i++){
            address token = index[_index].collateral[i];
            uint256 quantity = index[_index].quantities[i];
            ERC20(token).transferFrom(address(this),receiver, safeMul(quantity,index_amount_to_redeem));
        }
    }

    function register_index(address _index, address[] calldata _collateral, uint256[] calldata _quantities) external onlyAdmins{
        index[_index] = Index({
            collateral: _collateral,
            quantities: _quantities
        });
    }

    function receive_collateral(address[] calldata _collateral, uint256[] calldata _quantities, address _creator) external onlyAdmins{
        for(uint256 indx = 0; indx < _collateral.length; indx++ ){
            ERC20(_collateral[indx]).transferFrom(_creator, address(this), _quantities[indx]);
        }
    }

    function mint_index(address _index, address receiver, uint256[] calldata _collateral) external onlyAdmins{
        // Since the receiver MUST send the collateral at the exact ratio of collateral, we can safely do the calculations with one of the collateral tokens
        uint256 registered_collateral = index[_index].quantities[0];
        uint256 index_to_mint = safeDiv(_collateral[0], registered_collateral);
        IndexContract(_index).mint(receiver, index_to_mint *10 **18);
    }

    receive() external payable {
    }
}