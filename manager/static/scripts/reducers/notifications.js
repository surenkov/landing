// @flow
import {
    ADD_NOTIFICATION,
    REMOVE_NOTIFICATION,
    CLEAR_NOTIFICATIONS
} from '../actions/notifications'

import type { Action } from '../flow/redux'
import type { NotificationState } from '../flow/types'

export default (state: NotificationState = [], action: Action) => {
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
