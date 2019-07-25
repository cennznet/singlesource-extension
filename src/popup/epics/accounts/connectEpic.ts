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
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {BackgroundState} from '../../../background/redux/reducers';
import actions from '../../../shared/actions';
import {BgMsgTypes, PeerjsData} from '../../../types';
import {EpicDependencies} from '../../store';

const connectEpic = (action$: ActionsObservable<AnyAction>) => {
  return action$.pipe(
    ofType(actions.CONNECT),
    switchMap(({payload}) => {
      return of({
        type: actions.GET_ACCOUNTS.SUCCESS,
        payload,
      });
    })
  );
};

const peerjsConnectResponseEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {runtimeStream}: EpicDependencies
): Observable<Action<any>> =>
  action$.pipe(
    ofType(actions.STREAM_MSG),
    map(msg => msg.payload),
    ofType<PeerjsData>(BgMsgTypes.RTC_DATA),
    map(data => data.payload),
    ofType('connectResponse'),
    map(connectResponse => ({type: actions.CONNECT, payload: (connectResponse as any).accounts}))
  );

export default combineEpics(connectEpic, peerjsConnectResponseEpic);
