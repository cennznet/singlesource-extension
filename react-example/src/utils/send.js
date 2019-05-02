import BigNumber from 'bignumber.js'
import getApi from './api';
import { amountToWei } from './amount';

const CENNZ_ASSET_ID = 16000;

const send = async (sender, receiver, amount, cb) => {
  const api = await getApi();
  
  // eslint-disable-next-line
  api.setSigner(SingleSource.signer);

  const value = amountToWei(new BigNumber(amount));
  api.tx.genericAsset
    .transfer(CENNZ_ASSET_ID, receiver, value.toString(10))
    .signAndSend(sender, cb);
}

export default send;