import { combineEpics} from 'redux-observable';

import signEpic from './sign';
import pageEpics from './page';

export default combineEpics(
  signEpic,
  pageEpics
);
