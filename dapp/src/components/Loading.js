import {drizzleReactHooks} from '@drizzle/react-plugin';

const { useDrizzleState } = drizzleReactHooks;

const Loading = ({children}) => {

    const initialized = useDrizzleState(state => state.drizzleStatus.initialized);

    // Check Web3 compatibility
    if (typeof window.ethereum === "undefined") {
        return (<main><h1>Please install MetaMask to use this page</h1></main>);
    }

    if (!initialized) {
        return (<main><h1>Loading Dapp</h1></main>);
    }

    // Check if connected to Ganache
    if (window.ethereum.chainId && window.ethereum.chainId !== "0x539") {
        return (<main><h1>Please use Ganache to use this page. Current chainId: {window.ethereum.chainId}</h1></main>);
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
