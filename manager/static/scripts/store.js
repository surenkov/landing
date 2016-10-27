// @flow
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { hashHistory } from 'react-router'

import { routerMiddleware } from 'react-router-redux'
import { authMiddleware } from './utility/auth'
import rootReducer from './reducers/root-reducer'

const persistentPart = () =>
    JSON.parse(localStorage.getItem('state') || '{}');

export const store = createStore(rootReducer, persistentPart(), compose(
    applyMiddleware(thunk),
    applyMiddleware(authMiddleware),
    applyMiddleware(routerMiddleware(hashHistory)),
    process.env.NODE_ENV === 'development'
        ? window.devToolsExtension()
        : (f) => f
));

window.addEventListener('beforeunload', () => {
    const { auth } = store.getState();
    localStorage.setItem('state', JSON.stringify({ auth }));
});

