import { PortStreams } from '../streams';
import { fromEvent } from 'rxjs';
import { ToBgMessage } from '../../types';
import { createEpicMiddleware, Epic } from 'redux-observable';
import { applyMiddleware, createStore } from 'redux';
import rootEpic from './epics';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducers from './reducers';
import { composeWithDevTools } from 'remote-redux-devtools';

export default (streamRouter: PortStreams) => {
  // message stream and epic
  const messages$ = fromEvent<ToBgMessage>(streamRouter, 'data');

  const epicMiddleware = createEpicMiddleware({ dependencies: { router: streamRouter } });

  // store
  const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['accounts', 'network']
  };

  const persistedReducer = persistReducer(persistConfig, reducers);

  const composeEnhancers = composeWithDevTools({
    realtime: process.env.mode === 'development'
  });


  const store = createStore(persistedReducer, composeEnhancers(
    applyMiddleware(epicMiddleware)
  ) as any);
  messages$.subscribe(store.dispatch);

  epicMiddleware.run(rootEpic as Epic);

  persistStore(store);
}
