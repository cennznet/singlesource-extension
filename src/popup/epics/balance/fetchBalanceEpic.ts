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

import { of, from } from 'rxjs';
import {
  mergeMap,
  map,
  catchError,
  switchMap,
  takeUntil,
  timeout
} from 'rxjs/operators';
import { ofType, ActionsObservable } from 'redux-observable';
import _ from 'lodash';
import { Api } from '@cennznet/api';
import { GenericAsset } from '@cennznet/crml-generic-asset';
import types from '../../types';
import { Asset } from '../../types/asset';
import api$ from '../../utils/api';
import { weiToAmount } from '../../utils/amount';

type Action = { type: string; payload: { asset: Asset } };

const fetchBalance = async (
  api: Api,
  assetId: number,
  address: string
): Promise<Asset> => {
  const ga = await GenericAsset.create(api);
  const balanceWei = await ga.getFreeBalance(assetId, address);
  const balance = weiToAmount(balanceWei);
  return { address, assetId, balance };
};

const fetchBalanceEpic = (action$: ActionsObservable<Action>) =>
  action$.pipe(
    ofType(types.FETCH_BALANCE.REQUEST),
    mergeMap(action => {
      const { asset } = action.payload;
      const { assetId, address } = asset;

      return api$.pipe(
        switchMap(api => {
          // get balance stream
          const getBalance$ = from(fetchBalance(api, assetId, address));

          // map balance to actions observable
          return getBalance$.pipe(
            map(asset => ({
              type: types.FETCH_BALANCE.SUCCESS,
              payload: { asset }
            })),
            timeout(30 * 1000),
            takeUntil(action$.ofType(types.DISCONNECT))
          );
        }),
        timeout(30 * 1000),
        takeUntil(action$.ofType(types.DISCONNECT)),
        catchError(error =>
          of({ type: types.FETCH_BALANCE.FAIL, error, payload: { asset } })
        )
      );
    })
  );

export default fetchBalanceEpic;
