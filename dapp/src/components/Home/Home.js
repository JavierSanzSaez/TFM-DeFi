import { drizzleReactHooks } from '@drizzle/react-plugin'

const { useDrizzleState, useDrizzle } = drizzleReactHooks;

const Home = () => {

    console.log("REaching here 1")
    const { useCacheCall } = useDrizzle();
    const drizzleState = useDrizzleState(state => state);
    console.log("REaching here 2")
    console.log(drizzleState.accounts[0])
    const allIndexCreators = useCacheCall("MasterContract", "getAllIndexCreators") || 0;
    console.log("REaching here 3")

    return (
        <div className="home">
            <div className="home-soloOwner">
                {drizzleState.accounts[0]? 
                <h1>Hi! You are connected with address {drizzleState.accounts[0]} </h1>
                : 
                <h1>Hi! You are not connected with MetaMask</h1>
                }   
            </div>
            <div className="home-numberOfIndices">
                <p>Currently there are {allIndexCreators.length} indices created</p>
            </div>
        </div>
    );
}

export default Home;