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
import { NetworkName } from '../../../types';
import { PeerjsState } from '../../reducers/peerjsReducer';
import { SignState } from '../../reducers/signReducer';
import { Container, Hash, Subtitle, Title } from './style';

type Props = {
  network: NetworkName;
  sign: SignState;
  initPeerjsConnection(): void;
} & PeerjsState;

function cliSignCmd(encoded: string) {
  return `cennz-cli ext:sign ${encoded}`;
}

class SignPage extends PureComponent<Props, {}> {

  constructor(props: Props) {
    super(props);
    // this.state = { peerId: null, error: null, sent: false };
    // this.peer.peerId$.subscribe(peerId => {
    //   this.setState({ peerId });
    //   console.log('sign payload', this.props.sign.payload);
    //   this.peer.send(this.props.sign.payload).then(() => {
    //     this.setState({ sent: true });
    //   });
    // });
    //
    // this.peer._data$.subscribe(({ hexSignature }) => {
    //   const {
    //     sign: { requestUUID },
    //     onSignComplete
    //   } = this.props;
    //   onSignComplete(requestUUID, hexSignature);
    //   this.peer.destroy();
    // });
    // this.peer.error$.subscribe(error => {
    //   this.setState({ error });
    // });
  }

  componentWillMount(): void {
    this.props.initPeerjsConnection();
    // this.props.sendThroughRtc(this.props.sign.payload);
  }

  render() {
    const { peerId, opened, sessionId, secretKey, network, sign } = this.props;

    if (sign.hexSignature) {
      return (
        <Container>
          <Title>Sign Successful</Title>
          <Hash>Signature: {sign.hexSignature}</Hash>
        </Container>
      );
    }

    if (opened) {
      return (
        <Container>
          <Title>Do not close the modal</Title>
          <Hash>Connection established. Waiting for response...</Hash>
        </Container>
      );
    }

    const request = stringify({
      sessionId,
      secretKey,
      peerId,
      environment: network,
      type: 'signRequest'
    });

    const encoded = LZString.compressToEncodedURIComponent(request);

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
