import AlumnoRow from "./AlumnoRow";

const AlumnosBody = ({matriculasLength}) => {

    let rows = [];
    for (let i = 0; i < matriculasLength; i++) {
        rows.push(<AlumnoRow key={"ab-"+i} alumnoIndex={i}/>);
    }

    return <tbody>{rows}</tbody>;
};

export default AlumnosBody;
