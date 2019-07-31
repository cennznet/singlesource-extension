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
import {ActionsObservable, ofType, StateObservable} from 'redux-observable';
import {EMPTY, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {EpicDependencies} from '..';
import {InPageMsgTypes, SignCommand} from '../../../types';
import openSignPanel from '../../panel/openSignPanel';
import {BackgroundState} from '../reducers';

const signEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {router}
): Observable<Action<any>> =>
  action$.pipe(
    ofType<SignCommand>(InPageMsgTypes.SIGN),
    switchMap((message: SignCommand) => {
      openSignPanel({noheader: true, sign: message});
      return EMPTY;
    })
  );

export default signEpic;
