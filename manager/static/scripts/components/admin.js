// @flow
import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import { Notifications } from './notifications'
import { Menu } from './menu'
import { Auth } from './auth'
import { Blocks } from './blocks'
import { MediaPage } from './media'
import { UsersPage } from './users'
import { ConfigPage } from './config'
import { EnsureAuthenticated } from './auth'

import type { Store } from '../flow/redux'


const App = ({ children }) => (
    <div>
        <EnsureAuthenticated>
            <Menu />
        </EnsureAuthenticated>
        <div className="main container">
            {children}
        </div>
        <Notifications />
    </div>
);


type AppParams = { store: Store };

export default ({ store }: AppParams) => {
    const history = syncHistoryWithStore(hashHistory, store);
    return (
        <Provider store={store}>
            <Router history={history}>
                <Route path="/" component={App}>
                    <IndexRoute component={Blocks} />
                    <Route path="auth" component={Auth} />
                    <Route path="blocks" component={Blocks} />
                    <Route path="media" component={MediaPage} />
                    <Route path="users" component={UsersPage} />
                    <Route path="config" components={ConfigPage} />
                </Route>
            </Router>
        </Provider>
    );
};
