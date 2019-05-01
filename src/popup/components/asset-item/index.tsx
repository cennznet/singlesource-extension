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
import { Container, Content, Column, Row, Icon, Asset, Balance } from './style';
import _ from 'lodash';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import { CircularProgress } from '@material-ui/core';
import { getAssetName } from '../../utils/asset';
import { State } from '../../types/state';
import { getBalanceInfoSelector } from '../../reducers/balancesReducer';
import types from '../../types';

type Props = {
  address: string;
  assetId: number;
  balance?: BigNumber;
  loading?: boolean;
  onBalances?: (address: string, assetId: number) => void;
};

class AssetItem extends PureComponent<Props> {
  onBalances = () => {
    const { address, assetId, onBalances } = this.props;
    onBalances(address, assetId);
  };

  render() {
    const { balance, assetId, loading } = this.props;
    const name = getAssetName(assetId);
    return (
      <Container onClick={this.onBalances}>
        <Content>
          <Row>
            <Icon>{name.substr(0, 1)}</Icon>
          </Row>
          <Column style={{ flex: 1 }}>
            <Row
              style={{
                flex: 1,
                width: '100%',
                justifyContent: 'space-between'
              }}
            >
              <Balance>{balance.toFormat()}</Balance>
              {loading && <CircularProgress size={14} />}
            </Row>
            <Asset>{name}</Asset>
          </Column>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state: State, { address, assetId }) => {
  const balanceInfo = getBalanceInfoSelector(state, address, assetId);
  return { ...balanceInfo };
};

const mapDispatchToProps = {
  onBalances: (address: string, assetId: number) => ({
    type: types.NAVIGATE,
    payload: 'transactions',
    params: { address, assetId }
  })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetItem);
