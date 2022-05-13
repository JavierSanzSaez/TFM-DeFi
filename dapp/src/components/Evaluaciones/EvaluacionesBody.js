import EvaluacionRow from "./EvaluacionRow";

const EvaluacionesBody = ({evaluacionesLength}) => {

    let rows = [];
    for (let i = 0; i < evaluacionesLength; i++) {
        rows.push(<EvaluacionRow key={"eb-"+i} evaluacionIndex={i}/>);
    }
    return <tbody>{rows}</tbody>;
};

export default EvaluacionesBody;
