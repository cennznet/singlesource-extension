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
import { isEqual } from 'lodash';
import { ofType } from 'redux-observable';
import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map, take } from 'rxjs/operators';

import { Account, AccountsUpdate, BgMsgTypes, InPageMsgTypes, IsEnableUpdate, MessageOrigin, NetworkUpdate } from '../types';
import messenger$, { inpageBgDuplexStream }  from './messenger';
import signer from './signer';
import { InjectedWindow, ISingleSource } from './types';

const accounts$ = new ReplaySubject<Account[]>(1);
const network$ = new ReplaySubject<string>(1);

declare var window: InjectedWindow;

messenger$.pipe(
  ofType<AccountsUpdate>(BgMsgTypes.ACCOUNTS),
  map(msg => msg.payload),
  distinctUntilChanged((x, y) => isEqual(x, y))
).subscribe(accounts$);

messenger$.pipe(
  ofType<NetworkUpdate>(BgMsgTypes.ENVIRONMENT),
  map(msg => msg.payload),
  distinctUntilChanged()
).subscribe(network$);

const SingleSource = {
  get signer(): Signer {
    return signer;
  },

  get accounts$(): Observable<Account[]> {
    return accounts$;
  },

  get network$(): Observable<string> {
    return network$;
  },

  async enable(): Promise<ISingleSource> {
    const isEnable = await inpageBgDuplexStream.sendRequest(InPageMsgTypes.ENABLE, {}, MessageOrigin.BG);
    if (isEnable) {
      return SingleSource;
    }
    
    return null;
  }
};

window.SingleSource = SingleSource;

export default SingleSource;
