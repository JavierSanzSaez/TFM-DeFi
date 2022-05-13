import {drizzleReactHooks} from '@drizzle/react-plugin'

const SoloProfesor = ({children}) => {
    const {useDrizzleState, useDrizzle} = drizzleReactHooks;
    const drizzleState = useDrizzleState(state => state);    
    const { useCacheCall } = useDrizzle();

    let profesoresAddrs = useCacheCall(["Asignatura"], call => {
        let profesoresAddrs = [];
        let profesoresLength = call("Asignatura", "profesoresLength")
        for (let i = 0; i < profesoresLength; i++) {
            let profesorAddr = call("Asignatura", "profesores", i)
            profesoresAddrs.push(profesorAddr)
        }
        return profesoresAddrs;
    });

    if ( profesoresAddrs.includes(drizzleState.accounts[0])) {
        return <>
        {children}
    </>
    }
    else{
        return null
    }

};

export default SoloProfesor