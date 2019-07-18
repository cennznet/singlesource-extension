// import { Duplex } from 'readable-stream';
//
//
// export class MessageDuplex extends Duplex{
//
//   constructor(protected window: Window) {
//     super({ objectMode: true });
//     window.addEventListener('message', this.eventHandler);
//   }
//
//   _write(chunk: any, encoding: string, callback: (error?: (Error | null)) => void): void {
//     this.window.postMessage(chunk, window.origin);
//     callback();
//   }
//
//   _read(size?: number): void {
//   }
//
//   _destroy(err: Error | null, callback: (error: (Error | null)) => void): void {
//     this.window.removeEventListener('message', this.eventHandler);
//     callback(err);
//   }
//
//   protected eventHandler = ({data}: MessageEvent) => {
//     this.push(data);
//   };
// }
