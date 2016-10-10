/**
 * Created by surenkov on 10/4/16.
 */
import { list, create, update, remove, guardResponse } from '../utility/api'
import { addNotification } from './notifications'

export const BLOCKS_FETCHED = 'BLOCKS_FETCHED';
export const BLOCK_CREATED = 'BLOCK_CREATED';
export const BLOCK_UPDATED = 'BLOCK_UPDATED';
export const BLOCK_REMOVED = 'BLOCK_REMOVED';

export const BLOCK_TYPES_FETCHED = 'BLOCK_TYPES_FETCHED';


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

const blockTypesFetched = (data) => ({
    type: BLOCK_TYPES_FETCHED,
    data
});


export const fetchBlocks = () => (
    (dispatch) => guardResponse(
        list('/manager/api/blocks')
            .then((data) => dispatch(blocksFetched(data)))
    )
);

export const createBlock = (data) => (
    (dispatch) => guardResponse(
        create('/manager/api/blocks', data)
            .then((data) => dispatch(blockCreated(data)))
            .then(() => dispatch(addNotification({type: 'success', title: 'Блок создан'})))
    )
);

export const updateBlock = (data) => (
    (dispatch) => guardResponse(
        update(`/manager/api/blocks/${encodeURIComponent(data.id)}`, data)
            .then((data) => dispatch(blockUpdated(data, data.id)))
            .then(() => dispatch(addNotification({type: 'success', title: 'Блок сохранён'})))
    )
);

export const removeBlock = (id) => (
    (dispatch) => guardResponse(
        remove(`/manager/api/blocks/${encodeURIComponent(id)}`)
            .then(() => dispatch(blockRemoved(id)))
            .then(() => dispatch(addNotification({type: 'success', title: 'Блок удалён'})))
    )
);

export const fetchBlockTypes = () => (
    (dispatch) => guardResponse(
        list('/manager/api/blocks/types', 'type')
            .then((data) => dispatch(blockTypesFetched(data)))
    )
);
