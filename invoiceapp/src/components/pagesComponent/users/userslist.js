import React, { Component } from 'react';
import  Loader  from '../../../../public/assets/images/spinner.GIF';
import * as Constants from '../../../constants';
import Sidebar from '../../layoutsComponent/sidebar';
import Pagination from '../pagination';
import Modal from 'react-bootstrap-modal';
import Dropdown from '../uielements/dropdown';
import SpinnerLoader from 'react-loader-spinner';

import {
    BrowserRouter as Router
} from 'react-router-dom';

const itemsObj = [Constants.LISTING_EDIT,Constants.LISTING_RESET_PASSWORD];
const itemsIconsObj = [Constants.LISTING_EDIT_ICON,Constants.LISTING_CONVERT_ICON];

class Userslist extends Component {
    constructor(props) {
    super(props);
    this.state = {
            name:'',
            email:'',
            phoneNo:'',
            pageNo:'',
            pageOfItems: [],
            pageNo:1,
            searchFilter:'',
            modalerrors:{},
            passwordUserId:'',
            password:'',
            confirmpassword:'',
            errors:{}
        };
        
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitPassword = this.handleSubmitPassword.bind(this);
    this.search = this.search.bind(this);
    this.onDropDownItemClick = this.onDropDownItemClick.bind(this);
    
}

operateSpinnerLoader(val)
{
    let spinnerDiv = document.getElementById("spinnerLoaderDiv");
    let bodyDiv = document.getElementById("bodyDiv");
    if(val === "open")
    {
        if(bodyDiv)
        {
            bodyDiv.style.display="none";
        }
        if(spinnerDiv)
        {
            spinnerDiv.style.display="block";
        }
    }
    else if(val === "close")
    {
        if(spinnerDiv)
        {
            spinnerDiv.style.display="none";
        }
        if(bodyDiv)
        {
            bodyDiv.style.display="block";
        }
    }
}

componentDidMount() {
    this.operateSpinnerLoader("open");
    this.makeList();
}

onDropDownItemClick(item, index){
    switch(index){
        case 0://EDIT
            this.props.history.push("/edituser/"+item.userId);
            break;
        case 1: //RESET PASSWORD
            this.resetPassword(item.userId);
            break;
    }
}

makeList()
{
    fetch(Constants.BASE_URL_API+"getUsers",
    {
        method: "POST",
        mode:'cors',
        body: new URLSearchParams(this.state)
    })
    .then(response => { return response.json(); } )
    .then(data => {
        this.setState({
            pageOfItems: (data.users && data.users !=="undefined" && data.users !==null)?data.users:null,
            totalCount:(data.totalCount && data.totalCount !=="undefined" && data.totalCount !==null)?data.totalCount:0
        });
        this.operateSpinnerLoader("close");
      });
}

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    
    handleSubmitPassword(e) {
        e.preventDefault();
        document.getElementById("wait").style.display="block";
        if(!this.validateForm())
        {
           document.getElementById("modal_button").disabled;
           
            fetch(Constants.BASE_URL_API+"resetpassword",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams({userId:this.state.passwordUserId,password:this.state.password})
            })
            .then(response => { return response.json(); } )
            .then(data =>
                {
                   this.close();
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
        let modalerrors = {};
        if(this.state.password === "")
        {
            error_flag = true;
            modalerrors['password'] = "Please enter password!";
            setTimeout(function(){
                this.setState({modalerrors:{}});
           }.bind(this),Constants.WRNG_MSG_TIMEOUT);
        }
        if(this.state.confirmpassword === "")
        {
            error_flag = true;
            modalerrors['confirmpassword'] = "Please enter confirm password!";
            setTimeout(function(){
                this.setState({modalerrors:{}});
           }.bind(this),Constants.WRNG_MSG_TIMEOUT);
        }
        if(this.state.confirmpassword != this.state.password )
        {
            error_flag = true;
            modalerrors['confirmpassword'] = "Please enter password same as above!";
            setTimeout(function(){
                this.setState({modalerrors:{}});
           }.bind(this),Constants.WRNG_MSG_TIMEOUT);
        }
        
        this.setState({
        modalerrors: modalerrors
      });
        return error_flag;
    }
    
    open()
    {
          this.setState({ showModal: true, modalerrors:{} });
    }
  
    close()
    {
          this.setState({ showModal: false , modalerrors:{} });
    }

    async resetPassword(userId)
    {
         this.open();
         await this.setState({passwordUserId:userId});
         
    }

    async onChangePage(page) {
        if(page != this.state.pageNo){
            this.setState({
                pageNo:page
            },()=>{
                fetch(Constants.BASE_URL_API+"getUsers",
                {
                    method: "POST",
                    mode:'cors',
                    body: new URLSearchParams(
                        this.state
                    )
                })
                .then(response => { return response.json(); } )
                .then(data =>
                {
                    this.setState({
                        pageNo:page,
                        pageOfItems: (data.users && data.users !=="undefined" && data.users !==null)?data.users:null,
                        totalCount:(data.totalCount && data.totalCount !=="undefined" && data.totalCount !==null)?data.totalCount:0
                    });
                });
            });
        }
        
    }
 
   
    async handleSearch(e) {
        await this.setState({searchFilter:e.target.value});
    }
    
    search()
    {
        var error_flag = false;
        let errors = {};
        if (this.state.searchFilter === ""
        )
        {
            error_flag = true;
            errors['search'] = "Please select atleast one filter!";
            setTimeout(function(){
                this.setState({errors:{}});
           }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
        }
        if (error_flag) {
            this.setState({
                errors: errors
            });
            return error_flag;
        }
        else {
            this.setState({pageNo:1},()=>{
                this.makeList();
            });
        }
    }
    
    clearFilter()
   {
        this.setState({
            searchFilter:'',
            pageNo:1
            },()=>{
                this.makeList();
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
                      <span className="tophead-txt">Users >> View List</span>
                      <span className="tophead-txt pull-right"></span>
                    </a>
                   </div>
                </nav>
                
                 <div className="main-content">
        <div className="content-view">
            
        <div className="card">
        <div className="sec-t-container m-b-2"><h4 className="card-title">Search Filters</h4></div>
        <div className="card-block">
       
        <div className="row">
            <div className="col-lg-3">
                <b>Search</b>
                <fieldset className="form-group">
                <input placeholder = "Name/Email/Phone No" className="srh-fld" id="search_data" value="" onChange={this.handleSearch} value={this.state.searchFilter}/>
                </fieldset>
            </div>
            
            <div className="row">
                <div className="col-lg-3" style={{float:'right'}}>
                    <b>&nbsp;</b>
                    <div className="srch-fltr-btns">
                        <button type="button" className="btn btn-primary" onClick={this.search.bind(this)}><i className="fa fa-search" aria-hidden="true"></i> <span className="filterText">Search</span></button>
                        <button type="button" className="btn btn-cncl" onClick={this.clearFilter.bind(this)}><i className="fa fa-times-circle-o" aria-hidden="true"></i><span className="filterText">&nbsp;Clear</span></button>
                    </div>
                </div>
            </div>
            <span id="error_msg" className="err_msg">{this.state.errors.search}</span>
        
        </div>
        
        </div>
        </div>
            
        <div className="card">
            <div className="sec-t-container m-b-2"><h4 className="card-title">Users List</h4></div>
            <div className="card-block">
                <div id="spinnerLoaderDiv" className="react-spinner">
                    <SpinnerLoader type={Constants.LOADER_TYPE} color={Constants.LOADER_COLOR} height={50} width={50} />
                </div>	
                <div className="" id="bodyDiv">
                    <table className="table m-b-0">
                        <thead>
                            <tr>
                                <th>Sl No</th>
                                <th>Users Details</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                           {
                               this.state.pageOfItems && this.state.pageOfItems !=="undefined" && this.state.pageOfItems !==null && 
                                this.state.pageOfItems.length > 0 && this.state.pageOfItems.map(function(item,index) {
                                return <tr>
                                <td>{((this.state.pageNo-1)*Constants.RESULT_SET_SIZE)+(++index)}</td>
                                <td>
                                <b>{item.name}</b><br/>
                                <b>Email: </b>{(item.email)?item.email:'N/A'}<br/>
                                <b>Phone No: </b>{(item.phoneNo)?item.phoneNo:'N/A'}<br/>
                                </td>
                                <td>{item.status}<br/>
                                <b>Create Date:</b>
                                {(new Date(item.createDate).getDate()) + "-" + (new Date(item.createDate).getMonth() + 1) + "-" + (new Date(item.createDate).getFullYear())}
                                </td>
                                <td>
                                    <Dropdown 
                                        items={itemsObj} 
                                        itemsIconsObj = {itemsIconsObj}
                                        selectedItem = {item}
                                        onDropDownItemClick = {this.onDropDownItemClick} 
                                    />
                                </td>
                                </tr>;
                            },this)
                        }  
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
            <Pagination 
                        totalLength ={this.state.totalCount} 
                        items={this.state.pageOfItems} 
                        onChangePage={this.onChangePage} 
                        currentPageNo = {this.state.pageNo} />
        </div>
     </div>
    </div>
       
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
           <Modal.Title>Reset Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div id="wait" className="loader-login">
                <img src={Loader} width="64" height="64" />
            </div>	
           <form action="javascript:void(0);" onSubmit={this.handleSubmitPassword} id="modal_form_reason">
             <fieldset className="form-group">
                <label for="password">
                Password<span className="mandatory">*</span>
                </label>
                <input type="password" className="form-control form-control-md" name="password" onChange={this.handleChange} value={this.state.password} />
                 <span className="err_msg">{this.state.modalerrors.password}</span>
            </fieldset>
            
             <fieldset className="form-group">
                <label for="confirmpassword">
                Confirm Password<span className="mandatory">*</span>
                </label>
                <input type="password" className="form-control form-control-md" name="confirmpassword" onChange={this.handleChange} value={this.state.confirmpassword} />
                 <span className="err_msg">{this.state.modalerrors.confirmpassword}</span>
            </fieldset>
           <button className="btn btn-info btn-md" type="button" onClick={this.close}>Close</button>
           <button className="btn btn-primary btn-md" type="submit" id="modal_button">Save</button>
           </form>
          </Modal.Body>
         
        </Modal>
        
        </Router>
    );
  }
}
export default Userslist;
