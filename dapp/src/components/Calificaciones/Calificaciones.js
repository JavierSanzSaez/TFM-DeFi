import CalificacionesHead from "./CalificacionesHead";
import CalificacionesBody from "./CalificacionesBody";
import Calificar from "./Calificar";

const Calificaciones = () => {

    return (
        <section className="AppCalificaciones">
            <h2>Calificaciones</h2>
            <table>
                <CalificacionesHead />
                <CalificacionesBody />
            </table>

            <Calificar/>
        </section>
    );
};

export default Calificaciones;
