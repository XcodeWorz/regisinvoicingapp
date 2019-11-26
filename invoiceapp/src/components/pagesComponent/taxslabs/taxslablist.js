import React, { Component } from 'react';
import  Loader  from '../../../../public/assets/images/spinner.GIF';
import * as Constants from '../../../constants';
import Sidebar from '../../layoutsComponent/sidebar';
import Pagination from '../pagination';
import Modal from 'react-bootstrap-modal';

import {
    BrowserRouter as Router
} from 'react-router-dom';

class Taxslablist extends Component {
    constructor(props) {
    super(props);
    this.state = {
            result: {},
            name:'',
            percentage:'',
            showModal: false,
            errors:{},
            taxSlabId:'',
            operationType:''
        };
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
}
 
    componentDidMount() {
        this.makeList();
    }

    makeList()
    {
        fetch(Constants.BASE_URL_API+"gettaxslabs",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({taxSlabId:''})
        })
        .then(response => { return response.json(); } )
        .then(data => {
            this.setState({result: data.result});
        });
    }

    openModal() {
        this.setState(
            {
                showModal: true, 
                errors: {}, 
                operationType:'add',
                name:'', 
                percentage:''
                });
    }

    closeModal() {
        this.setState(
            {
                showModal: false,
                errors: {}, 
                operationType:'', 
                taxSlabId:'', 
                name:'', 
                percentage:'' 
            });
    }

    openEditModal(taxSlabId)
    {
        this.setState({
            showModal: true, 
            errors: {}, 
            taxSlabId:taxSlabId,
            operationType:'edit'
        },()=>{
            Promise.all([fetch(Constants.BASE_URL_API+"gettaxslabs",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams({taxSlabId:this.state.taxSlabId})
            })
            ])
            .then(([res1]) => { 
                return Promise.all([res1.json()]) 
            })
            .then(([res1]) => {
                    this.setState(
                                {
                                    taxSlabId:taxSlabId,
                                    name: res1.result[0].name,
                                    percentage: res1.result[0].percentage
                                    });
            });
        });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        
        document.getElementById("wait").style.display="block";

        var operationType = this.state.operationType;
        var apiname = "";
        if(operationType === "add")
        {
            apiname =   "inserttaxslab";
        }
        else if(operationType === "edit")
        {
            apiname =   "edittaxslab";   
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
                        this.closeModal();
                        this.makeList();
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
       
        if(this.state.percentage === "")
        {
            error_flag = true;
            errors["percentage"] = "Please enter percentage!";
            setTimeout(function(){
                this.setState({errors:{}});
           }.bind(this),Constants.WRNG_MSG_TIMEOUT);
        }
        if(this.state.percentage != "")
        {
            if(!this.isNumeric(this.state.percentage))
            {
                error_flag = true;
                errors["percentage"] = "Please enter valid percentage!";
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
                      <span className="tophead-txt">TaxSlab >> View List</span>
                      <span className="tophead-txt pull-right"></span>
                    </a>
                   </div>
                </nav>
                
                <div className="main-content">
                    <div className="content-view">
                        <div className="card">
                            <div className="sec-t-container m-b-2"><h4 className="card-title">TaxSlab List</h4>
                            <button className="btn btn-primary add-new" type="button" onClick={this.openModal.bind(this)}>
                                <i className="fa fa-plus-circle" aria-hidden="true"></i> Add New
                            </button>
                            </div>
                            <div className="card-block">
                                <div id="contactlist-wait" className="loader-login">
                                    <img src={Loader} width="64" height="64" />
                                </div>	
                                <div className="emp-meta">
                                    <table className="table table-bordered m-b-0">
                                        <thead>
                                            <tr>
                                                <th>Sl No</th>
                                                <th>Name</th>
                                                <th>Percentage</th>
                                                <th>Create Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody>
                                        {
                                            this.state.result.length > 0 && this.state.result.map(function(item,index) {
                                            return <tr>
                                                <td>{++index}</td>
                                            <td>
                                            {item.name}
                                            </td>
                                            <td>
                                            {item.percentage+'%'}
                                            </td>
                                            <td>
                                            {(new Date(item.createDate).getDate()) + "-" + (new Date(item.createDate).getMonth() + 1) + "-" + (new Date(item.createDate).getFullYear())}
                                            </td>
                                            <td>
                                            <b className="ed-del text-center">
                                            <a onClick={this.openEditModal.bind(this,item.taxSlabId)} href="javascript:void(0);"><i className="fa fa-pencil" aria-hidden="true"></i></a>
                                            </b>
                                            </td>
                                            </tr>;
                                            },this)
                                        }  
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <Pagination items={this.state.contacts} onChangePage={this.onChangePage} onChangePageNo={this.onChangePageNo}/>
                    </div>
                </div>
            </div>
       
        <Modal show={this.state.showModal} onHide={this.closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {this.state.operationType === "add" && "Add TaxSlab" }
                    {this.state.operationType === "edit" && "Edit TaxSlab" }
                    </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div id="wait" className="loader-login">
                    <img src={Loader} width="64" height="64" />
                </div>
                <form action="javascript:void(0);" onSubmit={this.handleSubmit} id="contact_form">
                    <fieldset className="form-group">
                        <label for="name">
                        Name<span className="mandatory">*</span>
                        </label>
                        <input type="text" className="form-control form-control-md" name="name" onChange={this.handleChange} value={this.state.name}/>
                            <span className="err_msg">{this.state.errors.name}</span>
                    </fieldset>
                    <fieldset className="form-group">
                        <label for="email">
                        Percentage(%)<span className="mandatory">*</span>
                        </label>
                        <input type="text" className="form-control form-control-md" name="percentage" onChange={this.handleChange} value={this.state.percentage}/>
                        <span className="err_msg">{this.state.errors.percentage}</span>
                    </fieldset>
                    <button className="btn btn-primary btn-md" type="submit" id="contact_submit">
                        Save
                    </button>
                    <span className="err_msg" id="resp-msg"></span>
                </form>
                <span className="err_msg" id="resp-msg"></span>
            </Modal.Body>
        </Modal>
    </Router>
    );
  }
}
export default Taxslablist;
