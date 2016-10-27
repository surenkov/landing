// @flow
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { USER_LOG_OUT } from '../actions/auth'

import notifications from './notifications'
import auth from './auth'
import blocks from './blocks'
import media from './media'
import users from './users'
import config from './config'

const appReducer = combineReducers({
    routing: routerReducer,
    auth,
    notifications,

    blocks,
    users,
    media,
    config
});

export default (state, action) => appReducer(
    action.type == USER_LOG_OUT
        ? { routing: state.routing }
        : state,
    action
);
