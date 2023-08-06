import Head from "next/head";
import {
  Button,
  Container,
  FormControl,
  FormLabel, NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput, NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";

import {useChain, useWallet} from "@cosmos-kit/react";

import {chainName, CW_LOTTO_ADDRESS, feeDenom, STAKINGDENOM} from "../config";

import {Coin} from "../codegen/CwLotto.types";

import {useRouter} from 'next/router'
import {useCwLottoState} from "../hooks/use-cw-lotto-state";
import {ChangeEvent, useEffect, useState} from "react";
import {CwLottoClient} from "../codegen/CwLotto.client";
import {useCwLottoConfig} from "../hooks/use-cw-lotto-config";

/*
* If In progress then make it possible to buy tickets. Define how many inputted tickets enabled
* else:
* - trigger winning state
*
* */
// Call Contract, with defined address of smart contract. Grab the current state and
// depending on the state we can render a couple of UIs.
// Grab the contract
// - In Progress
// -> Buy tickets
// In Finals
// - Winner
// -
export default function Gamble() {
  const router = useRouter();
  const [signingClient, setSigningClient] = useState<CwLottoClient | null>(null);
  const [inputValue, setInputValue] = useState<string | ReadonlyArray<string> | number | undefined>(undefined);
  const { address, getSigningCosmWasmClient, getRestEndpoint, getRpcEndpoint, chain }= useChain(chainName);

  const [numTickets, setNumTickets] = useState<number | null | undefined>(null);
  const lottoState = useCwLottoState(CW_LOTTO_ADDRESS);
  const lottoConfig = useCwLottoConfig(CW_LOTTO_ADDRESS);

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
        setSigningClient(new CwLottoClient(signingCWClient, address, CW_LOTTO_ADDRESS));
      });
  }, [address, getSigningCosmWasmClient]);

  useEffect(() => {
    if (!address || !signingClient) {return}

    signingClient.ticketCount({addr: address}).then(x => {
      setNumTickets(x.tickets);
    });

  },  [address, signingClient]);


  let lottoComponent;
  let currenBoughtNumber;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {

    setInputValue(Number(event.target.value));
  };

  const handleButtonClick =   async () => {
    let ticketUnitCost: string | undefined = lottoConfig?.ticket_unit_cost.amount;
    let ticketUnitDenom: string | undefined = lottoConfig?.ticket_unit_cost.denom;

    if (ticketUnitDenom == undefined || ticketUnitCost == undefined) {
      console.error("Test world");
      return;
    }

    let totalCost = Number(inputValue) * Number(ticketUnitCost);

    let fee: Coin = {
      amount: totalCost.toString(), denom: ticketUnitDenom,
    };
  };

  if (numTickets) {
    currenBoughtNumber = <div>
      Tickets currently bought: {numTickets}
    </div>
  }

  if (lottoState) {
    if ("OPEN" in  lottoState) {
      const openState = lottoState.OPEN;
      // hey you can vote and try and get tickets. =]
      console.log(lottoState.OPEN.expiration);

      // if open, see how many tickets we have bought.
      // render components that can then be executable.

      let expiration = openState.expiration;

      if ('at_time' in expiration) {
        const atTimeValue = expiration.at_time

        // if expiration time is after today, let the user update the state to the in progress to decide winner
        // for now, assume that they can vote.
        let expirationTime = new Date(Number(expiration.at_time) / 1e6)
        lottoComponent = <>
          We are open lotto state {expirationTime.toDateString()}
          <FormControl>
            <FormLabel>Amount</FormLabel>
            <NumberInput max={50} min={0}>
              <NumberInputField value={inputValue} onChange={handleInputChange} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          <Button onClick={handleButtonClick}>submit</Button>
        </>
      } else {
        console.error("We don't care")
      }

      // if a user can vote, he can enable somethings via the execute function so now we need
      // to do so this.
    } else if ('CHOOSING' in lottoState) {
      const choosingState = lottoState.CHOOSING;
      lottoComponent  = <div>
        We are waiting for admin to execute the winning lottery.
      </div>
    } else if ('CLOSED' in lottoState) {
      const closedState = lottoState.CLOSED;

      if (closedState.claimed) {
        lottoComponent  = <div>
          Lotto is done with winner: {closedState.winner}. and is claimed via {closedState.claimed}
        </div>
      } else {
        lottoComponent  = <div>
          Lotto is done with winner: {closedState.winner}. and is not claimed via {closedState.claimed}
          <ClaimComponent/>
        </div>
      }

    } else {
      console.error("Somehow got different lottoState")
    }
  } else {
    console.log("Value is undefined");
  }

  return (
    <Container maxW="5xl" py={10}>
      <Head>
        <title>CosmWasm Lotto</title>
        <meta name="description" content="Generated by create cosmos app"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <div>{currenBoughtNumber}</div>
      <div>{lottoComponent}</div>

    </Container>
  );
}


function ClaimComponent() {

  const { address, getSigningCosmWasmClient, getRestEndpoint, getRpcEndpoint, chain }= useChain(chainName);
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
        setSigningClient(new CwLottoClient(signingCWClient, address, CW_LOTTO_ADDRESS));
      });
  }, [address, getSigningCosmWasmClient]);


  const handleButtonClick =   async () => {
    let claimTokens = await signingClient?.claimTokens("auto", undefined, [])
  };

  return (<>
    <Button onClick={handleButtonClick}>Claim your winnings!</Button>
  </>);
}