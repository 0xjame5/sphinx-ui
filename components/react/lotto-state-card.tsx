import {Button, Header} from "semantic-ui-react";
import {Config, LotteryState} from "../../codegen/CwLotto.types";
import React from "react";
import {CountdownCard} from "./countdown-card";

export interface LotteryStateCardProps {
    lotteryState: LotteryState,
    lotteryConfig: Config,
    showPlayButton: boolean
}

export const LotteryStateCard: React.FC<LotteryStateCardProps> = ({lotteryState, lotteryConfig, showPlayButton}) => {
  return (<>
    <Header as='h3' style={{fontSize: '2em'}}>
      {
        "OPEN" in lotteryState ? (
          <>Lottery is Open</>
        ) : "CHOOSING" in lotteryState ? (
          <>Waiting for lottery to be executed</>
        ) : "CLOSED" in lotteryState ? (
          <>Lottery has finished</>
        ) : <>Unknown lottery state reached</>
      }
    </Header>
    {
      "OPEN" in lotteryState && "at_time" in lotteryState.OPEN.expiration &&
        <CountdownCard finalDate={new Date(Number(lotteryState.OPEN.expiration.at_time) / 1e6)}/>
    }

    Cost per Ticket: {lotteryConfig.ticket_unit_cost.amount}{lotteryConfig.ticket_unit_cost.denom}

    <p>
      {
        "OPEN" in lotteryState ? (
          <>Lottery is open state.</>
        ) : "CHOOSING" in lotteryState ? (
          <>The lottery is waiting to be executed on the chain.</>
        ) : "CLOSED" in lotteryState ? (
          <>Lottery has completed. Winner is: {lotteryState.CLOSED.winner} and {lotteryState.CLOSED.claimed ? (<>has been claimed</>) : (<>has not been claimed</>)}</>
        ) : <>Unknown lottery state reached</>
      }
    </p>
    {showPlayButton && "OPEN" in lotteryState && <Button>Play</Button>}
  </>
  )
}