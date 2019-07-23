import { combineEpics} from 'redux-observable';

import pageEpics from './page';
import signEpic from './sign';

export default combineEpics(
  signEpic,
  pageEpics
);
