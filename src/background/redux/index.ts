import {applyMiddleware, createStore} from 'redux';
import {createEpicMiddleware, Epic} from 'redux-observable';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {composeWithDevTools} from 'remote-redux-devtools';
import {fromEvent} from 'rxjs';
import {ToBgMessage} from '../../types';
import {PortStreams} from '../streams';
import rootEpic from './epics';
import reducers from './reducers';

export type EpicDependencies = {
  router: PortStreams;
};

export default (streamRouter: PortStreams) => {
  // message stream and epic
  const messages$ = fromEvent<ToBgMessage>(streamRouter, 'data');

  const epicMiddleware = createEpicMiddleware({dependencies: {router: streamRouter}});

  // store
  const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['accounts', 'network'],
  };

  const persistedReducer = persistReducer(persistConfig, reducers);

  const composeEnhancers = composeWithDevTools({
    realtime: process.env.mode === 'development',
  });

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(epicMiddleware)) as any);
  messages$.subscribe(store.dispatch);

  epicMiddleware.run(rootEpic as Epic);

  persistStore(store);

  return store;
};
