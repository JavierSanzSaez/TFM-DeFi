import { useState } from "react";
import { drizzleReactHooks } from '@drizzle/react-plugin'
import { Link } from "react-router-dom";

var Web3 = require('web3')

const { useDrizzleState, useDrizzle } = drizzleReactHooks;

const Create = () => {
    const { drizzle } = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    // Conservar los valores metidos en el formulario
    let [name_index, setName_index] = useState("")
    let [symbol, setSymbol] = useState("")

    let [collateralArray, setCollateralArray] = useState([{ token: "", quantity: 0, approved: false }])

    let [index_created, setIndex_created] = useState(false)
    let [new_index_address, setNew_index_address] = useState("")

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
            temp_quantities.push(collateralArray[i].quantity)
        }

        drizzle.contracts.MasterContract.methods.create_index(drizzleState.accounts[0], temp_tokens, temp_quantities, name_index, symbol).send()
            .then(
                (result) => {
                    console.log(result)
                    if (result.events.IndexCreated.returnValues.index_address) {
                        setNew_index_address(result.events.IndexCreated.returnValues.index_address)
                        setIndex_created(true)
                    }
                    else {
                        setIndex_created(false)
                    }
                }
            )

    }

    const onHandleApproveToken = (token_address, index) => {

        try {
            let web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
            let json_contract = require("../../contracts/ERC20.json")

            var contractConfig = {
                contractName: token_address,
                web3Contract: new web3.eth.Contract(json_contract.abi, token_address)
            }

            // Or using the Drizzle context object
            drizzle.addContract(contractConfig, [])
        }
        catch {

        }

        drizzle.contracts.StorageContract.methods.vaultContract().call()
            .then(
                (vaultContract) => {
                    drizzle.contracts[token_address].methods.approve(vaultContract, 10000000).send({ from: drizzleState.accounts[0] })
                        .then(
                            (result) => {
                                let stackID = drizzle.contracts.VaultContract.methods.approve(token_address, drizzleState.accounts[0]).call()
                                collateralArray[index].approved = true
                                console.log("Approval successful")
                                console.log(result)
                            }
                        )

                }
            )

    }

    return (
        <article className="FormCollateral">
            {!index_created ? <>
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
                                        index === collateralArray.length - 1 ?
                                            (<button className="mr10"
                                                onClick={() => handleAddClick(index)}>Add more</button>)
                                            :
                                            (<button className="mr10"
                                                onClick={() => handleRemoveClick(index)}>Remove</button>)
                                    }
                                </div>

                                {!input.approved && input.token.length === 42 ?
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
            </>
                :
                <>
                    <h3>Congrats!</h3>
                    <p>You are now the proud creator of a new Index Token! Now you are ready to mint more or trade with your index in the usual DEXes!</p>
                    <p>Details about your new Index:</p>
                    <ul>
                        <li><p>Name: {name_index}</p></li>
                        <li><p>Symbol: {symbol}</p></li>
                        <li><p>Address: {new_index_address}</p></li>
                        <li><p>Underlying collateral:</p></li>
                        <ul>
                            {
                                collateralArray.map(
                                    (input, index) => {
                                        return (
                                            <li>{input.quantity} units of token {input.token}</li>
                                        )
                                    }
                                )
                            }
                        </ul>
                    </ul>
                    <div className="IndexButtonOptions">
                        <button>
                            <Link to="/">Go to the Main Page</Link>
                        </button>
                        <p>Or</p>
                        <button>
                            <Link to={`indices/index/${new_index_address}`}>Go to your Index Page</Link>
                        </button>
                    </div>

                </>

            }

        </article>);
}

export default Create;