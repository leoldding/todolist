import React from 'react';
import Axios from 'axios';
import './styles.css';

class TaskItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            task: this.props.task,
        }
    }

    deleteTask = async () => {
        let taskList

        try {
            await Axios.post('/backend/deleteTask', {
                id: this.state.id,
                task: this.state.task,
            })
            taskList = this.props.taskList
            for (let i = 0; i < taskList.length; i++) {
                if (taskList[i][0] == this.state.id) {
                    taskList.splice(i, 1)
                    break
                }
            }
            this.props.setState({taskList: taskList})
        } catch(err) {
            console.log(err)
        }
    }

    render() {
        let task = this.state.task
        if (task !== '') {
            return (
                <div className={'inlineTask'}>
                    <button className={'transparentButton'} onClick={this.deleteTask}>X</button>
                    <li>{task}</li>
                </div>
            )
        }
    }
}

class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            newTask: '',
            addTaskError: '',
            taskList: [],
        };
        this.addTaskFocus = React.createRef()
    }

    async componentDidMount() {
        let data
        let tasks = []

        try {
            await Axios.post('/backend/retrieveTasks', {
                username: this.state.user,
            }).then(function (response) {
                data = response.data
                if (data !== null) {
                    data.forEach(function (item) {
                        tasks.push([item["id"], item["task"]])
                    })
                }
            })
            this.setState({taskList: tasks})
        } catch(err) {
            console.log(err)
        }
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
        let id
        let tasks

        if (this.state.newTask === '') {
            this.setState({addTaskError: 'New task cannot be nothing!'})
        }
         else {
            try {
                await Axios.post('/backend/addTask', {
                    user: this.state.user,
                    task: this.state.newTask,
                }).then(function(response) {
                    id = response.data
                });
                tasks = this.state.taskList
                tasks.push([id, this.state.newTask])
                this.setState({taskList: tasks})
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
        const taskList = this.state.taskList.map((task) => <TaskItem taskList={this.state.taskList} id={task[0]} key={task[0]} task={task[1]} setState={p => this.setState(p)} />)

        return(
            <div className={'listContainer'}>
                <h1>{user}'s To-Do List</h1>
                <div className={'list'}>
                    <form className={'listForm'} onSubmit={this.addTask}>
                        <input id={'addItemInput'} type={'text'} placeholder={'Add a new task'} ref={this.addTaskFocus} value={this.state.newTask} autoFocus
                            onChange={(event) => this.setState({newTask: event.target.value})}/>
                        <button id={'addItemButton'} className={'transparentButton'}>+</button>
                    </form>
                    <div className={'errorMessage'}>{addTaskError}</div>
                    {taskList}
                </div>
                <button id={'logout'} className={'transparentButton'} onClick={this.logout}>Log Out</button>
            </div>
        );
    }
}

export default Todo;