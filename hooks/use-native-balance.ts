import {useState, useEffect} from "react";
import {useChain, useWallet} from "@cosmos-kit/react";
import {chainName, STAKINGDENOM} from "../config";

export function useNativeBalance(): { balance: string | undefined } {
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

  // const {getCosmWasmClient, address} = useWallet();

  const [nativeBalance, setNativeBalance] = useState<string | null>(null);
  useEffect(() => {
    getCosmWasmClient().then((cwClient) => {
      if (cwClient && address) {
        // console.error("cosmwasmClient undefined or address undefined.");
        cwClient?.getBalance(address as string, STAKINGDENOM).then(resp => {
          setNativeBalance(resp.amount);
        });
      }
    });

  }, [address, getCosmWasmClient]);

  return {balance: nativeBalance ?? undefined};
}
