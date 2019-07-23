import { combineReducers } from 'redux';
import { Account } from '../../../types';

import sharedReducers from '../../../shared/reducers';

export type BackgroundState = {
  accounts: Account[];
  network: string;
};

const reducers = combineReducers({
  ...sharedReducers
});

export default reducers;
