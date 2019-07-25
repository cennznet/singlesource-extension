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

import {AnyAction} from 'redux';
import {Action} from 'redux-actions';
import {ActionsObservable, combineEpics, ofType, StateObservable} from 'redux-observable';
import {EMPTY, Observable, of} from 'rxjs';
import {map, mapTo, switchMap} from 'rxjs/operators';
import {BackgroundState} from '../../background/redux/reducers';
import actions from '../../shared/actions';
import {BgMsgTypes, MessageOrigin, PeerjsData, PeerjsError, PeerjsOpen, PeerjsReady, PopupMsgTypes} from '../../types';
import {EpicDependencies} from '../store';

const peerjsInitEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {runtimeStream}: EpicDependencies
): Observable<Action<any>> =>
  action$.pipe(
    ofType(actions.PEERJS_INIT.REQUEST),
    switchMap(() => {
      runtimeStream.send(PopupMsgTypes.PEERJS_INIT, {}, MessageOrigin.BG);
      return EMPTY;
    })
  );

const peerjsSendEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {runtimeStream}: EpicDependencies
): Observable<Action<any>> =>
  action$.pipe(
    ofType(actions.PEERJS_SEND),
    switchMap(({payload}) => {
      runtimeStream.send(PopupMsgTypes.PEERJS_SEND, payload, MessageOrigin.BG);
      return EMPTY;
    })
  );

const peerjsReadyEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {runtimeStream}: EpicDependencies
): Observable<Action<any>> =>
  action$.pipe(
    ofType(actions.STREAM_MSG),
    map(msg => msg.payload),
    ofType<PeerjsReady>(BgMsgTypes.PEERJS_READY),
    map(({payload}) => ({type: actions.PEERJS_INIT.SUCCESS, payload}))
  );

const peerjsErrorEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {runtimeStream}: EpicDependencies
): Observable<AnyAction> =>
  action$.pipe(
    ofType(actions.STREAM_MSG),
    map(msg => msg.payload),
    ofType<PeerjsError>(BgMsgTypes.PEERJS_ERROR),
    mapTo({type: actions.PEERJS_INIT.REQUEST})
  );

const peerjsOpenEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {runtimeStream}: EpicDependencies
): Observable<Action<any>> =>
  action$.pipe(
    ofType(actions.STREAM_MSG),
    map(msg => msg.payload),
    ofType<PeerjsOpen>(BgMsgTypes.RTC_OPEN),
    map(({payload}) => ({type: actions.PEERJS_CONNECT, payload}))
  );

export default combineEpics(peerjsInitEpic, peerjsSendEpic, peerjsReadyEpic, peerjsErrorEpic, peerjsOpenEpic);
