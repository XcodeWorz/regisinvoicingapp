import React, { Component } from 'react';
import * as Constants from '../../constants';
import Sidebar from '../layoutsComponent/sidebar';

import {
    BrowserRouter as Router
} from 'react-router-dom';

const loggedInUserId =  localStorage.getItem('loggedInUserDetails')?JSON.parse(localStorage.getItem('loggedInUserDetails')).loggedInUserId:'';
       
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            users:{},
            oldPassword:'',
            newPassword:'',
            cnewPassword:'',
            errors:{},
            responseErrorMsg:'',
            responseSuccessMsg:'',
            file:'',
            showSpinner:false,
            showImageMsg:'',
            showImageDialogModal:false
          
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit   =   this.handleSubmit.bind(this);
        this.changeImage    =   this.changeImage.bind(this);
        this.closeImageModal = this.closeImageModal.bind(this);
    }

    closeImageModal()
    {
        this.setState(
            {
                showSpinner:false,
                showImageDialogModal:false,
                showImageMsg:''
            }
        );
    }

    fileValidation(id){
        var fileInput = document.getElementById(id);
        var filePath = fileInput.value;
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        if(!allowedExtensions.exec(filePath)){
            fileInput.value = '';
            return false;
        }else{
                return true;
            }
    }

    changeImage(e)
    {
        e.preventDefault();
        this.setState(
            {
                showImageDialogModal:true,
                showSpinner:true,
                showImageMsg:'Uploading Image.Please wait...'
            }
        );
       
        var sizeInMB    =   (e.target.files[0].size / (1024*1024)).toFixed(2);
        if(!this.fileValidation("uploadProfileImage"))
        {
            this.setState(
                {
                    showImageDialogModal:true,
                    showSpinner:false,
                    showImageMsg:'Please upload file having extensions jpeg,jpg,png and gif only.'
                }
            );
        }
        else if(sizeInMB > Constants.VALID_PROFILE_IMAGE_SIZE)
        {
            this.setState(
                {
                    showImageDialogModal:true,
                    showSpinner:false,
                    showImageMsg:'Please upload profile image size less than '+Constants.VALID_PROFILE_IMAGE_SIZE+' MB'
                }
            );
        }
        else
        {
            const formData = new FormData();
            formData.append('file',e.target.files[0]);
            formData.append('userId',loggedInUserId);
            fetch(Constants.BASE_URL_API + "uploadprofileimage",
            {
                method: "POST",
                mode: 'cors',
                body: formData
            })
            .then(response => { return response.json(); })
            .then(data => {
                let parameters = {
                    loggedInUserName:JSON.parse(localStorage.getItem('loggedInUserDetails')).loggedInUserName,
                    loggedInUserId:JSON.parse(localStorage.getItem('loggedInUserDetails')).loggedInUserId,
                    loggedInUserEmail:JSON.parse(localStorage.getItem('loggedInUserDetails')).loggedInUserEmail,
                    loggedInProPic:data.imagePath,
                    loggedInUserType:JSON.parse(localStorage.getItem('loggedInUserDetails')).loggedInUserType
                };
                localStorage.clear();
                localStorage.setItem('loggedInUserDetails', JSON.stringify(parameters));
               this.makeUserDetails();
            });
        }
    }

    handleChange(e)
    {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e)
    {
        e.preventDefault();
        var error_flag = false;
        let errors = {};
        if (this.state.oldPassword === "") {
            error_flag = true;
            errors['oldPassword'] = "Please enter old password!";
        }
        if (this.state.newPassword === "") {
            error_flag = true;
            errors['newPassword'] = "Please enter new password!";
        }
        if (this.state.cnewPassword === "") {
            error_flag = true;
            errors['cnewPassword'] = "Please enter confirm new password!";
        }

        if(this.state.newPassword != this.state.cnewPassword)
        {
            error_flag = true;
            errors['cnewPassword'] = "Please enter confirm password same as above!";
        }
        
        this.setState({
            errors: errors
        });
        if (error_flag) {
            return error_flag;
        }
        else {
            fetch(Constants.BASE_URL_API + "changepassword",
                {
                    method: "POST",
                    mode: 'cors',
                    body: new URLSearchParams(
                        { 
                            userId:loggedInUserId,
                            oldPassword:this.state.oldPassword,
                            newPassword:this.state.newPassword
                    })
                })
                .then(response => { return response.json(); })
                .then(data => {
                    if(data.responseCode)
                    {
                        this.setState(
                            {
                                responseSuccessMsg:data.responseMessage,
                                errors:{},
                                oldPassword:'',
                                newPassword:'',
                                cnewPassword:''
                            });
                        setTimeout(function(){
                            this.setState({responseSuccessMsg:'',errors:{}});
                       }.bind(this),Constants.WRNG_MSG_TIMEOUT); 
                       
                    }
                    else
                    {
                        this.setState({responseErrorMsg:data.responseMessage,errors:{}});
                        setTimeout(function(){
                            this.setState({responseErrorMsg:'',errors:{}});
                       }.bind(this),Constants.WRNG_MSG_TIMEOUT); 
                    }
                    
                });

        }
    }

    componentDidMount() {
            
        fetch(Constants.BASE_URL_API + "getusers",
            {
                method: "POST",
                mode: 'cors',
                body: new URLSearchParams(
                    { 
                        userId:loggedInUserId,
                })
            })
            .then(response => { return response.json(); })
            .then(data => {
                this.setState({ users: data.users });
            });

    }

    makeUserDetails()
    {
        fetch(Constants.BASE_URL_API + "getusers",
            {
                method: "POST",
                mode: 'cors',
                body: new URLSearchParams(
                    { 
                        userId:loggedInUserId,
                })
            })
            .then(response => { return response.json(); })
            .then(data => {
                this.setState({ users: data.users });
            });

    }

    render() {

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
                                <span className="tophead-txt">Profile</span>
                                <span className="tophead-txt pull-right"></span>
                            </a>
                        </div>
                    </nav>

                    <div className="main-content">
                        <div className="content-view">

                            <div className="card">
                            <div className="card-block">
                                    <div className="flexbox layout-column contact-view">
                                        <div className="flex scroll-y p-a-2">
                                            <div className="column-equal m-b-2">
                                                <div className="col" style={{width:"128px"}}>
                                                    <img id="currentPic" src={(this.state.users.length > 0 
                                                        && this.state.users[0].proPicPath !=="undefined"
                                                        && this.state.users[0].proPicPath !==null
                                                        && this.state.users[0].proPicPath !="")?Constants.BASE_URL_API+this.state.users[0].proPicPath:Constants.AVATAR_IMG_PATH} className="current-pic avatar avatar-lg img-circle" alt="" />
                                                    
                                                    <div className="text-xs-center m-t-vs">
                                                        <div className="fileUpload btn btn-primary upload-btn">
                                                            <span>Change Photo</span>
                                                            <input id="uploadProfileImage" name="file" type="file" className="upload" onChange={this.changeImage} />
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                                <div className="col v-align-middle p-l-2">
                                                <h1>
                                                    {this.state.users.length > 0 && this.state.users[0].name}
                                                </h1>
                                                <h3>{this.state.users.length > 0 && this.state.users[0].userType}</h3>
                                                <h5>{this.state.users.length > 0 && this.state.users[0].email}</h5>
                                                </div>
                                            </div>
                                    
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>

                             <div className="card">
                             <div className="sec-t-container m-b-2"><h4 className="card-title">Change Password</h4></div>
                                
                                <div className="card-block">
                                    <form action="javascript:void(0);" onSubmit={this.handleSubmit} id="modal_form">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <fieldset className="form-group">
                                                <label for="client_name">
                                                    Old Password:<span className="mandatory">*</span>
                                                </label>
                                                <input type="password" className="form-control form-control-md" name="oldPassword" onChange={this.handleChange} value={this.state.oldPassword} />
                                                <span className="err_msg">{this.state.errors.oldPassword}</span>
                                                </fieldset>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4">

                                                <fieldset className="form-group">

                                                <label for="client_name">
                                                    New Password:<span className="mandatory">*</span>
                                                </label>

                                                <input type="password" className="form-control form-control-md" name="newPassword" onChange={this.handleChange} value={this.state.newPassword} />
                                                <span className="err_msg">{this.state.errors.newPassword}</span>
                                                </fieldset>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4">

                                                <fieldset className="form-group">

                                                <label for="client_name">
                                                    Confirm New Password:<span className="mandatory">*</span>
                                                </label>

                                                <input type="password" className="form-control form-control-md" name="cnewPassword" onChange={this.handleChange} value={this.state.cnewPassword} />
                                                <span className="err_msg">{this.state.errors.cnewPassword}</span>
                                                </fieldset>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="dialog-btns">
                                                    <button className="btn btn-primary btn-md" type="submit" id="modal_submit_button">Save</button>
                                                </div>
                                                <span className="err_msg" id="resp-msg">{this.state.responseErrorMsg}</span>
                                                <span className="err_msg" style={{color:'green'}}>{this.state.responseSuccessMsg}</span>
                                            </div>
                                        </div>

                                    </form>
                                
                                </div>
                            </div>

                        </div>
                    </div>    
                </div>

            </Router>
        );
    }
}
export default Profile;