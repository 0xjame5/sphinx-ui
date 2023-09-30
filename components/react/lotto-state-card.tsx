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
          "OPEN" in lotteryState ?  (
            <>Hello world</>
          ) : "PENDING" in lotteryState ? (
            <>Waiting for lottery to be executed</>
          ) : <>Lottery has finished</>
        }
      </Header>
      {"OPEN" in lotteryState && "at_time" in lotteryState.OPEN.expiration &&
          <CountdownCard finalDate={new Date(Number(lotteryState.OPEN.expiration.at_time) / 1e6)}/>}
      <p>
        {
          "OPEN" in lotteryState ?  (
            <>Lottery is open state.</>
          ) : "PENDING" in lotteryState ? (
            <>The lottery is waiting to be executed on the chain.</>
          ) : <>Lottery has completed.</>
        }
      </p>
    </Segment>
  )
}