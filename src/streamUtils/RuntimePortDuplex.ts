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

import { Duplex } from 'readable-stream';
import { Runtime } from 'webextension-polyfill-ts';
import logger from '../logger';
import { MsgTypes, PayloadOf, RuntimeMessage } from '../types';

type MessageWithoutOrigin<T extends MsgTypes> = Pick<RuntimeMessage<T, any>, Exclude<keyof RuntimeMessage<T, any>, 'origin'>>;

export class RuntimePortDuplex extends Duplex {
  port: Runtime.Port;
  origin: string;

  constructor(port: Runtime.Port, origin?: string) {
    super({ objectMode: true });
    this.port = port;
    this.origin = origin ? origin : port.name;
    port.onMessage.addListener(this.eventHandler);
  }

  send<T extends MsgTypes>(message: MessageWithoutOrigin<T>);
  send<T extends MsgTypes>(type: T, payload: PayloadOf<RuntimeMessage<T, any>>, dst: string | string[]);
  send<T extends MsgTypes>(
    arg1: MessageWithoutOrigin<T> | T,
    arg2?: PayloadOf<RuntimeMessage<T, any>>,
    arg3?: string | string[]
  ) {
    let message: RuntimeMessage<T, any>;
    if (arg2 && arg3) {
      message = {
        origin: this.origin,
        dst: arg3,
        type: arg1 as T,
        payload: arg2
      };
    } else {
      message = Object.assign({}, arg1 as MessageWithoutOrigin<T>, { origin: this.origin });
    }
    this.write(message);
  }

  _write(chunk: any, encoding: string, callback: (error?: (Error | null)) => void): void {
    this.port.postMessage(chunk);
    callback();
  }

  _read(size?: number): void {
  }

  _destroy(err: Error | null, callback: (error: (Error | null)) => void): void {
    this.port.onMessage.removeListener(this.eventHandler);
    callback(err);
  }

  private eventHandler = (message: any, port: Runtime.Port) => {
    logger.debug('RuntimePortDeplux', message);
    this.push(message);
  };
}
