// @flow
import type { Action, Dispatch } from '../flow/redux'

export const ADD_NOTIFICATION = 'NOTIFICATIONS_ADD';
export const REMOVE_NOTIFICATION = 'NOTIFICATIONS_REMOVE';
export const CLEAR_NOTIFICATIONS = 'NOTIFICATIONS_CLEAR';


type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type Notification = {
    type: NotificationType,
    title?: string,
    message?: string
};

export type NotificationSpec = {
    id: number,
    type: NotificationType,
    notify: Notification
};


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
