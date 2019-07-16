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

import { Writable } from 'stream';
import { browser } from 'webextension-polyfill-ts';
import { CONTENT_SCRIPT_PORT_NAME } from '../config';
import logger from '../logger';
import { MessageDuplex } from '../utils/MessageDuplex';
import { RuntimePortDuplex } from '../utils/RuntimePortDuplex';
import { tag, TaggedDuplex, untag } from '../utils/tagUntag';

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

const setupCommunication = () => {
  const port = browser.runtime.connect(null, {
    // TODO: change name to window.location.hostname
    name: CONTENT_SCRIPT_PORT_NAME
  });

  const portStream = new RuntimePortDuplex(port);
  const msgStream = new MessageDuplex(window);
  portStream.pipe(tag('ss:content')).pipe(msgStream)
    .pipe(untag('ss:inpage')).pipe(portStream);

  port.onMessage.addListener(data => {
    logger.debug('message from ext', data);
    window.postMessage(data, window.origin);
  });

  return {
    inpageWriteStream: new TaggedDuplex('ss:content').pipe(msgStream)
  };
};

const init = (inpageWriteStream: Writable) => {
  inpageWriteStream.write({ type: 'init' });
};

injectScript();
const { inpageWriteStream } = setupCommunication();
window.onload = () => init(inpageWriteStream);
