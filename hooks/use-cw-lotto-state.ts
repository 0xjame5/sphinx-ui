import {useEffect, useState} from "react";
import {useChain} from "@cosmos-kit/react";
import {CwLottoQueryClient} from "../codegen/CwLotto.client";
import {LotteryState} from "../codegen/CwLotto.types";
import {chainName} from "../config";


export function useCwLottoState(contractAddress: string) {
  const {
    address,
    chain: chainInfo,
    getCosmWasmClient,
  } = useChain(chainName);

  const [queryClient, setQueryClient] = useState<CwLottoQueryClient | null>(null);

  useEffect(() => {
    getCosmWasmClient().then((cosmwasmClient) => {
      if (!cosmwasmClient || !address) {
        console.error("cosmwasmClient undefined or address undefined.");
        return;
      }
      setQueryClient(new CwLottoQueryClient(cosmwasmClient, contractAddress));
    });
  }, [address, contractAddress, getCosmWasmClient]);

  const [state, setState] = useState<LotteryState | null>(null);

  useEffect(() => {
    if (queryClient && address) {
      queryClient.lotteryState().then((lotteryStateResp => {
        let y = lotteryStateResp.lotto_state;
        setState(y);
      }))
    }
  }, [queryClient, address]);

  return state;
}
