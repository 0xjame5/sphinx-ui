import {Button} from "semantic-ui-react";
import {useChain} from "@cosmos-kit/react";
import {chainName} from "../../config";
import {useContracts} from "../../codegen/contracts-context";

interface ClaimButtonProps {
    contractAddr: string
}

export const ClaimButton: React.FC<ClaimButtonProps> = ({contractAddr}) => {
  const { cwLotto } = useContracts();
  const { status } = useChain(chainName);

  // only is rendered during component claimed. ok so this page will be responsible for generating
  // the assumption before initiating this component is that the state is in closed
  const handleButtonClick = async () => {
    let signingClient = cwLotto.getSigningClient(contractAddr);

    if (signingClient != null) {
      signingClient.claimTokens("auto", undefined, [])
    }
  };

  return (<>
    <Button onClick={handleButtonClick}>Claim your winnings!</Button>
  </>);
}