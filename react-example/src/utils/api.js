import { Api } from '@cennznet/api';
import { WsProvider } from '@cennznet/api/polkadot';

const getUrl = environment => {
  switch (environment) {
    case 'RIMU': return 'wss://cennznet-node-0.centrality.cloud:9944';
    case 'KAURI': return 'wss://cennznet-node-0.centrality.me:9944';
    default: return 'wss://cennznet-node-0.centrality.cloud:9944';
  }
}

let apiPromise = null;
const configureApi = (environment) => {
  const provider = new WsProvider(getUrl(environment));
  apiPromise = new Api.create({ provider });
  return apiPromise;
}

export default () => apiPromise ? apiPromise : configureApi('RIMU');
export { configureApi };