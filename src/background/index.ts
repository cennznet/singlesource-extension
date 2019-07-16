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

import { browser } from 'webextension-polyfill-ts';
import { Runtime } from 'webextension-polyfill-ts/dist/generated/runtime';
import State from './state';
import openPanel from './openPanel';
import { CONTENT_SCRIPT_PORT_NAME, POPUP_PORT_NAME } from '../config';
import logger from '../logger';
import {
  IncomingMsgTypes,
  IncomingMessages,
  OutgoingMessages,
  OutgoingMsgTypes
} from '../types';
import { RuntimePortDuplex } from '../utils/RuntimePortDuplex';

let ports: Runtime.Port[] = [];

browser.runtime.onConnect.addListener(port => {
  logger.debug('browser.runtime.onConnect', port);

  ports.push(port);
  // const stream = new RuntimePortDuplex(port);
  // stream.on('data', (evt) => console.log('RuntimePortDuplex: <-', evt));
  port.onDisconnect.addListener(() => {
    logger.debug('port.onDisconnect', port);
    ports = ports.filter(i => i !== port);
  });

  port.onMessage.addListener(
    port.name === POPUP_PORT_NAME ? popupListener : pageListener
  );
});

const pageListener = (data: IncomingMessages) => {
  logger.debug('pageListener:', data);
  if (data.type === IncomingMsgTypes.SIGN) {
    openPanel({ noheader: true, sign: data });
  }
  if (data.type === IncomingMsgTypes.INIT) {
    getEnvironment().then(environment => {
      contentScriptPostMessage({
        type: OutgoingMsgTypes.ENVIRONMENT,
        environment,
        origin: 'bg'
      });
    });
    getAccounts().then(accounts => {
      contentScriptPostMessage({
        type: OutgoingMsgTypes.ACCOUNTS,
        accounts,
        origin: 'bg'
      });
    });
  }
};

const popupListener = (data: OutgoingMessages) => {
  logger.debug('popupListener:', data);
  // forward data to contentScript
  contentScriptPostMessage(data);
};

const contentScriptPostMessage = (data: OutgoingMessages) => {
  ports
    // TODO: add auth control based on domain name
    .filter(i => i.name === CONTENT_SCRIPT_PORT_NAME)
    .forEach(p => p.postMessage(data));
};

const popupPostMessage = (data: OutgoingMessages) => {
  ports
    .filter(i => i.name === POPUP_PORT_NAME)
    .forEach(p => p.postMessage(data));
};

const getEnvironment = (): Promise<string> => {
  return State.restore()
    .then(JSON.parse)
    .then(state => state.environment || 'PRODUCTION')
    .then(JSON.parse);
};

const getAccounts = (): Promise<any> => {
  return State.restore()
    .then(JSON.parse)
    .then(state => state.accounts || '[]')
    .then(JSON.parse);
};
