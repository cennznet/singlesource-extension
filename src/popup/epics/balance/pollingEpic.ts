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
import { AnyAction } from 'redux';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { Observable, timer } from 'rxjs';
import { switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import types from '../../../shared/actions';
import { State } from '../../types/state';

const pollingEpic = (
  action$: ActionsObservable<AnyAction>,
  state$: StateObservable<State>
): Observable<AnyAction> =>
  action$.pipe(
    ofType(types.GET_ACCOUNTS.SUCCESS, types.INIT),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { accounts } = state;
      const assets = _.flattenDeep(
        accounts.map(account =>
          account.assets.map(asset => ({ ...asset, address: account.address }))
        )
      );

      // repeat every 30 seconds until disconnect
      const repeat$ = timer(0, 30 * 1000).pipe(
        takeUntil(action$.ofType(types.DISCONNECT))
      );

      return repeat$.pipe(
        switchMap(() =>
          assets.map(asset => ({
            type: types.FETCH_BALANCE.REQUEST,
            payload: { asset }
          }))
        )
      );
    })
  );

export default pollingEpic;
