import { drizzleReactHooks } from '@drizzle/react-plugin'

const { useDrizzle } = drizzleReactHooks;

const AdminPanel = () => {

    const { useCacheCall, drizzle } = useDrizzle();
    const masterContract = useCacheCall("StorageContract", "masterContract") || "None";
    const vaultContract = useCacheCall("StorageContract", "vaultContract") || "None";
    const factoryContract = useCacheCall("StorageContract", "factoryContract") || "None";
    const storageContract = drizzle.contracts.StorageContract.address || "None";

    return (
        <div className="stats">
            <h1>Addresses of the current contracts</h1>
            <p>Master Contract: {masterContract}</p>
            <p>Factory Contract: {factoryContract}</p>
            <p>Vault Contract: {vaultContract}</p>
            <p>StorageContract: {storageContract}</p>
        </div>
    );
}

export default AdminPanel;