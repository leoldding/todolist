import React from 'react';
import Login from './components/login';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
      username: '',
    };
  }

  render() {
    const user = this.state.username
    if (this.state.loggedIn && this.state.username != '') {
      return (<h1>Hello {user}!</h1>);
    } else {
      return (<Login setState={p => this.setState(p)}/>);
    }
  };
}

export default App;
