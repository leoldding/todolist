import React from 'react';
import Axios from 'axios';

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
        };
    }

    credentialSubmit = async (event) => {
        event.preventDefault();

        try {
            await Axios.post('/backend/login', {
                username: this.state.username,
                password: this.state.password,
            });
            this.props.setState({loggedIn:true})
        } catch (err) {
            console.log(err)
        };

        this.setState({
            username: '',
            password: '',
        });
    };

    render() {
        return (
            <div className={'form'}>
                <form onSubmit={this.credentialSubmit}>
                    <div className={'inputContainer'}>
                        <label>Username: </label>
                        <input type={'text'} placeholder={'Username'} value={this.state.username} onChange={(event) => this.setState({username: event.target.value})} required autoFocus/>
                    </div>
                    <div className={'inputContainer'}>
                        <label>Password: </label>
                        <input type={'password'} placeholder={'Password'} value={this.state.password} onChange={(event) => this.setState({password: event.target.value})} required/>
                    </div>
                    <button>Login</button>
                </form>
            </div>
        );
    }
}

export default Login;