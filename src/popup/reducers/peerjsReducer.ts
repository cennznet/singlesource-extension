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

import produce from 'immer';
import {handleActions} from 'redux-actions';
import actions from '../../shared/actions';

export type PeerjsState = {
  peerId?: string;
  secretKey?: string;
  sessionId?: string;
  opened: boolean;
};

const initState: PeerjsState = {
  opened: false,
};

export default handleActions(
  {
    [actions.PEERJS_INIT.REQUEST]: produce((state: PeerjsState) => {
      state.opened = false;
    }),
    [actions.PEERJS_INIT.SUCCESS]: produce((state: PeerjsState, {payload: {peerId, secretKey, sessionId}}) => {
      state.peerId = peerId;
      state.secretKey = secretKey;
      state.sessionId = sessionId;
    }),
    [actions.PEERJS_CONNECT]: produce((state: PeerjsState) => {
      state.opened = true;
    }),
  },
  initState
);
