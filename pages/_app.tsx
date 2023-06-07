import '../styles/globals.css';
import type {AppProps} from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { ChainProvider } from '@cosmos-kit/react';
import { chains, assets } from 'chain-registry';
import { wallets } from '@cosmos-kit/keplr';
import {wallets as keplrWallets} from '@cosmos-kit/keplr';
import {wallets as cosmostationWallets} from '@cosmos-kit/cosmostation';
import {wallets as leapWallets} from '@cosmos-kit/leap';

import {getSigningCosmosClientOptions} from 'interchain';
import {GasPrice} from '@cosmjs/stargate';

import {SignerOptions} from '@cosmos-kit/core';
import {Chain} from '@chain-registry/types';
import Navbar from "../components/Navbar";
import {defaultTheme} from "../config";


function CreateCosmosApp({Component, pageProps}: AppProps) {
  const signerOptions: SignerOptions = {
    signingStargate: (_chain: Chain) => {
      return getSigningCosmosClientOptions();
    },
    signingCosmwasm: (chain: Chain) => {
      switch (chain.chain_name) {
      case 'junotestnet':
        return {
          gasPrice: GasPrice.fromString('0.0025ujunox'),
        };
      }
    },
  };

  return (
    <ChakraProvider theme={defaultTheme}>
      <ChainProvider
        chains={chains}
        assetLists={assets}
        wallets={[...keplrWallets, ...cosmostationWallets, ...leapWallets]}
        wrappedWithChakra={true}
        signerOptions={signerOptions}>
        <Navbar />
        <Component { ...pageProps} />
      </ChainProvider>
    </ChakraProvider>
  );
}

export default CreateCosmosApp;
