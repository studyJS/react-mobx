// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './components/App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();

import ReactDOM from 'react-dom'
import promiseFinally from 'promise.prototype.finally'
import React from 'react'
import { HashRouter } from 'react-router-dom'
// import { useStrict } from 'mobx'
import { Provider } from 'mobx-react'

import App from './components/App'

import articlesStore from './stores/articlesStore'
// import commentsStore from './stores/commentsStore'
import authStore from './stores/authStore'
import commonStore from './stores/commonStore'
// import editorStore from './stores/editorStore'
import userStore from './stores/userStore'
// import profileStore from './stores/profileStore'

const stores = {
  articlesStore,
  // commentsStore,
  authStore,
  commonStore,
  // editorStore,
  userStore
  // profileStore
}

// For easier debugging
window._____APP_STATE_____ = stores

promiseFinally.shim()
// useStrict(true)

ReactDOM.render(
  <Provider {...stores}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)
