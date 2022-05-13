import {useState} from "react";

import {drizzleReactHooks} from '@drizzle/react-plugin'

const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const FormProfesor = () => {
    const {drizzle} = useDrizzle();

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

    let [profesorAddr, setProfesorAddr] = useState("")
    let [profesorName, setProfesorName] = useState("")

    return (<article className="AppMisDatos">
        <h3>Añadir un nuevo profesor</h3>
            <form>
                <p>
                    Dirección del nuevo Profesor:  &nbsp;
                    <input key="alumno" type="text" name="alumno" value={profesorAddr} placeholder="Dirección del profesor"
                           onChange={ev => setProfesorAddr(ev.target.value)}/>
                </p>
                <p>
                    Nombre del nuevo Profesor:  &nbsp;
                    <input key="alumno" type="text" name="alumno" value={profesorName} placeholder="Nombre del profesor"
                           onChange={ev => setProfesorName(ev.target.value)}/>
                </p>
                <button key="submit" className="pure-button" type="button"
                        onClick={ev => {
                            ev.preventDefault();
                             const stackId = drizzle.contracts.Asignatura.methods.addProfesor.cacheSend(profesorAddr, profesorName);
                            setLastStackID(stackId);
                        }}>
                    Añadir
                </button>
                <p>{statusMessage}</p>
            </form>
    </article>);
};

export default FormProfesor;
