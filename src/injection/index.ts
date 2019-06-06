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

import { ReplaySubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { isEqual } from 'lodash';
import { Signer } from '@cennznet/api/polkadot.types';
import signer from './signer';
import messenger$ from './messenger';

const accounts$ = new ReplaySubject<any>(1);
const environment$ = new ReplaySubject<string>(1);

messenger$.subscribe(event => {
  const { type, accounts = [], environment = 'PRODUCTION' } = event.data;

  if (type === 'accounts') {
    accounts$.next(accounts);
  }
  if (type === 'environment') {
    environment$.next(environment);
  }
});

const SingleSource = {

  get signer(): Signer {
    return signer;
  },

  get accounts$(): Observable<Array<Object>> {
    return accounts$.pipe(distinctUntilChanged((x, y) => isEqual(x, y)));
  },

  get environment$(): Observable<string> {
    return environment$.pipe(distinctUntilChanged());
  }
};

export default SingleSource;

// reset globals so injected script won't fails while @plugnet
// checks for duplicated packages
// @ts-ignore
__plugnetjs = {};
