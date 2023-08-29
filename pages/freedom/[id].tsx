import {useRouter} from 'next/router';
import {Container} from "@chakra-ui/react";
import Head from "next/head";
import {
  Button,
} from "@chakra-ui/react";

import {useChain, useWallet} from "@cosmos-kit/react";


import {Coin} from "../../codegen/CwLotto.types";
import {useCwLottoState} from "../../hooks/use-cw-lotto-state";
import React, {ChangeEvent, useEffect, useState} from "react";
import {CwLottoClient} from "../../codegen/CwLotto.client";
import {useCwLottoConfig} from "../../hooks/use-cw-lotto-config";
import {chainName} from "../../config";
import {Icon, Form, Grid, Segment} from "semantic-ui-react";

export default function FreedomPage() {
  const router = useRouter();
  const {id} = router.query;
  const contractAddr = id as string;

  const [signingClient, setSigningClient] = useState<CwLottoClient | null>(null);
  const [inputValue, setInputValue] = useState<string | ReadonlyArray<string> | number | undefined>(undefined);
  const {address, getSigningCosmWasmClient, getRestEndpoint, getRpcEndpoint, chain} = useChain(chainName);

  const [numTickets, setNumTickets] = useState<number | null | undefined>(null);
  const lottoState = useCwLottoState(contractAddr);
  const lottoConfig = useCwLottoConfig(contractAddr);

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

  useEffect(() => {
    if (!address || !signingClient) {
      return
    }
    signingClient.ticketCount({addr: address}).then(x => setNumTickets(x.tickets));
  }, [address, signingClient]);

  let lottoComponent;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(Number(event.target.value));
  };

  const handleButtonClick = async () => {
    let ticketUnitCost: string | undefined = lottoConfig?.ticket_unit_cost.amount;
    let ticketUnitDenom: string | undefined = lottoConfig?.ticket_unit_cost.denom;
    if (ticketUnitDenom == undefined || ticketUnitCost == undefined) {
      return;
    }
    let parsedInputValue = Number(inputValue);
    let totalCost = Number(inputValue) * Number(ticketUnitCost);
    let fee: Coin = {
      amount: totalCost.toString(), denom: ticketUnitDenom,
    };
    await signingClient?.buyTicket({numTickets: parsedInputValue}, "auto", undefined, [fee]);
  };

  // if (numTickets) {
  //   currenBoughtNumber = <div>Tickets currently bought: {numTickets}</div>
  // }

  if (lottoState) {
    if ("OPEN" in lottoState) {
      const openState = lottoState.OPEN;
      let expiration = openState.expiration;
      if ('at_time' in expiration) {
        // if expiration time is after today, let the user update the state to the in progress to decide winner
        // for now, assume that they can vote.
        let expirationTime = new Date(Number(expiration.at_time) / 1e6)
        lottoComponent = <>
          <Grid>
            <Grid.Row columns={2} divided={true}>
              <Grid.Column width={12}>
                                We are open lotto state {expirationTime.toDateString()}
              </Grid.Column>
              <Grid.Column width={4}>
                <TicketCard numTickets={numTickets}/>
                <Form>
                  <Form.Input
                    type="number"
                    label="Number of Tickets"
                    placeholder="Enter a number"
                    value={inputValue}
                    onChange={handleInputChange}
                  />
                  <Button onClick={handleButtonClick} type='submit'>Buy</Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </>
      }
    } else if ('CHOOSING' in lottoState) {
      const choosingState = lottoState.CHOOSING;
      lottoComponent = <><Grid>
        <Grid.Row columns={2} divided={true}>
          <Grid.Column width={12}>
                        We are waiting for admin to execute the winning lottery.
          </Grid.Column>
          <Grid.Column width={4}>
            <TicketCard numTickets={numTickets}/>
          </Grid.Column>
        </Grid.Row>
      </Grid></>
    } else if ('CLOSED' in lottoState) {
      const closedState = lottoState.CLOSED;
      if (closedState.claimed) {
        lottoComponent = <div>
                    Lotto is done with winner: {closedState.winner}. and is claimed via {closedState.claimed}
        </div>
      } else {
        lottoComponent = <div>
                    Lotto is done with winner: {closedState.winner}. and is not claimed via {closedState.claimed}
          <ClaimComponent contractAddr={contractAddr}/>
        </div>
      }
    }
  }

  return (
    <Container maxW="5xl" py={10}>
      <Head>
        <title>Sphinx</title>
        <meta name="description" content="Sphinx CosmWasm App"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <div>{lottoComponent}</div>
    </Container>
  );
}

interface ClaimComponentProps {
    contractAddr: string
}

const ClaimComponent: React.FC<ClaimComponentProps> = ({contractAddr}) => {
  const {address, getSigningCosmWasmClient, getRestEndpoint, getRpcEndpoint, chain} = useChain(chainName);
  const [signingClient, setSigningClient] = useState<CwLottoClient | null>(null);

  // only is rendered during component claimed. ok so this page will be responsible for generating
  // the assumption before initiating this component is that the state is in closed
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

  const handleButtonClick = async () => {
    await signingClient?.claimTokens("auto", undefined, []);
  };

  return (<>
    <Button onClick={handleButtonClick}>Claim your winnings!</Button>
  </>);
}

interface TicketCardProps {
    numTickets: number | undefined | null
}

const TicketCard: React.FC<TicketCardProps> = ({numTickets}) => {
  return (
    <Segment>
      {numTickets ? (
        <p><Icon name='ticket' /> Ticket count is {numTickets}</p>
      ) : (<p>no tickets bought yet</p>
      )}
    </Segment>
  )
}