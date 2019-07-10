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

import Peer from 'peerjs';
import { ReplaySubject, AsyncSubject, Subject, EMPTY } from 'rxjs';
import CryptoJS from 'crypto-js';
import { v4 } from 'uuid';
import { switchMap } from 'rxjs/operators';

// const peerJS = {
//   host: 'service.centralityapp.com',
//   path: '/peerjs-server/',
//   secure: true
// };

const config: any = {
  iceServers: [
    { url: 'stun:stun01.sipphone.com' },
    { url: 'stun:stun.ekiga.net' },
    { url: 'stun:stun.fwdnet.net' },
    { url: 'stun:stun.ideasip.com' },
    { url: 'stun:stun.iptel.org' },
    { url: 'stun:stun.rixtelecom.se' },
    { url: 'stun:stun.schlund.de' },
    { url: 'stun:stun.l.google.com:19302' },
    { url: 'stun:stun1.l.google.com:19302' },
    { url: 'stun:stun2.l.google.com:19302' },
    { url: 'stun:stun3.l.google.com:19302' },
    { url: 'stun:stun4.l.google.com:19302' },
    { url: 'stun:stunserver.org' },
    { url: 'stun:stun.softjoys.com' },
    { url: 'stun:stun.voiparound.com' },
    { url: 'stun:stun.voipbuster.com' },
    { url: 'stun:stun.voipstunt.com' },
    { url: 'stun:stun.voxgratia.org' },
    { url: 'stun:stun.xten.com' },
    {
      url: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
    },
    {
      url: 'turn:192.158.29.39:3478?transport=udp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    },
    {
      url: 'turn:192.158.29.39:3478?transport=tcp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808'
    }
  ]
};

class P2PSession {
  peer: Peer;
  // Session uniq identifier
  uuid = v4();

  // SecretKey used to encrypt data flow. Both connect session
  // should use the same secretKey
  secretKey: string;

  // Id received from peer-server
  peerId$: AsyncSubject<string> = new AsyncSubject();

  // Data connection stream
  connection$: ReplaySubject<Peer.DataConnection> = new ReplaySubject(1);

  connectionClosed$: Subject<Peer.DataConnection> = new Subject();

  rtcConnProtocol$: Subject<any> = new Subject();

  // Data stream
  data$ = new ReplaySubject<any>(1);

  // Error stream
  error$ = new Subject<Error>();

  constructor(secretKey?: string) {
    // Use provided secretKey or generate a random one.
    this.secretKey = secretKey || CryptoJS.lib.WordArray.random(12).toString();

    this.peer = new Peer({ config });
    this.peer.on('open', id => {
      this.peerId$.next(id);
      this.peerId$.complete();
    });
    this.peer.on('connection', conn => {
      this.subscribeConnection(conn);
    });
    this.peer.on('close', () => this.error$.next(new Error('Peer closed!')));
    this.peer.on('error', err => this.error$.next(err));
  }

  subscribeConnection(conn) {
    conn.on('open', () => {
      console.log('open');
      this.connection$.next(conn);
    });

    conn.on('data', data => {
      try {
        const decrypted = CryptoJS.AES.decrypt(data, this.secretKey).toString(
          CryptoJS.enc.Utf8
        );
        const message = JSON.parse(decrypted);
        console.log('M:', JSON.stringify(message));
        this.data$.next(message);
      } catch (error) {
        this.error$.next(error);
      }
    });

    conn.on('close', () => {
      console.log('close');
      this.connectionClosed$.next(conn);
    });

    conn.on('error', this.error$.next);
  }

  connect(peerId): Promise<void> {
    return this.peerId$
      .pipe(
        switchMap(() => {
          const conn = this.peer.connect(peerId, { serialization: 'json' });
          this.subscribeConnection(conn);
          return EMPTY;
        })
      )
      .toPromise();
  }

  send(message): Promise<void> {
    return new Promise((resolve, reject) => {
      const msg = CryptoJS.AES.encrypt(
        JSON.stringify(message),
        this.secretKey
      ).toString();
      this.connection$.subscribe(conn => {
        conn.send(msg);
        resolve();
      }, reject);
    });
  }

  destroy() {
    this.peer.destroy();
  }
}

export default P2PSession;
