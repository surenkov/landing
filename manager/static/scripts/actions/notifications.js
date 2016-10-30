// @flow
import type { Action, Dispatch } from '../flow/redux'
import type { Notification } from '../flow/types'

export const ADD_NOTIFICATION = 'NOTIFICATIONS_ADD';
export const REMOVE_NOTIFICATION = 'NOTIFICATIONS_REMOVE';
export const CLEAR_NOTIFICATIONS = 'NOTIFICATIONS_CLEAR';

let notificationId = 0;

export const addNotification = ({
    type = 'info',
    title = '',
    message = ''
}: Notification, timeout: number = 4500): Action => (
    (dispatch: Dispatch) => {
        const { id } = dispatch({
            type: ADD_NOTIFICATION,
            id: notificationId++,
            notify: {
                type, title, message
            }
        });
        setTimeout(() => dispatch(removeNotification(id)), timeout);
        return id;
    }
);

export const removeNotification = (id: number): Action => ({
    type: REMOVE_NOTIFICATION,
    id
});

export const clearNotificaions = (): Action => ({
    type: CLEAR_NOTIFICATIONS
});
