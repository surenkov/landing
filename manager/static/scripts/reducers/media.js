// @flow
import {
    MEDIA_FETCHED,
    MEDIA_UPLOADED,
    MEDIA_DELETED
} from '../actions/media'
import type { Action } from '../flow/redux'
import type { MediaState } from '../flow/types'

export default (state: MediaState = {}, action: Action) => {
    switch (action.type) {
        case MEDIA_FETCHED:
            return {
                ...state,
                ...action.data
            };

        case MEDIA_UPLOADED:
            return {
                ...state,
                [action.data.id]: action.data
            };

        case MEDIA_DELETED:
            const {[action.id]: _, ...rest} = state;
            return rest;

        default:
            return state;
    }
}
