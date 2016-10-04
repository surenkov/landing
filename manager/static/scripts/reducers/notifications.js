/**
 * Created by surenkov on 10/3/16.
 */
import {
    ADD_NOTIFICATION,
    REMOVE_NOTIFICATION,
    CLEAR_NOTIFICATIONS
} from '../actions/notifications'

export default (state = [], action) => {
    switch (action.type) {
        case ADD_NOTIFICATION:
            return [
                {id: action.id, notify: action.notify},
                ...state
            ];

        case REMOVE_NOTIFICATION:
            const idx = state.findIndex((n) => n.id == action.id);
            return idx != -1
                ? [...state.slice(0, idx), ...state.slice(idx + 1)]
                : state;

        case CLEAR_NOTIFICATIONS:
            return [];

        default:
            return state;
    }
};
