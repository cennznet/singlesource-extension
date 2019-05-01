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

import { of } from 'rxjs';
import { withLatestFrom, switchMap } from 'rxjs/operators';
import { ofType, ActionsObservable, StateObservable } from 'redux-observable';
import { AnyAction } from 'redux';
import types from '../../types';
import { State } from '../../types/state';

const onAccountsChangeEpic = (
  action$: ActionsObservable<AnyAction>,
  state$: StateObservable<State>
) =>
  action$.pipe(
    ofType(types.GET_ACCOUNTS.SUCCESS, types.DISCONNECT),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { accounts } = state;
      return of({
        type: types.POST_MESSAGE,
        payload: { type: 'accounts', accounts }
      });
    })
  );

export default onAccountsChangeEpic;
