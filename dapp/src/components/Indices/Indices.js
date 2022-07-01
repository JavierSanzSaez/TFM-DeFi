import { drizzleReactHooks } from '@drizzle/react-plugin'
import IndexCard from "./IndexCard";
import { useEffect, useState } from "react";

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
    const { drizzle } = useDrizzle();
    const { useCacheCall } = useDrizzle();
    const list_indices_address = useCacheCall("MasterContract", "getAllIndexCreators") || list_indices_template;

    let [indices_components, setIndices_components] = useState([])
    let [indices_addresses, setIndices_addresses] = useState([])


    for (let i = 0; i < list_indices_address.length; i++) {
        let index_address = list_indices_address[i]

        var index_name = ""
        var index_symbol = ""
        if (!drizzle.contracts[index_address]){
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

        drizzle.contracts[index_address].methods.name().call()
        .then(
            name_index => {
                index_name = name_index;
                drizzle.contracts[index_address].methods.symbol().call()
                    .then(
                        symbol_index => {
                            console.log(symbol_index)
                            index_symbol = symbol_index
                            var temp_index = [...indices_components]
                            var temp_index_addresses = [...indices_addresses]
                            console.log(index_address)
                            console.log(temp_index_addresses)
                            if (!temp_index_addresses.includes(index_address)){
                                temp_index.push(
                                    <IndexCard index_name={index_name} symbol={index_symbol} address={index_address} />
                                )
                                temp_index_addresses.push(index_address)
                                setIndices_components(temp_index)
                                setIndices_addresses(temp_index_addresses)
                            }
                            console.log(indices_addresses)

                        }
                    )
            }
        )

    }


    return (
        <div className="indices-main">
            <div className="indices-header">
                <h2>List of Indices created</h2>
            </div>
            <div className="indices-body">
                {indices_components}
            </div>
        </div>
    )
};

export default Indices;