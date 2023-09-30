import {Header, Icon, Segment} from "semantic-ui-react";
import {Config, LotteryState} from "../../codegen/CwLotto.types";
import React from "react";
import {CountdownCard} from "./countdown-card";


export interface LotteryStateCardProps {
    lotteryState: LotteryState,
    lotteryConfig: Config
}

export const LotteryStateCard: React.FC<LotteryStateCardProps> = ({lotteryState, lotteryConfig}) => {
  return (
    <Segment>
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
      {"OPEN" in lotteryState && "at_time" in lotteryState.OPEN.expiration &&
              <CountdownCard finalDate={new Date(Number(lotteryState.OPEN.expiration.at_time) / 1e6)}/>}
      <p>
        {
          "OPEN" in lotteryState ? (
            <>Lottery is open state.</>
          ) : "CHOOSING" in lotteryState ? (
            <>The lottery is waiting to be executed on the chain.</>
          ) : "CLOSED" in lotteryState ? (
            <>Lottery has completed. Winner is: {lotteryState.CLOSED.winner} and {lotteryState.CLOSED.claimed ? (<>has not been claimed</>) : (<>has been claimed</>)}</>
          ) : <>Unknown lottery state reached</>
        }
      </p>
    </Segment>
  )
}