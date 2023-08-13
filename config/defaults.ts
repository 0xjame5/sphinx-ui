import { assets } from 'chain-registry';
import { AssetList, Asset } from '@chain-registry/types';

export const chainName = 'junotestnet';
export const STAKINGDENOM = 'ujunox';
export const feeDenom = 'ujunox';

// export const cw20ContractAddress = 'wasm1p7vmrhl3s0fyl0m9hk2hlm7uuxq84hztur63n8ryh85chh30vt6q89shcv';
// export const CW_LOTTO_ADDRESS = 'juno1w4lgq9mvlvtldf0q9thqtaq986tuhy3j7jneq68lc4xhecvaa9aq8mzqhc';

export const CW_LOTTO_ADDRESS = 'juno1law3szlnn4snqe6gylgt3h7r003e549fjs9sl9tf6zh3w480e33shlqrlp';

export const chainassets: AssetList = assets.find(
  (chain) => chain.chain_name === chainName
) as AssetList;

export const coin: Asset = chainassets.assets.find(
  (asset) => asset.base === STAKINGDENOM
) as Asset;
