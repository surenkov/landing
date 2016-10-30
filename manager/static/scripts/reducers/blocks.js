// @flow
import { combineReducers } from 'redux'

import {
    BLOCKS_FETCHED,
    BLOCK_CREATED,
    BLOCK_UPDATED,
    BLOCK_REMOVED,
    BLOCK_TYPES_FETCHED
} from '../actions/blocks'
import type { Action } from '../flow/redux'
import type { BlockState, TypeState } from '../flow/types'



const objects = (state: BlockState = {}, action: Action) => {
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
            const {[action.id]: _, ...rest} = state;
            return rest;

        default:
            return state;
    }
};

const types = (state: TypeState = {}, action: Action) => {
    switch (action.type) {
        case BLOCK_TYPES_FETCHED:
            return { ...state, ...action.data };

        default:
            return state;
    }
};

export default combineReducers({
    objects,
    types
});
