import {useEffect, useState} from "react";
import {useChain} from "@cosmos-kit/react";
import {chainName} from "../config";
import {useContracts} from "../codegen/contracts-context";


export function useCwLottoTicketCountV2(contractAddress: string) {
  const { address, chain: chainInfo} = useChain(chainName);
  const { cwLotto } = useContracts();
  const { status } = useChain(chainName);
  const [tickets, setBoughtTickets] = useState<number | null | undefined>(null);

  useEffect(() => {
    if (status === 'Connected' && address && cwLotto.cosmWasmClient) {
      const getQueryClient = cwLotto.getQueryClient(contractAddress);
      getQueryClient.ticketCount({addr: address})
        .then(configResp => setBoughtTickets(configResp.tickets))
        .catch(error => {
          console.error('Failed to fetch CwLottoConfig:', error);
          // Handle error appropriately
        });
    }
  }, [contractAddress, address, status, cwLotto]);

  return tickets;
}