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
import { ActionsObservable, ofType } from 'redux-observable';
import { merge } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import types from '../../shared/actions';

const navigateEpic = (action$: ActionsObservable<AnyAction>) =>
  merge(
    action$.pipe(
      ofType(types.CONNECT, types.GET_ACCOUNTS.SUCCESS),
      mapTo({ type: types.NAVIGATE, payload: 'dashboard' })
    ),
    action$.pipe(
      ofType(types.DISCONNECT, types.GET_ACCOUNTS.FAIL),
      mapTo({ type: types.NAVIGATE, payload: 'connect' })
    ),
    action$.pipe(
      ofType(types.SELECT_ACCOUNT),
      mapTo({ type: types.NAVIGATE, payload: 'accountDetails' })
    )
  );

export default navigateEpic;
