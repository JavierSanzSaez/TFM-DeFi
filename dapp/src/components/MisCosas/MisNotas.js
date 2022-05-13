import {drizzleReactHooks} from '@drizzle/react-plugin'

const {useDrizzle} = drizzleReactHooks;

const MisNotas = () =>
    <section className="AppMisNotas">
        <h3>Mis Notas</h3>
        <table>
            <MisNotasHead/>
            <MisNotasBody/>
        </table>
    </section>;


const MisNotasHead = () =>
    <thead>
    <tr>
        <th>Evaluación</th>
        <th>Nota</th>
    </tr>
    </thead>;


const MisNotasBody = () => {
    const {useCacheCall} = useDrizzle();

    const evaluacionesLength = useCacheCall("Asignatura", "evaluacionesLength") || 0;

    let rows = useCacheCall(['Asignatura'], call => {
        let rows = [];
        for (let ei = 0; ei < evaluacionesLength; ei++) {
            const nota = call("Asignatura", "miNota", ei);
            const ev = call("Asignatura", "evaluaciones", ei);
            rows.push(
                <tr key={"miNotaIndex-" + ei}>
                    <td>{ev?.nombre}</td>
                    <td>
                        {nota?.tipo === "0" ? "N.P." : ""}
                        {nota?.tipo === "1" ? (nota.calificacion / 10).toFixed(1) : ""}
                        {nota?.tipo === "2" ? (nota.calificacion / 10).toFixed(1) + "(M.H.)" : ""}
                    </td>
                </tr>);
        }
        return rows;
    });

    return <tbody>{rows}</tbody>;
};

export default MisNotas;
