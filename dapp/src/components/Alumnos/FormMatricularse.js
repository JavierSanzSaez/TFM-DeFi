import {useState} from "react";

import {drizzleReactHooks} from '@drizzle/react-plugin'

const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const Matricularse = () => {
    const {drizzle} = useDrizzle();

    // Obtener el status de la ultima transaccion enviada:
    const { transactionStack, transactions } = useDrizzleState(drizzleState => ({
        transactionStack: drizzleState.transactionStack,
        transactions: drizzleState.transactions
    }));
    const [lastStackID, setLastStackID] = useState(undefined)
    const txObject = transactions[transactionStack[lastStackID] || 'undefined'];
    const status = txObject?.status;

    // Conservar los valores metidos en el formulario
    let [nombre, setNombre] = useState("")
    let [email, setEmail] = useState("")
    let [dni, setDni] = useState("")

    return (<article className="AppMisDatos">
        <h3>Automatricula</h3>
            <form>
                <p>
                    Nombre del Alumno:  &nbsp;
                    <input key="nombre" type="text" name="nombre" value={nombre} placeholder="Nombre del alumno"
                            onChange={ev => setNombre(ev.target.value)}/>
                </p>
                <p>
                    Email:  &nbsp;
                    <input key="email" type="text" name="email" value={email} placeholder="Email"
                            onChange={ev => setEmail(ev.target.value)}/>
                </p>
                <p>
                    DNI:  &nbsp;
                    <input key="dni" type="text" name="dni" value={dni} placeholder="DNI"
                            onChange={ev => setDni(ev.target.value)}/>
                </p>

                <button key="submit" className="pure-button" type="button"
                        onClick={ev => {
                            ev.preventDefault();
                                const stackId = drizzle.contracts.Asignatura.methods.automatricula.cacheSend(nombre, email, dni);
                            setLastStackID(stackId);
                        }}>
                    Automatricula
                </button>

                <p> Último estado = {status} </p>
            </form>
    </article>);
};

export default Matricularse
