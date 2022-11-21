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
            login: true,
        };
        this.signinUsernameFocus = React.createRef();
        this.signinPasswordFocus = React.createRef();
        this.signupUsernameFocus = React.createRef();
        this.signupPasswordFocus = React.createRef();
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
        this.signinUsernameFocus.current.focus();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.login !== prevState.login) {
            if (this.state.login === true) {
                this.signinUsernameFocus.current.focus();
            } else {
                this.signupUsernameFocus.current.focus();
            }
        }
    }

    credentialSubmit = async (event) => {
        event.preventDefault();

        if (this.state.login === true) {
            if (this.state.username === '') {
                this.setState({userError: 'Username must not be empty!', passError: ''})
                this.signinUsernameFocus.current.focus();
            } else if (this.state.password === '') {
                this.setState({passError: 'Password must not be empty!', userError: ''})
                this.signinPasswordFocus.current.focus();
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
                    if (err.response.status === 400) {
                        this.setState({userError: 'Invalid User', passError: ''})
                        this.signinUsernameFocus.current.focus();
                    } else if (err.response.status === 401) {
                        this.setState({passError: 'Invalid Password', userError: ''})
                        this.signinPasswordFocus.current.focus();
                    }
                };
            }
        } else {
            if (this.state.username === '') {
                this.setState({userError: 'Username must not be empty!', passError: ''})
                this.signupUsernameFocus.current.focus();
            } else if (this.state.password === '') {
                this.setState({passError: 'Password must not be empty!', userError: ''})
                this.signupPasswordFocus.current.focus();
            } else {
                try {
                    await Axios.post('/backend/signup', {
                        username: this.state.username,
                        password: this.state.password,
                    });
                    this.setState({login: true, username: '', password: '', userError: '', passError: ''})
                } catch (err) {
                    console.log(err)
                    if (err.response.status === 400) {
                        this.setState({userError: 'Username Taken', passError: ''})
                        this.signupUsernameFocus.current.focus();
                    }
                };
            }
        }
    };

    signup = async (event) => {
        event.preventDefault();
        this.setState({login: false, username: '', password: '', userError: '', passError: ''})
    }

    signin = async (event) => {
        event.preventDefault();
        this.setState({login: true, username: '', password: '', userError: '', passError: ''})
    }



    render() {
        const userErrorMessage = this.state.userError
        const passErrorMessage = this.state.passError
        if (this.state.login === true) {
            return (
                <div className={'container'}>
                    <div className={'form'}>
                        <h2>Log In Here</h2>
                        <form onSubmit={this.credentialSubmit}>
                            <div className={'inputContainer'}>
                                <input type={'text'} placeholder={'Username'} value={this.state.username} ref={this.signinUsernameFocus}
                                       onChange={(event) => this.setState({username: event.target.value})}/>
                                <div className={'errorMessage'}>{userErrorMessage}</div>
                            </div>
                            <div className={'inputContainer'}>
                                <input type={'password'} placeholder={'Password'} value={this.state.password} ref={this.signinPasswordFocus}
                                       onChange={(event) => this.setState({password: event.target.value})}/>
                                <div className={'errorMessage'}>{passErrorMessage}</div>
                            </div>
                            <button>Login</button>
                        </form>
                        <p className={'inline'}>Don't have an account? <button onClick={this.signup} className={'loginSwap'}>Sign Up</button></p>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={'container'}>
                    <div className={'form'}>
                        <h2>Sign Up Here</h2>
                        <form onSubmit={this.credentialSubmit}>
                            <div className={'inputContainer'}>
                                <input type={'text'} placeholder={'Username'} value={this.state.username} ref={this.signupUsernameFocus}
                                       onChange={(event) => this.setState({username: event.target.value})}/>
                                <div className={'errorMessage'}>{userErrorMessage}</div>
                            </div>
                            <div className={'inputContainer'}>
                                <input type={'password'} placeholder={'Password'} value={this.state.password} ref={this.signupPasswordFocus}
                                       onChange={(event) => this.setState({password: event.target.value})}/>
                                <div className={'errorMessage'}>{passErrorMessage}</div>
                            </div>
                            <button>Sign Up</button>
                        </form>
                        <p className={'inline'}>Have an account? <button onClick={this.signin} className={'loginSwap'}>Log In</button></p>
                    </div>
                </div>
            );
        }
    }
}

export default Login;