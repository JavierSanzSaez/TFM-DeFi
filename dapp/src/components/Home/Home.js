import { drizzleReactHooks } from '@drizzle/react-plugin'

const { useDrizzleState, useDrizzle } = drizzleReactHooks;

const Home = () => {

    const { useCacheCall } = useDrizzle();
    const drizzleState = useDrizzleState(state => state);
    const allIndexCreators = useCacheCall("MasterContract", "getAllIndexCreators") || [];
    return (
        <div className="home">
            <h1>
                Create your index with just three clicks!
            </h1>
            <p>
                Every index created is ERC20-compliant, so you can use it in any popular DEX!
            </p>
            <div className="home-address-connected">
                {drizzleState.accounts[0]? 
                <h3>Hi! You are connected with address {drizzleState.accounts[0]} </h3>
                : 
                <p>Hi! You are not connected with MetaMask</p>
                }   
            </div>
            <div className="home-numberOfIndices">
                {
                allIndexCreators.length !== 0 ?
                    <p>Currently there are {allIndexCreators.length} indices created</p>
                :
                    <p>There are no Indices created yet.</p>
                }

            </div>
        </div>
    );
}

export default Home;