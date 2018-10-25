// import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//         </header>
//       </div>
//     );
//   }
// }

// export default App;

import Header from './Header'
import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'

import Login from './Login'
import Register from './Register'
import Home from './Home'

@inject('userStore', 'commonStore')
@withRouter
@observer
class App extends React.Component {
  componentWillMount () {
    if (!this.props.commonStore.token) {
      this.props.commonStore.setAppLoaded()
    }
  }

  componentDidMount () {
    if (this.props.commonStore.token) {
      this.props.userStore
        .pullUser()
        .finally(() => this.props.commonStore.setAppLoaded())
    }
  }

  render () {
    if (this.props.commonStore.appLoaded) {
      return (
        <div>
          <Header />
          <Switch>
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            {/* <Route path='/editor/:slug?' component={Editor} />
            <Route path='/article/:id' component={Article} />
            <PrivateRoute path='/settings' component={Settings} />
            <Route path='/@:username' component={Profile} />
            <Route path='/@:username/favorites' component={Profile} /> */}
            <Route path='/' component={Home} />
          </Switch>
        </div>
      )
    }
    return <Header />
  }
}

export default App;