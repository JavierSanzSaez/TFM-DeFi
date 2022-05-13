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
            <h2>Whoops, page not found</h2>
            <p>
                <Link to="/">Go back</Link>
            </p>
        </div>
    );
}

export default NoMatch;
