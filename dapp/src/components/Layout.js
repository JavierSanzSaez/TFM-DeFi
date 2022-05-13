import { Outlet } from "react-router-dom";

import Header from "./Header";
import Navegacion from "./Navegacion";

function Layout() {
    return (
        <>
            <Header />
            <Navegacion />
            <Outlet />
        </>
    );
}

export default Layout;