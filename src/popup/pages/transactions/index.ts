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

import { connect } from 'react-redux';
import _ from 'lodash';
import TransactionsPage from './transactionsPage';
import { State } from '../../types/state';
import {
  getTransactionsSelector,
  isFetchingTransactionsSelector
} from '../../reducers/transactions';
import types from '../../types';

const mapStateToProps = (state: State, props: any) => {
  const { address, assetId } = props.params;
  return {
    transactions: getTransactionsSelector(state, address, assetId),
    fetching: isFetchingTransactionsSelector(state, address, assetId)
  };
};

const mapDispatchToProps = {
  onRefresh: (address: string, assetId: number) => ({
    type: types.FETCH_TRANSACTIONS.REQUEST,
    payload: { address, assetId }
  })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionsPage);
