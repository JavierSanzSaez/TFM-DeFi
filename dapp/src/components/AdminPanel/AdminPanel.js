import { drizzleReactHooks } from '@drizzle/react-plugin'

import InitiateContracts from './InitiateContracts';

const { useDrizzle, useDrizzleState } = drizzleReactHooks;

const AdminPanel = () => {

    const { useCacheCall, drizzle } = useDrizzle();
    const drizzleState = useDrizzleState(state => state);

    const masterContract = useCacheCall("StorageContract", "masterContract") || "None";
    const vaultContract = useCacheCall("StorageContract", "vaultContract") || "None";
    const factoryContract = useCacheCall("StorageContract", "factoryContract") || "None";
    const storageContract = drizzle.contracts.StorageContract.address || "None";

    return (
    <div className='adminPanel'>
        <div className="stats">
            <h1>Addresses of the current contracts</h1>
            <p>Master Contract: {masterContract}</p>
            <p>Factory Contract: {factoryContract}</p>
            <p>Vault Contract: {vaultContract}</p>
            <p>StorageContract: {storageContract}</p>
        </div>
        <div>
            <button onClick={()=>InitiateContracts({drizzleState, drizzle})}>Start the show</button>
        </div>
    </div>

    )
}

export default AdminPanel;