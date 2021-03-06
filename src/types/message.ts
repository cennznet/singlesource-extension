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

import {Account} from './account';

export interface RuntimeMessage<T extends MsgTypes, U> {
  origin: string;
  dst: string | string[];
  type: T;
  payload: U;
  requestUUID?: string;
}

export type PayloadOf<T> = T extends RuntimeMessage<any, infer R> ? R : never;

export enum MessageOrigin {
  BG = 'ss:bg',
  PAGE = 'ss:page',
  CONTENT = 'ss:content',
  SIGN_POPUP = 'ss:sign',
  ENABLE_POPUP = 'ss:enable',
  TOOLBAR = 'ss:toolbar'
}

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
  result: string;
  isError: true;
}

export type RequestResponse<T> = SuccessResponse<T> | FailedResponse;

export type MsgTypes = InPageMsgTypes | BgMsgTypes | PopupMsgTypes;

export enum InPageMsgTypes {
  INIT = 'init',
  SIGN = 'sign',
  ENABLE = 'enable'
}

export enum BgMsgTypes {
  ACCOUNTS = 'accounts',
  ENVIRONMENT = 'environment',
  PEERJS_READY = 'bg:peerjs-ready',
  PEERJS_ERROR = 'bg:peerjs-error',
  RTC_OPEN = 'bg:rtc-open',
  RTC_DATA = 'bg:rtc-data',
  RTC_ERROR = 'bg:rtc-error',
  RTC_CLOSED = 'bg:rtc-closed',
  ENABLE_RESPONSE = 'bg:enable-response',
}

export type InitCommand = RuntimeMessage<InPageMsgTypes.INIT, never>;

export interface EnablePayload {
  domain: string
}

export type EnableCommand = RuntimeMessage<InPageMsgTypes.ENABLE, EnablePayload>  & RequestMessage;

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

export type AccountsUpdate = RuntimeMessage<BgMsgTypes.ACCOUNTS, Account[]>;
export type NetworkUpdate = RuntimeMessage<BgMsgTypes.ENVIRONMENT, string>;
export type IsEnableUpdate = RuntimeMessage<BgMsgTypes.ENABLE_RESPONSE, boolean>;

export type PeerjsReady = RuntimeMessage<BgMsgTypes.PEERJS_READY, PeerjsReadyPayload>;
export type PeerjsError = RuntimeMessage<BgMsgTypes.PEERJS_ERROR, Error>;
export type PeerjsOpen = RuntimeMessage<BgMsgTypes.RTC_OPEN, {}>;
export type PeerjsData = RuntimeMessage<BgMsgTypes.RTC_DATA, {accounts: Account[]} | {}>;

// =================================  Popup Messages ==========================================
export enum PopupMsgTypes {
  SIGNED = 'popup:signed',
  SIGNED_FAILED = 'popup:signed_failed',
  PEERJS_INIT = 'popup:peerjs-init',
  PEERJS_SEND = 'popup:peerjs-send',
  ENABLED_DOMAIN_ADD = 'popup:enabled-domain-add',
  ENABLED_PORT_ADD = 'popup:enabled-port-add',// TODO:
  BG_INIT = 'popup:bg-init',
  ACCOUNTS_UPDATE = 'popup:accounts-update'
}

export type ExtrinsicSignSuccess = RuntimeMessage<PopupMsgTypes.SIGNED, SuccessResponse<string>> & RequestMessage;

export type ExtrinsicSignFailed = RuntimeMessage<PopupMsgTypes.SIGNED_FAILED, FailedResponse> & RequestMessage;

export type ExtrinsicSignResponse = ExtrinsicSignSuccess | ExtrinsicSignFailed;

export type PeerjsInit = RuntimeMessage<PopupMsgTypes.PEERJS_INIT, {}>;

export type PeerjsSend = RuntimeMessage<PopupMsgTypes.PEERJS_SEND, any>;

export interface PeerjsReadyPayload {
  peerId: string;
  secretKey: string;
  sessionId: string;
}

// aggregate types
export type BgToPageMessage = AccountsUpdate | NetworkUpdate | IsEnableUpdate;

export type SignToPageMessage = ExtrinsicSignResponse;

export type ToPageMessages = BgToPageMessage | SignToPageMessage;

export type ToBgMessage = InitCommand | SignCommand;

export type ToContentMessage = InitCommand;

export enum EpicMessageOrigin {
  PAGE = 'from:page',
  CONTENT = 'from:content',
  POPUP = 'from:popup',
  BG = 'from:background'
}

export type BgEpicMessage = {
  type: EpicMessageOrigin
  payload: ToBgMessage
}
