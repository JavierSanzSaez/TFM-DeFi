import {useEffect} from 'react';

import {Link, useNavigate} from "react-router-dom";

function NoMatch() {
    let navigate = useNavigate();

    useEffect(() => {
        let tid = setTimeout(() => void navigate("/"),
            5000);
        return () => void clearTimeout(tid);
    });

    return (
        <div>
            <h2>Página no encontrada</h2>
            <p>
                <Link to="/">Ir a Home</Link>
            </p>
        </div>
    );
}

export default NoMatch;
