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

import { CircularProgress } from '@material-ui/core';
import copy from 'copy-to-clipboard';
import LZString from 'lz-string';
import QRCode from 'qrcode.react';
import React, { PureComponent } from 'react';
import stringify from 'safe-json-stringify';
import { Account, NetworkName } from '../../../types';
import Splash from '../../components/splash';
import P2PSession from '../../utils/p2pSession';
import { Content, Subtitle, Title } from './style';

type Props = {
  network: NetworkName;
  onConnect: (accounts: Account[]) => void;
};

type State = {
  peerId?: string;
  error?: Error;
  opened: boolean;
};

function cliConnectCmd(encoded: string) {
  return `cennz-cli ext:connect ${encoded}`;
}

class ConnectPage extends PureComponent<Props, State> {
  private peer: P2PSession;

  constructor(props: Props) {
    super(props);
    this.state = { peerId: null, error: null, opened: false };
    this.connect();
  }

  connect() {
    if (this.peer) {
      this.peer.destroy();
    }
    this.peer = new P2PSession();
    this.peer.peerId$.subscribe(peerId => this.setState({ peerId }));
    this.peer.connection$.subscribe(() => this.setState({ opened: true }));
    this.peer.data$.subscribe(response => {
      const { accounts } = response;
      this.props.onConnect(accounts);
    });
    this.peer.error$.subscribe(error => {
      console.log(error);
      this.connect();
    });
  }

  render() {
    const { network } = this.props;
    const sessionId = this.peer.uuid;
    const secretKey = this.peer.secretKey;
    const { peerId, error, opened } = this.state;

    if (error) return <pre>{stringify(error)}</pre>;

    if (opened) {
      return 'Connection established! Do not close this window.';
    }

    const request = stringify({
      sessionId,
      secretKey,
      peerId,
      environment: network,
      type: 'connectRequest'
    });

    const encoded = LZString.compressToEncodedURIComponent(request);
    // const link = `singlesource-${environment.toLowerCase()}://?request=${encoded}`;
    // if (peerId) {
    //   console.log(link);
    // }

    return (
      <Content>
        <Title>Connect</Title>
        <Subtitle>
          Connect your SingleSource account by scanning the QR code on
          mySingleSource app
        </Subtitle>
        {peerId ? (
          <div onClick={(evt) => {
            if ((evt as unknown as UIEvent).detail === 4) {
              copy(cliConnectCmd(encoded));
            }
          }}><QRCode size={365} level="H" value={encoded}/></div>
        ) : (
          <div style={{ alignSelf: 'center' }}>
            <CircularProgress/>
          </div>
        )}
        <Splash/>
      </Content>
    );
  }
}

export default ConnectPage;
