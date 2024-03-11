import {useChain} from "@cosmos-kit/react";
import {chainName} from "../config";
import {ContractsProvider} from "../codegen/contracts-context";

export const ContractContextProvider = ({children}: { children: any }) => {
  const {address, getCosmWasmClient, getSigningCosmWasmClient} = useChain(chainName);
  return (
    <ContractsProvider contractsConfig={{
      address,
      getCosmWasmClient,
      getSigningCosmWasmClient
    }}>
      {children}
    </ContractsProvider>
  );
};