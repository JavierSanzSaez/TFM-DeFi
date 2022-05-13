import {drizzleReactHooks} from '@drizzle/react-plugin'

const ShowProfesores = () => {
    const { useDrizzle } = drizzleReactHooks;
    
    const { useCacheCall } = useDrizzle();
    const profesoresLength = useCacheCall("Asignatura", "profesoresLength") || 0;

    let profesoresAddrs = useCacheCall(["Asignatura"], call => {
        let profesoresAddrs = [];
        for (let i = 0; i < profesoresLength; i++) {
            let profesorAddr = call("Asignatura", "profesores", i) || ""
            let profesorName = call("Asignatura","getNombreProfesor", profesorAddr) || ""
            profesoresAddrs.push(
            <tr>
                <td>
                {profesorName}
                </td>
                <td>
                {profesorAddr}
                </td>
            </tr>)
        }
        return <tbody>{profesoresAddrs}</tbody>;
    });

    return (
        <div>
            <h3>Profesores actuales</h3>
            <table>
                <thead>
                    <tr>
                        <th>
                            Nombre
                        </th>
                        <th>
                            Dirección
                        </th>
                    </tr>
                </thead>
                {profesoresAddrs}
            </table>
            
        </div>

    )
}

export default ShowProfesores 