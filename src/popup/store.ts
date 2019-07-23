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

import { applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'remote-redux-devtools';
import reducers from './reducers';
import rootEpic from './epics';
import { initConnection } from './utils/messenger';
import { MessageOrigin } from '../types';
import { RuntimePortDuplex } from '../streamUtils/RuntimePortDuplex';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['accounts', 'network']
};

const persistedReducer = persistReducer(persistConfig, reducers);

const composeEnhancers = composeWithDevTools({
  realtime: process.env.mode === 'development'
});

const isSignPopup = window.location.search.includes('sign=');

const runtimeStream = initConnection(isSignPopup ? MessageOrigin.SIGN_POPUP : MessageOrigin.TOOLBAR);

export type EpicDependencies = {runtimeStream: RuntimePortDuplex};

const epicMiddleware = createEpicMiddleware({ dependencies: {runtimeStream} });
const middleware = applyMiddleware(epicMiddleware);
const store = createStore(persistedReducer, composeEnhancers(
  middleware
) as any);

persistStore(store);

epicMiddleware.run(rootEpic);

export default store;
