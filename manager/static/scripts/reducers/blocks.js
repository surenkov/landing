/**
 * Created by surenkov on 10/4/16.
 */
import {
    BLOCKS_FETCHED,
    BLOCK_CREATED,
    BLOCK_UPDATED,
    BLOCK_REMOVED
} from '../actions/blocks'

export default (state = {}, action) => {
    switch (action.type) {
        case BLOCKS_FETCHED:
            return { ...state, ...action.blocks };

        case BLOCK_CREATED:
            return {
                ...state,
                [action.block.id]: action.block
            };

        case BLOCK_UPDATED:
            return {
                ...state,
                [action.id]: action.block
            };

        case BLOCK_REMOVED:
            const newState = { ...state };
            delete newState[action.id];
            return newState;

        default:
            return state;
    }
}
