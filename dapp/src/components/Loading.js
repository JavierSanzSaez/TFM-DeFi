import {drizzleReactHooks} from '@drizzle/react-plugin';

const { useDrizzleState } = drizzleReactHooks;

const Loading = ({children}) => {
    const initialized = useDrizzleState(state => state.drizzleStatus.initialized);

    console.log('initialized: ' + initialized)

    if (!initialized){
        return(<main>
            <h1>
                Loading Dapp...
            </h1>
        </main>)
    }

    window.ethereum.on('accountsChanged', accounts => {
        // Reloading the page with the new account
        console.log("Seleccionada otra cuenta =", accounts[0]);
        window.location.reload();
    });

    return <>
        {children}
    </>
};

export default Loading;
