import {useEffect, useState} from "react";
import {useChain} from "@cosmos-kit/react";
import {Config} from "../codegen/CwLotto.types";
import {chainName} from "../config";
import { useContracts } from "../codegen/contracts-context";


export function useCwLottoConfigV2(contractAddress: string){
  const { cwLotto } = useContracts();
  const { status } = useChain(chainName);
  
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    if (status === 'Connected' && cwLotto.cosmWasmClient) {
      const getQueryClient = cwLotto.getQueryClient(contractAddress);
      getQueryClient.config()
        .then(configResp => setConfig(configResp.config))
        .catch(error => {
          console.error('Failed to fetch CwLottoConfig:', error);
          // Handle error appropriately
        });
    }
  }, [contractAddress, status, cwLotto]);
  
  return config;
}
