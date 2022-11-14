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

    logout = async (event) => {
        event.preventDefault()

        try {
            await Axios.get('/backend/logout')
        } catch(err) {
            console.log(err)
        }
        this.props.setState({loggedIn: false, username: ''})
    }

    render() {
        const user = this.state.user
        return(
            <div>
                <h1>Hello {user}!</h1>
                <p><a onClick={this.logout}>Log Out</a></p>
            </div>
        );
    }
}

export default Todo;