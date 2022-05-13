import { drizzleReactHooks } from '@drizzle/react-plugin'
import { useParams, Link } from "react-router-dom";
import { useState } from 'react';

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const NuevaCalificacion = () => {

    const { useCacheCall, drizzle } = useDrizzle();

    let { alumnoAddr, ei: evaluacionIndex } = useParams();

    let [nuevaNota, setNuevaNota] = useState("");
    let [nuevoTipo, setNuevoTipo] = useState("");

    // Obtener el status de la ultima transaccion enviada:
    const { transactionStack, transactions } = useDrizzleState(drizzleState => ({
        transactionStack: drizzleState.transactionStack,
        transactions: drizzleState.transactions
    }));
    const [lastStackID, setLastStackID] = useState(undefined)
    const txObject = transactions[transactionStack[lastStackID] || 'undefined'];
    const status = txObject?.status || "";

    const nombreAlumno = useCacheCall("Asignatura", "datosAlumno", alumnoAddr)?.nombre;

    return (<div>
        <h3>Editar nota del alumno {nombreAlumno} ({alumnoAddr})</h3>
        <table>
            <thead>
                <th>Nueva Nota</th>
                <th>Nuevo tipo</th>
            </thead>
            <tbody>
                <td>
                    <input key="nuevanota" type="number" name="nuevanota" placeholder="Nueva nota"
                        onChange={ev => setNuevaNota(ev.target.value)} />
                </td>
                <td>
                    <select onChange={ev => setNuevoTipo(ev.target.value)}>
                        <option value="0"> N.P.</option>
                        <option value="1"> Normal</option>
                        <option value="2"> M.H.</option>
                    </select>
                </td>
                <td>
                    <button onClick={ev => {
                        ev.preventDefault();
                        const stackId = drizzle.contracts.Asignatura.methods.califica.cacheSend(alumnoAddr, evaluacionIndex, nuevoTipo, nuevaNota);
                        setLastStackID(stackId);
                    }}>
                        Actualizar
                    </button>
                </td>
            </tbody>
        </table>


        <br />
        <Link to="/calificaciones">Volver</Link>

    </div >

    )

}

export default NuevaCalificacion