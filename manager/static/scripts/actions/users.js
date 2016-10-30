// @flow
import { get, list, create, update, remove, guardResponse } from '../utility/api'
import { addNotification } from './notifications'

import type { Action, Dispatch } from '../flow/redux'
import type { User } from '../flow/types'

export const USERS_FETCHED = 'USERS_FETCHED';
export const USER_FETCHED = 'USER_FETCHED';
export const USER_CREATED = 'USER_CREATED';
export const USER_UPDATED = 'USER_UPDATED';
export const USER_REMOVED = 'USER_REMOVED';

const usersFetched = (users: Array<User>): Action => ({
    type: USERS_FETCHED,
    users
});

const userFetched = (user: Array<User>): Action => ({
    type: USER_FETCHED,
    user
});

const userCreated = (user: User): Action => ({
    type: USER_CREATED,
    user
});

const userUpdated = (user: User, id: string): Action => ({
    type: USER_UPDATED,
    user,
    id
});

const userRemoved = (id: string): Action => ({
    type: USER_REMOVED,
    id
});


export const fetchUsers = (): Action => (
    (dispatch: Dispatch) => guardResponse(
        list('/manager/api/users')
            .then((data) => dispatch(usersFetched(data)))
    )
);

export const fetchUser = (id: string): Action => (
    (dispatch: Dispatch) => guardResponse(
        get(`/manager/api/users/${encodeURIComponent(id)}`)
            .then((data) => dispatch(userFetched(data)))
    )
);

export const createUser = (user: User): Action => (
    (dispatch: Dispatch) => guardResponse(
        create('/manager/api/users', user)
            .then((user) => dispatch(userCreated(user)))
            .then(() => dispatch(addNotification({type: 'success', title: 'Пользователь создан.'})))
    )
);

export const updateUser = (user: User): Action => (
    (dispatch: Dispatch) => guardResponse(
        update(`/manager/api/users/${encodeURIComponent(user.id)}`, user)
            .then((user) => dispatch(userUpdated(user, user.id)))
            .then(() => dispatch(addNotification({type: 'success', title: 'Пользователь изменён.'})))
    )
);


export const removeUser = (id: string) => (
    (dispatch: Dispatch) => guardResponse(
        remove(`/manager/api/users/${encodeURIComponent(id)}`)
            .then(() => dispatch(userRemoved(id)))
            .then(() => dispatch(addNotification({type: 'success', title: 'Пользователь удалён.'})))
    )
);
