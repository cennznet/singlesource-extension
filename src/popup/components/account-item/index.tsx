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
import { Tooltip } from '@material-ui/core';
import { Container, Content, Name, Address, Assets } from './style';
import { Account } from '../../../types';
import { getAssetName } from '../../utils/asset';

type Props = {
  account: Account;
  onClick: () => void;
};

class AccountItem extends PureComponent<Props> {
  render() {
    const { account, onClick } = this.props;

    return (
      <Container onClick={onClick}>
        <Tooltip title="Account details">
          <Content>
            <Name>{account.name}</Name>
            <Address>{account.address}</Address>
            <Assets>
              {account.assets
                .map(({ assetId }) => getAssetName(assetId))
                .join(', ')}
            </Assets>
          </Content>
        </Tooltip>
      </Container>
    );
  }
}

export default AccountItem;
