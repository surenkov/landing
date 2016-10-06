/**
 * Created by surenkov on 10/6/16.
 */
import {
    MEDIA_FETCHED,
    MEDIA_UPLOADED,
    MEDIA_DELETED
} from '../actions/media'

export default (state = {}, action) => {
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
            const newState = { ...state };
            delete newState[action.id];
            return newState;

        default:
            return state;
    }
}
