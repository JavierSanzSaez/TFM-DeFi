import { drizzleReactHooks } from '@drizzle/react-plugin'
import IndexCard from "./IndexCard";

const { useDrizzle } = drizzleReactHooks;

const list_indices_template = [
    {
        name: "Test 1",
        symbol: "TEST1",
        address: "0x123"
    },
    {
        name: "Test 2",
        symbol: "TEST2",
        address: "0x333"
    },
    {
        name: "Test 3",
        symbol: "TEST3",
        address: "0x999"
    }
]

const Indices = () => {

    const { useCacheCall } = useDrizzle();
    const list_indices = useCacheCall("MasterContract", "getAllIndexCreators") || list_indices_template;
    console.log(list_indices)
    let indices_components = []
    for(let i =0; i< list_indices.length;i++ ){
        let index = list_indices[i]
        indices_components.push(
            <IndexCard index_name={index.name} symbol={index.symbol} address={index}/>
        )
        
    }
    
    return (
        <div className="indices-main">
            <div className="indices-header">
                <h2>List of Indices created</h2>
            </div>
            <div className="indices-body">
                {indices_components}
            </div>
        </div>
    )
};

export default Indices;