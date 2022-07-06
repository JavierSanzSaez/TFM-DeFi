import { useParams } from "react-router-dom";
import { drizzleReactHooks } from '@drizzle/react-plugin'

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
        let result = call('StorageContract', 'get_collateral', details.address) || {_collateral: [],_quantities:[]}
        for (let element = 0; element < result._collateral.length; element++) {
            output.push(
                <tr>
                    <td>{result._collateral[element]}</td>
                    <td>{parseFloat(result._quantities[element]*10**-18).toFixed(5)}</td>
                </tr>
            )
        }
        return output
    })

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
        </div>
    )

}

export default IndexDetail;