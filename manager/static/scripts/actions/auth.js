// @flow
import { addNotification } from './notifications'
import { checkStatus } from '../utility/api'

import type { Dispatch, Action } from '../flow/redux'
import type { Credentials } from '../flow/types'

export const USER_LOG_IN = 'USER_LOG_IN';
export const USER_LOG_OUT = 'USER_LOG_OUT';


export const logInUser = ({ email, password }: Credentials) => (
    (dispatch: Dispatch) => fetch('/manager/api/auth', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    }).then(checkStatus, () => { throw new Error('Ошибка соединения') }
    ).then((response) => response.json()
    ).then(({ token, email, name, role }) => dispatch({
        type: USER_LOG_IN,
        token: token,
        credentials: { email, name, role }
    })).catch((ex) => {
        let message = ex.message;
        const status = ex.response.status;

        if (status >= 400 && status < 500) {
            message = 'Проверьте комбинацию email и пароля'
        } else if (status >= 500) {
            message = 'Внутренняя ошибка сервера. Обратитесь к администратору.'
        }

        dispatch(
            addNotification({
                type: 'error',
                title: 'Не удалось войти',
                message
            }, 7000)
        )
    })
);

export const logOutUser = (): Action => ({
    type: USER_LOG_OUT
});
