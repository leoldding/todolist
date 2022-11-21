import React from 'react';
import Axios from 'axios';
import './todo.css';

class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            newTask: '',
            addTaskError: '',
        };
        this.addTaskFocus = React.createRef()
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

    addTask = async (event) => {
        event.preventDefault()

        if (this.state.newTask === '') {
            this.setState({addTaskError: 'New task cannot be nothing!'})
        }
         else {
            try {
                await Axios.post('/backend/addTask', {
                    user: this.state.user,
                    task: this.state.newTask,
                });
            } catch (err) {
                console.log(err)
            }
            this.setState({newTask: '', addTaskError: ''})
            this.addTaskFocus.current.focus();
        }
    }

    render() {
        const user = this.state.user
        const addTaskError = this.state.addTaskError
        return(
            <div>
                <h1>{user}'s To-Do List</h1>
                <div className={'list'}>
                    <form className={'listForm'} onSubmit={this.addTask}>
                        <input id={'addItemInput'} type={'text'} placeholder={'Add a new task'} ref={this.addTaskFocus} value={this.state.newTask} autoFocus
                            onChange={(event) => this.setState({newTask: event.target.value})}/>
                        <button id={'addItemButton'} className={'transparentButton'}>+</button>
                    </form>
                    <div className={'errorMessage'}>{addTaskError}</div>
                </div>
                <button id={'logout'} className={'transparentButton'} onClick={this.logout}>Log Out</button>
            </div>
        );
    }
}

export default Todo;