import {AptosClient,Network,Provider} from "aptos";

export const NETWORK = 'testnet';
export const NODE_URL = `https://fullnode.testnet.aptoslabs.com`;
export const cupcake_addr = '0x0e3b7758bf1f1e7f7c90983ff893701a86a88eae8767b8457476962976778d26';

export const client = new AptosClient(NODE_URL);
export const provider = new Provider(Network.TESTNET);