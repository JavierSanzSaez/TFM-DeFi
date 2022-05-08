// SPDX-License-Identifier: GPL-3.O
pragma solidity ^0.8.0;
 
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
 
contract StorageContract is SafeMath{

    mapping(address => address[]) public index_collateral; // Which tokens the index references to
    mapping(address => uint256[]) public index_quantities; // How many of each token the index references to

    address masterContract;

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

    function redeem_index(address index, address receiver, uint index_amount_to_redeem) public onlyMasterContract{
        require((index != address(0)) && (receiver != address(0)),"Cannot send the null address as args");
        require(ERC20Interface(index).balanceOf(receiver)>=index_amount_to_redeem, "Cannot ask for more index that the user already has"); // The ERC-20 token has the accounting of balances, so we call it
        ERC20Interface(index).transfer(address(this), index_amount_to_redeem);
        for(uint i = 0; i< index_collateral[index].length;i++){
            address token = index_collateral[index][i];
            uint256 quantity = index_quantities[index][i];
            ERC20Interface(token).transfer(receiver, safeMul(quantity,index_amount_to_redeem));
        }
    }

    function set_collateral(address index, address[] calldata collateral ) private{
        require(index != address(0),"Cannot send the null address as args");
        require(collateral.length > 0, "Cannot send empty array as args");
        index_collateral[index] = collateral;
    }

    function set_quantities(address index, uint256[] calldata quantities ) private{
        require(index != address(0),"Cannot send the null address as args");
        require(quantities.length > 0, "Cannot send empty array as args");
        index_quantities[index] = quantities;
    }

    function register_index(address index, address[] calldata collateral, uint256[] calldata quantities) public onlyMasterContract{
        require(index != address(0),"Cannot send the null address as args");
        require((collateral.length > 0) && (quantities.length > 0), "Cannot send empty array as args");

        set_collateral(index, collateral);
        set_quantities(index, quantities);
    }

    function mint_index(address index, address receiver, uint256[] calldata collateral) public onlyMasterContract{
        require((index != address(0)) && (receiver != address(0)),"Cannot send the null address as args");
        require(collateral.length > 0, "Cannot send empty array as args");

        // Since the receiver MUST send the collateral at the exact ratio of collateral, we can safely do the calculations with one of the collateral tokens
        uint256 registered_collateral = index_quantities[index][0];
        uint256 index_to_mint = safeDiv(collateral[0], registered_collateral);
        ERC20Interface(index).transfer(receiver, index_to_mint);
    }

    function setMasterContract(address _masterContract) public onlyMasterContract {
        require(_masterContract != address(0),"Cannot send the null address as args");
        masterContract = _masterContract;
    }

    receive() external payable {
    }
}