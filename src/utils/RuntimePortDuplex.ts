import { Duplex } from 'readable-stream';
import { Runtime } from 'webextension-polyfill-ts';

export class RuntimePortDuplex extends Duplex{

  constructor(private port: Runtime.Port) {
    super({ objectMode: true });
    port.onMessage.addListener(this.eventHandler);
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
    this.push(message);
  };
}
