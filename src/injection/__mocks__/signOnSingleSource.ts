import { Wallet, HDKeyring } from '@cennznet/wallet';
import { stringToU8a } from '@cennznet/util';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FunctionMetadata } from '@plugnet/types/Metadata/v5/Calls';
import {
  U8a,
  RuntimeVersion,
  Index,
  Method,
  Extrinsic
} from '@cennznet/types/polkadot';
import { Payload } from '../signOnSingleSource';

// @ts-ignore
Wallet.prototype.persistAll = async () => {};
const signOnSingleSource = jest.genMockFromModule('../signOnSingleSource');

const vault =
  '0x4a0140a515857eb9c05399385795738cc8cf898d12fcd982c06c4c034fed48e46c520bdfe02980c2c745572c68c5c50bc1c0126acc5c6565d1e6a226582fcb3330ef4f4b87aed90cb7d7cd6176ac1c22c792ed5327ed91df6476e4a13b8441ede0d364fe5488a655ffe25afdc4fa9d1c32258d719124263f51525feb21a09d3d61d9312ce96c1483f562496d4b106dc87115ed4bd77e502a068b63332702bf77267640be0c94a415beb0357fba52e0e050e7ffafbc884d13ea5577ddcfcab54aa8e79b28e78c2f16c2af715b60a737332625e5';

// @ts-ignore
signOnSingleSource = async (payload: Payload) => {
  const { method, meta, address, blockHash, nonce, era, version } = payload;

  const options = {
    blockHash: new U8a(blockHash),
    era: era && stringToU8a(era),
    nonce: new Index(nonce),
    version: new RuntimeVersion(JSON.parse(version))
  };

  const metadata = new FunctionMetadata(JSON.parse(meta));
  const meth = new Method(JSON.parse(method), metadata);

  const wallet = new Wallet({ vault, keyringTypes: [HDKeyring] });
  await wallet.unlock('aaaaaa');

  const ext = new Extrinsic(meth);

  await wallet.sign(ext, address, options);

  return ext.signature.signature.toHex();
};

export default signOnSingleSource;
