import produce from 'immer';
import {handleActions} from 'redux-actions';
import actions from '../../shared/actions';

export type PeerjsState = {
  peerId?: string;
  secretKey?: string;
  sessionId?: string;
  opened: boolean;
};

const initState: PeerjsState = {
  opened: false,
};

export default handleActions(
  {
    [actions.PEERJS_INIT.REQUEST]: produce((state: PeerjsState) => {
      state.opened = false;
    }),
    [actions.PEERJS_INIT.SUCCESS]: produce((state: PeerjsState, {payload: {peerId, secretKey, sessionId}}) => {
      state.peerId = peerId;
      state.secretKey = secretKey;
      state.sessionId = sessionId;
    }),
    [actions.PEERJS_CONNECT]: produce((state: PeerjsState) => {
      state.opened = true;
    }),
  },
  initState
);
