import { Link } from "react-router-dom";
import { OnlyAdmin, OnlyConnected } from "../checks";

const NavBar = () => (
    <nav>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/indices/">See Indices</Link></li>

        </ul>
    </nav>
);

export default NavBar;