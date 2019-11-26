import React, { Component } from 'react';
import  Logo  from '../../../public/assets/images/logo-website.png';
import  Loader  from '../../../public/assets/images/spinner.GIF';
import * as Constants from '../../constants';

var md5 = require('md5');

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errors:{}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount()
    {
        if(localStorage.getItem('loggedInUserDetails'))
        {
            this.props.history.push('/dashboard');
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const { username, password } = this.state;
        
        document.getElementById("wait").style.display="block";
        
        if(!this.validateForm())
        {
            fetch(Constants.BASE_URL_API+"checklogin",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams({email:username, password:password})
            })
            .then(response => { return response.json(); } )
            .then(data =>
            {
                document.getElementById("wait").style.display="none";
                if(data.responseCode)
                {
                    let parameters = {
                        loggedInUserName:data.name,
                        loggedInUserType:data.userType,
                        loggedInUserEmail:data.email,
                        loggedInUserId:data.userId,
                        isRegisteredUnderGST:data.isRegisteredUnderGST,
                        loggedInProPic:data.proPicPath
                    };

                    localStorage.clear();
                    localStorage.setItem('loggedInUserDetails', JSON.stringify(parameters));
                    if(data.isSettings && data.isSettings!=="undefined" && data.isSettings!==null)
                    {
                        this.props.history.push('/dashboard');
                    }
                    else
                    {
                        this.props.history.push('/settings');
                    }
                    
                }
                else
                {
                    document.getElementById("resp-msg").innerHTML = "Invalid Login!";
                }    
            });
        }
        else
        {
            document.getElementById("wait").style.display="none";
        }
        
    }
    
    validateForm()
    {
        var error_flag = false;
        let errors = {};
        if(this.state.username === "")
        {
            error_flag = true;
            errors['username'] = "Please enter username!";
            setTimeout(function(){
                this.setState({errors:{}});
            }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
        }
        if(this.state.username != "")
        {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if(!pattern.test(this.state.username)) {
                error_flag = true;
                errors["username"] = "Please enter valid email ID!";
                setTimeout(function(){
                    this.setState({errors:{}});
                }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
            }
        }
        
        if(this.state.password === "")
        {
            error_flag = true;
            errors['password'] = "Please enter password!";
            setTimeout(function(){
                this.setState({errors:{}});
            }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
        }
        
        this.setState({
        errors: errors
      });
        return error_flag;
    }

    render() {

        const { username, password } = this.state;

        return (
            <div className="app no-padding no-footer layout-static">
                <div className="session-panel">
                <div className="session">
                    <div className="session-content">
                    <div className="card card-block form-layout">
                    
                        <div id="wait" className="loader-login">
                            <img src={Loader} width="64" height="64" />
                        </div>	

                        <form action="javascript:void(0);" onSubmit={this.handleSubmit} id="login_form">
                            <div className="text-xs-center m-b-1 m-t-1">
                                <img src={Logo} width="170px;" alt="" className="m-b-1"/>
                            </div>
                            
                            <fieldset className="form-group">
                                <label for="username">
                                Enter your username
                                </label>
                                <div className="input-group login-input">
                                <div className="input-group-addon"><i className="material-icons">account_circle</i></div>
                                <input type="text" className="form-control form-control-md" name="username" onChange={this.handleChange} value={username}/>
                                </div>
                                
                                <div className="err_msg">{this.state.errors.username}</div>
                            
                            </fieldset>				
                            <fieldset className="form-group">
                                <label for="password">
                                Enter your password
                                </label>
                                <div className="input-group login-input">
                                <div className="input-group-addon"><i className="material-icons"><i className="material-icons">lock</i></i></div>
                                <input type="password" className="form-control form-control-md" name="password" onChange={this.handleChange} value={password}/>
                                </div>
                                <div className="err_msg">{this.state.errors.password}</div>
                            </fieldset>
                            <button className="btn btn-primary btn-block btn-md" type="submit">
                                Login
                            </button>

                            <div className="err_msg" id="resp-msg"></div>
                            <footer className="text-xs-center p-y-1">
                            </footer>
                        </form>
                    </div>
                    </div>
        
                </div>
        
                </div>
            </div>
        );
    }
}
export default Home;
