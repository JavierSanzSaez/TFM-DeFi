import MisDatos from "./MisDatos";
import MisNotas from "./MisNotas";
import { SoloAlumno } from "components/checks";

const MisCosas = () => {

    return <section className="AppMisCosas">
        <h2>Mis Cosas</h2>
        <MisDatos />
        <SoloAlumno>
            <MisNotas />
        </SoloAlumno>
    </section>;
}

export default MisCosas;

