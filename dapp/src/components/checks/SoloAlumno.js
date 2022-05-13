import { drizzleReactHooks } from '@drizzle/react-plugin'

const SoloAlumno = ({ children }) => {
    const { useDrizzleState, useDrizzle } = drizzleReactHooks;
    const drizzleState = useDrizzleState(state => state);
    const { useCacheCall } = useDrizzle();

    let isMatriculado = useCacheCall("Asignatura", "estaMatriculado", drizzleState.accounts[0])

    return (
        isMatriculado ?
            <>
                {children}
            </>
            :
            null
    )

};

export default SoloAlumno