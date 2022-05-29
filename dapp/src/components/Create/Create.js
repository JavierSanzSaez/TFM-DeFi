import { useState } from "react";
import { drizzleReactHooks } from '@drizzle/react-plugin'

const { useDrizzleState, useDrizzle } = drizzleReactHooks;

const Create = () => {
    const { drizzle } = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    // Obtener el status de la ultima transaccion enviada:
    const { transactionStack, transactions } = useDrizzleState(drizzleState => ({
        transactionStack: drizzleState.transactionStack,
        transactions: drizzleState.transactions
    }));
    const [lastStackID, setLastStackID] = useState(undefined)
    const txObject = transactions[transactionStack[lastStackID] || 'undefined'];
    const status = txObject?.status;

    // Conservar los valores metidos en el formulario
    let [name_index, setName_index] = useState("")
    let [symbol, setSymbol] = useState("")
    let [tokensIndex, setTokensIndex] = useState([])
    let [quantitiesIndex, setQuantitiesIndex] = useState([])

    let [collateralArray, setcollateralArray] = useState([{token:"",quantity:0}])

    // handle input change
    const handleInputChange = (e, attr) => {

        if (attr === "token") {
            let list = [...tokensIndex];
            list.append(e.target.value)
            setTokensIndex(list);
        }
        else if (attr === "quantity") {
            const list = [...quantitiesIndex];
            list.append(e.target.value)
            setQuantitiesIndex(list);
        }

    };

    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...collateralArray];
        list.splice(index, 1);
        setcollateralArray(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setcollateralArray([...collateralArray, { token: "", quantity: 0 }]);
    };


    return (<article className="AppMisDatos">
        <h3>Create an Index!</h3>
        <form>
            <p>
                Name of the Index:  &nbsp;
                <input key="name_index" type="text" name="name_index" value={name_index} placeholder="Name of the Token"
                    onChange={ev => setName_index(ev.target.value)} />
            </p>
            <p>
                Symbol:  &nbsp;
                <input key="symbol" type="text" name="symbol" value={symbol} placeholder="Symbol"
                    onChange={ev => setSymbol(ev.target.value)} />
            </p>

            {
                collateralArray.map((x, i) => {
                    return (
                        <div className="collateral-entry">
                            <input name="collateral-token" type="text" value={x.token}
                                onChange={e => handleInputChange(e, "token")} />
                            <input name="collateral-quantity" type="number" value={x.quantity}
                                onChange={e => handleInputChange(e, "quantity")} />
                            <div className="btn-box">
                                {collateralArray.length !== 1 && <button className="mr10"
                                    onClick={() => handleRemoveClick(i)}>Remove</button>}
                                {collateralArray.length - 1 === i && <button
                                    onClick={handleAddClick}>Add more</button>}
                            </div>
                        </div>
                    )
                })
            }

            <button key="submit" className="pure-button" type="button"
                onClick={ev => {
                    ev.preventDefault();
                    const stackId = drizzle.contracts.MasterContract.methods.create_index.cacheSend(drizzleState.accounts[0], tokensIndex, quantitiesIndex, name_index, symbol);
                    setLastStackID(stackId);
                }}>
                Create Index
            </button>

            <p> Último estado = {status} </p>
        </form>
    </article>);
}

export default Create;