import { Link } from "react-router-dom";

const IndexCard = ({ index_name, symbol, address }) => {

    let link = "index/" + address
    return (
        <div className="index-detail">
            <p>Name: {index_name}</p>
            <p>Symbol: {symbol}</p>
            <p>Address: {address}</p>
            <button>
                <Link to={link}>Get Details</Link>
            </button>
        </div>
    )
}

export default IndexCard;