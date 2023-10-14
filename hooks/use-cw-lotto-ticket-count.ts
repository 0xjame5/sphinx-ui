import {useEffect, useState} from "react";
import {useChain} from "@cosmos-kit/react";
import {CwLottoQueryClient} from "../codegen/CwLotto.client";
import {LotteryState} from "../codegen/CwLotto.types";
import {chainName} from "../config";


export function useCwLottoTicketCount(contractAddress: string) {
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

  const [tickets, setBoughtTickets] = useState<number | null | undefined>(null);

  useEffect(() => {
    if (queryClient && address) {
      queryClient.ticketCount({addr: address})
        .then(resp => setBoughtTickets(resp.tickets))
    }
  }, [queryClient, address]);

  return tickets;
}
