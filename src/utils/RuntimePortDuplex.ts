import { Duplex } from 'readable-stream';
import { Runtime } from 'webextension-polyfill-ts';
import {
  BgMsgTypes,
  InPageMsgTypes,
  MessageOrigin, PageToBgMessage,
  PopupMsgTypes,
  RuntimeMessageOf,
  RuntimeMessagePayload
} from '../types';
import logger from '../logger';

export class RuntimePortDuplex extends Duplex{
  port: Runtime.Port;
  origin: string;

  constructor(port: Runtime.Port, origin?: string) {
    super({ objectMode: true });
    this.port = port;
    this.origin = origin ? origin : port.name;
    port.onMessage.addListener(this.eventHandler);
  }

  send<T extends RuntimeMessagePayload<PopupMsgTypes| InPageMsgTypes | BgMsgTypes>>(payload: T, dst: string | string[]) {
    this.write({
      origin: this.origin,
      dst,
      payload
    } as RuntimeMessageOf<PopupMsgTypes | InPageMsgTypes | BgMsgTypes>)
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
