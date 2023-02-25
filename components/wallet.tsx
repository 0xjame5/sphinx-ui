import {useWallet} from '@cosmos-kit/react';
import {
    Box,
    Center,
    Grid,
    GridItem,
    Icon,
    Stack,
    useColorModeValue,
    Text,
    Heading,
} from '@chakra-ui/react';
import {MouseEventHandler, useEffect} from 'react';
import {FiAlertTriangle} from 'react-icons/fi';
import {
    Error,
    Connected,
    ConnectedShowAddress,
    ConnectedUserInfo,
    Connecting,
    ConnectStatusWarn,
    CopyAddressBtn,
    Disconnected,
    NotExist,
    Rejected,
    RejectedWarn,
    WalletConnectComponent,
    ChainCard,
} from '../components';
import {chainName} from '../config';

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
    } = walletManager;

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

    return (
        <Box>
            {/* TODO: GET JUNO BALANCE */}
            {/*{userInfo}*/}
            {/*{addressBtn}*/}
            <Box w="full" maxW={{base: 52, md: 64}}>
                {connectWalletButton}
            </Box>
            {connectWalletWarn && <GridItem>{connectWalletWarn}</GridItem>}
        </Box>
    );
};
