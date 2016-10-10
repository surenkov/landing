/**
 * Created by surenkov on 10/10/16.
 */
import { guardResponse, get, update } from '../utility/api'
import { addNotification } from './notifications'

export const CONFIG_FETCHED = 'CONFIG_FETCHED';
export const CONFIG_UPDATED = 'CONFIG_UPDATED';


const configFetched = (config) => ({
    type: CONFIG_FETCHED,
    config
});

const configUpdated = (config) => ({
    type: CONFIG_UPDATED,
    config
});


export const fetchConfig = () => (
    (dispatch) => guardResponse(
        get('/manager/api/landing/config')
            .then((config) => dispatch(configFetched(config)))
    )
);

export const updateConfig = (config) => (
    (dispatch) => guardResponse(
        update('/manager/api/landing/config', config)
            .then((config) => dispatch(configUpdated(config)))
            .then(() => dispatch(addNotification({
                type: 'success',
                title: 'Параметры сохранены.'
            })))
    )
);
