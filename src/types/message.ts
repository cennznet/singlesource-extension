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

export interface RuntimeMessagePayload<T extends InPageMsgTypes | BgMsgTypes | PopupMsgTypes> {
  type: T;
}

export interface RuntimeMessageOf<T extends InPageMsgTypes | BgMsgTypes | PopupMsgTypes> {
  origin: string;
  dst: string | string[];
  payload: RuntimeMessagePayload<T>;
}

export interface RuntimeMessageWith<T> {
  origin: string;
  dst: string | string[];
  payload: T;
}

export type PageToBgMessage = InitCommand | SignCommand;

export interface RequestMessage {
  requestUUID: string;
}

export interface SuccessResponse<T> {
  requestUUID: string;
  result: T;
  isError: false;
}

export interface FailedResponse {
  requestUUID: string;
  result: Error;
  isError: true;
}

export type RequestResponse<T> = SuccessResponse<T> | FailedResponse;

export interface InitCommand {
  type: InPageMsgTypes.INIT;
}

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

export interface SignCommand extends RequestMessage {
  type: InPageMsgTypes.SIGN;
  payload: SignPayload;
}

export type BgToPageMessage = AccountsUpdate | EnvironmentUpdate;
export type SignToPageMessage = ExtrinsicSignResponse;

export type ToPageMessages = BgToPageMessage | SignToPageMessage;

export interface AccountsUpdate {
  type: BgMsgTypes.ACCOUNTS;
  accounts: Account[];
}

export interface EnvironmentUpdate {
  type: BgMsgTypes.ENVIRONMENT;
  environment: string;
}

export interface ExtrinsicSignSuccess extends SuccessResponse<string> {
  type: PopupMsgTypes.SIGNED;
}

export interface ExtrinsicSignFailed extends FailedResponse {
  type: PopupMsgTypes.SIGNED_FAILED;
}

export type ExtrinsicSignResponse = ExtrinsicSignSuccess | ExtrinsicSignFailed;
