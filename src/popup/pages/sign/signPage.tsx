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

import copy from 'copy-to-clipboard';
import React, { PureComponent } from 'react';
import QRCode from 'qrcode.react';
import stringify from 'safe-json-stringify';
import { Container, Title, Subtitle, Hash } from './style';
import { CircularProgress } from '@material-ui/core';
import LZString from 'lz-string';
import P2PSession from '../../utils/p2pSession';
import { NetworkName } from '../../../types';

type Props = {
  network: NetworkName;
  sign: any;
  onSignComplete: (requestUUID: string, hexSignature: string) => void;
};

type State = {
  peerId?: string;
  sent: boolean;
  error?: Error;
};

function cliSignCmd(encoded: string) {
  return `cennz-cli ext:sign ${encoded}`;
}

class SignPage extends PureComponent<Props, State> {
  peer = new P2PSession();

  constructor(props: Props) {
    super(props);
    this.state = { peerId: null, error: null, sent: false };
    this.peer.peerId$.subscribe(peerId => {
      this.setState({ peerId });
      this.peer.send(this.props.sign.payload).then(() => {
        this.setState({ sent: true });
      });
    });

    this.peer.data$.subscribe(({ hexSignature }) => {
      const {
        sign: { requestUUID },
        onSignComplete
      } = this.props;
      onSignComplete(requestUUID, hexSignature);
      this.peer.destroy();
    });
    this.peer.error$.subscribe(error => {
      this.setState({ error });
    });
  }

  render() {
    const { peerId, sent } = this.state;
    const sessionId = this.peer.uuid;
    const secretKey = this.peer.secretKey;
    const { network, sign } = this.props;

    if (sign.hexSignature)
      return (
        <Container>
          <Title>Sign Successful</Title>
          <Hash>Signature: {sign.hexSignature}</Hash>
        </Container>
      );

    if (!!sent)
      return (
        <Container>
          <Title>Do not close the modal</Title>
          <Hash>Connection established. Waiting for response...</Hash>
        </Container>
      );

    const request = stringify({
      sessionId,
      secretKey,
      peerId,
      environment: network,
      type: 'signRequest'
    });

    const encoded = LZString.compressToEncodedURIComponent(request);
    // const link = `singlesource-${network.toLowerCase()}://?request=${encoded}`;
    // if (peerId) {
    //   console.log(link);
    // }

    return (
      <Container>
        <Title>Sign Request</Title>
        <Subtitle>
          Authorise this request by scanning the QR code on mySingleSource app
        </Subtitle>
        {peerId ? (
          <div onClick={(evt) => {
            if ((evt as unknown as UIEvent).detail === 4) {
              copy(cliSignCmd(encoded));
            }
          }}><QRCode size={365} level="H" value={encoded} /></div>
        ) : (
          <CircularProgress />
        )}
      </Container>
    );
  }
}

export default SignPage;
