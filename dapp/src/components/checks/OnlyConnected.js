import {drizzleReactHooks} from '@drizzle/react-plugin';

const { useDrizzleState } = drizzleReactHooks;

const OnlyConnected = ({children}) => {

    const initialized = useDrizzleState(state => state.drizzleStatus.initialized);

    // Check Web3 compatibility
    if ((typeof window.ethereum === "undefined") ||
        !initialized ||
        (window.ethereum.chainId && window.ethereum.chainId !== "0x539") // Ganache's Chain ID
    ) {
        return null;
    }

    return <>
        {children}
    </>
};

export default OnlyConnected;
