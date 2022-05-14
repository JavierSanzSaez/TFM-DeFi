import { Link } from "react-router-dom";
import { OnlyAdmin, OnlyConnected } from "../checks";

const NavBar = () => (
    <nav>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/indices/">See Indices</Link></li>
            <OnlyConnected>
                <li><Link to="/createIndex/">CreateIndex</Link></li>
                <OnlyAdmin>
                    <li><Link to="/stats/">Stats</Link></li>
                </OnlyAdmin>
            </OnlyConnected>
        </ul>
    </nav>
);

export default NavBar;