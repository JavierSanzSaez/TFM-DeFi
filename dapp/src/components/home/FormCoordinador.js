import {useState} from "react";

import {drizzleReactHooks} from '@drizzle/react-plugin'

const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const FormCoordinador = () => {
    const {drizzle, useCacheCall} = useDrizzle();

    // Obtener el status de la ultima transaccion enviada:
    const { transactionStack, transactions } = useDrizzleState(drizzleState => ({
        transactionStack: drizzleState.transactionStack,
        transactions: drizzleState.transactions
    }));
    const [lastStackID, setLastStackID] = useState(undefined)
    const txObject = transactions[transactionStack[lastStackID] || 'undefined'];
    const status = txObject?.status;

    const statusMessage = status !== "" ? status:""
    // Conservar los valores metidos en el formulario
    const currentCoord = useCacheCall("Asignatura","coordinador")
    let [coordinadorAddr, setCoordinadorAddr] = useState(
        currentCoord==="0x0000000000000000000000000000000000000000"?"":currentCoord
    )

    return (<article className="AppMisDatos">
        <h3>Formulario de coordinador</h3>
            <form>
                <p>
                    Dirección del nuevo Coordinador:  &nbsp;
                    <input key="alumno" type="text" name="alumno" value={coordinadorAddr} placeholder="Dirección del coordinador"
                           onChange={ev => setCoordinadorAddr(ev.target.value)}/>
                </p>
                <button key="submit" className="pure-button" type="button"
                        onClick={ev => {
                            ev.preventDefault();
                             const stackId = drizzle.contracts.Asignatura.methods.setCoordinador.cacheSend(coordinadorAddr);
                            setLastStackID(stackId);
                        }}>
                    Actualizar
                </button>
                
                <p>{statusMessage}</p>
            </form>
    </article>);
};

export default FormCoordinador;
