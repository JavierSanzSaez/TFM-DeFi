import {useState} from "react";

import {drizzleReactHooks} from '@drizzle/react-plugin'

import { SoloProfesor } from "components/checks";

const {useDrizzle, useDrizzleState} = drizzleReactHooks;


/*
PENDIENTE DE INVESTIGAR:
Si se usa useCacheSend, se envian varias transacciones cada vez que se hace un submit del formulario.
El problema esta relacionado con actualizar el estado del stackIds dentro de la implementacion de ese hook.
 */

const Calificar = () => {
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
    let [alumnoAddr, setAlumnoAddr] = useState("")
    let [indexEval, setEvalIndex] = useState("")
    let [tipo, setTipo] = useState("")
    let [calificacion, setCalificacion] = useState("")

    return (<article className="AppMisDatos">
        <h3>Calificar</h3>
        <SoloProfesor>
            <form>
                <p>
                    Dirección del Alumno:  &nbsp;
                    <input key="alumno" type="text" name="alumno" value={alumnoAddr} placeholder="Dirección del alumno"
                           onChange={ev => setAlumnoAddr(ev.target.value)}/>
                </p>
                <p>
                    Índice de la Evaluación:  &nbsp;
                    <input key="evaluacion" type="number" name="evaluacion" value={indexEval}
                           placeholder="Índice de la evaluación"
                           onChange={ev => setEvalIndex(ev.target.value)}/>
                </p>
                <p>
                    Tipo: (0=NP 1=Nota 2=MH):  &nbsp;
                    <input key="tipo" type="number" name="tipo" value={tipo} placeholder="Tipo de nota"
                           onChange={ev => setTipo(ev.target.value)}/>
                </p>
                <p>
                    Nota (x10):  &nbsp;
                    <input key="calificacion" type="number" name="calificacion" value={calificacion} placeholder="Nota"
                           onChange={ev => setCalificacion(ev.target.value)}/>
                </p>

                <button key="submit" className="pure-button" type="button"
                        onClick={ev => {
                            ev.preventDefault();
                             const stackId = drizzle.contracts.Asignatura.methods.califica.cacheSend(alumnoAddr, indexEval, tipo, calificacion);
                            setLastStackID(stackId);
                        }}>
                    Calificar
                </button>

                <p> Último estado = {status} </p>
            </form>
        </SoloProfesor>
    </article>);
};

export default Calificar;
