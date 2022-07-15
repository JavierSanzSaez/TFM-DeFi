# Master Thesis Project
Development of a multicryptocurrency decentralized finances application based on the basketization of tokens.
Author: Javier Sanz Sáez, 2022
## Table of contents
- [Master Thesis Project](#master-thesis-project)
  - [Table of contents](#table-of-contents)
  - [Summary](#summary)
    - [What is this?](#what-is-this)
    - [Why focus on economic indices for your Thesis?](#why-focus-on-economic-indices-for-your-thesis)
  - [Installation](#installation)
    - [Downloading the project](#downloading-the-project)
    - [Executing the project](#executing-the-project)
  - [How does this work?](#how-does-this-work)
    - [The Index Token](#the-index-token)

## Summary
### What is this?
This project is framed under my M.Sc. in Telecommunication Engineering's Thesis project. 

The source of inspiration for this project comes from an existing technology, [Set Protocol](https://www.setprotocol.com/?ref=block123), which implements tokenized baskets on several blockchains, such as Ethereum, Polygon or Optimism.

In essence, a basket of tokens consists of an agrupation of tokens (named collateral) that is transformed into a single token. This is a fairly typical behaviour in Traditional Finances with economic indices and ETFs. In the crypto world, moreover, tokenizing this basket allows for easy trading, since the generated token normally is ERC-20 compliant and thus can be traded on the popular DEXes.

### Why focus on economic indices for your Thesis?
In the crypto world, extreme volatility is on the daily news over and over. Even stablecoins suffer greatly from it during their depegs. Economic indices, however, allow for a dampening of the volatility, since their value is the aggregate value of its collateral. This means that if an index is sectorial and focused specifically on DEXes, if one of the DEXes suffers a great devaluation due to vulnerabilities, rug pulls or similar threats, the index will experiment a way lower decrease on value compared to HODLing such DEX token by itself.

During my work at a propietary trading firm, I had the chance to delve deep into crypto and the endless possibilities of basketizing tokens. I perceived them as the key to a secure investment and a powerful indicator of crypto markets. Additionally, and best of all, the concept behind it is very simple, so it was complex enough to be implemented into my Thesis.

## Installation
### Downloading the project
Download the project in the directory of your preference

```sh
git clone https://github.com/JavierSanzSaez/TFM-DeFi.git [destination path]
```

Then you need to download the AppImage of [Ganache](https://trufflesuite.com/ganache/) and place it on the root folder of the project. 

Afterwards, you have to edit the following line inside this bash file [(start.sh)](./start.sh):

```sh
gnome-terminal -e ./ganache-[version of ganache]-[computer OS].AppImage
```

If you are using another terminal, such as Terminator or XTerm, you have to replace the command `gnome-terminal` for the corresponding terminal command.

Then you need to install all dependencies:
```bash
npm install # This installs the Truffle interface
cd dapp
npm install # This installs the ReactJS dApp 
```

In order for the dApp to work, it requires you to deploy the contracts on the Ganache Blockchain. This is achieved via Truffle. You can install Truffle with the following command:

```sh
npm install -g truffle
```

Once Truffle is installed, you can deploy the contracts with the following command
```sh
truffle migrate --reset
```
After you have deployed the contracts, you need to copy their JSONs (which will be on the [contracts/artifacts](./contracts/artifacts) folder) onto the dApp files. You can run the following command to copy them all:

```sh
cp -r ./contracts ./dapp/src/contracts
```
I have tried to use a symbolic link between these two folders, with no success. If you come up with a way to successfully implement that, please do drop a Pull Request :D 


### Executing the project
Just execute [start.sh](./start.sh):
```sh
./start.sh
```
And you're good to go! Access the dApp at [localhost:3000](http://localhost:3000)

## How does this work?
The procedure of creating an index is the following:
1. The user sends the tokens that will serve as collateral to a smart contract
2. This smart contract will create and deploy a new ERC-20 token that represents that collateral
3. The smart contract will then mint a unit of this index and send it to the user.

The main guideline used to code the smart contracts was that they should be upgradeable, that is, that I could be able to deploy different versions of contracts without having to completely pause the entire system and making several expensive deployments.

On that note, and taking into account the procedure of creation, I structured the system in four smart contracts. Below is a diagram (in Spanish :( sorry) showing the conections between the smart contracts

![Smart Contracts Diagram](images/Smart%20Contracts.png)

- **Master Contract (*Contrato maestro*)**: This contract serves as the proxy for the system. it receives all requests and executes the other contracts' functions. It is the only address allowed to interact with the rest of the contracts.
- **Factory Contract (*Contrato Fábrica*)**: Its sole purpose is to create, deploy and mint the ERC-20 index token.
- **Vault contract (*Contrato Cámara*)**: This contract is responsible for keeping the collateral sent by the user. It will only allow deposits and withdraws from the Master Contract.
- **Storage Contract (*Contrato de Almacenamiento*)**: It serves as a "database" that will store all the variables needed by the system, such as the array of indices, the array of creators and the addresses of all contracts, including itself.

With this structure in mind, we can rewrite the procedure aforementioned as the following:
1. The user interacts with the Master Contract and asks to create and index or mint an existing index.
2. Then, the Master Contract redirects the request to either:
   * The Factory Contract to create the index token
   * The Vault Contract to mint the existing index
3. After the creation/minting is done, the user then deposits the collateral directly into the Vault by means of the Master Contract
4. The system registers the new index onto the Storage Contract and cleans up

### The Index Token
The Index Token that is deployed is a minimal extension to OpenZeppelin's ERC-20 contract. The only addition is an `approve()` function calling inside the constructor, that allows the owner to transact to a great quantity of tokens. Probably this can also be removed.

One important aspect of the Index Token is that, since we are deploying the code to the blockchain, it cannot be shut down. This means that the token cannot be disabled and that anybody can trade with the token, regardless of whether the creator of the token wants it ot not.

