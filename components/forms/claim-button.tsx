import {useEffect, useState} from "react";
import {CwLottoClient} from "../../codegen/CwLotto.client";
import {Button} from "semantic-ui-react";
import {useChain} from "@cosmos-kit/react";
import {chainName} from "../../config";

interface ClaimButtonProps {
    contractAddr: string
}

export const ClaimButton: React.FC<ClaimButtonProps> = ({contractAddr}) => {
  const {address, getSigningCosmWasmClient, getRestEndpoint, getRpcEndpoint, chain} = useChain(chainName);
  const [signingClient, setSigningClient] = useState<CwLottoClient | null>(null);
  // only is rendered during component claimed. ok so this page will be responsible for generating
  // the assumption before initiating this component is that the state is in closed
  useEffect(() => {
    if (!address) {
      return
    }
    getSigningCosmWasmClient()
      .then(signingCWClient => {
        if (!signingCWClient || !address) {
          console.error("cosmwasmClient undefined or address undefined.");
          return;
        }
        setSigningClient(new CwLottoClient(signingCWClient, address, contractAddr));
      });
  }, [address, contractAddr, getSigningCosmWasmClient]);

  const handleButtonClick = async () => {
    await signingClient?.claimTokens("auto", undefined, []);
  };

  return (<>
    <Button onClick={handleButtonClick}>Claim your winnings!</Button>
  </>);
}