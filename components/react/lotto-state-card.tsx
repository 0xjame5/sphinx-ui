import {Button, Header, Icon, List} from "semantic-ui-react";
import {Config} from "../../codegen/CwLotto.types";
import React from "react";
import {CountdownCard} from "./countdown-card";
import Link from 'next/link'
import {GameState} from "../../hooks/use-cw-lotto-state";

export interface GameStateCardProps {
    contractAddress: string,
    gameState: GameState,
    gameConfig: Config,
    showPlayButton: boolean
}

export const GameStateCard: React.FC<GameStateCardProps> = ({contractAddress, gameState, gameConfig, showPlayButton}) => {

  console.log(gameState)
  const prizePool = Number(gameConfig.ticket_unit_cost.amount) * Number(gameState.numberOfTickets)

  return (<>
    <Header as='h3' style={{fontSize: '2em'}}>
      {
        "OPEN" in gameState.lotteryState ? (
          <>Game is Open</>
        ) : "CHOOSING" in gameState.lotteryState ? (
          <>Waiting for game to be executed</>
        ) : "CLOSED" in gameState.lotteryState ? (
          <>Game has finished</>
        ) : <>Unknown lottery state reached</>
      }
    </Header>
    {
      "OPEN" in gameState.lotteryState && "at_time" in gameState.lotteryState.OPEN.expiration &&
        <CountdownCard finalDate={new Date(Number(gameState.lotteryState.OPEN.expiration.at_time) / 1e6)}/>
    }

    <List>
      <List.Item>
        {
          "OPEN" in gameState.lotteryState ? (
            <List.Content><Icon name={'game'}/> Open to Play!</List.Content>
          ) : "CHOOSING" in gameState.lotteryState ? (
            <List.Content><Icon name={'game'}/> Pending Execution</List.Content>
          ) : ( // "CLOSED" in gameState ?
            <List.Content><Icon name={'game'}/> Completed</List.Content>
          )
        }
      </List.Item>

      <List.Item>
        <List.Content>
          <Icon name={'winner'}/> {prizePool} {gameConfig.ticket_unit_cost.denom}
        </List.Content>
      </List.Item>

      {"CLOSED" in gameState.lotteryState &&
            <List.Item>
              <List.Content>
                {gameState.lotteryState.CLOSED.claimed ? <Icon name={'checkmark'} />: <Icon name={'close'} />} Claimed
              </List.Content>
            </List.Item>
      }

      {"CLOSED" in gameState.lotteryState &&
            <List.Item>
              <List.Content>
                <Icon name={'winner'}/> Winner {gameState.lotteryState.CLOSED.winner}
              </List.Content>
            </List.Item>
      }

      <List.Item>
        <List.Content><Icon name={'ticket'} /> Cost  {gameConfig.ticket_unit_cost.amount}{gameConfig.ticket_unit_cost.denom}</List.Content>
      </List.Item>
    </List>

    { showPlayButton && <> {
      "OPEN" in gameState.lotteryState ? (
        <Link href={`/play/${contractAddress}`} passHref><Button>Play</Button></Link>
      ):<Link href={`/play/${contractAddress}`} passHref><Button>View</Button></Link>
    }</>}
  </>
  )
}