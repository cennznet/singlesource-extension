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

import CryptoJS from 'crypto-js';
import Peer from 'peerjs';
import {AsyncSubject, EMPTY, Observable, ReplaySubject, Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {v4} from 'uuid';

// const peerJS = {
//   host: 'service.centralityapp.com',
//   path: '/peerjs-server/',
//   secure: true
// };

const config: any = {
  iceServers: [
    {url: 'stun:stun01.sipphone.com'},
    {url: 'stun:stun.ekiga.net'},
    {url: 'stun:stun.fwdnet.net'},
    {url: 'stun:stun.ideasip.com'},
    {url: 'stun:stun.iptel.org'},
    {url: 'stun:stun.rixtelecom.se'},
    {url: 'stun:stun.schlund.de'},
    {url: 'stun:stun.l.google.com:19302'},
    {url: 'stun:stun1.l.google.com:19302'},
    {url: 'stun:stun2.l.google.com:19302'},
    {url: 'stun:stun3.l.google.com:19302'},
    {url: 'stun:stun4.l.google.com:19302'},
    {url: 'stun:stunserver.org'},
    {url: 'stun:stun.softjoys.com'},
    {url: 'stun:stun.voiparound.com'},
    {url: 'stun:stun.voipbuster.com'},
    {url: 'stun:stun.voipstunt.com'},
    {url: 'stun:stun.voxgratia.org'},
    {url: 'stun:stun.xten.com'},
    {
      url: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com',
    },
    {
      url: 'turn:192.158.29.39:3478?transport=udp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808',
    },
    {
      url: 'turn:192.158.29.39:3478?transport=tcp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808',
    },
  ],
};

class P2PSession {
  peer: Peer;
  // Session uniq identifier
  uuid = v4();

  // SecretKey used to encrypt data flow. Both connect session
  // should use the same secretKey
  secretKey: string;

  peerId$: Observable<string>;

  connection$: Observable<Peer.DataConnection>;

  connectionClosed$: Observable<Peer.DataConnection>;

  data$: Observable<any>;

  error$: Observable<Error>;

  peerjsError$: Observable<Error>;

  // Id received from peer-server
  protected _peerId$: AsyncSubject<string> = new AsyncSubject();

  // Data connection stream
  protected _connection$: ReplaySubject<Peer.DataConnection> = new ReplaySubject(1);

  protected _connectionClosed$: Subject<Peer.DataConnection> = new Subject();

  // Data stream
  protected _data$ = new ReplaySubject<any>(1);

  // Error stream
  protected _error$ = new Subject<Error>();
  protected _peerjsError$ = new Subject<Error>();

  protected _destroyed$ = new Subject<boolean>();

  constructor(secretKey?: string) {
    this.peerId$ = this._peerId$.pipe(takeUntil(this._destroyed$));
    this.connection$ = this._connection$.pipe(takeUntil(this._destroyed$));
    this.connectionClosed$ = this._connectionClosed$.pipe(takeUntil(this._destroyed$));
    this.data$ = this._data$.pipe(takeUntil(this._destroyed$));
    this.error$ = this._error$.pipe(takeUntil(this._destroyed$));
    this.peerjsError$ = this._peerjsError$.pipe(takeUntil(this._destroyed$));

    // Use provided secretKey or generate a random one.
    this.secretKey = secretKey || CryptoJS.lib.WordArray.random(12).toString();

    this.peer = new Peer({config});
    this.peer.on('open', id => {
      this._peerId$.next(id);
      this._peerId$.complete();
    });
    this.peer.on('connection', conn => {
      this.subscribeConnection(conn);
    });
    this.peer.on('close', () => this._peerjsError$.next(new Error('Peer closed!')));
    this.peer.on('error', err => this._peerjsError$.next(err));
  }

  subscribeConnection(conn) {
    conn.on('open', () => {
      this._connection$.next(conn);
    });

    conn.on('data', data => {
      try {
        const decrypted = CryptoJS.AES.decrypt(data, this.secretKey).toString(CryptoJS.enc.Utf8);
        const message = JSON.parse(decrypted);
        this._data$.next(message);
      } catch (error) {
        this._error$.next(error);
      }
    });

    conn.on('close', () => {
      this._connectionClosed$.next(conn);
    });

    conn.on('error', e => {
      this._error$.next(e);
    });
  }

  async connect(peerId): Promise<void> {
    return this._peerId$
      .pipe(
        switchMap(() => {
          const conn = this.peer.connect(
            peerId,
            {serialization: 'json'}
          );
          this.subscribeConnection(conn);
          return EMPTY;
        })
      )
      .toPromise();
  }

  async send(message): Promise<void> {
    return new Promise((resolve, reject) => {
      const msg = CryptoJS.AES.encrypt(JSON.stringify(message), this.secretKey).toString();
      this._connection$.subscribe(conn => {
        conn.send(msg);
        resolve();
      }, reject);
    });
  }

  destroy() {
    this._destroyed$.next(true);
    this.peer.destroy();
  }
}

export default P2PSession;
