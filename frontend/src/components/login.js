import React from 'react';
import Axios from 'axios';
import './login.css';

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            passwordConfirm: '',
            userError: '',
            passError: '',
            passConfirmError: '',
            login: true,
        };
        this.signinUsernameFocus = React.createRef();
        this.signinPasswordFocus = React.createRef();
        this.signupUsernameFocus = React.createRef();
        this.signupPasswordFocus = React.createRef();
        this.signupPasswordConfirmFocus = React.createRef();
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
                this.setState({userError: 'Username must not be empty!', passError: '', passConfirmError: ''})
                this.signupUsernameFocus.current.focus();
            } else if (this.state.password === '') {
                this.setState({passError: 'Password must not be empty!', userError: '', passConfirmError: ''})
                this.signupPasswordFocus.current.focus();
            } else if (this.state.password !== this.state.passwordConfirm) {
                this.setState({passConfirmError: 'Passwords do not match!', userError: '', passError: ''})
            } else {
                try {
                    await Axios.post('/backend/signup', {
                        username: this.state.username,
                        password: this.state.password,
                    });
                    this.setState({login: true, username: '', password: '', passwordConfirm: '', userError: '', passError: '', passConfirmError: ''})
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
        this.setState({login: true, username: '', password: '', passwordConfirm: '', userError: '', passError: '', passConfirmError: ''})
    }



    render() {
        const userErrorMessage = this.state.userError
        const passErrorMessage = this.state.passError
        const passConfirmErrorMessage = this.state.passConfirmError
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
                        <p className={'inline'}>Don't have an account? <button onClick={this.signup} className={'transparentButton'}>Sign Up</button></p>
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
                            <div className={'inputContainer'}>
                                <input type={'password'} placeholder={'Confirm Password'} value={this.state.passwordConfirm} ref={this.signupPasswordConfirmFocus}
                                       onChange={(event) => this.setState({passwordConfirm: event.target.value})}/>
                                <div className={'errorMessage'}>{passConfirmErrorMessage}</div>
                            </div>
                            <button>Sign Up</button>
                        </form>
                        <p className={'inline'}>Have an account? <button onClick={this.signin} className={'transparentButton'}>Log In</button></p>
                    </div>
                </div>
            );
        }
    }
}

export default Login;