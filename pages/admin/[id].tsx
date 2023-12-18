import Head from "next/head";
import {Button, Container, FormControl, FormLabel, Input,} from "@chakra-ui/react";
import {useCwLottoState} from "../../hooks/use-cw-lotto-state";

import {useRouter} from 'next/router'
import React, {ChangeEvent, useEffect, useState} from "react";
import {CwLottoClient} from "../../codegen/CwLotto.client";
import {useChain} from "@cosmos-kit/react";
import {chainName} from "../../config";

export default function ManagePage() {
  const router = useRouter();
  const {id} = router.query;
  const contractAddr = id as string;

  const [client, setClient] = useState<CwLottoClient | null>(null);
  const {address, getSigningCosmWasmClient} = useChain(chainName);

  const gameState = useCwLottoState(contractAddr);

  const [seedValue, setSeedValue] = useState<string | null>(null);
  const handleSeedChange = (event: ChangeEvent<HTMLInputElement>) => setSeedValue(event.target.value);

  useEffect(() => {
    if (!address) {
      return
    }
    getSigningCosmWasmClient()
      .then(signingCWClient => {
        if (!signingCWClient || !address) {
          console.error("cosmwasmClient undefined or address undefined.");
          return;
        }
        setClient(new CwLottoClient(signingCWClient, address, contractAddr));
      });
  }, [address, contractAddr, getSigningCosmWasmClient]);

  let adminComponent;

  const handleButtonClick = async () => {
    if (seedValue && seedValue != "") {
      let parsedValue = Number(seedValue);
      await client?.executeLottery({seed: parsedValue}, "auto", undefined, []);
      window.location.reload();
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
        {gameState && adminComponent}
      </div>
    </Container>
  );
}
