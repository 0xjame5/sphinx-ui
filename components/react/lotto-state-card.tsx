import {Button, Header} from "semantic-ui-react";
import {Config, LotteryState} from "../../codegen/CwLotto.types";
import React from "react";
import {CountdownCard} from "./countdown-card";
import Link from 'next/link'

export interface GameStateCardProps {
    contractAddress: string,
    gameState: LotteryState,
    gameConfig: Config,
    showPlayButton: boolean
}

export const GameStateCard: React.FC<GameStateCardProps> = ({contractAddress, gameState, gameConfig, showPlayButton}) => {
  return (<>
    <Header as='h3' style={{fontSize: '2em'}}>
      {
        "OPEN" in gameState ? (
          <>Game is Open</>
        ) : "CHOOSING" in gameState ? (
          <>Waiting for game to be executed</>
        ) : "CLOSED" in gameState ? (
          <>Game has finished</>
        ) : <>Unknown lottery state reached</>
      }
    </Header>
    {
      "OPEN" in gameState && "at_time" in gameState.OPEN.expiration &&
        <CountdownCard finalDate={new Date(Number(gameState.OPEN.expiration.at_time) / 1e6)}/>
    }
    Cost per Ticket: {gameConfig.ticket_unit_cost.amount}{gameConfig.ticket_unit_cost.denom}
    <p>
      {
        "OPEN" in gameState ? (
          <>Game is open state.</>
        ) : "CHOOSING" in gameState ? (
          <>The lottery is waiting to be executed on the chain.</>
        ) : "CLOSED" in gameState ? (
          <>


              Game has completed. Winner is: {gameState.CLOSED.winner} and {gameState.CLOSED.claimed ? (<>has been claimed</>) : (<>has not been claimed</>)}</>
        ) : <>Unknown lottery state reached</>
      }
    </p>
    { showPlayButton && <> {
      "OPEN" in GameStateCard ? (
        <Link href={`/play/${contractAddress}`} passHref><Button>Play</Button></Link>
      ):<Link href={`/play/${contractAddress}`} passHref><Button>View</Button></Link>
    }</>}
  </>
  )
}