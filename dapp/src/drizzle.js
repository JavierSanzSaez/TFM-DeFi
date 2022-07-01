import { Drizzle } from '@drizzle/store';
import MasterContract from "./contracts/MasterContract.json";
import StorageContract from "./contracts/StorageContract.json";
import ERC20 from "./contracts/ERC20.json";
import VaultContract from "./contracts/VaultContract.json"
import FactoryContract from "./contracts/FactoryContract.json"

const options = {
    contracts: [MasterContract, StorageContract, VaultContract, FactoryContract], ERC20,
    polls: {
        accounts: 3000,
    },
    web3: {
        fallback: {
            type: "ws",
            url: "ws://127.0.0.1:8545"
        }
    }
}

export default new Drizzle(options);


