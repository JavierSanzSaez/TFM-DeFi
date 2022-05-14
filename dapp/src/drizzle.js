import { Drizzle } from '@drizzle/store';
import MasterContract from "./contracts/MasterContract.json";

const options = {
    contracts: [MasterContract],
    polls: {
        accounts: 3000,
    },
    web3: {
        fallback: {
            type: "ws",
            url: "ws://127.0.0.1:7545"
        }
    }
}

export default new Drizzle(options);


