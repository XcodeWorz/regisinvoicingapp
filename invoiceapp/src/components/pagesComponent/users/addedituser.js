import React, { Component } from 'react';
import  Loader  from '../../../../public/assets/images/spinner.GIF';
import * as Constants from '../../../constants';
import Sidebar from '../../layoutsComponent/sidebar';

import {
    BrowserRouter as Router
} from 'react-router-dom';

class Addedituser extends Component {
    constructor(props) {
    super(props);
    this.state = {
        name: '',
        email:'',
        phoneNo:'',
        password:'',
        confirmpassword:'',
        errors:{},
        usertask:(props.match.path.match(/edituser/g) !==null && props.match.path.match(/edituser/g) !=="undefined")?'edit':'add'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
}

componentDidMount() {
    if(this.state.usertask ==="edit")
    {
        Promise.all([fetch(Constants.BASE_URL_API+"getusers",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({userId:this.props.match.params.id})
        })
        ])
        .then(([res1]) => { 
            return Promise.all([res1.json()]) 
        })
        .then(([res1]) => {
                this.setState(
                            {
                                userId:this.props.match.params.id,
                                name: res1.users[0].name,
                                email: res1.users[0].email,
                                phoneNo: res1.users[0].phoneNo
                                });
        });
    }
}

    handleChange(e) {
            const { name, value } = e.target;
            this.setState({ [name]: value });
        }

