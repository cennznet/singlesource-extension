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
import logger from '../logger';
import { PageToBgMessage, RuntimeMessageWith } from '../types';
import { PortStreams } from './streams';
import handlers from './handlers';

let ports: Runtime.Port[] = [];


const streamRouter = new PortStreams();

streamRouter.on('data', (message: RuntimeMessageWith<PageToBgMessage>) => {
  logger.debug('bg: <-', message);
  const {payload} = message;
  if (payload.type && handlers[payload.type]) {
    handlers[payload.type](message as any, streamRouter);
  }
});

browser.runtime.onConnect.addListener(port => {
  logger.debug('browser.runtime.onConnect', port);

  ports.push(port);

  streamRouter.setup(port);
  port.onDisconnect.addListener(() => {
    logger.debug('port.onDisconnect', port);
    streamRouter.remove(port);
    ports = ports.filter(i => i !== port);
  });
});
