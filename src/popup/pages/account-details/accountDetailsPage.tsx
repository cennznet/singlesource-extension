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

import React, { PureComponent } from 'react';
import { Container, Content, Title, Row, Items } from './style';
import AssetItem from '../../components/asset-item';
import { Tooltip, IconButton } from '@material-ui/core';
import GradientIcon from '@material-ui/icons/Gradient';
import { Account } from '../../types/account';
import QRModal from '../../components/qr-modal';
import Address from '../../components/address';

type P = {
  account: Account;
};

type S = {
  addressQROpen: boolean;
};

class AccountDetailsPage extends PureComponent<P, S> {
  state = { addressQROpen: false };

  onQRModalToggle = () => {
    this.setState(({ addressQROpen }) => ({ addressQROpen: !addressQROpen }));
  };

  render() {
    const { account } = this.props;
    const { addressQROpen } = this.state;
    if (!account)
      return (
        <Container>
          <Content>
            <Title>No account selected</Title>
          </Content>
        </Container>
      );
    const { name, address, assets } = account;
    return (
      <Container>
        <Content>
          <Row>
            <Title>{name}</Title>
            <Tooltip title="Address QR">
              <IconButton onClick={this.onQRModalToggle}>
                <GradientIcon />
              </IconButton>
            </Tooltip>
          </Row>
          <Address value={address} />
          <Items>
            {assets.map(asset => (
              <AssetItem
                key={asset.assetId}
                address={address}
                assetId={asset.assetId}
              />
            ))}
          </Items>
        </Content>
        <QRModal
          open={addressQROpen}
          onClose={this.onQRModalToggle}
          data={account.address}
        />
      </Container>
    );
  }
}

export default AccountDetailsPage;
