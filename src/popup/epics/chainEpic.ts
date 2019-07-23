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

import { Observable, merge, of, EMPTY } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';
import { ofType, ActionsObservable } from 'redux-observable';
import { REHYDRATE } from 'redux-persist';
import types from '../../shared/actions';
import { AnyAction } from 'redux';

const chainEpic = (
  action$: ActionsObservable<AnyAction>
): Observable<AnyAction> =>
  merge(
    action$.pipe(
      ofType(REHYDRATE),
      mapTo({ type: types.INIT })
    ),

    action$.pipe(
      ofType(types.NAVIGATE),
      switchMap(({ payload, params }) => {
        if (payload === 'transactions') {
          const { address, assetId } = params;
          return of({
            type: types.FETCH_TRANSACTIONS.REQUEST,
            payload: { address, assetId }
          });
        }
        return EMPTY;
      })
    )
  );

export default chainEpic;
