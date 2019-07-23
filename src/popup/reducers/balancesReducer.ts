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

import BigNumber from 'bignumber.js';
import _ from 'lodash';
import { AnyAction } from 'redux';
import { createSelector } from 'reselect';
import types from '../../shared/actions';
import { BalancesState } from '../types/balancesState';
import { State } from '../types/state';

const initialState: BalancesState = {};

export default (state = initialState, action: AnyAction): BalancesState => {
  switch (action.type) {
    case types.FETCH_BALANCE.REQUEST: {
      const address = _.get(action, 'payload.asset.address');
      const assetId = _.get(action, 'payload.asset.assetId');

      const update = {
        [address]: {
          [assetId]: {
            loading: true,
            error: null
          }
        }
      };

      return _.merge(_.cloneDeep(state), update);
    }

    case types.FETCH_BALANCE.FAIL: {
      const address = _.get(action, 'payload.asset.address');
      const assetId = _.get(action, 'payload.asset.assetId');
      const error = _.get(action, 'payload.error');

      const update = {
        [address]: {
          [assetId]: {
            error,
            loading: false
          }
        }
      };

      return _.merge(_.cloneDeep(state), update);
    }

    case types.FETCH_BALANCE.SUCCESS: {
      const address = _.get(action, 'payload.asset.address');
      const assetId = _.get(action, 'payload.asset.assetId');
      const balance = _.get(action, 'payload.asset.balance');

      const update = {
        [address]: {
          [assetId]: {
            balance,
            loading: false
          }
        }
      };

      return _.merge(_.cloneDeep(state), update);
    }

    default:
      return state;
  }
};

const getBalancesSelector = (state: State): BalancesState => state.balances;

export const getBalanceInfoSelector = createSelector(
  [
    getBalancesSelector,
    (__, address) => address,
    (__, ___, assetId) => assetId
  ],
  (balances, address, assetId) => {
    const defaultBalanceInfo = {
      balance: new BigNumber(0),
      loading: false,
      error: null
    };
    const balanceInfo = _.get(balances, `${address}.${assetId}`, {});
    return _.defaultsDeep(balanceInfo, defaultBalanceInfo);
  }
);
