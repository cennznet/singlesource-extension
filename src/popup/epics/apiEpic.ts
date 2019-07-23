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
import { EMPTY} from 'rxjs';
import { switchMap, withLatestFrom} from 'rxjs/operators';
import { networks } from '../../config';
import types from '../../shared/actions';
import { BgMsgTypes, MessageOrigin} from '../../types';
import { EpicDependencies } from '../store';
import { State } from '../types/state';
import { configure } from '../utils/api';

// const apiEpic = (
//   action$: ActionsObservable<AnyAction>,
//   state$: StateObservable<State>,
//   { runtimeStream }: EpicDependencies
// ) =>
//   action$.pipe(
//     ofType(types.INIT, types.CHANGE_ENVIRONMENT),
//     withLatestFrom(state$),
//     switchMap(([, state]) => {
//       const { environment } = state;
//       const network = _.find(networks, { name: environment });
//       configure(network.nodeUrl);
//       runtimeStream.send(BgMsgTypes.ENVIRONMENT, environment, MessageOrigin.PAGE);
//       return EMPTY;
//     })
//   );

const apiEpic = (
  action$: ActionsObservable<AnyAction>,
  state$: StateObservable<State>,
  { runtimeStream }: EpicDependencies
) =>
  action$.pipe(
    ofType(types.CHANGE_ENVIRONMENT),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { network } = state;
      const networkMeta = _.find(networks, { name: network });
      configure(networkMeta.nodeUrl);
      runtimeStream.send(BgMsgTypes.ENVIRONMENT, network, [MessageOrigin.PAGE, MessageOrigin.BG]);
      return EMPTY;
    })
  );

export default apiEpic;
