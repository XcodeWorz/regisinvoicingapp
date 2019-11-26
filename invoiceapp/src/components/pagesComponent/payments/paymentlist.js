import React, { Component } from 'react';
import * as Constants from '../../../constants';
import Sidebar from '../../layoutsComponent/sidebar';
import Pagination from '../pagination';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import SpinnerLoader from 'react-loader-spinner';

import {
    BrowserRouter as Router
} from 'react-router-dom';
import ReactSelectDropdown from 'react-select';

class Paymentlist extends Component {
    constructor(props) {
        super(props);

        //Check URL Path is /invoicelist 
        this.isInvoice = (this.props.location.pathname === Constants.LISTPAYRECEIVED_INVOICE_PATH)?true:false;

        this.state = {
            pageNo:1,
            pageOfItems: [],
            totalCount:0,
            totalAmount:0,
            errors:{},
            searchFilterFromDate:'',
            searchFilterToDate:'',
            searchFilterStatus:'',
            searchFilter:'',
            type:this.isInvoice?Constants.PAY_TYPE_REC:""
        };
            
        this.onChangePage = this.onChangePage.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.search = this.search.bind(this);
        this.handleSearchFromDate = this.handleSearchFromDate.bind(this);
        this.handleSearchToDate = this.handleSearchToDate.bind(this);
        this.handleSearchStatus = this.handleSearchStatus.bind(this);
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

    makeList()
    {
        Promise.all([
            fetch(Constants.BASE_URL_API+"getpaymentreceived",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams(this.state)
            })
            ])
            .then(([res1]) => { 
                    return Promise.all([res1.json()]) 
            })
            .then(([res1]) => {
                
                this.setState({
                    pageOfItems: res1.payments,
                    totalCount:res1.totalCount,
                    totalAmount:res1.totalAmount
                });
                this.operateSpinnerLoader("close");
            });
    }
    
    async handleSearch(e) {
        await this.setState({searchFilter:e.target.value});
    }

    
    async handleSearchFromDate(e) {
        await this.setState({searchFilterFromDate:e});
    }
    
    async handleSearchToDate(e) {
        await this.setState({searchFilterToDate:e});
    }

    async handleSearchStatus(e) {
        await this.setState({searchFilterStatus:e.target.value});
    }
    
