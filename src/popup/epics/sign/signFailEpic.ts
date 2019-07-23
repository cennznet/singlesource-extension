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

import { Action } from 'redux-actions';
import { ActionsObservable, ofType } from 'redux-observable';
import { EMPTY, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import types from '../../../shared/actions';
import { MessageOrigin, PopupMsgTypes } from '../../../types';
import { EpicDependencies } from '../../store';
import { SignFailPayload } from '../../types/actions';
import getParameter from '../../utils/getParameter';

const signFailEpic = (
  action$: ActionsObservable<Action<any>>,
  _,
  { runtimeStream }: EpicDependencies
): Observable<never> =>
  action$.pipe(
    ofType<Action<SignFailPayload>>(types.SIGN.FAIL),
    switchMap(({ payload: { requestUUID, error } }) => {
      const parent = getParameter('parent') || MessageOrigin.PAGE;
      const message = {
        dst: parent,
        type: PopupMsgTypes.SIGNED,
        requestUUID,
        payload: {
          result: error,
          isError: true,
        }
      };
      runtimeStream.send(message);
      return EMPTY;
    })
  );

export default signFailEpic;
