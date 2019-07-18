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
