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
import { EMPTY, Observable } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import actions from '../../../shared/actions';
import { BgMsgTypes, MessageOrigin } from '../../../types';
import { EpicDependencies } from '../../store';
import { State } from '../../types/state';

const enableRejectEpic = (
  action$: ActionsObservable<AnyAction>,
  state$: StateObservable<State>,
  {runtimeStream}: EpicDependencies
): Observable<any> =>
  action$.pipe(
    ofType(actions.ENABLE.REJECT),
    withLatestFrom(state$),
    switchMap(([,{enable: {requestUUID, originPage}}]) => {
      runtimeStream.send({
        dst: originPage,
        type: BgMsgTypes.ENABLE_RESPONSE,
        requestUUID,
        payload: {
          result:  'User rejected the authorization request',
          isError: true,
        }
      });
      // close enable popup
      window.close();
      return EMPTY;
    })
  );

export default enableRejectEpic;
