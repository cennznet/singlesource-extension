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

import {combineEpics} from 'redux-observable';
import accounts from './accounts';
import apiEpic from './apiEpic';
import balance from './balance';
import chainEpic from './chainEpic';
import getTransactions from './getTransactionsEpic';
import initEpic from './initEpic';
import mockEpics from './mock';
import navigateEpic from './navigateEpic';
import peerjsEpic from './peerjsEpic';
import signEpics from './sign';

const epics: any[] = [
  chainEpic,
  navigateEpic,
  initEpic,
  ...accounts,
  ...signEpics,
  ...balance,
  apiEpic,
  ...mockEpics,
  getTransactions,
  peerjsEpic,
];

const rootEpic = (...args: any[]) => combineEpics(...epics)(...args);

export default rootEpic;
