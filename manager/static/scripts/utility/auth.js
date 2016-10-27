// @flow
import { replace } from 'react-router-redux'
import { USER_LOG_IN, USER_LOG_OUT } from '../actions/auth'
import type { Store, Dispatch, Action } from '../flow/redux'

export const authMiddleware = ({ dispatch, getState }: Store) => (next: Dispatch) => (action: Action) => {
    if (action.type === USER_LOG_IN)
        setTimeout(() => dispatch(replace('/')));

    if (action.type === USER_LOG_OUT)
        setTimeout(() => dispatch(replace('/auth')));

    return next(action);
};


type Credentials = {
    auth: {
        token: string
    }
};

export const isUserLoggedIn = ({ auth: { token }}: Credentials) => {
    return token;
};

const tokenExpired = ({ auth: { expires }}) =>
    expires - Date.now() <= 0;

export const handleUserRedirect = (store: Store) => {
    const state = store.getState();
    if (!isUserLoggedIn(state) || tokenExpired(state)) {
        store.dispatch(replace('/auth'));
    }
};
