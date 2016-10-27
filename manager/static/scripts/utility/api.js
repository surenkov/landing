// @flow
import _ from 'lodash'
import { store } from '../store'
import { addNotification } from '../actions/notifications'

import type { Response } from '../flow/fetch'

class ResponseError extends Error {
    response: Response
}



function token() {
    return store.getState().auth.token;
}

function connectionError(message: string = 'Ошибка соединения') {
   throw new Error(message);
}



export const checkStatus = (response: Response) => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    let error = new ResponseError(response.statusText);
    error.response = response;
    throw error;
};

export const guardResponse = (promise: Promise<any>, title: string = 'Ошибка запроса') => (
    promise
        .then(() => false)
        .catch((ex) => {
            const status = ex.response.status;
            let message = ex.message;
            let type = 'warning';

            if (status >= 400 && status < 500) {
                message = 'Ошибка запроса. Убедитесь в корректности данных.';
            } else if (status >= 500) {
                message = 'Внутренняя ошибка сервера. Обратитесь к администратору.';
                type = 'error';
            }

            store.dispatch(
                addNotification({
                    type,
                    title,
                    message
                })
            );
            return true;
        })
);

export const normalize = (objects: Array<{}>, key: string = 'id') =>
    _.keyBy(objects, key);



export const create = (url: string, data: {}) => (
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': token(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(
        checkStatus,
        connectionError
    ) .then((response) => response.json())
);

export const list = (url: string, key: string = 'id') => (
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token(),
            'Accept': 'application/json',
        }
    }).then(
        checkStatus,
        connectionError
    ).then((response) => response.json()
    ).then((data) => normalize(data, key))
);

export const get = (url: string) => (
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token(),
            'Accept': 'application/json',
        }
    }).then(
        checkStatus,
        connectionError
    ).then((response) => response.json())
);

export const update = (url: string, data: {}) => (
    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': token(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(
        checkStatus,
        connectionError
    ).then((response) => response.json())
);

export const remove = (url: string) => (
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': token(),
            'Accept': 'application/json'
        }
    }).then(
        checkStatus,
        connectionError
    ).then((response) => response.json())
);

export const upload = (url: string, formData: FormData) => (
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': token(),
            'Accept': 'application/json'
        },
        body: formData
    }).then(
        checkStatus,
        connectionError
    ).then((response) => response.json())
);
