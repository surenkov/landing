/**
 * Created by surenkov on 9/30/16.
 */
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { USER_LOG_OUT } from '../actions/auth'

import notifications from './notifications'
import auth from './auth'
import blocks from './blocks'
import media from './media'

const appReducer = combineReducers({
    routing: routerReducer,
    auth,
    notifications,

    blocks,
    media
});

export default (state, action) => appReducer(
    action.type == USER_LOG_OUT
        ? undefined
        : state,
    action
);
