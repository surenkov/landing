/**
 * Created by surenkov on 10/3/16.
 */
import { USER_LOG_IN, USER_LOG_OUT } from '../actions/auth'

const initialState = {
    credentials: {
        name: 'Анонимный пользователь',
    },
    token: null,
    expires: 0
};

export default (state = initialState, action) => {
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
