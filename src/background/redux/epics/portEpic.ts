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
import {map, switchMap} from 'rxjs/operators';
import {Runtime} from 'webextension-polyfill-ts';

import actions from '../../../shared/actions';
import {PopupMsgTypes} from '../../../types';
import {EpicMessageOrigin} from '../../../types/message';
import {EpicDependencies} from '../index';
import {BackgroundState} from '../reducers';

const portConnectEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {router}: EpicDependencies
): Observable<Action<any>> =>
  action$.pipe(
    ofType<Action<Runtime.Port>>(actions.PORT_CONNECT),
    switchMap(({payload}) => {
      router.setup(payload);
      return EMPTY;
    })
  );

const portDisconnectEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {router}: EpicDependencies
): Observable<Action<any>> =>
  action$.pipe(
    ofType<Action<Runtime.Port>>(actions.PORT_DISCONNECT),
    switchMap(({payload}) => {
      router.remove(payload);
      return EMPTY;
    })
  );

const enabledPortAddEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {router}: EpicDependencies
): Observable<Action<any>> =>
  action$.pipe(
    ofType(EpicMessageOrigin.POPUP),
    map(msg => msg.payload),
    ofType<Action<string>>(PopupMsgTypes.ENABLED_PORT_ADD),
    switchMap(({payload}) => {
      router.addEnabledPort(payload);
      return EMPTY;
    })
  );

const enabledPortRemoveEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {router}: EpicDependencies
): Observable<Action<any>> =>
  action$.pipe(
    ofType(EpicMessageOrigin.POPUP),
    map(msg => msg.payload),
    ofType<Action<string>>(actions.ENABLED_PORT_REMOVE),
    switchMap(({payload}) => {
      router.removeEnabledPort(payload);
      return EMPTY;
    })
  );

export default combineEpics(portConnectEpic, portDisconnectEpic, enabledPortAddEpic, enabledPortRemoveEpic);
