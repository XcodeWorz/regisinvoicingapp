import React, { Component } from 'react';
import * as Constants from '../../../constants';
import Sidebar from '../../layoutsComponent/sidebar';
import "../../../../public/assets/js/vfs_fonts.js";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ReactExport from "react-export-excel";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
import SpinnerLoader from 'react-loader-spinner';

import {
    BrowserRouter as Router
} from 'react-router-dom';

class Downloadexcelpayments extends Component {
    constructor(props) {
    super(props);
    this.isInvoice = (this.props.location.pathname === Constants.LIST_INVOICE_DOWNLOAD_EXCEL_PAYMENT_PATH)?true:false;
    this.state = {
            searchFilter:'',
            searchFilterStatus:'',
            searchFilterFromDate:'',
            searchFilterToDate:'',
            payments:{},
            errors:[],
            totalAmount:0,
            type:this.isInvoice?Constants.PAY_TYPE_REC:"",
            expenses:[]
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSearchStatus = this.handleSearchStatus.bind(this);
        this.handleSearchFromDate = this.handleSearchFromDate.bind(this);
        this.handleSearchToDate = this.handleSearchToDate.bind(this);
        this.search = this.search.bind(this);
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
        let api = "getpaymentreceived";
        Promise.all([
            fetch(Constants.BASE_URL_API+api,
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
                this.setState(
                    {
                        payments: res1.payments,
                        totalAmount:res1.totalAmount
                    });
                this.operateSpinnerLoader("close");
        });
      
    }

    search()
    {
        var error_flag = false;
        let errors = {};
        if (this.state.searchFilter === "" &&
            this.state.searchFilterStatus==="" &&
            this.state.searchFilterFromDate==="" &&
            this.state.searchFilterToDate===""
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
            this.makeList();
        }
    }
    
    async handleSearch(e) {
        await this.setState({searchFilter:e.target.value});
    }
   
    async handleSearchStatus(e) {
        await this.setState({searchFilterStatus:e.target.value});
    }
    
    async handleSearchFromDate(e) {
        await this.setState({searchFilterFromDate:e});
    }
    
    async handleSearchToDate(e) {
        await this.setState({searchFilterToDate:e});
    }
    
    clearFilter()
    {
        this.setState({
            searchFilter:'',
            searchFilterStatus:'',
            searchFilterFromDate:'',
            searchFilterToDate:''
            },()=>{
                this.makeList();
            });
    }
   
    render() {
    let excelArray  =   [];
    this.state.payments && this.state.payments!=="undefined" && this.state.payments !==null &&
    this.state.payments.length > 0 && this.state.payments.map((invoiceExcel, idx) => {
        let objExcel = {};
        let invoiceNo = "";
        if(this.isInvoice)
        {
            invoiceNo = invoiceExcel.invoiceNo;
        } 
        if(!this.isInvoice && invoiceExcel.isExpense === "Y")
        {
            invoiceNo = invoiceExcel.invoiceNo;
        }
        if(!this.isInvoice && invoiceExcel.isExpense === "N")
        {
            invoiceNo = invoiceExcel.paymentInvoiceNo;
        }
       
        if(this.isInvoice)
        {
            objExcel = {
                slNo:idx+1,
                paymentDate:(new Date(invoiceExcel.paymentDate).getDate()) + "-" + (new Date(invoiceExcel.paymentDate).getMonth() + 1) + "-" + (new Date(invoiceExcel.paymentDate).getFullYear()),
                paymentNumber:invoiceExcel.paymentNo,
                paymentStatus:invoiceExcel.paymentStatus,
                customerEmail:invoiceExcel.email,
                companyName:invoiceExcel.contactCompanyName,
                placeOfSupply:(invoiceExcel.contactPlaceOfSupply)?invoiceExcel.contactPlaceOfSupply:'N/A',
                gstin:(invoiceExcel.contactGSTIN)?invoiceExcel.contactGSTIN:'N/A',
                currency:(invoiceExcel.currency)?invoiceExcel.currency:'N/A',
                invoiceNumber:(invoiceNo!=="")?invoiceNo:'N/A',
                amountReceived:(invoiceExcel.amountReceived)?invoiceExcel.amountReceived.toFixed(2):"0.00",
                taxAmount:(invoiceExcel.taxAmount)?invoiceExcel.taxAmount.toFixed(2):"0.00",
                };
                excelArray.push(objExcel);
        }
    });
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
                    <span className="tophead-txt">{this.isInvoice?"Payments Received":""} >> Download Excel</span>
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
                                    <b>Search:</b>
                                    <fieldset className="form-group">
                                    <input className="form-control input-sm" id="search_data" value="" onChange={this.handleSearch} value={this.state.searchFilter}/>
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
                            <span id="error_msg" className="err_msg">{this.state.errors.search}</span>
                            </div>
                        </div>
                        
                        <div className="card">
                            <div className="sec-t-container m-b-2"><h4 className="card-title">{this.isInvoice?"Payments Received":""} List - 
                                &nbsp;<i className="fa fa-inr" aria-hidden="true"></i>
                                {
                                    (this.state.totalAmount && this.state.totalAmount!=="undefined" && this.state.totalAmount !==null && this.state.totalAmount!=="")
                                    ?
                                        parseFloat(this.state.totalAmount).toFixed(2)
                                    :
                                        "0.00"
                                }
                            </h4>
                           
                                <ExcelFile element={<button className="btn btn-primary add-new" type="button">Download Excel</button>}>
                                    <ExcelSheet data={excelArray} name="Payment Received Report">
                                        <ExcelColumn label="Sl No" value="slNo"/>
                                        <ExcelColumn label="Payment Date" value="paymentDate"/>
                                        <ExcelColumn label="Payment Number" value="paymentNumber"/>
                                        <ExcelColumn label="Payment Status" value="paymentStatus"/>
                                        <ExcelColumn label="Amount Received" value="amountReceived"/>
                                        <ExcelColumn label="Tax Amount" value="taxAmount"/>
                                        <ExcelColumn label="Invoice Number" value="invoiceNumber"/>
                                        <ExcelColumn label="Company Name" value="companyName"/>
                                        <ExcelColumn label="Place Of Supply" value="placeOfSupply"/>
                                        <ExcelColumn label="GSTIN" value="gstin"/>
                                        <ExcelColumn label="Currency" value="currency"/>
                                    </ExcelSheet>
                                </ExcelFile>
                                   
                            </div>
                            <div className="card-block">
                                <div id="spinnerLoaderDiv" className="react-spinner">
                                    <SpinnerLoader type={Constants.LOADER_TYPE} color={Constants.LOADER_COLOR} height={50} width={50} />
                                </div>
                                <div className="" id="bodyDiv">
                                    <table className="table table-bordered m-b-0">
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
                                            this.state.payments && this.state.payments!=="undefined" && this.state.payments !==null &&
                                            this.state.payments.length > 0 && this.state.payments.map(function(item,index) {
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
                                            <td>{++index}</td>
                                            <td>
                                                {
                                                    this.isInvoice &&
                                                    <span>
                                                        <b>No:</b>
                                                        <span style={{fontSize:15}}><a href={(this.isInvoice?"/paymentreceived/":"#")+item.paymentId}>{(item.paymentNo)?item.paymentNo:'N/A'}</a></span>
                                                        <br/>
                                                    </span>
                                                }
                                                <b>Date:</b>{(new Date(item.paymentDate).getDate()) + "-" + (new Date(item.paymentDate).getMonth() + 1) + "-" + (new Date(item.paymentDate).getFullYear())}
                                            </td>
                                            <td><a href={(this.isInvoice?"/customerdetails/":"")+item.contactId}><span style={{fontSize:15}}>{(item.displayName)?item.displayName:'N/A'}</span></a></td>
                                            <td>
                                                {
                                                    this.isInvoice &&
                                                    <a href={(this.isInvoice?"/invoicedetails/":"")+item.invoiceId}><span style={{fontSize:15}}>{(item.invoiceNo)?item.invoiceNo:'N/A'}</span></a>
                                                }
                                            </td>
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
                    </div>
                </div>
            </div>
        </Router>
    );
  }
}
export default Downloadexcelpayments;
