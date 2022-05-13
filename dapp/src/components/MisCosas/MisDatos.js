import {drizzleReactHooks} from '@drizzle/react-plugin'
import {newContextComponents} from "@drizzle/react-components";

const {AccountData} = newContextComponents;
const {useDrizzle, useDrizzleState} = drizzleReactHooks;

const MisDatos = () => {
    const {drizzle, useCacheCall} = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    const datos = useCacheCall("Asignatura", "quienSoy");

    return (
        <article className="AppMisDatos">
            <h3>Mis Datos</h3>
            <ul>
                <li>Nombre: <span style={{color: "blue"}}>{datos?._nombre || "No matriculado"}</span></li>
                <li>Email: <span style={{color: "blue"}}>{datos?._email || "No matriculado"}</span></li>

                <AccountData
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                    accountIndex={0}
                    units="ether"
                    precision={3}
                    render={({address, balance, units}) => <>
                        <li>Dirección: <span style={{color: "blue"}}>{address}</span></li>
                        <li>Balance: <span style={{color: "blue"}}>{balance}</span> {units}</li>
                    </>}
                />
            </ul>
        </article>);
};

export default MisDatos;
