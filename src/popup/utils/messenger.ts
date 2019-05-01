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
import { POPUP_PORT_NAME } from '../../config';

type Callback = (message: any, port: Runtime.Port) => void;

class Messenger {
  port: Runtime.Port;

  constructor(name: string) {
    try {
      this.port = browser.runtime.connect(null, { name });
    } catch (error) {
      // fails when running as webpage
    }
  }

  addListener = (callback: Callback) => {
    this.port.onMessage.addListener(callback);
  };

  removeListener = (callback: Callback) => {
    this.port.onMessage.removeListener(callback);
  };

  send = (data: any) => {
    try {
      this.port.postMessage(data);
    } catch (error) {
      // fails when running as webpage
    }
  };
}

export default new Messenger(POPUP_PORT_NAME);
