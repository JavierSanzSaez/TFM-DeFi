// SPDX-License-Identifier: GPL-3.O
pragma solidity ^0.8.0;
 
//Safe Math Interface
 
contract StorageContract {

    mapping(address => address[]) index_collateral; // Which tokens the index references to
    mapping(address => int[]) index_quantities; // How many of each token the index references to

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

    function get_collateral(address index) public view onlyMasterContract returns (address[] memory) {
        require(index != address(0),"Cannot send the null address as args");
        return index_collateral[index];
    }

    function get_quantities(address index) public view onlyMasterContract returns (int[] memory) {
        require(index != address(0),"Cannot send the null address as args");
        return index_quantities[index];
    }

    function set_collateral(address index, address[] calldata collateral ) public onlyMasterContract{
        require(index != address(0),"Cannot send the null address as args");
        require(collateral.length > 0, "Cannot send empty array as args");
        index_collateral[index] = collateral;
    }

    function set_quantities(address index, int[] calldata quantities ) public onlyMasterContract  {
        require(index != address(0),"Cannot send the null address as args");
        require(quantities.length > 0, "Cannot send empty array as args");
        index_quantities[index] = quantities;
    }

    function setMasterContract(address _masterContract) public onlyMasterContract {
        require(_masterContract != address(0),"Cannot send the null address as args");
        masterContract = _masterContract;
    }

    receive() external payable {
        revert();
    }
}