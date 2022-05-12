// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.13;

//Safe Math Interface
 
contract SafeMath_ERC20 {
 
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

contract IndexContract is ERC20Interface, SafeMath_ERC20{
   
    string public symbol;
    string public  name;
    uint8 public decimals;
    uint public _totalSupply;
 
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;
  

    constructor(address vaultContract, string memory _symbol, string memory _name){
        symbol = _symbol;
        name = _name;
        decimals = 18;
        _totalSupply = 1000000000;
        balances[vaultContract] = _totalSupply;
    }
 
    function totalSupply() public view returns (uint) {
        return _totalSupply  - balances[address(0)];
    }
 
    function balanceOf(address tokenOwner) public view returns (uint balance) {
        return balances[tokenOwner];
    }
 
    function transfer(address to, uint tokens) public returns (bool success) {
        balances[msg.sender] = safeSub(balances[msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        emit Transfer(msg.sender, to, tokens);
        return true;
    }
 
    function approve(address spender, uint tokens) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
 
    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] = safeSub(balances[from], tokens);
        allowed[from][msg.sender] = safeSub(allowed[from][msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        emit Transfer(from, to, tokens);
        return true;
    }
 
    function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }
 
    receive() external payable {
        revert();
    }
}

abstract contract StorageContract {
    address public masterContract;
    address public vaultContract;

    function addNewIndex(address _index, address creator) virtual external;

}

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

    function setMasterContract(address _masterContract) external onlyMasterContract{
        masterContract = _masterContract;
    }

    function setStorageContract(address _storageContract) external onlyMasterContract {
        storageContract = _storageContract;
        storageContractInstance = StorageContract(storageContract);
    }

    function createIndex(string calldata name, string calldata symbol, address creator) external onlyMasterContract returns(address index){
        address vault = storageContractInstance.vaultContract();
        IndexContract new_index = new IndexContract(vault, name, symbol);
        storageContractInstance.addNewIndex(address(new_index), creator);
        return address(new_index);
    }
}