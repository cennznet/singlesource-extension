import { EMPTY, Observable } from 'rxjs';
import { Action } from 'redux-actions';
import { InPageMsgTypes, SignCommand } from '../../../types';
import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import openPanel from '../../openPanel';
import { BackgroundState } from '../reducers';

const signEpic  = (action$: ActionsObservable<Action<any>>, state$: StateObservable<BackgroundState>, {router}): Observable<Action<any>> =>
  action$.pipe(
    ofType<SignCommand>(InPageMsgTypes.SIGN),
    switchMap((message: SignCommand) => {

      openPanel({ noheader: true, sign: message });
      return EMPTY;
    })
  );

export default signEpic;