    handleSubmit(e) {
        e.preventDefault();
        
        document.getElementById("wait").style.display="block";

        let apiname =   "";
        if(this.state.usertask === "add")
        {
            apiname = "insertuser";
        }
        else if(this.state.usertask === "edit")
        {
            apiname = "edituser";
        }
        
        if(!this.validateForm())
        {
            fetch(Constants.BASE_URL_API+apiname,
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams(this.state)
            })
            .then(response => { return response.json(); } )
            .then(data =>
                  {
                    document.getElementById("wait").style.display="none";
                    document.getElementById("contact_submit").disabled; 
                    if(data.responseCode)
                    {
                        this.props.history.push('/userslist');
                    }
                    else
                    {
                        document.getElementById("resp-msg").innerHTML = data.responseMessage;
                    }    
                });
        }
        else
        {
            document.getElementById("wait").style.display="none";
        }
        
    }
    
    isNumeric(val)
    {
        var reg = /^\d+$/;
        if( !reg.test( val ) )
        {
            return false;
        }
        return true;
    }
    
    isPhone(val)
    {
        if(!this.isNumeric(val))
        {
            return false;
        }
        else
        {
            var len	=	val.length;
            var count_len	=	10;
            if(len == count_len)
            {
                return true;
            }
            else
            return false;
        }
        
    }
    
    validateForm()
    {
        var error_flag = false;
        let errors = {};
        if(this.state.name === "")
        {
            error_flag = true;
            errors["name"] = "Please enter name!";
            setTimeout(function(){
                this.setState({errors:{}});
           }.bind(this),Constants.WRNG_MSG_TIMEOUT);
        }
       
        if(this.state.email === "")
        {
            error_flag = true;
            errors["email"] = "Please enter email!";
            setTimeout(function(){
                this.setState({errors:{}});
           }.bind(this),Constants.WRNG_MSG_TIMEOUT);
        }
        
        if(this.state.email != "")
        {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if(!pattern.test(this.state.email)) {
                error_flag = true;
                errors["email"] = "Please enter valid email ID!";
                setTimeout(function(){
                    this.setState({errors:{}});
               }.bind(this),Constants.WRNG_MSG_TIMEOUT);
            }
        }
            
        if(this.state.phoneNo != "")
        {
           if(!this.isPhone(this.state.phoneNo))
           {
                error_flag = true;
                errors["phoneNo"] = "Please enter valid phone no!";
                setTimeout(function(){
                    this.setState({errors:{}});
               }.bind(this),Constants.WRNG_MSG_TIMEOUT);
           }
        }
        
        if(this.state.usertask === "add")
        {
            if(this.state.password === "")
            {
                error_flag = true;
                errors["password"] = "Please enter password!";
                setTimeout(function(){
                    this.setState({errors:{}});
               }.bind(this),Constants.WRNG_MSG_TIMEOUT);
            }
            
            if(this.state.confirmpassword === "")
            {
                error_flag = true;
                errors["confirmpassword"] = "Please enter confirm password!";
                setTimeout(function(){
                    this.setState({errors:{}});
               }.bind(this),Constants.WRNG_MSG_TIMEOUT);
            }
            
            if(this.state.password != this.state.confirmpassword)
            {
                error_flag = true;
                errors["confirmpassword"] = "Please enter password same as above!";
                setTimeout(function(){
                    this.setState({errors:{}});
               }.bind(this),Constants.WRNG_MSG_TIMEOUT);
            }
        }
       
        this.setState({
        errors: errors
      });
        return error_flag;
    }
    
    render() {
    const {
            name,
            email,
            phoneNo,
            password,
            confirmpassword,
            usertask
        } = this.state;
        
    return (
        <Router>
            <Sidebar />
            <div className="main-panel">
                <nav className="header navbar">
                    <div className="header-inner">
                        <div className="navbar-item navbar-spacer-right brand hidden-lg-up">
                            <a href="javascript:;" data-toggle="sidebar" className="toggle-offscreen">
                                <i className="material-icons">menu</i>
                            </a>
                        </div>
                        <a className="navbar-item navbar-spacer-right navbar-heading hidden-md-down" href="javascript:void(0);">
                            <span className="tophead-txt">Users >> {(usertask ==="add")?"Add User":"Edit User"}</span>
                            <span className="tophead-txt pull-right"></span>
                        </a>
                    </div>
                </nav>
                <div className="main-content">
                    <div className="content-view">
                        <div className="card">
                            <div className="sec-t-container m-b-2"><h4 className="card-title">
                            {(usertask ==="add")?"Add User":"Edit User"}
                            </h4></div>
                            <div className="card-block">
                                <div id="userDiv">
                                    <div id="wait" className="loader-login">
                                        <img src={Loader} width="64" height="64" />
                                    </div>	
                                    <form action="javascript:void(0);" onSubmit={this.handleSubmit} id="contact_form">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <fieldset className="form-group">
                                                    <label for="firstName">
                                                    Name<span className="mandatory">*</span>
                                                    </label>
                                                    <input type="text" className="form-control form-control-md" name="name" onChange={this.handleChange} value={name}/>
                                                    <span className="err_msg">{this.state.errors.name}</span>
                                                </fieldset>
                                            </div>
                                            <div className="col-md-6">
                                                <fieldset className="form-group">
                                                    <label for="email">
                                                    Email<span className="mandatory">*</span>
                                                    </label>
                                                    <input type="text" className="form-control form-control-md" name="email" onChange={this.handleChange} value={email}/>
                                                    <span className="err_msg">{this.state.errors.email}</span>
                                                </fieldset>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <fieldset className="form-group">
                                                    <label for="phoneNo">
                                                    Phone No<span className="mandatory"></span>
                                                    </label>
                                                    <input type="text" className="form-control form-control-md" name="phoneNo" onChange={this.handleChange} value={phoneNo}/>
                                                    <span className="err_msg">{this.state.errors.phoneNo}</span>
                                                </fieldset>
                                            </div>
                                        </div> 
                                        {
                                            usertask ==="add" &&
                                            <div className="row">
                                                <div className="col-md-6">  
                                                    <fieldset className="form-group">
                                                        <label for="password">
                                                        Password<span className="mandatory">*</span>
                                                        </label>
                                                        <input type="password" className="form-control form-control-md" name="password" onChange={this.handleChange} value={password}/>
                                                        <span className="err_msg">{this.state.errors.password}</span>
                                                    </fieldset>
                                                </div>
                                                <div className="col-md-6">
                                                    <fieldset className="form-group">
                                                        <label for="confirmpassword">
                                                        Confirm Password<span className="mandatory">*</span>
                                                        </label>
                                                        <input type="password" className="form-control form-control-md" name="confirmpassword" onChange={this.handleChange} value={confirmpassword}/>
                                                        <span className="err_msg">{this.state.errors.confirmpassword}</span>
                                                    </fieldset>
                                                </div>
                                            </div>
                                        }
                                        <a className="btn btn-info btn-md" type="button" href="/userslist">
                                            Cancel
                                        </a>
                                            
                                        <button className="btn btn-primary btn-md" type="submit" id="contact_submit">
                                            Save
                                        </button>
                                        <span className="err_msg" id="resp-msg"></span>
                                    </form>
                                </div>     
                            </div>
                        </div>
                    </div>
                </div>
            
            </div>
        </Router>
    );
  }
}
export default Addedituser;
