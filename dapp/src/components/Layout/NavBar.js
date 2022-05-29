import { Link } from "react-router-dom";
import { OnlyAdmin } from "../checks";

const NavBar = () => (
    <nav>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/indices/">See Indices</Link></li>
            <li><Link to="/createIndex/">Create an Index!</Link></li>
            <OnlyAdmin>
                <li><Link to="/stats/">See Stats</Link></li>
            </OnlyAdmin>
        </ul>
    </nav>
);

export default NavBar;