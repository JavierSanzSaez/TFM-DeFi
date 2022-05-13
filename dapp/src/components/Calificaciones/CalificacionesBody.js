import {drizzleReactHooks} from "@drizzle/react-plugin";

import CalificacionRow from "./CalificacionRow";

const {useDrizzle} = drizzleReactHooks;

const CalificacionesBody = () => {
    const {useCacheCall} = useDrizzle();

    const ml = useCacheCall("Asignatura", "matriculasLength") || 0;

    let rows = [];
    for (let i = 0; i < ml; i++) {
        rows.push(<CalificacionRow key={"cb-"+i} alumnoIndex={i}/>);
    }

    return <tbody>{rows}</tbody>;
};

export default CalificacionesBody;
