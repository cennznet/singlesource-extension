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

import { AnyAction } from 'redux';
import { ofType, ActionsObservable, StateObservable } from 'redux-observable';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import _ from 'lodash';
import { State } from '../types/state';
import types from '../../shared/actions';

const baseUrl = (env: string) =>
  `https://internal-api-${env}.uncoverexplorer.com/v1`;

const transactionUrl = (
  environment: string,
  address: string,
  assetId: number
): string =>
  `${baseUrl(
    environment.toLowerCase()
  )}/addresses/${address}/transactions?asset_id=${assetId}`;

const getTransactionsEpic = (
  action$: ActionsObservable<AnyAction>,
  state$: StateObservable<State>
) =>
  action$.pipe(
    ofType(types.FETCH_TRANSACTIONS.REQUEST),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const { address, assetId } = action.payload;
      const { network } = state;
      const url = transactionUrl(network, address, assetId);
      return fetch(url)
        .then(response => response.json())
        .then(response => {
          const transactions = _.get(response, 'result', []);
          return {
            type: types.FETCH_TRANSACTIONS.SUCCESS,
            payload: { address, assetId, transactions }
          };
        })
        .catch(error => ({
          type: types.FETCH_TRANSACTIONS.FAIL,
          payload: { address },
          error
        }));
    })
  );

export default getTransactionsEpic;
