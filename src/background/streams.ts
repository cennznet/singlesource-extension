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

import {Duplex} from 'readable-stream';
import {Runtime} from 'webextension-polyfill-ts';
import logger from '../logger';
import {RuntimePortDuplex} from '../streamUtils/RuntimePortDuplex';
import {BgMsgTypes, InPageMsgTypes, MessageOrigin, MsgTypes, PayloadOf, PopupMsgTypes, RuntimeMessage} from '../types';

export class PortStreams extends Duplex {
  streams: RuntimePortDuplex[] = [];
  enabledPortNames: string[] = [];

  constructor() {
    super({objectMode: true});
  }

  setup(port: Runtime.Port): void {
    const portStream = new RuntimePortDuplex(port, MessageOrigin.BG);
    this.streams.push(portStream);
    logger.debug('Streams add port: ', port.name)
    portStream.pipe(this);
  }

  remove(port: Runtime.Port): void {
    logger.debug('Streams remove port: ', port.name)
    const streamIdx = this.streams.findIndex(stream => stream.port === port);
    const [stream] = this.streams.splice(streamIdx, 1);
    stream.destroy();
  }

  send<T extends BgMsgTypes>(type: T, payload: PayloadOf<RuntimeMessage<T, any>>, dst: string | string[]) {
    const message: RuntimeMessage<T, any> = {
      origin: MessageOrigin.BG,
      dst,
      type,
      payload,
    };
    this.write(message);
  }

  _write(chunk: RuntimeMessage<MsgTypes, any>, encoding: string, callback: (error?: Error | null) => void): void {
    if (isRuntimeMessage(chunk)) {
      const handle = (dst: string, type: InPageMsgTypes | BgMsgTypes | PopupMsgTypes) => {
        if (dst === MessageOrigin.BG) {
          this.push(chunk);
        } else {
          const streams = this.streams.filter(
            stream => 
              stream.port.name.startsWith(dst)
              && (!stream.port.name.startsWith(MessageOrigin.PAGE) ||
                this.enabledPortNames.includes(stream.port.name) ||
                type === BgMsgTypes.ENABLE_RESPONSE
              )
          );
          for (const stream of streams) {
            try {
              stream.write(chunk);
            } catch (e) {
              logger.debug('port write error', e);
            }
          }
        }
      };
      if (chunk.dst instanceof Array) {
        chunk.dst.forEach(dst => handle(dst, chunk.type));
      } else {
        handle(chunk.dst, chunk.type);
      }
    }
    callback();
  }

  addEnabledPort(portName: string) {
    // Assuming there are not two ports having same port name
    this.enabledPortNames.push(portName);
  }

  removeEnabledPort(portName: string) {
    this.enabledPortNames = this.enabledPortNames.filter(name => name !== portName);
  }

  _read(size?: number): void {}
}

function isRuntimeMessage(data: any): data is RuntimeMessage<any, any> {
  // FIXME
  return true;
}
