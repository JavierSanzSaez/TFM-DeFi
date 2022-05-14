import { Outlet } from "react-router-dom";

import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout = ()=> {
    return (
        <>
            <Header />
            <NavBar />
            <Outlet />
            <Footer />
        </>
    );
}

export default Layout;