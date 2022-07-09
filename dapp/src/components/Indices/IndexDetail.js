import { useParams } from "react-router-dom";
import { drizzleReactHooks } from '@drizzle/react-plugin'
import { useState } from "react";
import { ethers } from "ethers"

var Web3 = require('web3')


const { useDrizzleState, useDrizzle } = drizzleReactHooks;

const IndexDetail = ({ }) => {
    let { addr } = useParams();
    const { useCacheCall, drizzle } = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    let inputQuantitiesArray = {}
    let [redeemValue, setRedeemValue] = useState(0)

    let loading = true

    let handleEditCollateral = (ev,index, quantity) => {
        ev.preventDefault()
        inputQuantitiesArray[index] = quantity
        console.log(inputQuantitiesArray)
    }

    let details = useCacheCall([addr], call => {
        let name = call(addr, "name") || "";
        let symbol = call(addr, "symbol") || "";
        let details_dict = {
            name: name,
            symbol: symbol,
            address: addr
        }
        return details_dict
    })

    let [output, output_form, collateral, quantities] = useCacheCall(['StorageContract'], call => {
        let output = []
        let output_form = []
        let result = call('StorageContract', 'get_collateral', details.address) || { _collateral: [], _quantities: [] }
        for (let element = 0; element < result._collateral.length; element++) {
            output.push(
                <tr>
                    <td>{result._collateral[element]}</td>
                    <td>{parseFloat(result._quantities[element] * 10 ** -18).toFixed(5)}</td>
                </tr>
            )
            inputQuantitiesArray[result._collateral[element]]=0
            output_form.push(
                <p>
                    {result._collateral[element]}:  &nbsp;
                    <input key="collateral" type="number" name={result._collateral[element]}
                        onChange={ev => handleEditCollateral(ev, ev.target.name, ev.target.value)} />
                </p>
            )
        }
        loading = false
        return [output, output_form, result._collateral, result._quantities]
    })
    let actions = { // Watch out, the outputs are swapped because we want the user to check the OTHER option
        "mint": "Redeem your Index",
        "redeem": "Mint an Index"
    }
    let [action, setAction] = useState("mint")

    let checkValues = (array) => {
        // Check that the quantities are at the exact ratio!
        let ratio = 0
        for (let i = 0; i < array.length; i++) {
            if (ratio == 0) {
                ratio = array[i] / quantities[i]
            }
            else {
                if (ratio != array[i] / quantities[i]) {
                    return false
                }
            }
        }
        return true
    }


let handleMint = (ev) => {
    ev.preventDefault()
    let temp_array = []
    for (const [key, value] of Object.entries(inputQuantitiesArray)){
        temp_array.push(ethers.BigNumber.from(String(value * 10 ** 18)))
    }
    checkValues(temp_array) &&
        drizzle.contracts.MasterContract.methods.mint_index(details.address, drizzleState.accounts[0], collateral, temp_array).send({ from: drizzleState.accounts[0] })
}

let handleRedeem = (ev) => {
    ev.preventDefault()
    try {
        let web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
        let json_contract = require("../../contracts/ERC20.json")

        var contractConfig = {
            contractName: details.address,
            web3Contract: new web3.eth.Contract(json_contract.abi, details.address)
        }

        // Or using the Drizzle context object
        drizzle.addContract(contractConfig, [])
    }
    catch {

    }
    console.log(redeemValue * 10 ** 18)
    console.log(redeemValue)
    drizzle.contracts.StorageContract.methods.vaultContract().call()
    .then(
        (vaultContract)=>{
            drizzle.contracts[details.address].methods.approve(vaultContract, ethers.BigNumber.from(String(10 ** 20))).send({ from: drizzleState.accounts[0] })
            .then(
                ()=>{
                    drizzle.contracts.MasterContract.methods.redeem_index(details.address, drizzleState.accounts[0], ethers.BigNumber.from(String(redeemValue * 10 ** 18))).send({ from: drizzleState.accounts[0] })
                }
            )
        }
    )
}

return (
    <div className="index-detail">
        <div className="index-detail-title">
            <h2>{details.name} ({details.symbol})</h2>
        </div>
        <div className="index-detail.body">
            <p>Contract Address: {details.address}</p>
            <div className="collateral">
                <p>Collateral</p>
                <table>
                    <tr>
                        <th>Token</th>
                        <th>Quantity</th>
                    </tr>
                    {output}
                </table>

            </div>

        </div>
        {loading?
        <></>
        :
<div className="index-actions">
            <button onClick={() => { action == "mint" ? setAction("redeem") : setAction("mint") }}>{actions[action]}</button>
            {action != "redeem" ?
                <>
                    <h3>Mint this Index!</h3>
                    {output_form}
                    <div className="index-buttons">
                        <button onClick={(ev) => { handleMint(ev) }}>Mint Index</button>
                    </div>
                </>

                :

                <>
                    <h3>Redeem your Index and get your collateral back!</h3>
                    <input key="redeem" type="number" name="redeem" value={redeemValue}
                        onChange={ev => setRedeemValue(ev.target.value)} />
                    <div className="index-buttons">
                        <button onClick={(ev) => { handleRedeem(ev) }}>Redeem Index</button>
                    </div>
                </>

            }
        </div>
    }
        
    </div>
)

}

export default IndexDetail;