// @flow
import { list, create, update, remove, guardResponse } from '../utility/api'
import { addNotification } from './notifications'

import type { Dispatch, Action } from '../flow/redux'
import type { Block, Id } from '../flow/types'

export const BLOCKS_FETCHED = 'BLOCKS_FETCHED';
export const BLOCK_CREATED = 'BLOCK_CREATED';
export const BLOCK_UPDATED = 'BLOCK_UPDATED';
export const BLOCK_REMOVED = 'BLOCK_REMOVED';

export const BLOCK_TYPES_FETCHED = 'BLOCK_TYPES_FETCHED';


const blocksFetched = (blocks): Action => ({
    type: BLOCKS_FETCHED,
    blocks
});

const blockCreated = (block: Block): Action => ({
    type: BLOCK_CREATED,
    block
});

const blockUpdated = (block: Block, id: Id): Action => ({
    type: BLOCK_UPDATED,
    id,
    block
});

const blockRemoved = (id: Id): Action => ({
    type: BLOCK_REMOVED,
    id
});

const blockTypesFetched = (data: Id): Action => ({
    type: BLOCK_TYPES_FETCHED,
    data
});


export const fetchBlocks = (): Action => (
    (dispatch: Dispatch) => guardResponse(
        list('/manager/api/blocks')
            .then((data) => dispatch(blocksFetched(data)))
    )
);

export const createBlock = (data: Block): Action => (
    (dispatch: Dispatch) => guardResponse(
        create('/manager/api/blocks', data)
            .then((data) => dispatch(blockCreated(data)))
            .then(() => dispatch(addNotification({type: 'success', title: 'Блок создан'})))
    )
);

export const updateBlock = (data: Block): Action => (
    (dispatch: Dispatch) => guardResponse(
        update(`/manager/api/blocks/${encodeURIComponent(data.id)}`, data)
            .then((data) => dispatch(blockUpdated(data, data.id)))
            .then(() => dispatch(addNotification({type: 'success', title: 'Блок сохранён'})))
    )
);

export const removeBlock = (id: string): Action => (
    (dispatch: Dispatch) => guardResponse(
        remove(`/manager/api/blocks/${encodeURIComponent(id)}`)
            .then(() => dispatch(blockRemoved(id)))
            .then(() => dispatch(addNotification({type: 'success', title: 'Блок удалён'})))
    )
);

export const fetchBlockTypes = (): Action => (
    (dispatch: Dispatch) => guardResponse(
        list('/manager/api/blocks/types', 'type')
            .then((data) => dispatch(blockTypesFetched(data)))
    )
);
