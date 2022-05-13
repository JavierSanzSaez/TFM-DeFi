import {drizzleReactHooks} from '@drizzle/react-plugin'
import {Link} from "react-router-dom";

const {useDrizzle} = drizzleReactHooks;

const AlumnoRow = ({alumnoIndex}) => {
    const {useCacheCall} = useDrizzle();

    let {addr, datos} = useCacheCall(['Asignatura'],
        call => {
            const addr = call("Asignatura", "matriculas", alumnoIndex);
            const datos = addr && call("Asignatura", "datosAlumno", addr);
            return {addr, datos};
        }
    );

    return <tr key={"ALU-" + alumnoIndex}>
        <th>A<sub>{alumnoIndex}</sub></th>
        <td>{datos?.nombre}</td>
        <td>{datos?.email}</td>
        <td><Link to={`/alumnos/${addr}`}>Info</Link></td>
    </tr>;
};

export default AlumnoRow;
