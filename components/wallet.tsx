import {useWallet} from '@cosmos-kit/react';
import {Box, Button, GridItem, HStack, Icon,} from '@chakra-ui/react';
import {MouseEventHandler, useEffect} from 'react';
import {FiAlertTriangle} from 'react-icons/fi';
import {
    Connected,
    ConnectedShowAddress,
    ConnectedUserInfo,
    Connecting,
    ConnectStatusWarn,
    CopyAddressBtn,
    Disconnected,
    Error,
    NotExist,
    Rejected,
    RejectedWarn,
    WalletConnectComponent,
} from '../components';
import {chainName} from '../config';
import {useNativeBalance} from "../hooks/use-native-balance";

export const WalletSection = () => {
    const walletManager = useWallet();
    const {
        connect,
        openView,
        walletStatus,
        username,
        address,
        message,
        currentChainName,
        currentWallet,
        currentChainRecord,
        getChainLogo,
        setCurrentChain,
        getStargateClient,
    } = walletManager;

    const { balance } = useNativeBalance();

    useEffect(() => {
        setCurrentChain(chainName);
    }, [setCurrentChain]);

    const chain = {
        chainName: currentChainName,
        label: currentChainRecord?.chain.pretty_name,
        value: currentChainName,
        icon: getChainLogo(currentChainName),
    };

    // Events
    const onClickConnect: MouseEventHandler = async (e) => {
        e.preventDefault();
        await connect();
    };

    const onClickOpenView: MouseEventHandler = (e) => {
        e.preventDefault();
        openView();
    };

    // Components
    const connectWalletButton = (
        <WalletConnectComponent
            walletStatus={walletStatus}
            disconnect={
                <Disconnected buttonText="Connect" onClick={onClickConnect}/>
            }
            connecting={<Connecting/>}
            connected={
                <Connected buttonText={'Wallet'} onClick={onClickOpenView}/>
            }
            rejected={<Rejected buttonText="Reconnect" onClick={onClickConnect}/>}
            error={<Error buttonText="Change Wallet" onClick={onClickOpenView}/>}
            notExist={
                <NotExist buttonText="Install Wallet" onClick={onClickOpenView}/>
            }
        />
    );

    const connectWalletWarn = (
        <ConnectStatusWarn
            walletStatus={walletStatus}
            rejected={
                <RejectedWarn
                    icon={<Icon as={FiAlertTriangle} mt={1}/>}
                    wordOfWarning={`${currentWallet?.walletInfo.prettyName}: ${message}`}
                />
            }
            error={
                <RejectedWarn
                    icon={<Icon as={FiAlertTriangle} mt={1}/>}
                    wordOfWarning={`${currentWallet?.walletInfo.prettyName}: ${message}`}
                />
            }
        />
    );

    const userInfo = username && (
        <ConnectedUserInfo username={username}/>
    );
    const addressBtn = currentChainName && (
        <CopyAddressBtn
            walletStatus={walletStatus}
            connected={<ConnectedShowAddress address={address} isLoading={false}/>}
        />
    );

    const balanceDisplay = balance && (<Box>
        <Button> {balance} uJUNOX </Button>
    </Box>);

    console.log(balance);

    return (
        <Box>
            <HStack>
                <Box>
                    {connectWalletButton}
                </Box>
                {connectWalletWarn && <GridItem>{connectWalletWarn}</GridItem>}
                {addressBtn}
                {balanceDisplay}
            </HStack>
        </Box>
    );
};
