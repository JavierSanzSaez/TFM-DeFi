import {drizzleReactHooks} from '@drizzle/react-plugin'
import { SoloProfesor } from 'components/checks';
import { Link } from 'react-router-dom';

const {useDrizzle} = drizzleReactHooks;

const EvaluacionRow = ({evaluacionIndex}) => {
    const {useCacheCall} = useDrizzle();
    const ev = useCacheCall("Asignatura", "evaluaciones", evaluacionIndex);
    return <tr key={"EVA-" + evaluacionIndex}>
            <th>E<sub>{evaluacionIndex}</sub></th>
            <td>{ev?.nombre}</td>
            <td>{ev?.fecha ? (new Date(1000 * ev.fecha)).toLocaleString() : ""}</td>
            <td>{(ev?.puntos / 10).toFixed(1)}</td>
            <SoloProfesor>
                <td><Link to={`/evaluacion/${evaluacionIndex}`}>Ver Calificaciones</Link></td>
            </SoloProfesor>
        </tr>;
};

export default EvaluacionRow;
