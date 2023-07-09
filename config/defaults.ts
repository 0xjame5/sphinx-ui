import { assets } from 'chain-registry';
import { AssetList, Asset } from '@chain-registry/types';

export const chainName = 'junotestnet';
export const STAKINGDENOM = 'ujunox';
export const feeDenom = 'ujunox';

// export const cw20ContractAddress = 'wasm1p7vmrhl3s0fyl0m9hk2hlm7uuxq84hztur63n8ryh85chh30vt6q89shcv';
// export const CW_LOTTO_ADDRESS = 'juno1w4lgq9mvlvtldf0q9thqtaq986tuhy3j7jneq68lc4xhecvaa9aq8mzqhc';

export const CW_LOTTO_ADDRESS = 'juno1ddj44kqc0vkwx8wwg0ufkd0zf5vx446m6rnkk8ccm7fw6hfq6vtslde5dh';

export const chainassets: AssetList = assets.find(
  (chain) => chain.chain_name === chainName
) as AssetList;

export const coin: Asset = chainassets.assets.find(
  (asset) => asset.base === STAKINGDENOM
) as Asset;
