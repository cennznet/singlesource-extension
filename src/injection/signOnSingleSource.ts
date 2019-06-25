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

import { AsyncSubject } from 'rxjs';
import { v4 } from 'uuid';
import messenger$ from './messenger';

export type Payload = {
  extrinsic: string;
  address: string;
  blockHash: string;
  era?: string;
  nonce: string;
  version?: string;
};

const streams: { [key: string]: AsyncSubject<string> } = {};

messenger$.subscribe(event => {
  const { type, hexSignature, requestUUID, error } = event.data;
  if (type === 'signed' && requestUUID) {
    const stream$ = streams[requestUUID];
    if (stream$) {
      if (hexSignature) {
        stream$.next(hexSignature);
        stream$.complete();
      } else {
        stream$.error(error);
      }
    }
  }
});

const signOnSingleSource = (payload: Payload): Promise<string> => {
  const uuid = v4();
  const message = {
    payload,
    type: 'sign',
    requestUUID: uuid
  };

  window.postMessage(message, window.origin);

  const stream$ = new AsyncSubject<string>();
  streams[uuid] = stream$;
  return stream$.asObservable().toPromise();
};

export default signOnSingleSource;
