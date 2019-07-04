import { GenericAsset } from '@cennznet/crml-generic-asset';
import BigNumber from 'bignumber.js'
import getApi from './api';
import { amountToWei } from './amount';

const CENNZ_ASSET_ID = 16000;

const send = async (sender, receiver, amount, cb) => {
  const api = await getApi();
  
  // eslint-disable-next-line
  api.setSigner(SingleSource.signer);

  const value = amountToWei(new BigNumber(amount));
  const asset = await GenericAsset.create(api);
  const hash = await asset.transfer(CENNZ_ASSET_ID, receiver, value.toString(10)).signAndSend(sender);
  if (hash) {
    console.info(hash.toHex())
  }
}

export default send;