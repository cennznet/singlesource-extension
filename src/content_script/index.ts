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

import { BridgeDuplex} from '../streamUtils/BridgeDuplex';
import { MessageOrigin } from '../types';

const injectScript = () => {
  try {
    const path = browser.extension.getURL('singleSource.js');
    const inject = window.document.createElement('script');
    inject.setAttribute('type', 'text/javascript');
    inject.setAttribute('src', path);
    const head = window.document.head || window.document.documentElement;
    head.insertBefore(inject, head.children[0]);
    head.removeChild(inject);
  } catch (e) {
    console.error('SingleSource script injection failed >>> ', e);
  }
};

export const setupCommunication = () => {
  const bridgeDuplex = new BridgeDuplex(window, MessageOrigin.CONTENT, MessageOrigin.CONTENT, MessageOrigin.PAGE);
};

injectScript();
setupCommunication();
