import {Action} from 'redux-actions';
import {ActionsObservable, combineEpics, ofType, StateObservable} from 'redux-observable';
import {EMPTY, merge, Observable} from 'rxjs';
import {mergeMap, switchMap, tap} from 'rxjs/operators';
import {Runtime} from 'webextension-polyfill-ts';
import actions from '../../../shared/actions';
import {BgMsgTypes, PeerjsInit, PeerjsSend, PopupMsgTypes} from '../../../types';
import P2PSession from '../../utils/p2pSession';
import {EpicDependencies} from '../index';
import {BackgroundState} from '../reducers';

let session: P2PSession = null;

const messageQueue = [];

const peerjsInitEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {router}: EpicDependencies
): Observable<Action<any>> =>
  action$.pipe(
    ofType<PeerjsInit>(PopupMsgTypes.PEERJS_INIT),
    mergeMap(({origin}) => {
      const peer = new P2PSession();
      if (session) {
        session.destroy();
      }
      session = peer;
      const destroyFn = () => {
        peer.destroy();
        session = null;
        return EMPTY;
      };
      const error$ = peer.error$.pipe(
        tap(error => router.send(BgMsgTypes.RTC_ERROR, error, origin)),
        switchMap(destroyFn)
      );
      const peerjsError$ = peer.peerjsError$.pipe(
        tap(error => router.send(BgMsgTypes.PEERJS_ERROR, error, origin)),
        switchMap(() => EMPTY)
      );
      const disconnect$ = peer.connectionClosed$.pipe(
        tap(() => router.send(BgMsgTypes.RTC_CLOSED, {}, origin)),
        switchMap(destroyFn)
      );
      return merge(
        peer.peerId$.pipe(
          switchMap(peerId => {
            router.send(
              BgMsgTypes.PEERJS_READY,
              {
                peerId,
                secretKey: peer.secretKey,
                sessionId: peer.uuid,
              },
              origin
            );
            return EMPTY;
          })
        ),
        peer.connection$.pipe(
          switchMap(() => {
            router.send(BgMsgTypes.RTC_OPEN, {}, origin);
            while (messageQueue.length > 0) {
              const [data] = messageQueue.splice(0, 1);
              session.send(data).then();
            }
            return EMPTY;
          })
        ),
        error$,
        peerjsError$,
        disconnect$,
        // TODO: move the handler of accounts update to background
        peer.data$.pipe(
          switchMap(data => {
            router.send(BgMsgTypes.RTC_DATA, data, origin);
            return EMPTY;
          })
        )
      );
    })
  );

const peerjsDestroyEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {router}: EpicDependencies
): Observable<Action<any>> =>
  action$.pipe(
    ofType<Action<Runtime.Port>>(actions.PORT_DISCONNECT),
    mergeMap(() => {
      if (session) {
        session.peer.disconnect();
        session = null;
      }
      return EMPTY;
    })
  );

const peerjsSendQueueEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<BackgroundState>,
  {router}: EpicDependencies
): Observable<Action<any>> =>
  action$.pipe(
    ofType<PeerjsSend>(PopupMsgTypes.PEERJS_SEND),
    mergeMap(({payload}) => {
      messageQueue.push(payload);
      return EMPTY;
    })
  );

export default combineEpics(peerjsInitEpic, peerjsDestroyEpic, peerjsSendQueueEpic);
