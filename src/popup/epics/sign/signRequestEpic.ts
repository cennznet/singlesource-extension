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

import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { Observable, EMPTY } from 'rxjs';
import { withLatestFrom, switchMap } from 'rxjs/operators';
import { AnyAction } from 'redux';
import _ from 'lodash';
import { State } from '../../types/state';
import types from '../../types';
import getParameter from '../../utils/getParameter';

const signRequestEpic = (
  action$: ActionsObservable<AnyAction>,
  state$: StateObservable<State>
): Observable<any> =>
  action$.pipe(
    ofType(types.GET_ACCOUNTS.SUCCESS),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { accounts } = state;
      if (_.isEmpty(accounts)) return EMPTY;

      const request = JSON.parse(getParameter('sign'));
      if (request) {
        return [
          { type: types.SIGN.REQUEST, payload: request },
          { type: types.NAVIGATE, payload: 'sign' }
        ];
      }

      return EMPTY;
    })
  );
export default signRequestEpic;
