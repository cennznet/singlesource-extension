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

import { Account } from './account';

export type MsgTypes = InPageMsgTypes | BgMsgTypes | PopupMsgTypes;

export enum InPageMsgTypes {
  INIT = 'init',
  SIGN = 'sign'
}

export enum BgMsgTypes {
  ACCOUNTS = 'accounts',
  ENVIRONMENT = 'environment'
}

export enum PopupMsgTypes {
  INIT = 'init',
  SIGNED = 'signed',
  SIGNED_FAILED = 'signed_failed'
}

export enum MessageOrigin {
  BG = 'ss:bg',
  PAGE = 'ss:page',
  CONTENT = 'ss:content',
  SIGN_POPUP = 'ss:sign',
  TOOLBAR = 'ss:toolbar'
}

// export interface RuntimeMessagePayload<T extends InPageMsgTypes | BgMsgTypes | PopupMsgTypes> {
//   type: T;
// }

export type PayloadOf<T> = T extends RuntimeMessage<any, infer R> ? R : never;

export interface RuntimeMessage<T extends InPageMsgTypes | BgMsgTypes | PopupMsgTypes, U> {
  origin: string;
  dst: string | string[];
  type: T;
  payload: U;
  requestUUID?: string;
}

// export interface RuntimeMessageWith<T> {
//   origin: string;
//   dst: string | string[];
//   payload: T;
// }

export type ToBgMessage = InitCommand | SignCommand;

export interface RequestMessage {
  requestUUID: string;
}

export interface SuccessResponse<T> {
  // requestUUID: string;
  result: T;
  isError: false;
}

export interface FailedResponse {
  // requestUUID: string;
  result: Error;
  isError: true;
}

export type RequestResponse<T> = SuccessResponse<T> | FailedResponse;

export type InitCommand = RuntimeMessage<InPageMsgTypes.INIT, never>;

export interface SignPayload {
  extrinsic: string;
  method: string;
  meta: string;
  address: string;
  blockHash: string;
  era?: string;
  nonce: string;
  version?: string;
}

export type SignCommand = RuntimeMessage<InPageMsgTypes.SIGN, SignPayload> & RequestMessage;

export type BgToPageMessage = AccountsUpdate | NetworkUpdate;
export type SignToPageMessage = ExtrinsicSignResponse;

export type ToPageMessages = BgToPageMessage | SignToPageMessage;

export type AccountsUpdate = RuntimeMessage<BgMsgTypes.ACCOUNTS, Account[]>;

export type NetworkUpdate = RuntimeMessage<BgMsgTypes.ENVIRONMENT, string>;

// export interface EnvironmentUpdate {
//   type: BgMsgTypes.ENVIRONMENT;
//   environment: string;
// }

export type ExtrinsicSignSuccess = RuntimeMessage<PopupMsgTypes.SIGNED, SuccessResponse<string>> & RequestMessage;

// export interface ExtrinsicSignSuccess extends SuccessResponse<string> {
//   type: PopupMsgTypes.SIGNED;
// }

export type ExtrinsicSignFailed = RuntimeMessage<PopupMsgTypes.SIGNED_FAILED, FailedResponse> & RequestMessage;

// export interface ExtrinsicSignFailed extends FailedResponse {
//   type: PopupMsgTypes.SIGNED_FAILED;
// }

export type ExtrinsicSignResponse = ExtrinsicSignSuccess | ExtrinsicSignFailed;
