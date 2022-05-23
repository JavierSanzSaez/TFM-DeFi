import { drizzleReactHooks } from '@drizzle/react-plugin'

const { useDrizzleState, useDrizzle } = drizzleReactHooks;

const Home = () => {

    const { useCacheCall } = useDrizzle();
    const drizzleState = useDrizzleState(state => state);
    //const allIndexCreators = useCacheCall("MasterContract", "getAllIndexCreators") || 0;
    const allIndexCreators = 10

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
                {
                allIndexCreators.length !== 0 ?
//                    <p>Currently there are {allIndexCreators.length} indices created</p>
                    <p>Currently there are 10 indices created</p>

                :
                    <p>There are no Indices created yet.</p>
                }

            </div>
        </div>
    );
}

export default Home;