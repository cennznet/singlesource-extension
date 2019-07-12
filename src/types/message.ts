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

export type IncomingMessages = InitCommand | SignCommand;

export interface IncomingRequest {
  requestUUID: string;
}

export interface InitCommand {
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

export interface SignCommand extends IncomingRequest{
  type: IncomingMsgTypes.SIGN;
  payload: SignPayload;
}

export type OutgoingMessages = AccountsUpdate | EnvironmentUpdate | ExtrinsicSignResponse;

export interface OutgoingResponse {
  requestUUID: string;
}

export interface AccountsUpdate {
  type: OutgoingMsgTypes.ACCOUNTS;
  accounts: Account[];
}

export interface EnvironmentUpdate {
  type: OutgoingMsgTypes.ENVIRONMENT;
  environment: string;
}

export interface ExtrinsicSignSuccess extends OutgoingResponse{
  type: OutgoingMsgTypes.SIGNED;
  hexSignature: string;
}

export interface ExtrinsicSignFailed extends OutgoingResponse{
  type: OutgoingMsgTypes.SIGNED_FAILED;
  error: Error;
}

export type ExtrinsicSignResponse = ExtrinsicSignSuccess | ExtrinsicSignFailed;
