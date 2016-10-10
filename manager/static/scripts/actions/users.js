/**
 * Created by surenkov on 10/10/16.
 */
import { list, create, update, remove, guardResponse } from '../utility/api'
import { addNotification } from './notifications'

export const USERS_FETCHED = 'USERS_FETCHED';
export const USER_FETCHED = 'USER_FETCHED';
export const USER_CREATED = 'USER_CREATED';
export const USER_UPDATED = 'USER_UPDATED';
export const USER_REMOVED = 'USER_REMOVED';


const usersFetched = (users) => ({
    type: USERS_FETCHED,
    users
});

const userFetched = (user) => ({
    type: USER_FETCHED,
    user
});

const userCreated = (user) => ({
    type: USER_CREATED,
    user
});

const userUpdated = (user, id) => ({
    type: USER_UPDATED,
    user,
    id
});

const userRemoved = (id) => ({
    type: USER_REMOVED,
    id
});


export const fetchUsers = () => (
    (dispatch) => guardResponse(
        list('/manager/api/users')
            .then((data) => dispatch(usersFetched(data)))
    )
);

export const fetchUser = (id) => (
    (dispatch) => guardResponse(
        get(`/manager/api/users/${encodeURIComponent(id)}`)
            .then((data) => dispatch(userFetched(user)))
    )
);

export const createUser = (user) => (
    (dispatch) => guardResponse(
        create('/manager/api/users', user)
            .then((user) => dispatch(userCreated(user)))
            .then(() => dispatch(addNotification({type: 'success', title: 'Пользователь создан.'})))
    )
);

export const updateUser = (user) => (
    (dispatch) => guardResponse(
        update(`/manager/api/users/${encodeURIComponent(user.id)}`, user)
            .then((user) => dispatch(userUpdated(user, user.id)))
            .then(() => dispatch(addNotification({type: 'success', title: 'Пользователь изменён.'})))
    )
);


export const removeUser = (id) => (
    (dispatch) => guardResponse(
        remove(`/manager/api/users/${encodeURIComponent(id)}`)
            .then(() => dispatch(userRemoved(id)))
            .then(() => dispatch(addNotification({type: 'success', title: 'Пользователь удалён.'})))
    )
);
