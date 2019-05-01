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

import _ from 'lodash';
import { createSelector } from 'reselect';
import { TransactionsState, Transaction } from '../types/transactions';
import { State } from '../types/state';
import types from '../types';

type FetchTransactionAction = {
  type: string;
  payload: {
    address: string;
    assetId: number;
    transactions: Transaction[];
  };
  error?: Error;
};

const initialState: TransactionsState = {};

export default (
  state = initialState,
  action: FetchTransactionAction
): TransactionsState => {
  switch (action.type) {
    case types.FETCH_TRANSACTIONS.REQUEST: {
      const { address, assetId } = action.payload;

      const update = {
        [address]: {
          [assetId]: {
            loading: true
          }
        }
      };

      return _.merge(_.cloneDeep(state), update);
    }

    case types.FETCH_TRANSACTIONS.FAIL: {
      const { address, assetId } = action.payload;
      const { error } = action;

      const update = {
        [address]: {
          [assetId]: {
            loading: false,
            error
          }
        }
      };

      return _.merge(_.cloneDeep(state), update);
    }

    case types.FETCH_TRANSACTIONS.SUCCESS: {
      const { address, assetId, transactions } = action.payload;

      const update = {
        [address]: {
          [assetId]: {
            loading: false,
            transactions: _.reduce(
              transactions,
              (obj, item) => ({
                ...obj,
                [item.hash]: item
              }),
              {}
            )
          }
        }
      };

      return _.merge(_.cloneDeep(state), update);
    }

    default:
      return state;
  }
};

const getTransactionsState = (state: State): TransactionsState =>
  state.transactions;

export const getTransactionsSelector = createSelector(
  [
    getTransactionsState,
    (__: any, address: string) => address,
    (__: any, ___: any, assetId: number) => assetId
  ],
  (state, address, assetId): Transaction[] => {
    const path = `${address}.${assetId}.transactions`;
    const transactions = _.get(state, path, {});
    // @ts-ignore
    return _.values(transactions);
  }
);

export const getTransactionSelector = createSelector(
  [getTransactionsSelector, (__, ___, ____, hash: string) => hash],
  (transactions, hash) => _.find(transactions, { hash })
);

export const isFetchingTransactionsSelector = createSelector(
  [
    getTransactionsState,
    (__: any, address: string) => address,
    (__: any, ___: any, assetId: number) => assetId
  ],
  (state, address, assetId): boolean =>
    // @ts-ignore
    _.get(state, `${address}.${assetId}.loading`, false)
);
