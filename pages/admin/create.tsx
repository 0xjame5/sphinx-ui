import Head from "next/head";
import {Button, Container, FormControl, FormLabel, Input,} from "@chakra-ui/react";

import {useRouter} from 'next/router'
import React, {ChangeEvent, useEffect, useState} from "react";
import {CwLottoClient} from "../../codegen/CwLotto.client";
import {useChain} from "@cosmos-kit/react";
import {chainName} from "../../config";
import {ContractContextProvider} from "../ContractContextProvider";
import {useContracts} from "../../codegen/contracts-context";
import {useCwLottoStateV2} from "../../hooks/use-cw-lotto-state-v2";
import {cosmos} from "interchain";
import signing = cosmos.tx.signing;
import { Duration, InstantiateMsg, Coin } from "../../codegen/CwLotto.types";

const CreateLayout = () => {
  const router = useRouter();
  const { cwLotto } = useContracts();
  const {address, status, getSigningCosmWasmClient} = useChain(chainName);

  const [seedValue, setSeedValue] = useState<string | null>(null);
  const handleSeedChange = (event: ChangeEvent<HTMLInputElement>) => setSeedValue(event.target.value);

  const handleButtonClick = async () => {
    getSigningCosmWasmClient().then((signingCwClient) => {

      if (signingCwClient && address) {
        let duration: Duration = { time: 500 }
        let ticketCost: Coin = { amount: "1000000", denom: "ujunox" }
        
        let lotteryInstantiate: InstantiateMsg = {
          admin: address,
          house_fee: 100, // 1%
          lottery_duration: duration,
          ticket_cost: ticketCost,
        };

        let response = signingCwClient.instantiate(
          address,
          3896,
          lotteryInstantiate,
          "Create a new lottery",
          "auto",
          undefined
        );

        response.then((msg) => {console.log(msg)})
      }
    });
  };

  return (
    <Container maxW="5xl" py={10}>
      <Head>
        <title>Sphinx | Create </title>
      </Head>
      <div>

        <>Create</>
        <Button onClick={handleButtonClick}></Button>
      </div>
    </Container>
  );
}


export default function CreatePage() {
  return (<ContractContextProvider>
    <CreateLayout />
  </ContractContextProvider>)
}
