import { Outlet } from "react-router-dom";

import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout = () => {
    return (
        <>
            <Header />
            <NavBar />
            <div className="app-body">
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

export default Layout;