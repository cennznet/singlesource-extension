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

import storage from 'redux-persist/lib/storage';

class State {
  restore = () => {
    return storage.getItem('persist:root');
  };
}

const state = new State();

export const getEnvironment = (): Promise<string> => {
  return state.restore()
    .then(JSON.parse)
    .then(state => state.environment || 'PRODUCTION')
    .then(JSON.parse);
};

export const getAccounts = (): Promise<any> => {
  return state.restore()
    .then(JSON.parse)
    .then(state => state.accounts || '[]')
    .then(JSON.parse);
};

export default state;
