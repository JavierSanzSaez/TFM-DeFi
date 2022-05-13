import { drizzleReactHooks } from '@drizzle/react-plugin'
import { SoloProfesor } from 'components/checks';
import { Link } from "react-router-dom";

const { useDrizzle } = drizzleReactHooks;

const CalificacionRow = ({ alumnoIndex }) => {
    const { useCacheCall } = useDrizzle();

    const alumnoAddr = useCacheCall("Asignatura", "matriculas", alumnoIndex);

    let alumnoName = useCacheCall(['Asignatura'],
        call => alumnoAddr && call("Asignatura", "datosAlumno", alumnoAddr)?.nombre
    );

    let cells = useCacheCall(['Asignatura'], call => {
        if (!alumnoAddr) { return []; }

        let cells = [];
        const evaluacionesLength = call("Asignatura", "evaluacionesLength") || 0;
        for (let ei = 0; ei < evaluacionesLength; ei++) {
            const nota = call("Asignatura", "calificaciones", alumnoAddr, ei);
            cells.push(
                <td key={"p2-" + alumnoIndex + "-" + ei}>

                    {nota?.tipo === "0" ? "N.P." : ""}
                    {nota?.tipo === "1" ? (nota?.calificacion / 10).toFixed(1) : ""}
                    {nota?.tipo === "2" ? (nota?.calificacion / 10).toFixed(1) + "(M.H.)" : ""}
                    <p></p>
                    <SoloProfesor>
                        <Link to={`nuevaCalificacion/${alumnoAddr}/${ei}`}>
                            <button>
                                Actualizar
                            </button>
                        </Link>
                    </SoloProfesor>

                </td>
            );
        }
        return cells;
    });

    return <tr key={"d" + alumnoIndex}>
        <th>A<sub>{alumnoIndex}</sub></th>
        <td>{alumnoName}</td>
        {cells}
    </tr>;
};

export default CalificacionRow;
