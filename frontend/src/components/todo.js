import React from 'react';
import Axios from 'axios';
import './todo.css';

class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
        };
    }

    render() {
        const user = this.state.user
        return(
            <h1>Hello {user}!</h1>
        );
    }
}

export default Todo;