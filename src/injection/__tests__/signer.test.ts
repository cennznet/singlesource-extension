jest.mock('../signOnSingleSource');
// @ts-ignore
global.window = {};
console.log = () => {};
console.error = () => {};

import signer from '../signer';
import { Api } from '@cennznet/api';
import { WsProvider } from '@cennznet/api/polkadot';
import BigNumber from 'bignumber.js';
import { GenericAsset } from '@cennznet/crml-generic-asset';

export const amountToWei = (
  amount: BigNumber,
  decimal: BigNumber | string = '1e18'
): BigNumber => {
  const decimalBN = new BigNumber(decimal);
  return amount.multipliedBy(decimalBN);
};

const sender = '5Ff43zooDZWgZx5kBjTF5VDW2zxaJ7T9uYbJTZsm2KHL1k7j';
const receiver = '5Ham9G1BBdQwRobaUaGXvvuV7VY1BwiTa1jG18Tf2inQNybe';

let api: Api = null;

describe('encode & decode extrinsic', () => {
  beforeAll(async () => {
    const provider = new WsProvider(
      'wss://cennznet-node-0.centrality.cloud:9944'
    );
    api = await Api.create({ provider });
    api.setSigner(signer);
  }, 30000);

  it('should sign and inject signature', async () => {
    const value = amountToWei(new BigNumber('0.001'));

    const asset = await GenericAsset.create(api);
    const hash = await asset
      .transfer(16000, receiver, value.toString(10))
      .signAndSend(sender);
    expect(hash).toBeTruthy();
    console.info('TxHash: ', hash.toString());
  }, 30000);
});
