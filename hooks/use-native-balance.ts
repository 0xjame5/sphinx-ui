import {useState, useEffect} from "react";
import {useWallet} from "@cosmos-kit/react";
import {STAKINGDENOM} from "../config";

// import cosmwasm client generated with cosmwasm-ts-codegen
// import { HackCw20QueryClient } from "../codegen/HackCw20.client";

export function useNativeBalance(): {
    balance: string | undefined;
} {
    const {getCosmWasmClient, address} = useWallet();

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

