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

import {browser} from 'webextension-polyfill-ts';
import actions from '../shared/actions';
import setupRedux from './redux';
import {PortStreams} from './streams';

const streamRouter = new PortStreams();

const store = setupRedux(streamRouter);

browser.runtime.onConnect.addListener(port => {
  store.dispatch({type: actions.PORT_CONNECT, payload: port});

  port.onDisconnect.addListener(() => {
    store.dispatch({type: actions.ENABLED_PORT_REMOVE, payload: port.name});
    store.dispatch({type: actions.PORT_DISCONNECT, payload: port});
  });
});
