import { Account } from './account';

export enum IncomingMsgTypes {
  INIT = 'init',
  SIGN = 'sign'
}

export enum OutgoingMsgTypes {
  ACCOUNTS = 'accounts',
  ENVIRONMENT = 'environment',
  SIGNED = 'signed',
  SIGNED_FAILED = 'signed_failed'
}

export interface Message {
  type: IncomingMsgTypes | OutgoingMsgTypes;
  origin: 'page' | 'content' | 'bg';
}

export interface IncomingMessage extends Message {
  origin: 'page';
}

export type IncomingMessages = InitCommand | SignCommand;

export interface IncomingRequest extends IncomingMessage {
  requestUUID: string;
}

export interface InitCommand extends IncomingMessage {
  type: IncomingMsgTypes.INIT;
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

export interface SignCommand extends IncomingRequest {
  type: IncomingMsgTypes.SIGN;
  payload: SignPayload;
}

export type OutgoingMessages = AccountsUpdate | EnvironmentUpdate | ExtrinsicSignResponse;

export interface OutgoingResponse extends OutgoingMessage {
  requestUUID: string;
}

export interface OutgoingMessage extends Message {
  origin: 'bg';
}

export interface AccountsUpdate extends OutgoingMessage {
  type: OutgoingMsgTypes.ACCOUNTS;
  accounts: Account[];
}

export interface EnvironmentUpdate extends OutgoingMessage {
  type: OutgoingMsgTypes.ENVIRONMENT;
  environment: string;
}

export interface ExtrinsicSignSuccess extends OutgoingResponse {
  type: OutgoingMsgTypes.SIGNED;
  hexSignature: string;
}

export interface ExtrinsicSignFailed extends OutgoingResponse {
  type: OutgoingMsgTypes.SIGNED_FAILED;
  error: Error;
}

export type ExtrinsicSignResponse = ExtrinsicSignSuccess | ExtrinsicSignFailed;
