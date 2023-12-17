import {AptosClient,Network,Provider} from "aptos";

export const NETWORK = "testnet";
export const NODE_URL = `https://fullnode.testnet.aptoslabs.com`;
// export const moduleAddress = '0xb8533e4a7ab7bdc888af3ad576b396a6ca97f1d542e131101246669297041ff4';
// export const hostAddress = '0xb8533e4a7ab7bdc888af3ad576b396a6ca97f1d542e131101246669297041ff4';
export const client = new AptosClient(NODE_URL);
export const provider = new Provider(Network.TESTNET);

export const cupcake_addr = '0x2fb91806fc4381aceb4313c3bd27e3ac4a4c380f8164e3ac54589799ec01dc74'