import {drizzleReactHooks} from '@drizzle/react-plugin'

const {useDrizzle} = drizzleReactHooks;

const Header = () => {
    const {useCacheCall} = useDrizzle();

    const nombre = useCacheCall("Asignatura", "nombre");
    const curso = useCacheCall("Asignatura", "curso");

    return (
        <header className="AppHeader">
            <h1>
                Asignatura: {nombre}-<em>{curso}</em>
            </h1>
        </header>
    );
};

export default Header;