export interface SignSuccessPayload {
  requestUUID: string;
  hexSignature: string;
}

export interface SignFailPayload {
  requestUUID: string;
  error: Error;
}
