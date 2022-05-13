import { drizzleReactHooks } from '@drizzle/react-plugin'
import { useParams, Link } from "react-router-dom";

import AlumnosHead from "./AlumnosHead";
import AlumnosBody from "./AlumnosBody";
import FormMatricularse from "./FormMatricularse"

const { useDrizzle } = drizzleReactHooks;

export const Alumnos = () => {
    const { useCacheCall } = useDrizzle();

    const ml = useCacheCall("Asignatura", "matriculasLength") || 0;

    const datos = useCacheCall("Asignatura", "quienSoy");

    return (<div>
        {
            datos ?
                <section className="AppAlumnos">
                    <h2>Alumnos</h2>
                    <table>
                        <AlumnosHead />
                        <AlumnosBody matriculasLength={ml || 0} />
                    </table>
                </section>
                :
                <div>
                    <h2>Automatricularse</h2>
                    <p>No estás matriculado en esta asignatura</p>
                    <FormMatricularse />
                </div>
        }

    </div>

    );
};


export const Alumno = () => {
    const { useCacheCall } = useDrizzle();

    let { addr } = useParams();

    const datos = useCacheCall("Asignatura", "datosAlumno", addr);

    return (
        <div>
            <header className="AppAlumno">
                <h2>Alumno</h2>
            </header>
            <ul>
                <li><b>Nombre:</b> {datos?.nombre ?? "Desconocido"}</li>
                <li><b>Email:</b> {datos?.email ?? "Desconocido"}</li>
                <li><b>Address:</b> {addr}</li>
            </ul>
            <Link to="/alumnos">Volver</Link>
        </div>)
};
