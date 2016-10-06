/**
 * Created by surenkov on 10/3/16.
 */
import { replace } from 'react-router-redux'
import { USER_LOG_IN, USER_LOG_OUT } from '../actions/auth'

export const authMiddleware = ({ dispatch, getState }) => next => action => {
    if (action.type === USER_LOG_IN)
        setTimeout(() => dispatch(replace('/')));

    if (action.type === USER_LOG_OUT)
        setTimeout(() => dispatch(replace('/auth')));

    return next(action);
};


export const isUserLoggedIn = ({ auth: { token }}) => {
    return token;
};

const tokenExpired = ({ auth: { expires }}) =>
    expires - Date.now() <= 0;

export const handleUserRedirect = (store) => {
    const state = store.getState();
    if (!isUserLoggedIn(state) || tokenExpired(state)) {
        store.dispatch(replace('/auth'));
    }
};
