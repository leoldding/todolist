import React from 'react';
import Axios from 'axios';
import './login.css';

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            userError: '',
            passError: '',
        };
    }

    async componentDidMount() {
        let returnedUser
        try {
            await Axios.get('/backend/check')
                .then(function (response) {
                    returnedUser = response.data.username
                })
            this.props.setState({loggedIn:true, username: returnedUser})
        } catch(err) {
            console.log(err)
        }
    }

    credentialSubmit = async (event) => {
        event.preventDefault();

        if (this.state.username == '') {
            this.setState({userError: 'Username must not be empty!', passError: ''})
        } else if (this.state.password == '') {
            this.setState({passError: 'Password must not be empty!', userError: ''})
        } else {
            try {
                await Axios.post('/backend/login', {
                    username: this.state.username,
                    password: this.state.password,
                });
                this.props.setState({loggedIn: true, username: this.state.username})
                this.setState({userError: '', passError: ''})
            } catch (err) {
                console.log(err)
                if (err.response.status == 400) {
                    this.setState({userError: 'Invalid Username', passError: ''})
                } else if (err.response.status == 401) {
                    this.setState({passError: 'Invalid Password', userError: ''})
                }
            };
        }
    };

    render() {
        const userErrorMessage = this.state.userError
        const passErrorMessage = this.state.passError
        return (
            <div className={'form'}>
                <h2>Log In Here</h2>
                <form onSubmit={this.credentialSubmit}>
                    <div className={'inputContainer'}>
                        <label>Username: </label>
                        <input type={'text'} placeholder={'Username'} value={this.state.username} onChange={(event) => this.setState({username: event.target.value})} autoFocus/>
                        <div className={'errorMessage'}>{userErrorMessage}</div>
                    </div>
                    <div className={'inputContainer'}>
                        <label>Password: </label>
                        <input type={'password'} placeholder={'Password'} value={this.state.password} onChange={(event) => this.setState({password: event.target.value})}/>
                        <div className={'errorMessage'}>{passErrorMessage}</div>
                    </div>
                    <button>Login</button>
                </form>
            </div>
        );
    }
}

export default Login;