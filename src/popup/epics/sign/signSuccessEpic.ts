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

import {Action} from 'redux-actions';
import {ActionsObservable, ofType} from 'redux-observable';
import {EMPTY, Observable} from 'rxjs';
import {switchMap, withLatestFrom} from 'rxjs/operators';
import types from '../../../shared/actions';
import {MessageOrigin, PopupMsgTypes, SignCommand} from '../../../types';
import {EpicDependencies} from '../../store';
import {State} from '../../types/state';
import getParameter from '../../utils/getParameter';

const signSuccessEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: Observable<State>,
  {runtimeStream}: EpicDependencies
): Observable<never> =>
  action$.pipe(
    ofType<Action<string>>(types.SIGN.SUCCESS),
    withLatestFrom(state$),
    switchMap(([{payload}, {sign: {requestUUID}}]) => {
      const request: SignCommand = JSON.parse(getParameter('sign'));
      const parent = request.origin || MessageOrigin.PAGE;
      const message = {
        dst: parent,
        type: PopupMsgTypes.SIGNED,
        requestUUID,
        payload: {
          result: payload,
          isError: false,
        },
      };
      runtimeStream.send(message);
      return EMPTY;
    })
  );

export default signSuccessEpic;
