import {useEffect, useState} from "react";
import {useChain} from "@cosmos-kit/react";
import {Config} from "../codegen/CwLotto.types";
import {chainName} from "../config";
import { useContracts } from "../codegen/contracts-context";

export interface GameState {
    lotteryState: LotteryState,
    numberOfTickets: number
}

export function useCwLottoStateV2(contractAddress: string){
  const { cwLotto } = useContracts();
  const { status } = useChain(chainName);
  
  const [config, setState] = useState<GameState | null>(null);

  useEffect(() => {
    if (status === 'Connected' && cwLotto.cosmWasmClient) {
      const getQueryClient = cwLotto.getQueryClient(contractAddress);
      getQueryClient.lotteryState()
        .then(configResp => {
            const gameState: GameState = {
                lotteryState: configResp.lotto_state,
                numberOfTickets: configResp.total_tickets
            };
            setState(gameState);
        })
        .catch(error => {
          console.error('Failed to fetch CwLottoConfig:', error);
        });
    }
  }, [contractAddress, status, cwLotto]); //

  // if (status == 'Connected' && cwLotto.cosmWasmClient) {
  //   const getQueryClient = cwLotto.getQueryClient(contractAddress);
  //   getQueryClient.config().then((configResp => setConfig(configResp.config)))
  // }
  return config;
}
