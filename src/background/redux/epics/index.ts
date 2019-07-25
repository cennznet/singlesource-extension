import {combineEpics} from 'redux-observable';

import pageEpics from './page';
import peerjsEpic from './peerjs';
import portEpic from './portEpic';
import signEpic from './sign';

export default combineEpics(signEpic, pageEpics, peerjsEpic, portEpic);
