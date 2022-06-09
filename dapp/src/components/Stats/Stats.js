import { drizzleReactHooks } from '@drizzle/react-plugin'

const { useDrizzle } = drizzleReactHooks;

const Stats = () => {

    const { useCacheCall } = useDrizzle();
    const masterContract = useCacheCall("StorageContract", "masterContract") || "None";
    const vaultContract = useCacheCall("StorageContract", "vaultContract") || "None";
    const factoryContract = useCacheCall("StorageContract", "factoryContract") || "None";

    return (
        <div className="stats">
            <h1>Addresses of the current contracts</h1>
            <p>Master Contract: {masterContract}</p>
            <p>Factory Contract: {factoryContract}</p>
            <p>Vault Contract: {vaultContract}</p>
        </div>
    );
}

export default Stats;