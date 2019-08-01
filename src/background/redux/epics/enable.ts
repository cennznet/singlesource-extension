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
import {MessageOrigin} from '../../../types/message';
import openPanel from '../../panel/openPanel';
import {getPageInfoFromRouter} from '../../utils/getDomainFromRouter';
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
      const {origin} = enableCommand;

      const domain = getPageInfoFromRouter(router, origin)

      if (!state.enabledDomains.includes(domain)) {
        const enable = enableCommand;
        enable.payload.domain = domain;

        // open panel and ask for the accessPermission of this url
        openPanel({
          noheader: true, 
          pageName: 'enable',
          enable: JSON.stringify(enable)
        });
      } else {
        router.write({
          origin:MessageOrigin.BG, 
          dst: origin,
          type: BgMsgTypes.ENABLE_RESPONSE,
          requestUUID: enableCommand.requestUUID,
          payload: {
            result: true,
            isError: false,
          }
        })
      }

      return EMPTY;
    })
  );

export default enableEpic;
