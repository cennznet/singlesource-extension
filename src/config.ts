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

import { Network } from './types';
import { Dictionary } from 'lodash';
import BigNumber from 'bignumber.js';

BigNumber.set({ DECIMAL_PLACES: 5 });

export const networks: Dictionary<Network> = {
  RIMU_CENNZENT: {
    name: 'RIMU',
    displayName: 'Rimu - CENNZnet',
    nodeUrl: 'wss://rimu.unfrastructure.io/public/ws',
    color: '#F45BFF'
  },
  KAURI_CENNZNET: {
    name: 'KAURI',
    displayName: 'Kauri - CENNZnet',
    nodeUrl: 'wss://cennznet-node-0.centrality.me:9944',
    color: '#FFCA2D'
  }
  // TODO: update me
  // MAINNET_CENNZENT: {
  //   environment: 'MAINNET',
  //   name: 'Mainnet - CENNZnet',
  //   nodeUrl:
  //     'wss://cennznet-node-0.centrality.cloud:9944',
  //   color: '#0087fa'
  // }
};
