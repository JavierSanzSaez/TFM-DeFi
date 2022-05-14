import { drizzleReactHooks } from '@drizzle/react-plugin'

const OnlyAdmin = ({ children }) => {
    const { useDrizzleState, useDrizzle } = drizzleReactHooks;
    const drizzleState = useDrizzleState(state => state);
    const { useCacheCall } = useDrizzle();

    let isAdmin = useCacheCall("MasterContract", "isAdmin", drizzleState.accounts[0])

    return (
        isAdmin ?
            <>
                {children}
            </>
            :
            null
    )

};

export default OnlyAdmin