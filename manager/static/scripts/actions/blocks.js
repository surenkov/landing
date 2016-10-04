/**
 * Created by surenkov on 10/4/16.
 */
import { list, create, update, remove, guardResponse } from '../utility/api'

export const BLOCKS_FETCHED = 'BLOCKS_FETCHED';
export const BLOCK_CREATED = 'BLOCK_CREATED';
export const BLOCK_UPDATED = 'BLOCK_UPDATED';
export const BLOCK_REMOVED = 'BLOCK_REMOVED';


const blocksFetched = (blocks) => ({
    type: BLOCKS_FETCHED,
    blocks
});

const blockCreated = (block) => ({
    type: BLOCK_CREATED,
    block
});

const blockUpdated = (block, id) => ({
    type: BLOCK_UPDATED,
    id,
    block
});

const blockRemoved = (id) => ({
    type: BLOCK_REMOVED,
    id
});


export const fetchBlocks = () => (
    (dispatch) => guardResponse(
        list('/manager/api/blocks')
            .then((data) => dispatch(blocksFetched(data)))
    )
);

export const createBlock = (data) => (
    (dispatch) => guardResponse(
        create('/manager/api/blocks')
            .then((data) => dispatch(blockCreated(data)))
    )
);

export const updateBlock = (data) => (
    (dispatch) => guardResponse(
        update(`/manager/api/blocks/${encodeURIComponent(data.id)}`)
            .then((data) => dispatch(blockUpdated(data, data.id)))
    )
);

export const removeBlock = (id) => (
    (dispatch) => guardResponse(
        remove(`/manager/api/blocks/${encodeURIComponent(id)}`)
            .then(() => dispatch(blockRemoved(id)))
    )
);