    async onChangePage(page) {
        if(page != this.state.pageNo){
            this.setState({
                pageNo:page
            },()=>{
                fetch(Constants.BASE_URL_API+"getpaymentreceived",
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
                        pageOfItems:data.payments,
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
            searchFilterFromDate:'',
            searchFilterToDate:'',
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
        
        if (this.state.searchFilter === "" &&
            this.state.searchFilterStatus==="" &&
            this.state.searchFilterFromDate === "" &&
            this.state.searchFilterToDate === ""
        )
        {
            error_flag = true;
            errors['search'] = "Please select atleast one filter!";
            setTimeout(function(){
                this.setState({errors:{}});
            }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
        }
        if(error_flag) {
            this.setState({
                errors: errors
            });
            return error_flag;
        }
        else{
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
                      <span className="tophead-txt">Payment { this.isInvoice?"Received":"" } >> View List</span>
                      <span className="tophead-txt pull-right"></span>
                    </a>
                   </div>
                </nav>
                
                <div className="main-content">
                    <div className="content-view">
                        <div className="card">
                            <div className="sec-t-container m-b-2"><h4 className="card-title">Search Filters</h4></div>
                            <div className="card-block">
                                <span>
                                    <div className="row">
                                        <div className="col-lg-3">
                                            <b>Search</b>
                                            <fieldset className="form-group">
                                            <input placeholder="PaymentNo/InvoiceNo/CustomerName" className="srh-fld" id="search_data" value="" onChange={this.handleSearch} value={this.state.searchFilter}/>
                                            </fieldset>
                                        </div>
                                        <div className="col-lg-3">
                                            <b>Status:</b>
                                            <select className="form-control" name="search_status" onChange={this.handleSearchStatus} value={this.state.searchFilterStatus}>
                                                <option value="">--select status--</option>
                                                <option value={Constants.PAYMENT_STATUS_SUCCESS}>{Constants.PAYMENT_STATUS_SUCCESS}</option>
                                                <option value={Constants.PAYMENT_STATUS_VOID}>{Constants.PAYMENT_STATUS_VOID}</option>
                                            </select>
                                        </div>
                                        <div className="col-lg-3">
                                            <b>From Date:</b>
                                                <DatePicker
                                                    name="searchFromDate"
                                                    selected={this.state.searchFilterFromDate}
                                                    onChange={this.handleSearchFromDate}
                                                    dateFormat = "dd-MM-yyyy"
                                                />
                                        </div>
                                        <div className="col-lg-3">
                                            <b>To Date:</b>
                                            <DatePicker
                                                name="searchToDate"
                                                selected={this.state.searchFilterToDate}
                                                onChange={this.handleSearchToDate}
                                                dateFormat = "dd-MM-yyyy"
                                            />
                                        </div>
                                        <div className="col-lg-3" style={{float:'right'}}>
                                            <b>&nbsp;</b>
                                            <div className="srch-fltr-btns">
                                                <button type="button" className="btn btn-primary" onClick={this.search.bind(this)}><i className="fa fa-search" aria-hidden="true"></i> <span className="filterText">Search</span></button>
                                                <button type="button" className="btn btn-cncl" onClick={this.clearFilter.bind(this)}><i className="fa fa-times-circle-o" aria-hidden="true"></i><span className="filterText">&nbsp;Clear</span></button>
                                            </div>
                                        </div>
                                    </div>
                                </span>
                               
                            <span id="error_msg" className="err_msg">{this.state.errors.search}</span>
                            </div>
                        </div>
                        <div className="card">
                            <div className="sec-t-container m-b-2"><h4 className="card-title">Payment { this.isInvoice?"Received":"" } List - 
                                &nbsp;<i className="fa fa-inr" aria-hidden="true"></i>
                                {
                                    (this.state.totalAmount && this.state.totalAmount!=="undefined" && this.state.totalAmount !==null && this.state.totalAmount!=="")
                                    ?
                                        parseFloat(this.state.totalAmount).toFixed(2)
                                    :
                                        "0.00"
                                }
                            </h4>
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
                                                <th>Payment</th>
                                                <th>Customer</th>
                                                <th>{(this.isInvoice)?"Invoice":""} No</th>
                                                <th>Status</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody>
                                        {
                                            this.state.pageOfItems && this.state.pageOfItems!=="undefined" && this.state.pageOfItems !==null &&
                                            this.state.pageOfItems.length > 0 && this.state.pageOfItems.map(function(item,index) {
                                            
                                            let amountReceived = 0;
                                            let taxAmount = 0;
                                            if(item.amountReceived && item.amountReceived !=="undefined" && item.amountReceived!==null)
                                            {
                                                amountReceived = parseFloat(item.amountReceived);
                                            }
                                            if(item.isTaxDeducted === "Y")
                                            {
                                                if(item.taxAmount && item.taxAmount !=="undefined" && item.taxAmount!==null)
                                                {
                                                    taxAmount = parseFloat(item.taxAmount);
                                                }
                                            }
                                            return <tr>
                                            <td>{((this.state.pageNo-1)*Constants.RESULT_SET_SIZE)+(++index)}</td>
                                            <td>
                                                <b>No:</b>
                                                <span style={{fontSize:15}}><a href={(this.isInvoice?"/paymentreceived/":"#")+item.paymentId}>{(item.paymentNo)?item.paymentNo:'N/A'}</a></span>
                                                <br/>
                                                <b>Date:</b>{(new Date(item.paymentDate).getDate()) + "-" + (new Date(item.paymentDate).getMonth() + 1) + "-" + (new Date(item.paymentDate).getFullYear())}
                                            </td>
                                            <td><a href={(this.isInvoice?"/customerdetails/":"#")+item.contactId}><span style={{fontSize:15}}>{(item.displayName)?item.displayName:'N/A'}</span></a></td>
                                            <td><a href={(this.isInvoice?"/invoicedetails/":"#")+item.invoiceId}><span style={{fontSize:15}}>{(item.invoiceNo)?item.invoiceNo:'N/A'}</span></a></td>
                                            <td>{item.paymentStatus}</td>
                                            <td>
                                                <b>Amount Paid:</b>
                                                &nbsp;<i className="fa fa-inr" aria-hidden="true"></i>
                                                {amountReceived.toFixed(2)}
                                                <br/>
                                                {
                                                    item.isTaxDeducted === "Y" &&
                                                    <span>
                                                        <b>Tax Amount:</b>
                                                        &nbsp;<i className="fa fa-inr" aria-hidden="true"></i>
                                                        {taxAmount.toFixed(2)}
                                                    </span>
                                                }
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
        </Router>
    );
  }
}
export default Paymentlist;
