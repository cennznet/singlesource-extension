/**
 * Copyright 2019 Centrality Investments Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Signer } from '@cennznet/api/polkadot.types';
import { Extrinsic } from '@cennznet/types/extrinsic';
import { SignatureOptions } from '@cennznet/types/polkadot.types';
import signOnSingleSource, { Payload } from './signOnSingleSource';

let id = 0;

const signer: Signer = {
  sign: async (
    extrinsic: Extrinsic,
    address: string,
    options: SignatureOptions
  ): Promise<number> => {
    const payload: Payload = {
      extrinsic: extrinsic.method.toString(),
      address,
      blockHash: options.blockHash.toString(),
      era: options.era && options.era.toString(),
      nonce: options.nonce.toString(),
      meta: extrinsic.meta.toString(),
      // @ts-ignore
      version: options.version && JSON.stringify(options.version.toJSON())
    };

    // send payload to singelsource
    const hexSignature = await signOnSingleSource(payload);

    extrinsic.addSignature(
      // @ts-ignore
      address,
      hexSignature,
      options.nonce,
      options.era
    );

    return ++id;
  }
};

export default signer;
