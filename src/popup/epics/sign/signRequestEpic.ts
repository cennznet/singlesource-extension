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
import {EMPTY, Observable} from 'rxjs';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {BackgroundState} from '../../../background/redux/reducers';
import actions from '../../../shared/actions';
import {BgMsgTypes, EpicMessageOrigin, PeerjsData, SignCommand} from '../../../types';
import {EpicDependencies} from '../../store';
import {State} from '../../types/state';
import getParameter from '../../utils/getParameter';

const signOnLoadEpic = (action$: ActionsObservable<AnyAction>, state$: StateObservable<State>): Observable<any> =>
  action$.pipe(
    ofType(actions.GET_ACCOUNTS.SUCCESS),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const {accounts} = state;
      if (accounts.length === 0) return EMPTY;

      const request: SignCommand = JSON.parse(getParameter('sign'));
      if (request) {
        return [{type: actions.SIGN.REQUEST, payload: request}, {type: actions.NAVIGATE, payload: 'sign'}];
      }

      return EMPTY;
    })
  );

const signRequestEpic = (action$: ActionsObservable<AnyAction>, state$: StateObservable<State>): Observable<any> =>
  action$.pipe(
    ofType<Action<SignCommand>>(actions.SIGN.REQUEST),
    map(({payload: signCommand}) => ({type: actions.PEERJS_SEND, payload: signCommand.payload}))
  );

const peerjsSignResponseEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {runtimeStream}: EpicDependencies
): Observable<Action<any>> =>
  action$.pipe(
    ofType(actions.STREAM_MSG),
    map(msg => msg.payload),
    ofType(EpicMessageOrigin.BG),
    map(msg => msg.payload),
    ofType<PeerjsData>(BgMsgTypes.RTC_DATA),
    map(data => data.payload),
    ofType('signResponse'),
    map(rsp => ({type: actions.SIGN.SUCCESS, payload: (rsp as any).hexSignature}))
  );

export default combineEpics(signOnLoadEpic, signRequestEpic, peerjsSignResponseEpic);
