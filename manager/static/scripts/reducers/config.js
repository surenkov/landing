/**
 * Created by surenkov on 10/10/16.
 */
import { CONFIG_FETCHED, CONFIG_UPDATED } from '../actions/config'

export default (state = {}, action) => {
    switch (action.type) {
        case CONFIG_FETCHED:
        case CONFIG_UPDATED:
            return action.config;

        default:
            return state;
    }
}
