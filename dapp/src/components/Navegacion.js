import {Link} from "react-router-dom";

const Navegacion = () => (
    <nav>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/evaluaciones/">Evaluaciones</Link></li>
            <li><Link to="/alumnos/">Alumnos</Link></li>
            <li><Link to="/calificaciones/">Calificaciones</Link></li>
            <li><Link to="/miscosas/">Mis Cosas</Link></li>
        </ul>
    </nav>
);

export default Navegacion;
