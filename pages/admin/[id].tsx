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

const ManagePageLayout = () => {
  const router = useRouter();
  const {id} = router.query;
  const contractAddr = id as string;

  const { cwLotto } = useContracts();
  const {address, status} = useChain(chainName);
  const gameState = useCwLottoStateV2(contractAddr);

  const [seedValue, setSeedValue] = useState<string | null>(null);
  const handleSeedChange = (event: ChangeEvent<HTMLInputElement>) => setSeedValue(event.target.value);

  let adminComponent;

  const handleButtonClick = async () => {
    if (seedValue && seedValue != "" && address && status == "Connected") {
      let parsedValue = Number(seedValue);
      await cwLotto.getSigningClient(contractAddr)?.executeLottery({seed: parsedValue}, "auto", undefined, []);
      console.log("success")
      // window.location.reload();
    }
  };

  if (gameState?.lotteryState) {
    if ("CHOOSING" in gameState.lotteryState) {
      adminComponent = <>
        <FormControl>
          <FormLabel>Seed For Random Lottery</FormLabel>
          <Input onChange={handleSeedChange}></Input>
        </FormControl>
        <Button onClick={handleButtonClick}>submit</Button>
      </>;
    } else if ("OPEN" in gameState.lotteryState) {
      adminComponent = <div>still open</div>;
    } else { // CLOSED
      adminComponent = <div>closed</div>
    }
  }

  return (
    <Container maxW="5xl" py={10}>
      <Head>
        <title>Sphinx | Manage</title>
      </Head>
      <div>
        { gameState && (<></>) }

        {gameState && adminComponent}
      </div>
    </Container>
  );
}


export default function ManagePage() {
  return (<ContractContextProvider>
    <ManagePageLayout />
  </ContractContextProvider>)
}