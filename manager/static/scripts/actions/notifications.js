/**
 * Created by surenkov on 10/3/16.
 */

export const ADD_NOTIFICATION = 'NOTIFICATIONS_ADD';
export const REMOVE_NOTIFICATION = 'NOTIFICATIONS_REMOVE';
export const CLEAR_NOTIFICATIONS = 'NOTIFICATIONS_CLEAR';

let notificationId = 0;

export const addNotification = ({
    type = 'info',
    title = '',
    message = ''
}, timeout = 4500) => (
    (dispatch) => {
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

export const removeNotification = (id) => ({
    type: REMOVE_NOTIFICATION,
    id
});

export const clearNotificaions = () => ({
    type: CLEAR_NOTIFICATIONS
});
