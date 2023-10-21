import {Button, Header, Icon, List} from "semantic-ui-react";
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

    <List>
      <List.Item>
        {
          "OPEN" in gameState ? (
            <List.Content><Icon name={'game'}/> Open to Play!</List.Content>
          ) : "CHOOSING" in gameState ? (
            <List.Content><Icon name={'game'}/> Pending Execution</List.Content>
          ) : ( // "CLOSED" in gameState ?
            <List.Content><Icon name={'game'}/> Completed</List.Content>
          )
        }
      </List.Item>

      {"CLOSED" in gameState &&
            <List.Item>
              <List.Content>
                {gameState.CLOSED.claimed ? <Icon name={'checkmark'} />: <Icon name={'close'} />} Claimed
              </List.Content>
            </List.Item>
      }

      {"CLOSED" in gameState &&
            <List.Item>
              <List.Content>
                <Icon name={'winner'}/> Winner {gameState.CLOSED.winner}
              </List.Content>
            </List.Item>
      }

      <List.Item>
        <List.Content><Icon name={'ticket'} /> Cost  {gameConfig.ticket_unit_cost.amount}{gameConfig.ticket_unit_cost.denom}</List.Content>
      </List.Item>
    </List>

    { showPlayButton && <> {
      "OPEN" in GameStateCard ? (
        <Link href={`/play/${contractAddress}`} passHref><Button>Play</Button></Link>
      ):<Link href={`/play/${contractAddress}`} passHref><Button>View</Button></Link>
    }</>}
  </>
  )
}