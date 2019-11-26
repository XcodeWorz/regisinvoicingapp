import React, { Component } from 'react';
import * as Constants from '../../../constants';
import Sidebar from '../../layoutsComponent/sidebar';
import Pagination from '../pagination';
import Modal from 'react-bootstrap-modal';
import Dropdown from '../uielements/dropdown';
import SpinnerLoader from 'react-loader-spinner';

import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

class Contactlist extends Component {
    constructor(props) {
    super(props);
    this.state = {
            userType:Constants.USER_TYPE_CUSTOMER,
            salutation: '',
            firstName: '',
            lastName: '',
            companyName: '',
            displayName:'',
            email:'',
            phoneNo:'',
            website:'',
            //address:'',
            gstNo:'',
            placeOfSupply:'',
            isTaxable:'',
            currency:'',
            pageNo:1,
            pageOfItems: [],
            searchFilter:'',
            searchFilterStatus:'',
            totalCount:0,
            errors:{},

            modalMsg:"",
            modalContactId:'',
            modalStatus:'',
            showModal:false,
            showModalDelete:false,

        };
        
        this.onChangePage = this.onChangePage.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.search = this.search.bind(this);
        this.onDropDownItemClick = this.onDropDownItemClick.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.statusOperate = this.statusOperate.bind(this);
        this.handleSearchStatus = this.handleSearchStatus.bind(this);

        this.closeModalDelete = this.closeModalDelete.bind(this);
        this.deleteContactOperate = this.deleteContactOperate.bind(this);
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
                this.props.history.push("/editcontact/"+item.contactId);
                break;
            case 1: //STATUS CHANGE
                this.statusContact(item.contactId,item.status);
                break;
            case 2: //DELETE 
                this.deleteContact(item.contactId);
                break;
        }
    }

    closeModal()
    {
        this.setState({
            modalMsg:"",
            modalContactId:"",
            modalStatus:"",
            showModal:false,
        });
    }
    closeModalDelete()
    {
        this.setState({
            modalContactId:"",
            showModalDelete:false,
        });
    }

    statusOperate()
    {
        fetch(Constants.BASE_URL_API+"changecontactstatus",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({contactId:this.state.modalContactId,status:this.state.modalStatus})
        })
        .then(response => { return response.json(); } )
        .then(data => {
           this.makeList();
           this.closeModal();
        });
    }

    statusContact(id,status)
    {
        let msg = "";
        let newstatus = "";
        if(status === Constants.ACTIVE_STATUS)
        {
            msg = "Are you sure you want to inactivate this customer.";
            newstatus = Constants.INACTIVE_STATUS;
        }
        else
        {
            msg = "Are you sure you want to activate this customer.";
            newstatus = Constants.ACTIVE_STATUS;
        }
        this.setState({
            modalContactId:id,
            modalMsg:msg,
            modalStatus:newstatus,
            showModal:true,
        });
    }

    deleteContact(id)
    {
        this.setState({
            modalContactId:id,
            showModalDelete:true,
        });
    }

    deleteContactOperate()
    {
        fetch(Constants.BASE_URL_API+"deletecustomer",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({contactId:this.state.modalContactId,type:this.state.userType})
        })
        .then(response => { return response.json(); } )
        .then(data => {
           this.makeList();
           this.closeModalDelete();
        });
    }

    makeList()
    {
        fetch(Constants.BASE_URL_API+"getcontacts",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams(this.state)
        })
        .then(response => { return response.json(); } )
        .then(data => {
            this.setState(
                {
                    pageOfItems: data.contacts,
                    totalCount:data.totalCount,
                });
            this.operateSpinnerLoader("close");
        });
    }
    
    async handleSearch(e) {
        await this.setState({searchFilter:e.target.value});
    }

    async handleSearchStatus(e) {
        await this.setState({searchFilterStatus:e.target.value});
    }
    
    async onChangePage(page) {
        if(page != this.state.pageNo){
            this.setState({
                pageNo:page
            },()=>{
                fetch(Constants.BASE_URL_API+"getcontacts",
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
                        pageOfItems:data.contacts,
                        totalCount:data.totalCount
                    });
                });
            });
        }
        
    }

    clearFilter()
    {
        this.setState({
            searchFilter:'',
            searchFilterStatus:'',
            pageNo:1
            },()=>{
                this.makeList();
            });
        
   }

   search()
   {
        var error_flag = false;
        let errors = {};
        if (this.state.searchFilter === "" && this.state.searchFilterStatus === "")
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
                      <span className="tophead-txt">Contacts >> View List</span>
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
                                        <input placeholder="FirstName/CompanyName/DisplayName/Email/PhoneNo/GSTNO/Website/PlaceOfSupply" className="srh-fld" id="search_data" value="" onChange={this.handleSearch} value={this.state.searchFilter}/>
                                        </fieldset>
                                    </div>

                                    <div className="col-lg-3">
                                        <b>Status</b>
                                        <select className="form-control" name="search_status" onChange={this.handleSearchStatus} value={this.state.searchFilterStatus}>
                                            <option value="">--select status--</option>
                                            <option value={Constants.ACTIVE_STATUS}>{Constants.ACTIVE_STATUS}</option>
                                            <option value={Constants.INACTIVE_STATUS}>{Constants.INACTIVE_STATUS}</option>
                                        </select>
                                    </div>
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
                        <div className="card">
                            <div className="sec-t-container m-b-2"><h4 className="card-title">Contacts List</h4>
                            <a className="btn btn-primary add-new" href="/addcontact">
                                <i className="fa fa-plus-circle" aria-hidden="true"></i> Add New
                            </a>
                            </div>
                            <div className="card-block">
                                <div id="spinnerLoaderDiv" className="react-spinner">
                                    <SpinnerLoader type={Constants.LOADER_TYPE} color={Constants.LOADER_COLOR} height={50} width={50} />
                                </div>
                                <div className="" id="bodyDiv">
                                    <table className="table m-b-0">
                                        <thead>
                                            <tr>
                                                <th>Sl No</th>
                                                <th>Name</th>
                                                <th>Contact</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody>
                                        {
                                            this.state.pageOfItems && this.state.pageOfItems!=="undefined" && this.state.pageOfItems !==null &&
                                            this.state.pageOfItems.length > 0 && this.state.pageOfItems.map(function(item,index) {
                                            let itemsObj = [];
                                            let itemsIconsObj = [];
                                            if(item.status === Constants.ACTIVE_STATUS)
                                            {
                                                itemsObj = [Constants.LISTING_EDIT, Constants.LISTING_INACTIVE];
                                                itemsIconsObj = [Constants.LISTING_EDIT_ICON, Constants.LISTING_INACTIVE_ICON];
                                               
                                            }
                                            else if(item.status === Constants.INACTIVE_STATUS)
                                            {
                                                itemsObj = [Constants.LISTING_EDIT, Constants.LISTING_ACTIVE];
                                                itemsIconsObj = [Constants.LISTING_EDIT_ICON, Constants.LISTING_ACTIVE_ICON];
                                            }
                                            return <tr>
                                            <td>{((this.state.pageNo-1)*Constants.RESULT_SET_SIZE)+(++index)}</td>
                                            <td>
                                                <b><a className="row-header" href={"/customerdetails/"+item.contactId}>{(item.displayName)?item.displayName:'N/A'}</a></b><br/>
                                            </td>
                                            <td>
                                            {(item.firstName)?(item.salutation+" "+item.firstName+" "+item.lastName):'N/A'}<br/>
                                            <b>Email: </b>{(item.email)?item.email:'N/A'}<br/>
                                            <b>Phone No: </b>{(item.phoneNo)?item.phoneNo:'N/A'}<br/>
                                            </td>
                                            <td>
                                                {
                                                    (item.status === Constants.ACTIVE_STATUS)
                                                    ?
                                                    <span className="status-span-active">{item.status}</span>
                                                    :
                                                    <span className="status-span-inactive">{item.status}</span>
                                                }
                                                <br/><br/>
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
            <Modal show={this.state.showModal} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="wr-msg">{this.state.modalMsg}</div>
                    <div className="text-center">
                        <button className="btn btn-info btn-md" type="button" onClick={this.closeModal}>No</button>
                        <button className="btn btn-primary btn-md" type="button" id="modal_button" onClick={this.statusOperate}>Yes</button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={this.state.showModalDelete} onHide={this.closeModalDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="wr-msg">Are you sure you want to delete this {this.state.userType.toLowerCase()}?</div>
                    <div className="text-center">
                        <button className="btn btn-info btn-md" type="button" onClick={this.closeModalDelete}>No</button>
                        <button className="btn btn-primary btn-md" type="button" id="modal_button" onClick={this.deleteContactOperate}>Yes</button>
                    </div>
                </Modal.Body>
            </Modal>
        </Router>
    );
  }
}
export default Contactlist;
