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

import { ofType, StateObservable, ActionsObservable } from 'redux-observable';
import types from '../types';
import { withLatestFrom, switchMap, startWith } from 'rxjs/operators';
import { State } from '../types/state';
import { AnyAction } from 'redux';
import { EMPTY, of } from 'rxjs';
import _ from 'lodash';
import { configure } from '../utils/api';
import { networks } from '../../config';
import { EpicDependencies } from '../store';
import { BgMsgTypes, MessageOrigin, PopupMsgTypes } from '../../types';

const apiEpic = (
  action$: ActionsObservable<AnyAction>,
  state$: StateObservable<State>,
  { runtimeStream }: EpicDependencies
) =>
  action$.pipe(
    ofType(types.INIT, types.CHANGE_ENVIRONMENT),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { environment } = state;
      const netwok = _.find(networks, { environment });
      configure(netwok.nodeUrl);
      runtimeStream.send({
        type: BgMsgTypes.ENVIRONMENT,
        environment
      }, MessageOrigin.PAGE);
      return EMPTY;
    })
  );

export default apiEpic;
