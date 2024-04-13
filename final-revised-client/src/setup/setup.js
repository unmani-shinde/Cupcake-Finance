import {AptosClient,Network,Provider} from "aptos";

export const NETWORK = "testnet";
export const NODE_URL = `https://fullnode.testnet.aptoslabs.com`;
// export const moduleAddress = '0xb8533e4a7ab7bdc888af3ad576b396a6ca97f1d542e131101246669297041ff4';
// export const hostAddress = '0xb8533e4a7ab7bdc888af3ad576b396a6ca97f1d542e131101246669297041ff4';
export const client = new AptosClient(NODE_URL);
export const provider = new Provider(Network.TESTNET);

export const cupcake_addr = '0xefd5c18108655b8abaec24a739a0fba25cf726e5094d1798e36dc48febbe6e17'

export const meow_addr = '0x398d449de4a4b45846b70ec6fde562a8adedfaded839dbfa0c2ee3c55e786f23';

