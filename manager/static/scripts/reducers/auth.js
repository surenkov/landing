// @flow
import { USER_LOG_IN, USER_LOG_OUT } from '../actions/auth'
import type { Action } from '../flow/redux'


type State = {
    credentials: {
        name: string
    },
    token: ?string,
    expires: number
};

const initialState = {
    credentials: {
        name: 'Анонимный пользователь',
    },
    token: null,
    expires: 0
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case USER_LOG_IN:
            return {
                credentials: action.credentials,
                token: `JWT ${action.token}`,
                expires: Date.now() + 2592000000
            };

        case USER_LOG_OUT:
            return initialState;

        default:
            return state;
    }
};
