/**
 * Created by surenkov on 10/10/16.
 */
import {
    USERS_FETCHED,
    USER_FETCHED,
    USER_CREATED,
    USER_UPDATED,
    USER_REMOVED
} from '../actions/users'

export default (state = {}, action) => {
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
