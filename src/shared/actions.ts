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

const prefix = 'APP/';

const action = (type: string) => `${prefix}${type}`;

const asyncAction = (type: string) => ({
  REQUEST: `${prefix}${type}/REQUEST`,
  SUCCESS: `${prefix}${type}/SUCCESS`,
  FAIL: `${prefix}${type}/FAIL`,
  CANCEL: `${prefix}${type}/CANCEL`,
});

export default {
  INIT: action('INIT'),
  NAVIGATE: action('NAVIGATE'),
  SIGN: asyncAction('SIGN'),
  GET_ACCOUNTS: asyncAction('GET_ACCOUNTS'),

  SELECT_ACCOUNT: action('SELECT_ACCOUNT'),

  CHANGE_ENVIRONMENT: action('CHANGE_ENVIRONMENT'),

  FETCH_BALANCE: asyncAction('FETCH_BALANCE'),
  FETCH_TRANSACTIONS: asyncAction('FETCH_TRANSACTIONS'),

  CONNECT: action('CONNECT'),
  DISCONNECT: action('DISCONNECT'),

  PEERJS_INIT: asyncAction('PEERJS_INIT'),
  PEERJS_CONNECT: action('PEERJS_CONNECT'),
  PEERJS_SEND: action('PEERJS_SEND'),

  STREAM_MSG: action('STREAM_MSG'),

  PORT_CONNECT: action('PORT_CONNECT'),
  PORT_DISCONNECT: action('PORT_DISCONNECT'),
};
