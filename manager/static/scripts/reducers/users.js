// @flow
import {
    USERS_FETCHED,
    USER_FETCHED,
    USER_CREATED,
    USER_UPDATED,
    USER_REMOVED
} from '../actions/users'

import type { Action } from '../flow/redux'
import type { UserState } from '../flow/types'

export default (state: UserState = {}, action: Action) => {
    switch (action.type) {
        case USERS_FETCHED:
            return { ...state, ...action.users };

        case USER_FETCHED:
        case USER_CREATED:
            return { ...state, [action.user.id]: action.user };

        case USER_UPDATED:
            return { ...state, [action.id]: action.user };

        case USER_REMOVED:
            const {[action.id]: _, ...rest} = state;
            return rest;

        default:
            return state;
    }
}
