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
import {ActionsObservable, combineEpics, ofType, StateObservable} from 'redux-observable';
import {EMPTY, Observable} from 'rxjs';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import actions from '../../../shared/actions';
import {BgMsgTypes, EpicMessageOrigin} from '../../../types';
import {PopupMsgTypes} from '../../../types/message';
import {BackgroundState} from '../reducers';

const bgInitEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {router}
): Observable<Action<any>> =>
  action$.pipe(
    ofType(EpicMessageOrigin.POPUP),
    map(msg => msg.payload),
    ofType<Action<any>>(PopupMsgTypes.BG_INIT),
    withLatestFrom(state$),
    switchMap(([cmd, state]) => {
      router.send(BgMsgTypes.ENVIRONMENT, state.network, cmd.payload.origin);
      router.send(BgMsgTypes.ACCOUNTS, state.accounts, cmd.payload.origin);
      return EMPTY;
    })
  );

  const initEpic = (
    action$: ActionsObservable<Action<any>>,
    state$: StateObservable<BackgroundState>,
    {router}
  ): Observable<Action<any>> =>
    action$.pipe(
      ofType<Action<any>>(actions.INIT),
      withLatestFrom(state$),
      switchMap(([cmd, state]) => {
        router.send(BgMsgTypes.ENVIRONMENT, state.network, cmd.payload.origin);
        router.send(BgMsgTypes.ACCOUNTS, state.accounts, cmd.payload.origin);
        return EMPTY;
      })
    );

export default combineEpics(initEpic, bgInitEpic);
