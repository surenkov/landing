// @flow
import {
    USERS_FETCHED,
    USER_FETCHED,
    USER_CREATED,
    USER_UPDATED,
    USER_REMOVED
} from '../actions/users'
import type { State, Action } from '../flow/redux'

export default (state: State = {}, action: Action) => {
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
