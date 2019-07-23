import { Account } from '../../../types';
import { combineReducers } from 'redux';

import sharedReducers from '../../../shared/reducers';

export type BackgroundState = {
  accounts: Account[];
  network: string;
};

const reducers = combineReducers({
  ...sharedReducers
});

export default reducers;
