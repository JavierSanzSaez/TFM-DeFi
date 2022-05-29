// SPDX-License-Identifier: GPL-3.O
pragma solidity >=0.8.13;
 
import {IndexContract} from "./IndexContract.sol";
import {StorageContract} from "./StorageContract.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


//Safe Math Interface
 
abstract contract SafeMath {
 
    function safeMul(uint a, uint b) public pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
 
    function safeDiv(uint a, uint b) public pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}

contract VaultContract is SafeMath{

    struct Index{
        address[] collateral; // Which tokens the index references to
        uint256[] quantities; // How many of each token the index references to
    }

    mapping (address => Index) index;
    address[] registered_indexes;

    address public masterContract;
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

    function setMasterContract() external onlyMasterContract {
        masterContract = storageContractInstance.masterContract();
    }

    function setStorageContract(address _storageContract) external onlyMasterContract {
        storageContract = _storageContract;
        storageContractInstance = StorageContract(storageContract);
    }

    function get_index(address _index) external view returns(Index memory __index) {
        return index[_index];
    }

    function redeem_index(address _index, address receiver, uint index_amount_to_redeem) external onlyMasterContract{
        IndexContract index_ = IndexContract(_index);
        
        require(IndexContract(_index).balanceOf(receiver)>=index_amount_to_redeem, "Cannot ask for more index that the user already has"); // The ERC-20 token has the accounting of balances, so we call it

        index_.transferFrom(address(this),receiver, index_amount_to_redeem);

        for(uint i = 0; i< index[_index].collateral.length;i++){
            address token = index[_index].collateral[i];
            uint256 quantity = index[_index].quantities[i];
            ERC20(token).transferFrom(address(this),receiver, safeMul(quantity,index_amount_to_redeem));
        }
    }

    function register_index(address _index, address[] calldata _collateral, uint256[] calldata _quantities ) external onlyMasterContract{
        index[_index] = Index({
            collateral: _collateral,
            quantities: _quantities
        });

    }
    function mint_index(address _index, address receiver, uint256[] calldata _collateral) external onlyMasterContract returns(bool result){
        // Since the receiver MUST send the collateral at the exact ratio of collateral, we can safely do the calculations with one of the collateral tokens
        uint256 registered_collateral = index[_index].quantities[0];
        uint256 index_to_mint = safeDiv(_collateral[0], registered_collateral);
        return IndexContract(_index).transferFrom(address(this),receiver, index_to_mint);
    }

    receive() external payable {
    }
}