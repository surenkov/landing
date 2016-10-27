// @flow
import { CONFIG_FETCHED, CONFIG_UPDATED } from '../actions/config'
import type { State, Action } from '../flow/redux'

export default (state: State = {}, action: Action) => {
    switch (action.type) {
        case CONFIG_FETCHED:
        case CONFIG_UPDATED:
            return action.config;

        default:
            return state;
    }
}
