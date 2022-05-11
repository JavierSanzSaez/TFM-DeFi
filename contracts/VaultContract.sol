// SPDX-License-Identifier: GPL-3.O
pragma solidity >=0.8.13;
 
// ERC-20 Interface
interface ERC20Interface {
    function totalSupply() external view returns (uint);
    function balanceOf(address tokenOwner) external view returns (uint balance);
    function allowance(address tokenOwner, address spender) external view returns (uint remaining);
    function transfer(address to, uint tokens) external returns (bool success);
    function approve(address spender, uint tokens) external returns (bool success);
    function transferFrom(address from, address to, uint tokens) external returns (bool success);
 
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

//Safe Math Interface
 
contract SafeMath {
 
    function safeAdd(uint a, uint b) public pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
 
    function safeSub(uint a, uint b) public pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
 
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

    function get_index(address _index) external view returns(Index memory __index) {
        return index[_index];
    }

    function redeem_index(address _index, address receiver, uint index_amount_to_redeem) external onlyMasterContract{
        require((_index != address(0)) && (receiver != address(0)),"Cannot send the null address as args");
        require(ERC20Interface(_index).balanceOf(receiver)>=index_amount_to_redeem, "Cannot ask for more index that the user already has"); // The ERC-20 token has the accounting of balances, so we call it
        ERC20Interface(_index).transfer(address(this), index_amount_to_redeem);
        for(uint i = 0; i< index[_index].collateral.length;i++){
            address token = index[_index].collateral[i];
            uint256 quantity = index[_index].quantities[i];
            ERC20Interface(token).transfer(receiver, safeMul(quantity,index_amount_to_redeem));
        }
    }

    function register_index(address _index, address[] calldata _collateral, uint256[] calldata _quantities ) external onlyMasterContract{
        require(_index != address(0),"Cannot send the null address as args");
        require((_collateral.length > 0) && (_quantities.length > 0), "Cannot send empty array as args");
        index[_index] = Index({
            collateral: _collateral,
            quantities: _quantities
        });

    }

    function mint_index(address _index, address receiver, uint256[] calldata _collateral) external onlyMasterContract returns(bool result){
        require((_index != address(0)) && (receiver != address(0)),"Cannot send the null address as args");
        require(_collateral.length > 0, "Cannot send empty array as args");

        // Since the receiver MUST send the collateral at the exact ratio of collateral, we can safely do the calculations with one of the collateral tokens
        uint256 registered_collateral = index[_index].quantities[0];
        uint256 index_to_mint = safeDiv(_collateral[0], registered_collateral);
        return ERC20Interface(_index).transferFrom(address(this),receiver, index_to_mint);
    }

    function setMasterContract(address _masterContract) external onlyMasterContract {
        require(_masterContract != address(0),"Cannot send the null address as args");
        masterContract = _masterContract;
    }

    receive() external payable {
    }
}