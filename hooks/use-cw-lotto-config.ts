import {useEffect, useState} from "react";
import {useChain} from "@cosmos-kit/react";
import {CwLottoQueryClient} from "../codegen/CwLotto.client";
import {Config} from "../codegen/CwLotto.types";
import {chainName} from "../config";


export function useCwLottoConfig(contractAddress: string){
  const {
    address,
    getCosmWasmClient,
  } = useChain(chainName);

  const [queryClient, setQueryClient] = useState<CwLottoQueryClient | null>(
    null
  );

  useEffect(() => {
    getCosmWasmClient().then((cosmwasmClient) => {
      if (!cosmwasmClient || !address) {
        console.error("cosmwasmClient undefined or address undefined.");
        return;
      }
      setQueryClient(new CwLottoQueryClient(cosmwasmClient, contractAddress));
    });
  }, [address, contractAddress, getCosmWasmClient]);

  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    if (queryClient && address) {
      queryClient.config().then((lotteryStateResp => setConfig(lotteryStateResp.config)))
    }
  }, [queryClient, address]);

  return config;
}
