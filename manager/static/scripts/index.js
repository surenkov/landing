import React from 'react'
import ReactDOM from 'react-dom'

import Admin from './components/admin'
import { store } from './store'
import { handleUserRedirect } from './utility/auth'

window.addEventListener('load', () => {
    handleUserRedirect(store);
    ReactDOM.render(
        <Admin store={store} />,
        document.getElementById('app-container')
    );
});

if (module.hot) {
    module.hot.accept();
}
