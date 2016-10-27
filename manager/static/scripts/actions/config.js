// @flow
import { guardResponse, get, update } from '../utility/api'
import { addNotification } from './notifications'

import type { Dispatch, Action } from '../flow/redux'

export const CONFIG_FETCHED = 'CONFIG_FETCHED';
export const CONFIG_UPDATED = 'CONFIG_UPDATED';


const configFetched = (config): Action => ({
    type: CONFIG_FETCHED,
    config
});

const configUpdated = (config): Action => ({
    type: CONFIG_UPDATED,
    config
});


export const fetchConfig = (): Action => (
    (dispatch: Dispatch) => guardResponse(
        get('/manager/api/landing/config')
            .then((config) => dispatch(configFetched(config)))
    )
);

export const updateConfig = (config: {}): Action => (
    (dispatch: Dispatch) => guardResponse(
        update('/manager/api/landing/config', config)
            .then((config) => dispatch(configUpdated(config)))
            .then(() => dispatch(addNotification({
                type: 'success',
                title: 'Параметры сохранены.'
            })))
    )
);
