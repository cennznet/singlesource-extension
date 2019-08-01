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

import { Duplex, Transform } from 'readable-stream';
import v4 from 'uuid/v4';
import {
  MsgTypes, PayloadOf,
  RequestMessage,
  RequestResponse, RuntimeMessage
} from '../types';

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

export class MultiplexWindowMessageDuplex extends Duplex {
  constructor(protected window: Window, public tag: string, public untag?: string) {
    super({ objectMode: true });
    window.addEventListener('message', this.eventHandler);
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

  // async sendRequest<T extends RuntimeMessagePayload<InPageMsgTypes> & RequestMessage, U >(payload: T, dst: string | string[]): Promise<U> {
  //   //origin will be added in content_script
  //   this.write({
  //     origin: undefined,
  //     dst,
  //     payload
  //   } as RuntimeMessageOf<InPageMsgTypes>);
  //   return new Promise((resolve, reject) => {
  //     const filter = (message: RuntimeMessageWith<RequestResponse<U>>) => {
  //       const {payload: {requestUUID}} = message;
  //       if (requestUUID === payload.requestUUID) {
  //         if (message.payload.isError) {
  //           reject(message.payload.result);
  //         }else{
  //           resolve(message.payload.result as U);
  //         }
  //         this.removeListener('data', filter);
  //       }
  //     };
  //     this.on('data', filter);
  //   });
  // }

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
    if (data[this.untag]) {
      this.push(data[this.untag]);
    }
  };
}
