import {SingleSourceInjected} from './types';
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

import {Signer} from '@cennznet/api/polkadot.types';
import {Observable} from 'rxjs';
import {Account} from '../types';

export interface InjectedWindow extends Window {
  cennznetInjected: {[key: string]: CennznetInjectedCreator}
}

export interface CennznetInjectedCreator {
  version: string;
  enable: () => Promise<CennznetInjected>;
}

export interface CennznetInjected {
  signer: Signer;
  accounts$: Observable<Account[]>;
  accounts: Account[] | null;
  network$: Observable<string>;
  network: string | null;
}

export interface SingleSourceInjected extends CennznetInjected {
  // isConnected$: Observable<boolean>;
  // isConnected: boolean;
  // isPaired$: Observable<boolean>;
  // isPaired: boolean;
  // pairedDevice$: Observable<{
  //   version: string;
  //   id: string;
  // }>;
  // pairedDevice;
}
