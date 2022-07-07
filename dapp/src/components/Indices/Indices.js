import { drizzleReactHooks } from '@drizzle/react-plugin'
import IndexCard from "./IndexCard";
var Web3 = require('web3')

const { useDrizzle } = drizzleReactHooks;

const list_indices_template = [
    {
        name: "Test 1",
        symbol: "TEST1",
        address: "0x123"
    },
    {
        name: "Test 2",
        symbol: "TEST2",
        address: "0x333"
    },
    {
        name: "Test 3",
        symbol: "TEST3",
        address: "0x999"
    }
]

const Indices = () => {
    const { useCacheCall, drizzle } = useDrizzle();
    const list_indices_address = useCacheCall("MasterContract", "getAllIndexCreators");

    for (let i = 0; i < list_indices_address.length; i++) { // Loading all index contracts to Drizzle
        let index_address = list_indices_address[i]

        if (!drizzle.contracts[index_address]) {
            try {
                console.log("Trying Web3")
                let web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
                let json_contract = require("../../contracts/ERC20.json")

                var contractConfig = {
                    contractName: index_address,
                    web3Contract: new web3.eth.Contract(json_contract.abi, index_address)
                }

                // Or using the Drizzle context object
                drizzle.addContract(contractConfig, [])

            }
            catch {
            }
        }
    }

    let cells = useCacheCall(list_indices_address, call => {
        let cells = [];

        for (let i = 0; i < list_indices_address.length; i++) {
            let name = call(list_indices_address[i], "name") || "";
            let symbol = call(list_indices_address[i], "symbol") || "";

            cells.push(
                <IndexCard index_name={name} symbol={symbol} address={list_indices_address[i]} />
            )
        }
        return cells;
    });

    return (
        <div className="indices-main">
            <div className="indices-header">
                <h2>List of Indices created</h2>
            </div>
            <div className="indices-body">
                {
                    cells
                }
            </div>
        </div>
    )

};

export default Indices;