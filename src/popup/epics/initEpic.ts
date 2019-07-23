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
import { of } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import types from '../../shared/actions';

const initEpic = (
  action$: ActionsObservable<AnyAction>,
  state$: StateObservable<any>
) =>
  action$.pipe(
    ofType(types.INIT),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { accounts } = state;
      if (_.isEmpty(accounts)) return of({ type: types.GET_ACCOUNTS.FAIL });
      return of({ type: types.GET_ACCOUNTS.SUCCESS, payload: accounts });
    })
  );

export default initEpic;
