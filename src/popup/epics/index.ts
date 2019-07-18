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

import { combineEpics } from 'redux-observable';
import chainEpic from './chainEpic';
// import messengerEpic from './messengerEpic';
import navigateEpic from './navigateEpic';
import initEpic from './initEpic';
import signEpics from './sign';
import accounts from './accounts';
import balance from './balance';
import apiEpic from './apiEpic';
import mockEpics from './mock';
import getTransactions from './getTransactionsEpic';

const epics: any[] = [
  chainEpic,
  // messengerEpic,
  navigateEpic,
  initEpic,
  ...accounts,
  ...signEpics,
  ...balance,
  apiEpic,
  ...mockEpics,
  getTransactions
];

const rootEpic = (...args: any[]) => combineEpics(...epics)(...args);

export default rootEpic;
