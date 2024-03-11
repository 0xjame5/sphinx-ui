import {useRouter} from 'next/router';
import {Container} from "@chakra-ui/react";
import Head from "next/head";
import {Grid, Segment} from 'semantic-ui-react'
import {useChain} from "@cosmos-kit/react";
import React from "react";
import {chainName} from "../../config";
import {GameStateCard} from "../../components/react/lotto-state-card";
import {TicketCard} from "../../components/react/ticket-card";
import {ClaimButton} from "../../components/forms/claim-button";
import {BuyTicketsForm} from "../../components/forms/buy-tickets";
import {ContractContextProvider} from "../ContractContextProvider";
import {useCwLottoConfigV2} from "../../hooks/use-cw-lotto-config-v2";
import {useCwLottoStateV2} from "../../hooks/use-cw-lotto-state-v2";
import {useCwLottoTicketCountV2} from "../../hooks/use-cw-lotto-ticket-count-v2";

const PlayPageLayout = () => {
  const router = useRouter();
  const {id} = router.query;
  const contractAddr = id as string;
  const {address} = useChain(chainName);

  let lottoConfig = useCwLottoConfigV2(contractAddr);
  let gameState = useCwLottoStateV2(contractAddr);
  let ticketCount = useCwLottoTicketCountV2(contractAddr)

  const lottoState = gameState?.lotteryState;

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
                <GameStateCard contractAddress={contractAddr} showPlayButton={false}/>
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
                    {lottoConfig &&
                                          <BuyTicketsForm config={lottoConfig} contractAddr={contractAddr}/>}
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
  )
};

export default function PlayPage() {
  return (<ContractContextProvider>
    <PlayPageLayout/>
  </ContractContextProvider>);
}
