import { ActionsObservable, ofType, StateObservable } from 'redux-observable';
import { Action } from 'redux-actions';
import { EMPTY, Observable } from 'rxjs';
import { BgMsgTypes, InitCommand, InPageMsgTypes } from '../../../types';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { BackgroundState } from '../reducers';

const initEpic  = (action$: ActionsObservable<Action<any>>, state$: StateObservable<BackgroundState>, {router}): Observable<Action<any>> =>
  action$.pipe(
    ofType<InitCommand>(InPageMsgTypes.INIT),
    withLatestFrom(state$),
    switchMap( ([{origin}, state])=>{
      router.send(BgMsgTypes.ENVIRONMENT, state.network, origin);
      router.send(BgMsgTypes.ACCOUNTS, state.accounts, origin);
      return EMPTY;
    })
  );

export default initEpic;
