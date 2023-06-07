import {useEffect, useState} from "react";
import {useChain, useWallet} from "@cosmos-kit/react";
import {CwLottoQueryClient} from "../codegen/CwLotto.client";
import {LotteryState} from "../codegen/CwLotto.types";
import {chainName} from "../config";


export function useCwLottoState(contractAddress: string){
  const {
    connect,
    openView,
    status,
    username,
    address,
    message,
    wallet,
    chain: chainInfo,
    logoUrl,
    getCosmWasmClient,
  } = useChain(chainName);

  // const { getSigningCosmWasmClient, address } = useWallet();
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
