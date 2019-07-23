import { Signer } from '@cennznet/api/polkadot.types';
import { Observable } from 'rxjs';
import { Account } from '../types';

export interface InjectedWindow extends Window {
  SingleSource: {
    signer: Signer;
    accounts$: Observable<Account[]>;
    network$: Observable<string>;
  }
}
