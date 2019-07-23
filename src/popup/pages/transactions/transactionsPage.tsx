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

import { CircularProgress, Icon, IconButton } from '@material-ui/core';
import _ from 'lodash';
import React, { PureComponent } from 'react';
import TransactionItem from '../../components/transaction-item';
import { AssetTransferTx } from '../../types/transactions';
import { Container, Content, Items, Row, Title } from './style';

type Props = {
  params: { address: string; assetId: number };
  fetching: boolean;
  transactions: AssetTransferTx[];
  onRefresh: (address: string, assetId: number) => any;
};

class TransactionsPage extends PureComponent<Props> {
  refresh = () => {
    const {
      onRefresh,
      params: { address, assetId }
    } = this.props;
    onRefresh(address, assetId);
  };

  render() {
    const { fetching, transactions } = this.props;
    const noData = _.isEmpty(transactions) && !fetching;
    return (
      <Container>
        <Content>
          <Row style={{ width: '100%', height: 50 }}>
            <Title>Transactions</Title>
            {fetching ? (
              <CircularProgress size={22} style={{ margin: 12 }} />
            ) : (
              <IconButton onClick={this.refresh}>
                <Icon>refresh</Icon>
              </IconButton>
            )}
          </Row>
          <Items>
            {noData && 'No Transactions'}
            {_.map(transactions, i => (
              <TransactionItem key={i.hash} transaction={i} />
            ))}
          </Items>
        </Content>
      </Container>
    );
  }
}

export default TransactionsPage;
