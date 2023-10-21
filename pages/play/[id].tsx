import {useRouter} from 'next/router';
import {Container} from "@chakra-ui/react";
import Head from "next/head";


import {Grid, Segment} from 'semantic-ui-react'

import {useChain} from "@cosmos-kit/react";
import {useCwLottoState} from "../../hooks/use-cw-lotto-state";
import React, {useEffect, useState} from "react";
import {CwLottoClient} from "../../codegen/CwLotto.client";
import {useCwLottoConfig} from "../../hooks/use-cw-lotto-config";
import {chainName} from "../../config";
import {GameStateCard} from "../../components/react/lotto-state-card";
import {TicketCard} from "../../components/react/ticket-card";
import {useCwLottoTicketCount} from "../../hooks/use-cw-lotto-ticket-count";
import {ClaimButton} from "../../components/forms/claim-button";
import {BuyTicketsForm} from "../../components/forms/buy-tickets";

export default function PlayPage() {
  const router = useRouter();
  const {id} = router.query;
  const contractAddr = id as string;

  const [signingClient, setSigningClient] = useState<CwLottoClient | null>(null);
  const {address, getSigningCosmWasmClient, getRestEndpoint, getRpcEndpoint, chain} = useChain(chainName);

  const lottoState = useCwLottoState(contractAddr);
  const lottoConfig = useCwLottoConfig(contractAddr);
  const ticketCount = useCwLottoTicketCount(contractAddr);

  useEffect(() => {
    getRpcEndpoint().then((resp => {
      console.log(resp)
    }));
    getRestEndpoint().then((resp => {
      console.log(resp)
    }));
  }, [address, getRestEndpoint, getRpcEndpoint]);

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
        setSigningClient(new CwLottoClient(signingCWClient, address, contractAddr));
      });
  }, [address, contractAddr, getSigningCosmWasmClient]);

  let showSegmentForOpen = lottoState && 'OPEN' in lottoState
  let showSegmentForClosed = lottoState && 'CLOSED' in lottoState && !lottoState.CLOSED.claimed && lottoState.CLOSED.winner === address
  let showSegment = showSegmentForOpen || showSegmentForClosed
  return (
    <Container maxW="5xl" py={10}>
      <Head>
        <title>Sphinx</title>
        <meta name="description" content="Sphinx CosmWasm App"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <Grid columns={2}>
        <Grid.Column width={showSegment ? 12 : 16}>
          <Segment>
            {lottoState && lottoConfig && address &&
                          <GameStateCard contractAddress={contractAddr} gameState={lottoState} gameConfig={lottoConfig}
                            showPlayButton={false}/>
            }
          </Segment>
        </Grid.Column>
        {
          lottoState ? (
            <>
              {
                'OPEN' in lottoState ? (
                  <Grid.Column width={4}><Segment>
                                        Lottery is open state.
                    {ticketCount && <TicketCard numTickets={ticketCount}/>}
                    {signingClient && lottoConfig &&
                                          <BuyTicketsForm cwLottoClient={signingClient} config={lottoConfig}/>}
                  </Segment></Grid.Column>
                ) : address && 'CLOSED' in lottoState && !lottoState.CLOSED.claimed && lottoState.CLOSED.winner.toString() === address ? (
                  <Grid.Column width={4}><Segment>
                                        You won, time to claim.
                    <ClaimButton contractAddr={contractAddr}/>
                  </Segment></Grid.Column>
                ) : <></>
              }
            </>
          ) : (
            <></>
          )
        }
      </Grid>
    </Container>
  );
}



