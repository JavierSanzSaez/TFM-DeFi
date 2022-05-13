import { useState } from "react";
import {drizzleReactHooks} from '@drizzle/react-plugin'

const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const FormEvaluaciones = () => {

    const {drizzle} = useDrizzle();

    const [nombreEval, setNombreEval] = useState(undefined);
    const [fechaEval, setfechaEval] = useState(undefined);
    const [puntosEval, setpuntosEval] = useState(undefined);

    // Obtener el status de la ultima transaccion enviada:
    const { transactionStack, transactions } = useDrizzleState(drizzleState => ({
        transactionStack: drizzleState.transactionStack,
        transactions: drizzleState.transactions
    }));
    const [lastStackID, setLastStackID] = useState(undefined)
    const txObject = transactions[transactionStack[lastStackID] || 'undefined'];
    const status = txObject?.status;

    return (
        <form>
            <p>
                Nombre &nbsp;
                <input key="nombreEval" type="text" name="nombreEval" placeholder="Nombre"
                    onChange={ev => setNombreEval(ev.target.value)} />
            </p>
            <p>
                Fecha &nbsp;
                <input key="fechaEval" type="date" name="fechaEval"
                    onChange={ev => setfechaEval((new Date(ev.target.value).getTime())/1000)} />
            </p>
            <p>
            Puntos (0-100) &nbsp;
                <input key="puntosEval" type="number" name="puntosEval" placeholder="Puntos"
                    onChange={ev => setpuntosEval(ev.target.value)} />
            </p>
            <button key="submit" className="pure-button" type="button"
                onClick={ev => {
                    ev.preventDefault();
                    const stackId = drizzle.contracts.Asignatura.methods.creaEvaluacion.cacheSend(nombreEval, fechaEval,puntosEval);
                    setLastStackID(stackId);
                }}>
                Crear
            </button>

            <p>{status}</p>
        </form>
    )
};

export default FormEvaluaciones;