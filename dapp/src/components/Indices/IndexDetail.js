import { useParams } from "react-router-dom";
import { drizzleReactHooks } from '@drizzle/react-plugin'
import { useState } from "react";

const { useDrizzle } = drizzleReactHooks;

const IndexDetail = ({ }) => {
    let { addr } = useParams();
    const { useCacheCall, drizzle } = useDrizzle();

    let details = useCacheCall([addr], call => {
        let name = call(addr, "name") || "";
        let symbol = call(addr, "name") || "";
        let details_dict = {
            name: name,
            symbol: symbol,
            address: addr
        }
        return details_dict
    })

    let output = useCacheCall(['StorageContract'], call => {
        let output = []
        let result = call('StorageContract', 'get_collateral', details.address) || { _collateral: [], _quantities: [] }
        for (let element = 0; element < result._collateral.length; element++) {
            output.push(
                <tr>
                    <td>{result._collateral[element]}</td>
                    <td>{parseFloat(result._quantities[element] * 10 ** -18).toFixed(5)}</td>
                </tr>
            )
        }
        return output
    })
    let actions = { // Watch out, the outputs are swapped because we want the user to check the OTHER option
        "mint":"Redeem your Index",
        "redeem": "Mint an Index"
    }
    let [action, setAction] = useState("mint")

    let handleMint = (ev) => {

    }

    let handleRedeem = (ev) => {

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
            <div className="index-actions">
                <button onClick={()=>{action == "mint"?setAction("redeem"):setAction("mint")}}>{actions[action]}</button>
                {action != "redeem" ?
                    <>

                        <div className="index-buttons">
                            <button onClick={(ev) => { handleMint(ev) }}>Mint Index</button>
                        </div>
                    </>

                    :

                    <>
                        <div className="index-buttons">
                            <button onClick={(ev) => { handleRedeem(ev) }}>Redeem Index</button>
                        </div>
                    </>

                }


            </div>



        </div>
    )

}

export default IndexDetail;