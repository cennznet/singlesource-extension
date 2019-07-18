import { Duplex } from 'readable-stream';
import { Runtime } from 'webextension-polyfill-ts';
import { BgMsgTypes, MessageOrigin, RuntimeMessageOf, RuntimeMessagePayload } from '../types';
import { RuntimePortDuplex } from '../utils/RuntimePortDuplex';
import logger from '../logger';

export class PortStreams extends Duplex{
  streams: RuntimePortDuplex[] = [];

  constructor(){
    super({objectMode: true});
  }

  setup(port: Runtime.Port): void {
    const portStream = new RuntimePortDuplex(port, MessageOrigin.BG);
    this.streams.push(portStream);
    portStream.pipe(this);
  }

  remove(port: Runtime.Port): void {
    const streamIdx = this.streams.findIndex(stream => stream.port === port);
    const [stream] = this.streams.splice(streamIdx, 1);
    stream.destroy();
  }

  send<T extends RuntimeMessagePayload<BgMsgTypes>>(payload: T, dst: string | string[]) {
    this.write({
      origin: MessageOrigin.BG,
      dst,
      payload
    } as RuntimeMessageOf<BgMsgTypes>);
  }

  _write(chunk: any, encoding: string, callback: (error?: (Error | null)) => void): void {
    if (isRuntimeMessage(chunk)){
      const handle = (dst: string) => {
        if (dst === MessageOrigin.BG){
          this.push(chunk);
        } else {
          const stream = this.streams.find( stream => stream.port.name.startsWith(dst) );
          if (stream) {
            stream.write(chunk);
          }
        }
      };
      if (chunk.dst instanceof Array) {
        chunk.dst.forEach((dst) => handle(dst));
      } else {
        handle(chunk.dst);
      }
    }
    callback();
  }

  _read(size?: number): void {
  }

}

function isRuntimeMessage(data: any): data is RuntimeMessageOf<any> {
  logger.debug('isRuntimeMessage', data);
  // FIXME
  return true;
}
