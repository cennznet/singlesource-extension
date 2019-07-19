import { Transform } from 'readable-stream';
import logger from '../logger';

export function addOrigin(origin: string) {
  return new Transform({
    objectMode: true,
    transform(chunk: any, encoding: string, callback: (error?: Error, data?: any) => void): void {
      try {
        chunk.origin = origin;
        callback(null, chunk);
      }catch (e) {
        logger.debug('addOrigin fail');
        callback();
      }
    }
  });
}
