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

import { Transform } from 'readable-stream';
import { Duplex } from 'stream';
import v4 from 'uuid/v4';
import { browser } from 'webextension-polyfill-ts';

import { MessageOrigin, MsgTypes, PayloadOf, RequestMessage, RequestResponse, RuntimeMessage } from '../types';
import { InPageMsgTypes } from '../types/message';
import { addOrigin } from './addOrigin';
import { RuntimePortDuplex } from './RuntimePortDuplex';

export function tag(tag: string) {
  return new Transform({
    objectMode: true,
    transform(chunk: any, encoding: string, callback: (error?: Error, data?: any) => void): void {
      callback(null, { [tag]: chunk });
    }
  });
}

export function untag(tag: string) {
  return new Transform({
    objectMode: true,
    transform(chunk: any, encoding: string, callback: (error?: Error, data?: any) => void): void {
      if (chunk[tag]) {
        callback(null, chunk[tag]);
      } else {
        callback();
      }
    }
  });
}

/**
 * BridgeDuplex is a bridge duplex stream using in content script for connecting background and inject
 */
export class BridgeDuplex extends Duplex {
  tag: string;
  untag: string;
  portStream: RuntimePortDuplex;
  
  constructor(protected window: Window, tag: string, untag?: string) {
    super({ objectMode: true });
    window.addEventListener('message', this.eventHandler);
    this.tag = tag;
    this.untag = untag ? untag : tag;
  }

  send<T extends MsgTypes>(type: T, payload: PayloadOf<RuntimeMessage<T, any>>, dst: string | string[]) {
    const message: RuntimeMessage<T, any> = {
      origin: undefined, //origin will be added in content_script
      dst,
      type,
      payload
    };
    this.write(message);
  }

  async sendRequest<T extends MsgTypes, U>(type: T, payload: PayloadOf<RuntimeMessage<T, any>>, dst: string | string[]): Promise<U> {
    const uuid = v4();
    const message: RuntimeMessage<T, any> & RequestMessage = {
      origin: undefined, //origin will be added in content_script
      dst,
      type,
      payload,
      requestUUID: uuid
    };
    this.write(message);
    return new Promise((resolve, reject) => {
      const filter = (message: RuntimeMessage<T, RequestResponse<U>> & RequestMessage) => {
        const { payload, requestUUID } = message;
        if (requestUUID === uuid) {
          if (payload.isError) {
            reject(new Error(payload.result));
          } else {
            resolve(payload.result as U);
          }
          this.removeListener('data', filter);
        }
      };
      this.on('data', filter);
    });
  }

  _write(chunk: any, encoding: string, callback: (error?: (Error | null)) => void): void {
    this.window.postMessage({ [this.tag]: chunk }, window.origin);
    callback();
  }

  _read(size?: number): void {
  }

  _destroy(err: Error | null, callback: (error: (Error | null)) => void): void {
    this.window.removeEventListener('message', this.eventHandler);
    callback(err);
  }

  protected eventHandler = ({ data }: MessageEvent) => {
    if (!this.portStream && data[this.untag].type ===InPageMsgTypes.ENABLE) {
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
