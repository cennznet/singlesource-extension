import { Duplex, Transform } from 'readable-stream';

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

export class TaggedDuplex extends Duplex{
  constructor(public tag: string){
    super({objectMode: true});
  }

  _read(size?: number): void {
  }

  _write(chunk: any, encoding: string, callback: (error?: (Error | null)) => void): void {
    this.push({[this.tag]: chunk});
  }
}

// export class TagUnTagStream extends Transform {
//   constructor(private tag: string) {
//     super({ objectMode: true });
//   }
//
//   _transform(chunk: any, encoding: string, callback: (error?: Error, data?: any) => void): void {
//     callback(null, { [this.tag]: chunk });
//   }
// }
