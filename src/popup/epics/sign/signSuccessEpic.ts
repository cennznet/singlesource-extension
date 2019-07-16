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

import { of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ofType, ActionsObservable } from 'redux-observable';
import types from '../../types';
import { ExtrinsicSignSuccess, OutgoingMsgTypes } from '../../../types';
import { Action } from 'redux-actions';
import { SignSuccessPayload } from '../../types/actions';

const signSuccessEpic = (
  action$: ActionsObservable<Action<any>>
): Observable<Action<ExtrinsicSignSuccess>> =>
  action$.pipe(
    ofType<Action<SignSuccessPayload>>(types.SIGN.SUCCESS),
    switchMap(({ payload: { requestUUID, hexSignature } }) => {
      const payload: ExtrinsicSignSuccess = {
        type: OutgoingMsgTypes.SIGNED,
        hexSignature,
        requestUUID,
        origin: 'bg'
      };
      return of({
          type: types.POST_MESSAGE,
          payload
        })
      }
    )
  );

export default signSuccessEpic;
