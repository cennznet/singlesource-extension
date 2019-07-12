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

import React from 'react';
import { Tooltip, CircularProgress } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import BN from 'bn.js';
import Moment from 'moment';
import {
  Container,
  Content,
  Row,
  Column,
  Flow,
  Amount,
  Asset,
  Date,
  IconContainer,
  Address
} from './style';
import { weiToAmount } from '../../utils/amount';
import { getAssetName } from '../../utils/asset';
import { AssetTransferTx } from '../../types/transactions';

const getAddress = (transaction: AssetTransferTx): string => {
  const address =
    transaction.transactionFlow === 'Incoming'
      ? transaction.fromAddress
      : transaction.toAddress;
  return `${address.substr(0, 10)}....${address.substr(
    address.length - 10,
    address.length
  )}`;
};

const TransactionItem = ({ transaction }: { transaction: AssetTransferTx }) => (
  <Container>
    <Content>
      <Row style={{ flex: 1, justifyContent: 'space-between' }}>
        <Row>
          <IconContainer>
            <Icon style={{ color: '#fff' }}>
              {transaction.transactionFlow === 'Incoming'
                ? 'arrow_downward'
                : 'arrow_upward'}
            </Icon>
          </IconContainer>
          <Column>
            <Row>
              <Amount>
                {weiToAmount(new BN(transaction.value)).toFormat()}
              </Amount>
              <Asset>{getAssetName(transaction.assetId)}</Asset>
            </Row>
            <Address>{getAddress(transaction)}</Address>
            <Row>
              <Flow>{transaction.transactionFlow}</Flow>
              <Date>{Moment.unix(transaction.timestamp).fromNow()}</Date>
            </Row>
          </Column>
        </Row>
        <Row>
          <Column style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Tooltip title="View on UNcover">
              <a
                target="_blank"
                href={`https://uncoverexplorer.com/tx/${transaction.hash}`}
              >
                <Icon>link</Icon>
              </a>
            </Tooltip>
            {transaction.status === true ? (
              <Icon color="secondary" fontSize="small">
                check
              </Icon>
            ) : (
              <Icon color="secondary" fontSize="small">
                clear
              </Icon>
            )}
          </Column>
        </Row>
      </Row>
    </Content>
  </Container>
);

export default TransactionItem;
