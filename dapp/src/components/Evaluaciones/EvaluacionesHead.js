import { SoloProfesor } from "components/checks";

const EvaluacionesHead = () =>
    <thead>
    <tr>
        <th>#</th>
        <th>Nombre</th>
        <th>Fecha</th>
        <th>Puntos</th>
        <SoloProfesor>
            <th>Calificaciones</th>
        </SoloProfesor>
    </tr>
    </thead>;

export default EvaluacionesHead;
