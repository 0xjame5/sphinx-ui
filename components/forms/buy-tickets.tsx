import {Coin, Config} from "../../codegen/CwLotto.types";
import {Button, Form} from "semantic-ui-react";
import {ChangeEvent, useState} from "react";
import {useContracts} from "../../codegen/contracts-context";
import {useChain} from "@cosmos-kit/react";
import {chainName} from "../../config";

interface BuyTicketsProps {
    config: Config,
    contractAddr: string,
}

export const BuyTicketsForm: React.FC<BuyTicketsProps> = ({config, contractAddr}: {
    config: Config,
    contractAddr: string
}) => {
  const { cwLotto } = useContracts();
  const { status } = useChain(chainName);

  const [inputValue, setInputValue] = useState<string | ReadonlyArray<string> | number | undefined>(undefined);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(Number(event.target.value));
  };
  const handleButtonClick = async () => {
    if (status != "Connected") {
      return
    }
    let parsedInputValue = Number(inputValue);
    let totalCost = Number(inputValue) * Number(config.ticket_unit_cost.amount);
    let fee: Coin = {amount: totalCost.toString(), denom: config.ticket_unit_cost.denom};
    await cwLotto.getSigningClient(contractAddr)
      .buyTicket({numTickets: parsedInputValue}, "auto", undefined, [fee]);
  };

  return <Form>
    <Form.Input
      type="number"
      label="Number of Tickets"
      placeholder="Enter a number"
      value={inputValue}
      onChange={handleInputChange}
    />
    <Button onClick={handleButtonClick} type='submit'>Buy</Button>
  </Form>
}