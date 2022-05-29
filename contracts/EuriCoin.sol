// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EuriCoin is ERC20 {
    constructor() ERC20("EuriCoin", "EURI") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}
