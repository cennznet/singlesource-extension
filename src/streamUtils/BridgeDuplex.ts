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

import v4 from 'uuid/v4';
import { browser } from 'webextension-polyfill-ts';
import {
  MessageOrigin,
} from '../types';
import {InPageMsgTypes} from '../types/message';
import {addOrigin} from './addOrigin';
import { MultiplexWindowMessageDuplex } from './MultiplexWindowMessageDuplex';
import { RuntimePortDuplex } from './RuntimePortDuplex';

/**
 * BridgeDuplex is a bridge duplex stream using in content script for connecting background and inject
 */
export class BridgeDuplex extends MultiplexWindowMessageDuplex {
  portStream: RuntimePortDuplex;

  constructor(protected window: Window, originType: MessageOrigin, tag: string, untag?: string) {
    super(window, tag, untag);
  }

  protected eventHandler = ({ data }: MessageEvent) => {
    if (!this.portStream && data.type ===InPageMsgTypes.ENABLE) {
      const port = browser.runtime.connect(null, {
        // TODO: change name to window.location.hostname
        name: `${MessageOrigin.PAGE}/${v4()}`
      });

      this.portStream = new RuntimePortDuplex(port);

      this.portStream.pipe(this).pipe(addOrigin(port.name)).pipe(this.portStream);
      
      this.portStream.send(InPageMsgTypes.INIT, {}, MessageOrigin.BG);
    }

    if (data[this.untag]) {
      this.push(data[this.untag]);
    }
  };
}
