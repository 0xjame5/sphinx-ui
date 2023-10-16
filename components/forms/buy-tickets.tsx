import {Coin, Config} from "../../codegen/CwLotto.types";
import {Button, Form} from "semantic-ui-react";
import {ChangeEvent, useState} from "react";
import {CwLottoClient} from "../../codegen/CwLotto.client";

interface BuyTicketsProps {
    cwLottoClient: CwLottoClient,
    config: Config,
}

export const BuyTicketsForm: React.FC<BuyTicketsProps> = ({cwLottoClient, config}: {
    cwLottoClient: CwLottoClient,
    config: Config
}) => {
  const [inputValue, setInputValue] = useState<string | ReadonlyArray<string> | number | undefined>(undefined);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(Number(event.target.value));
  };

  const handleButtonClick = async () => {
    let parsedInputValue = Number(inputValue);
    let totalCost = Number(inputValue) * Number(config.ticket_unit_cost.amount);
    let fee: Coin = {amount: totalCost.toString(), denom: config.ticket_unit_cost.denom};
    await cwLottoClient.buyTicket({numTickets: parsedInputValue}, "auto", undefined, [fee]);
  };

  return <><Form>
    <Form.Input
      type="number"
      label="Number of Tickets"
      placeholder="Enter a number"
      value={inputValue}
      onChange={handleInputChange}
    />
    <Button onClick={handleButtonClick} type='submit'>Buy</Button>
  </Form>
  </>
}