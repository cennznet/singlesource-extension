import { Api } from '@cennznet/api';
// import { WsProvider } from '@cennznet/api/polkadot';

const getUrl = environment => {
  switch (environment) {
    case 'RIMU': return 'wss://rimu.unfrastructure.io/public/ws';
    case 'KAURI': return 'wss://cennznet-node-0.centrality.cloud:9944';
    default: return 'wss://rimu.unfrastructure.io/public/ws';
  }
}

let apiPromise = null;
const configureApi = (environment) => {
  // const provider = new WsProvider(getUrl(environment));
  apiPromise = Api.create({ provide:getUrl(environment) });
  return apiPromise;
}

export default () => apiPromise ? apiPromise : configureApi('RIMU');
export { configureApi };
