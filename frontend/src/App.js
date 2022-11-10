import React from 'react';
import Login from './components/login';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
    };
  }

  render() {
    return (
      this.state.loggedIn ? <h1>LOGGED IN</h1> : <Login setState={p=>this.setState(p)}/>
    );
  };
}

export default App;
