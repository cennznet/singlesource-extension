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

import {applyMiddleware, createStore} from 'redux';
import {createEpicMiddleware, Epic} from 'redux-observable';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {composeWithDevTools} from 'remote-redux-devtools';
import {fromEvent, Observable} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {BgEpicMessage, ToBgMessage} from '../../types';
import {PortStreams} from '../streams';
import { wrapBgEpicMessage } from '../utils/wrapBgEpicMessage';
import rootEpic from './epics';
import reducers from './reducers';

export type EpicDependencies = {
  router: PortStreams;
};

export default (streamRouter: PortStreams) => {
  // message stream and epic
  const messages$ = fromEvent<ToBgMessage>(streamRouter, 'data');

  const epicMiddleware = createEpicMiddleware({dependencies: {router: streamRouter}});

  // store
  const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['accounts', 'network', 'enabledDomains']
  };

  const persistedReducer = persistReducer(persistConfig, reducers);

  const composeEnhancers = composeWithDevTools({
    realtime: process.env.mode === 'development',
  });

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(epicMiddleware)) as any);
 
  messages$.pipe(
    switchMap<ToBgMessage, Observable<BgEpicMessage>>(wrapBgEpicMessage)
  ).subscribe(store.dispatch);

  epicMiddleware.run(rootEpic as Epic);

  persistStore(store);

  return store;
};
