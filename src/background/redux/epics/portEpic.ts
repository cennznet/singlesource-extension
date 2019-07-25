import {Action} from 'redux-actions';
import {ActionsObservable, combineEpics, ofType, StateObservable} from 'redux-observable';
import {EMPTY, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {Runtime} from 'webextension-polyfill-ts';
import actions from '../../../shared/actions';
import {EpicDependencies} from '../index';
import {BackgroundState} from '../reducers';

const portConnectEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {router}: EpicDependencies
): Observable<Action<any>> =>
  action$.pipe(
    ofType<Action<Runtime.Port>>(actions.PORT_CONNECT),
    switchMap(({payload}) => {
      router.setup(payload);
      return EMPTY;
    })
  );
const portDisconnectEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {router}: EpicDependencies
): Observable<Action<any>> =>
  action$.pipe(
    ofType<Action<Runtime.Port>>(actions.PORT_DISCONNECT),
    switchMap(({payload}) => {
      router.remove(payload);
      return EMPTY;
    })
  );

export default combineEpics(portConnectEpic, portDisconnectEpic);
