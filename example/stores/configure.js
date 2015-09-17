import rootReducer  from '../reducers';
import { devTools } from 'redux-devtools';
import { compose, createStore } from 'redux';

const createStoreWithMiddleware = compose(devTools())(createStore);

export default function configureStore (initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
