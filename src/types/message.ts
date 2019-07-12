import { Account } from './account';

export enum IncomingMsgTypes {
  INIT = 'init',
  SIGN = 'sign'
}

export enum OutgoingMsgTypes {
  ACCOUNTS = 'accounts',
  ENVIRONMENT = 'environment'
}

export type IncomingMessages = InitCommand | SignCommand;

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

export interface SignCommand {
  type: IncomingMsgTypes.SIGN;
  payload: SignPayload;
  requestUUID: string;
}

export type OutgoingMessages = AccountsUpdate | EnvironmentUpdate;

export interface AccountsUpdate {
  type: OutgoingMsgTypes.ACCOUNTS;
  accounts: Account[];
}

export interface EnvironmentUpdate {
  type: OutgoingMsgTypes.ENVIRONMENT;
  environment: string;
}
