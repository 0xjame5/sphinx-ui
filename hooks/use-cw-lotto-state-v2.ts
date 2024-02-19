import {useEffect, useState} from "react";
import {useChain} from "@cosmos-kit/react";
import {LotteryState} from "../codegen/CwLotto.types";
import {chainName} from "../config";
import { useContracts } from "../codegen/contracts-context";

export interface GameState {
    lotteryState: LotteryState,
    numberOfTickets: number
}

export function useCwLottoStateV2(contractAddress: string){
  const { cwLotto } = useContracts();
  const { status } = useChain(chainName);
  
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    if (status === 'Connected' && cwLotto.cosmWasmClient) {
      const getQueryClient = cwLotto.getQueryClient(contractAddress);
      getQueryClient.lotteryState()
        .then(response => {
          const gameState: GameState = {
            lotteryState: response.lotto_state,
            numberOfTickets: response.total_tickets
          };
          setState(gameState);
        })
        .catch(error => {
          console.error('Failed to fetch CwLottoConfig:', error);
        });
    }
  }, [contractAddress, status, cwLotto]);

  return state;
}
