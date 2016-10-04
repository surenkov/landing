/**
 * Created by surenkov on 10/3/16.
 */
import _ from 'lodash'
import { store } from '../store'
import { addNotification } from '../actions/notifications'

function token() {
    return store.getState().auth.token;
}

function connectionError(message = 'Ошибка соединения') {
   throw new Error(message);
}

export const checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
};

export const guardResponse = (promise, title = 'Ошибка запроса') => (
    promise.catch((ex) => {
        const status = ex.response.status;
        let message = ex.message;

        if (status >= 400 && status < 500) {
            message = 'Ошибка запроса. Убедитесь в корректности данных.';
        } else if (status >= 500) {
            message = 'Внутренняя ошибка сервера. Обратитесь к администратору.';
        }

        store.dispatch(
            addNotification({
                type: 'warning',
                title,
                message
            })
        );
    })
);

export const normalize = (objects, key = 'id') =>
    _.keyBy(objects, key);

export const create = (url, data) => (
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

export const list = (url) => (
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
    ).then((data) => normalize(data))
);

export const get = (url) => (
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

export const update = (url, data) => (
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

export const remove = (url) => (
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

export const upload = (url, formData) => (
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': token(),
            'Accept': 'application/json'
        },
        body: formData
    })
);
