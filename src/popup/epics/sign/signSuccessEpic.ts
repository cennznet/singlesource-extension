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

import { Observable, EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType, ActionsObservable } from 'redux-observable';
import types from '../../../shared/actions';
import { ExtrinsicSignSuccess, PopupMsgTypes, MessageOrigin } from '../../../types';
import { Action } from 'redux-actions';
import { SignSuccessPayload } from '../../types/actions';
import { EpicDependencies } from '../../store';
import getParameter from '../../utils/getParameter';

const signSuccessEpic = (
  action$: ActionsObservable<Action<any>>,
  _,
  { runtimeStream }: EpicDependencies
): Observable<never> =>
  action$.pipe(
    ofType<Action<SignSuccessPayload>>(types.SIGN.SUCCESS),
    switchMap(({ payload: { requestUUID, hexSignature } }) => {
      const parent = getParameter('parent') || MessageOrigin.PAGE;
      const message = {
        dst: parent,
        type: PopupMsgTypes.SIGNED,
        requestUUID,
        payload: {
          result: hexSignature,
          isError: false,
        }
      };
      runtimeStream.send(message);
      return EMPTY;
    })
  );

export default signSuccessEpic;
