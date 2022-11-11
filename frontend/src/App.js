import React from 'react';
import Login from './components/login';
import Todo from './components/todo';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
      username: '',
    };
  }

  render() {
    if (this.state.loggedIn) {
      return (<Todo user={this.state.username} setState={p => this.setState(p)}/>);
    } else {
      return (<Login setState={p => this.setState(p)}/>);
    }
  };
}

export default App;
