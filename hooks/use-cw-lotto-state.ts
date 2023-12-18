import {useEffect, useState} from "react";
import {useChain} from "@cosmos-kit/react";
import {CwLottoQueryClient} from "../codegen/CwLotto.client";
import {LotteryState} from "../codegen/CwLotto.types";
import {chainName} from "../config";

export interface GameState {
  lotteryState: LotteryState,
  numberOfTickets: number
}

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

  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    if (queryClient && address) {
      queryClient.lotteryState().then(lotteryStateResp => {
        const gameState: GameState = {
          lotteryState: lotteryStateResp.lotto_state, numberOfTickets: lotteryStateResp.total_tickets
        };
        setState(gameState);
      })
    }
  }, [queryClient, address]);

  return state;
}
