import { drizzleReactHooks } from '@drizzle/react-plugin'

import EvaluacionesHead from "./EvaluacionesHead";
import EvaluacionesBody from "./EvaluacionesBody";
import FormEvaluaciones from './FormEvaluaciones';
import { SoloCoordinador } from 'components/checks';

const { useDrizzle } = drizzleReactHooks;

const Evaluaciones = () => {
    const { useCacheCall } = useDrizzle();

    const el = useCacheCall("Asignatura", "evaluacionesLength");

    return (
        <div className="evaluaciones"> 
            <section className="AppEvaluaciones">
                <h2>Evaluaciones</h2>
                <table>
                    <EvaluacionesHead />
                    <EvaluacionesBody evaluacionesLength={el ?? 0} />
                </table>
            </section>
            <SoloCoordinador>
                <section className="FormEvaluaciones">
                    <h2>Crear nueva evaluación</h2>
                    <FormEvaluaciones />
                </section>
            </SoloCoordinador>
        </div>
    );
};

export default Evaluaciones;
