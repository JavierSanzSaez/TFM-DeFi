import { drizzleReactHooks } from '@drizzle/react-plugin'

const { useDrizzleState, useDrizzle } = drizzleReactHooks;

const InitiateContracts = ({drizzle, drizzleState})=>{

    
    const masterContract = drizzle.contracts.MasterContract.address
    const storageContract = drizzle.contracts.StorageContract.address
    const vaultContract = drizzle.contracts.VaultContract.address
    const factoryContract = drizzle.contracts.FactoryContract.address
    

    const stackId = drizzle.contracts.StorageContract.methods.addAdmin.cacheSend(masterContract,{from: drizzleState.accounts[0]})
    const stackId_1 = drizzle.contracts.StorageContract.methods.setFactoryContract.cacheSend(factoryContract,{from: drizzleState.accounts[0]})
    const stackId_2 = drizzle.contracts.StorageContract.methods.setMasterContract.cacheSend(masterContract,{from: drizzleState.accounts[0]})
    const stackId_3 = drizzle.contracts.StorageContract.methods.setVaultContract.cacheSend(vaultContract,{from: drizzleState.accounts[0]})
    
    const stackId_4 = drizzle.contracts.MasterContract.methods.initMasterContract.cacheSend(storageContract,{from: drizzleState.accounts[0]})

    const stackId_5 = drizzle.contracts.FactoryContract.methods.addAdmin.cacheSend(masterContract,{from: drizzleState.accounts[0]})
    const stackId_6 = drizzle.contracts.FactoryContract.methods.setStorageContract.cacheSend(storageContract,{from: drizzleState.accounts[0]})
    const stackId_7 = drizzle.contracts.FactoryContract.methods.setMasterContract.cacheSend({from: drizzleState.accounts[0]})

    const stackId_8 = drizzle.contracts.VaultContract.methods.addAdmin.cacheSend(masterContract,{from: drizzleState.accounts[0]})
    const stackId_9 = drizzle.contracts.VaultContract.methods.setStorageContract.cacheSend(storageContract,{from: drizzleState.accounts[0]})
    const stackId_0 = drizzle.contracts.VaultContract.methods.setMasterContract.cacheSend({from: drizzleState.accounts[0]})

}

export default InitiateContracts