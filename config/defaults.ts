import { assets } from 'chain-registry';
import { AssetList, Asset } from '@chain-registry/types';

export const chainName = 'junotestnet';
export const STAKINGDENOM = 'ujunox';
export const feeDenom = 'uand';

export const cw20ContractAddress = 'wasm1p7vmrhl3s0fyl0m9hk2hlm7uuxq84hztur63n8ryh85chh30vt6q89shcv'

export const chainassets: AssetList = assets.find(
    (chain) => chain.chain_name === chainName
) as AssetList;

export const coin: Asset = chainassets.assets.find(
    (asset) => asset.base === STAKINGDENOM
) as Asset;
