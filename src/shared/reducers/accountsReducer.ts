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

import { AnyAction } from 'redux';
import actions from '../actions';

const initialState: Account[] = [];

const accountsReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case actions.GET_ACCOUNTS.SUCCESS:
      return action.payload;
    case actions.GET_ACCOUNTS.FAIL:
      return initialState;
    case actions.DISCONNECT:
      return initialState;
    default:
      return state;
  }
};

export default accountsReducer;
