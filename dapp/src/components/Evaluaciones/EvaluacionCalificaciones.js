import { drizzleReactHooks } from '@drizzle/react-plugin'
import { useParams, Link } from "react-router-dom";
import { useState } from 'react';

const { useDrizzle, useDrizzleState } = drizzleReactHooks;


export const EvaluacionCalificaciones = () => {
    const { useCacheCall, drizzle } = useDrizzle();

    let { evaluacionIndex } = useParams();

    let [nuevaNota, setNuevaNota] = useState("");
    let [nuevoTipo, setNuevoTipo] = useState("");

    // Obtener el status de la ultima transaccion enviada:
    const { transactionStack, transactions } = useDrizzleState(drizzleState => ({
        transactionStack: drizzleState.transactionStack,
        transactions: drizzleState.transactions
    }));
    const [lastStackID, setLastStackID] = useState(undefined)
    const txObject = transactions[transactionStack[lastStackID] || 'undefined'];
    const status = txObject?.status;

    let cells = useCacheCall(['Asignatura'], call => {
        let cells = [];
        const matriculadosLength = call("Asignatura", "matriculasLength") || 0;
        for (let ei = 0; ei < matriculadosLength; ei++) {
            let alumnoAddr = call("Asignatura", "matriculas", ei) || "";
            let nota = call("Asignatura", "calificaciones", alumnoAddr, evaluacionIndex) || ""
            let alumnoName = alumnoAddr && call("Asignatura", "datosAlumno", alumnoAddr)?.nombre
            cells.push(
                <tr>
                    <td>
                        {alumnoName}
                    </td>
                    <td>
                        {alumnoAddr}
                    </td>
                    <td key={"p2-" + evaluacionIndex + "-" + ei}>
                        {nota?.tipo === "0" ? "N.P." : ""}
                        {nota?.tipo === "1" ? (nota?.calificacion / 10).toFixed(1) : ""}
                        {nota?.tipo === "2" ? (nota?.calificacion / 10).toFixed(1) + "(M.H.)" : ""}
                    </td>
                    <td>
                        <input key="nuevanota" type="number" name="nuevanota" placeholder="Nueva nota"
                            onChange={ev => setNuevaNota(ev.target.value)} />
                        <select onChange={ev => setNuevoTipo(ev.target.value)}>
                            <option value="0"> N.P.</option>
                            <option value="1"> Normal</option>
                            <option value="2"> M.H.</option>
                        </select>
                        <button onClick={ev => {
                            ev.preventDefault();
                            const stackId = drizzle.contracts.Asignatura.methods.califica.cacheSend(alumnoAddr, evaluacionIndex, nuevoTipo, nuevaNota);
                            setLastStackID(stackId);
                        }}>Actualizar</button>
                    </td>

                </tr>
            )
        }
        return cells;
    });

    return (
        <div>
            <h2>
                Calificaciones para la evaluación E<sub>{evaluacionIndex}</sub>
            </h2>
            <table>
                <tr>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Calificación</th>
                    <th>Editar calificación</th>
                </tr>
                {cells}
            </table>
            <Link to="/evaluaciones">Volver</Link>
        </div>)
};

export default EvaluacionCalificaciones;