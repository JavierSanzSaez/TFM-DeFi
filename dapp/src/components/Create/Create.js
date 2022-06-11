import { useState } from "react";
import { drizzleReactHooks } from '@drizzle/react-plugin'
var Web3 = require('web3')

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

    let [collateralArray, setCollateralArray] = useState([{ token: "", quantity: 0, approved: false }])

    // handle input change
    const handleInputChange = (e, index) => {
        let newCollateralArray = [...collateralArray];
        newCollateralArray[index][e.target.name] = e.target.value;
        setCollateralArray(newCollateralArray);
    };

    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
        let poppedArray = [...collateralArray]
        poppedArray.splice(index, 1)
        setCollateralArray(poppedArray);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        let new_element = { token: "", quantity: 0, approved: false }
        setCollateralArray([...collateralArray, new_element]);
    };

    const handleSubmit = (ev) => {

        ev.preventDefault();
        let temp_tokens = []
        let temp_quantities = []
        for (let i = 0; i < collateralArray.length; i++) {
            temp_tokens.push(collateralArray[i].token);
            temp_quantities.push(collateralArray[i].quantity * 10 ** 18)
        }

        setTokensIndex(temp_tokens);
        setQuantitiesIndex(temp_quantities);

        console.log({
            "symbol": symbol,
            "name": name_index,
            "_collateral": tokensIndex,
            "_quantities": quantitiesIndex
        })

        const stackId = drizzle.contracts.MasterContract.methods.create_index.cacheSend(drizzleState.accounts[0], tokensIndex, quantitiesIndex, name_index, symbol);
        setLastStackID(stackId);
    }

    const onHandleApproveToken = (token_address, index) => {

        let web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
        web3.eth.getBalance("")
        .then(function(result){
            console.log(result)
        })
        let json_contract = require("../../contracts/ERC20.json")

        let web3Contract = new web3.eth.Contract(json_contract.abi, token_address)

        let masterContract = drizzle.contracts['MasterContract'].address
        let storageContract = drizzle.contracts['StorageContract'].address

        web3Contract.methods.approve(masterContract, 10000000).send({from:drizzleState.accounts[0]})
        .on(
            'receipt', function(){
                    let newCollateralArray = [...collateralArray];
                    newCollateralArray[index].approved = true;
                    setCollateralArray(newCollateralArray);
            }
            )
    }

    return (
        <article className="FormCollateral">
            <h3>Create an Index!</h3>
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
                collateralArray.map((input, index) => {
                    return (
                        <div className="collateral-entry" key={index}>
                            <input name="token" type="text" value={input.token} placeholder="0x...."
                                onChange={e => handleInputChange(e, index)} />
                            <input name="quantity" type="number" value={input.quantity}
                                onChange={e => handleInputChange(e, index)} />
                            <div className="btn-box">
                                {
                                    index == collateralArray.length - 1 ?
                                        (<button className="mr10"
                                            onClick={() => handleAddClick(index)}>Add more</button>)
                                        :
                                        (<button className="mr10"
                                            onClick={() => handleRemoveClick(index)}>Remove</button>)
                                }
                            </div>

                            {!input.approved && input.token.length == 42 ?
                                <button onClick={() => onHandleApproveToken(input.token, index)}>
                                    Approve token
                                </button>
                                :
                                <></>
                            }

                        </div>
                    )
                })
            }

            <button className="pure-button" type="button" onClick={(ev) => handleSubmit(ev)}>
                Create Index
            </button>

            {/* <p> Último estado = {status} </p> */}
        </article>);
}

export default Create;