// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IndexContract is ERC20, ERC20Burnable, Ownable {
    address vaultContract;

    constructor(address vault_,string memory name_, string memory symbol_) ERC20(name_, symbol_) {
        vaultContract = vault_;
        approve(msg.sender, 10000000 *10 **18);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}