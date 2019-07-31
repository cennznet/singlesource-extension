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
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { EMPTY, Observable, of } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';

import { EpicDependencies } from '..';
import {BgMsgTypes, EnableCommand, InPageMsgTypes } from '../../../types';
import openEnablePanel from '../../panel/openEnablePanel';
import { BackgroundState } from '../reducers';

const enableEpic  = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {router}: EpicDependencies
): Observable<Action<any>> =>
  action$.pipe(
    ofType<EnableCommand>(InPageMsgTypes.ENABLE),
    withLatestFrom(state$),
    switchMap( ([enableCommand, state])=>{
      const {origin, payload} = enableCommand;
      const {domain} = payload;

      if (!state.enabledDomains.includes(domain)) {
        // open panel and ask for the accessPermission of this url
        openEnablePanel({ noheader: true, enable: enableCommand });
      } else {
        router.send(BgMsgTypes.ENABLE_RESPONSE, true, origin);
      }

      return EMPTY;
    })
  );

export default enableEpic;
