import { Duplex, Transform } from 'readable-stream';
import {
  InPageMsgTypes,
  RequestMessage,
  RequestResponse,
  RuntimeMessageOf,
  RuntimeMessagePayload, RuntimeMessageWith
} from '../types';
import { MessageDuplex } from './MessageDuplex';

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
      if(chunk[tag]) {
        callback(null, chunk[tag]);
      }else{
        callback();
      }
    }
  });
}

// export class TaggedDuplex extends Duplex{
//   constructor(public tag: string){
//     super({objectMode: true});
//   }
//
//   send<T extends RuntimeMessagePayload<InPageMsgTypes>>(payload: T, dst: string | string[]): void {
//     //origin will be added in content_script
//     this.write({
//       origin: undefined,
//       dst,
//       payload
//     } as RuntimeMessageOf<InPageMsgTypes>)
//   }
//
//   async sendRequest<T extends RuntimeMessagePayload<InPageMsgTypes> & RequestMessage, U >(payload: T, dst: string | string[]): Promise<U> {
//     //origin will be added in content_script
//     this.write({
//       origin: undefined,
//       dst,
//       payload
//     } as RuntimeMessageOf<InPageMsgTypes>);
//     return new Promise((resolve, reject) => {
//       const filter = (message: RuntimeMessageWith<RequestResponse<U>>) => {
//         const {payload: {requestUUID}} = message;
//         if (requestUUID === payload.requestUUID) {
//           if (message.payload.isError) {
//             reject(message.payload.result);
//           }else{
//             resolve(message.payload.result as U);
//           }
//           this.removeListener('data', filter);
//         }
//       };
//       this.on('data', filter);
//     });
//   }
//
//   _read(size?: number): void {
//   }
//
//   _write(chunk: any, encoding: string, callback: (error?: (Error | null)) => void): void {
//     this.push({[this.tag]: chunk});
//   }
// }

export class TagUntagMessageDuplex extends Duplex {
  constructor(protected window: Window, public tag: string, public untag?: string){
    super({ objectMode: true });
    window.addEventListener('message', this.eventHandler);
  }

  send<T extends RuntimeMessagePayload<InPageMsgTypes>>(payload: T, dst: string | string[]): void {
    //origin will be added in content_script
    this.write({
      origin: undefined,
      dst,
      payload
    } as RuntimeMessageOf<InPageMsgTypes>)
  }

  async sendRequest<T extends RuntimeMessagePayload<InPageMsgTypes> & RequestMessage, U >(payload: T, dst: string | string[]): Promise<U> {
    //origin will be added in content_script
    this.write({
      origin: undefined,
      dst,
      payload
    } as RuntimeMessageOf<InPageMsgTypes>);
    return new Promise((resolve, reject) => {
      const filter = (message: RuntimeMessageWith<RequestResponse<U>>) => {
        const {payload: {requestUUID}} = message;
        if (requestUUID === payload.requestUUID) {
          if (message.payload.isError) {
            reject(message.payload.result);
          }else{
            resolve(message.payload.result as U);
          }
          this.removeListener('data', filter);
        }
      };
      this.on('data', filter);
    });
  }

  _write(chunk: any, encoding: string, callback: (error?: (Error | null)) => void): void {
    this.window.postMessage({[this.tag]: chunk}, window.origin);
    callback();
  }

  _read(size?: number): void {
  }

  _destroy(err: Error | null, callback: (error: (Error | null)) => void): void {
    this.window.removeEventListener('message', this.eventHandler);
    callback(err);
  }

  protected eventHandler = ({data}: MessageEvent) => {
    if(data[this.untag]) {
      this.push(data[this.untag]);
    }
  };
}
