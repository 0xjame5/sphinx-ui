import React from "react";
import {Button, Header, Icon, List} from "semantic-ui-react";
import {useCwLottoConfigV2} from "../../hooks/use-cw-lotto-config-v2";
import {useCwLottoStateV2} from "../../hooks/use-cw-lotto-state-v2";
import {CountdownCard} from "./countdown-card";
import Link from 'next/link'


export interface GameStateCardProps {
    contractAddress: string,
    showPlayButton: boolean
}

export const GameStateCard: React.FC<GameStateCardProps> = ({contractAddress, showPlayButton}) => {
  let cwLottoConfig = useCwLottoConfigV2(contractAddress);
  let cwLottoState = useCwLottoStateV2(contractAddress);

  return (
    <div>
      <Header as='h3' style={{fontSize: '2em'}}>
        {cwLottoConfig && cwLottoState ? <>{
          "OPEN" in cwLottoState.lotteryState ? (
            <>Game is Open</>
          ) : "CHOOSING" in cwLottoState.lotteryState ? (
            <>Waiting for game to be executed</>
          ) : "CLOSED" in cwLottoState.lotteryState ? (
            <>Game has finished</>
          ) : <>Unknown lottery state reached</>
        }</> : <>Loading</>}
      </Header>
      {
        cwLottoState &&
                ("OPEN" in cwLottoState.lotteryState && "at_time" in cwLottoState.lotteryState.OPEN.expiration &&
                  <CountdownCard
                    finalDate={new Date(Number(cwLottoState.lotteryState.OPEN.expiration.at_time) / 1e6)}/>)
      }

      <List>
        <List.Item>
          {
            cwLottoState && ("OPEN" in cwLottoState.lotteryState ? (
              <List.Content><Icon name={'game'}/> Open to Play!</List.Content>
            ) : "CHOOSING" in cwLottoState.lotteryState ? (
              <List.Content><Icon name={'game'}/> Pending Execution</List.Content>
            ) : ( // "CLOSED" in gameState ?
              <List.Content><Icon name={'game'}/> Completed</List.Content>
            ))
          }
        </List.Item>
        <List.Item>
          <List.Content>
            {
              cwLottoState && cwLottoConfig && (
                <div>
                  <Icon name={'winner'}/>
                  {Number(cwLottoConfig.ticket_unit_cost.amount) * Number(cwLottoState.numberOfTickets)} {cwLottoConfig.ticket_unit_cost.denom}
                </div>
              )
            }
          </List.Content>
        </List.Item>
        {cwLottoState && "CLOSED" in cwLottoState.lotteryState &&
            <List.Item>
              <List.Content>
                {cwLottoState.lotteryState.CLOSED.claimed ? <Icon name={'checkmark'} />: <Icon name={'close'} />} Claimed
              </List.Content>
            </List.Item>
        }

        {cwLottoState && "CLOSED" in cwLottoState.lotteryState &&
            <List.Item>
              <List.Content>
                <Icon name={'winner'}/> Winner {cwLottoState.lotteryState.CLOSED.winner}
              </List.Content>
            </List.Item>
        }
        {cwLottoConfig &&
          <List.Item>
            <List.Content>
              <Icon name={'ticket'}/>Cost {cwLottoConfig.ticket_unit_cost.amount}{cwLottoConfig.ticket_unit_cost.denom}
            </List.Content>
          </List.Item>
        }

      </List>
      { showPlayButton && cwLottoState && <> {
        "OPEN" in cwLottoState.lotteryState ? (
          <Link href={`/play/${contractAddress}`} passHref><Button>Play</Button></Link>
        ):<Link href={`/play/${contractAddress}`} passHref><Button>View</Button></Link>
      }</>}
    </div>

  );
}
