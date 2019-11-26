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

class Downloadexcelinvoice extends Component {
    constructor(props) {
    super(props);
    this.isInvoice = (this.props.location.pathname === Constants.LIST_INVOICE_DOWNLOAD_EXCEL_PATH)?true:false;
    this.state = {
            pageNo:'',
            searchFilter:'',
            searchFilterStatus:'',
            searchFilterFromDate:'',
            searchFilterToDate:'',
            totalInvoice:{},
            invoices:{},
            errors:[],
            type:(this.isInvoice)?"invoice":"",
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
        Promise.all([fetch(Constants.BASE_URL_API+"getinvoicetotal",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({contactId:''})
        }), fetch(Constants.BASE_URL_API+"getinvoicesold",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams(this.state)
        })])
    
        .then(([res1, res2]) => { 
            return Promise.all([res1.json(), res2.json()]) 
        })
        .then(([res1, res2]) => {
        
            this.setState({totalInvoice:res1.responseResult, invoices: res2.invoices});
            console.log("RESULT"+JSON.stringify(this.state.totalInvoice));
            this.operateSpinnerLoader("close");
        });
    }

    makeInvoiceList()
    {
        Promise.all([fetch(Constants.BASE_URL_API+"getinvoicetotal",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({contactId:''})
        }), fetch(Constants.BASE_URL_API+"getinvoicesold",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams(this.state)
        })])
    
        .then(([res1, res2]) => { 
            return Promise.all([res1.json(), res2.json()]) 
        })
        .then(([res1, res2]) => {
        
            this.setState({totalInvoice:res1.responseResult, invoices: res2.invoices});
            console.log("RESULT"+JSON.stringify(this.state.totalInvoice));
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
            this.makeInvoiceList();
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
    
    Rs(amount){
    var words = new Array();
    words[0] = 'Zero';words[1] = 'One';words[2] = 'Two';words[3] = 'Three';words[4] = 'Four';
    words[5] = 'Five';words[6] = 'Six';words[7] = 'Seven';words[8] = 'Eight';words[9] = 'Nine';
    words[10] = 'Ten';words[11] = 'Eleven';words[12] = 'Twelve';words[13] = 'Thirteen';
    words[14] = 'Fourteen';words[15] = 'Fifteen';words[16] = 'Sixteen';words[17] = 'Seventeen';
    words[18] = 'Eighteen';words[19] = 'Nineteen';words[20] = 'Twenty';words[30] = 'Thirty';
    words[40] = 'Forty';words[50] = 'Fifty';words[60] = 'Sixty';words[70] = 'Seventy';
    words[80] = 'Eighty';words[90] = 'Ninety';
    var op;
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if(n_length <= 9){
    var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
    var received_n_array = new Array();
    for (var i = 0; i < n_length; i++){
    received_n_array[i] = number.substr(i, 1);}
    for (var i = 9 - n_length, j = 0; i < 9; i++, j++){
    n_array[i] = received_n_array[j];}
    for (var i = 0, j = 1; i < 9; i++, j++){
    if(i == 0 || i == 2 || i == 4 || i == 7){
    if(n_array[i] == 1){
    n_array[j] = 10 + parseInt(n_array[j]);
    n_array[i] = 0;}}}
    var value = "";
    for (var i = 0; i < 9; i++){
    if(i == 0 || i == 2 || i == 4 || i == 7){
    value = n_array[i] * 10;} else {
    value = n_array[i];}
    if(value != 0){
    words_string += words[value] + " ";}
    if((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)){
    words_string += "Crores ";}
    if((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)){
    words_string += "Lakhs ";}
    if((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)){
    words_string += "Thousand ";}
    if(i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)){
    words_string += "Hundred and ";} else if(i == 6 && value != 0){
    words_string += "Hundred ";}}
    words_string = words_string.split(" ").join(" ");}
    return words_string;}
    
    RsPaise(n){
    var nums = n.toString().split('.')
    var whole = this.Rs(nums[0]);
    if(nums[1]==null)nums[1]=0;
    if(nums[1].length == 1 )nums[1]=nums[1]+'0';
    if(nums[1].length> 2){nums[1]=nums[1].substring(2,length - 1)}
    if(nums.length == 2){
    if(nums[0]<=9){nums[0]=nums[0]*10} else {nums[0]=nums[0]};
    var fraction = this.Rs(nums[1]);
    var op = "";
    if(whole=='' && fraction==''){op= 'zero only';}
    if(whole=='' && fraction!=''){op= 'paise ' + fraction.toLowerCase() + ' only';}
    if(whole!='' && fraction==''){op='Rupees ' + whole.toLowerCase() + ' only';} 
    if(whole!='' && fraction!=''){op='Rupees ' + whole.toLowerCase() + 'and ' + fraction.toLowerCase() + ' paise' + ' only';}
    return op;
    }}
    
    camelize(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        // Directly return the joined string
        return splitStr.join(' '); 
    }
    
    clearFilter()
    {
        this.setState({
            searchFilter:'',
            searchFilterStatus:'',
            searchFilterFromDate:'',
            searchFilterToDate:''
            },()=>{
                this.makeInvoiceList();
            });
    }
   
    render() {
    let excelArray  =   [];
    this.state.invoices && this.state.invoices!=="undefined" && this.state.invoices !==null &&
    this.state.invoices.length > 0 && this.state.invoices.map((invoiceExcel, idx) => {
        let invoiceitemsexcel = invoiceExcel.invoiceitems;
        invoiceitemsexcel.map((itemsExcel, idx) => {
        let objExcel = {
            slNo:idx+1,
            invoiceDate:(new Date(invoiceExcel.invoiceDate).getDate()) + "-" + (new Date(invoiceExcel.invoiceDate).getMonth() + 1) + "-" + (new Date(invoiceExcel.invoiceDate).getFullYear()),
            invoiceNumber:invoiceExcel.invoiceNo,
            invoiceStatus:invoiceExcel.status,
            customerEmail:invoiceExcel.email,
            companyName:invoiceExcel.companyName,
            placeOfSupply:(invoiceExcel.placeOfSupply)?invoiceExcel.placeOfSupply:'N/A',
            gstin:(invoiceExcel.gstNo)?invoiceExcel.gstNo:'N/A',
            currency:(invoiceExcel.currency)?invoiceExcel.currency:'N/A',
            dueDate:(new Date(invoiceExcel.invoiceDate).getDate()) + "-" + (new Date(invoiceExcel.invoiceDate).getMonth() + 1) + "-" + (new Date(invoiceExcel.invoiceDate).getFullYear()),
            itemName:itemsExcel.itemName,
            itemDesc:'',
            itemQuantity:itemsExcel.quantity,
            itemRate:(itemsExcel.rate).toFixed(2),
            itemTax:'GST'+itemsExcel.tax,
            itemTaxPercentage:itemsExcel.tax+'%',
            itemTaxAmount:(((itemsExcel.rate * itemsExcel.quantity) * itemsExcel.tax)/100).toFixed(2),
            cgstRatePercentage:(invoiceExcel.isIGST && invoiceExcel.isIGST == "N")?(itemsExcel.tax/2).toString():'N/A',
            sgstRatePercentage:(invoiceExcel.isIGST && invoiceExcel.isIGST == "N")?(itemsExcel.tax/2).toString():'N/A',
            igstRatePercentage:(invoiceExcel.isIGST && invoiceExcel.isIGST == "Y")?(itemsExcel.tax).toString():'N/A',
            cgstRate:(invoiceExcel.isIGST && invoiceExcel.isIGST == "N")?(((itemsExcel.rate * itemsExcel.quantity) * (itemsExcel.tax/2))/100).toFixed(2):'N/A',
            sgstRate:(invoiceExcel.isIGST && invoiceExcel.isIGST == "N")?(((itemsExcel.rate * itemsExcel.quantity) * (itemsExcel.tax/2))/100).toFixed(2):'N/A',
            igstRate:(invoiceExcel.isIGST && invoiceExcel.isIGST == "Y")?(((itemsExcel.rate * itemsExcel.quantity) * (itemsExcel.tax))/100).toFixed(2):'N/A',
            itemTotal:(itemsExcel.rate * itemsExcel.quantity).toFixed(2),
            subTotal:invoiceExcel.subTotal.toFixed(2),
            total:invoiceExcel.totalAmount.toFixed(2),
            customerNotes:(invoiceExcel.customerNotes)?invoiceExcel.customerNotes:'N/A',
            termsAndConditions:(invoiceExcel.termsAndConditions)?invoiceExcel.termsAndConditions:'N/A',
            };
            excelArray.push(objExcel);
        });
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
                    <span className="tophead-txt">{this.isInvoice?"Invoices":""} >> Download Excel</span>
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
                                        <option value={Constants.DUE_ON_DATE_STATUS}>{Constants.DUE_ON_DATE_STATUS}</option>
                                        <option value={Constants.CLEARED_STATUS}>{Constants.CLEARED_STATUS}</option>
                                        <option value={Constants.VOID_STATUS}>{Constants.VOID_STATUS}</option>
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
                        
                        { this.isInvoice && this.state.totalInvoice && this.state.totalInvoice.length > 0 &&
                        <div className="card">
                            <div className="sec-t-container m-b-2"><h4 className="card-title">Summary</h4></div>
                            <div className="card-block">

                            <div className="row">
                            <div className="emp-meta">
                                    <table className="table table-bordered m-b-0">
                                    <tr>
                                    <td></td>
                                    <td><b>Last 15 Days</b></td>
                                    <td><b>Last 30 Days</b></td>
                                    <td><b>Overall</b></td>
                                    </tr>
                                    <tr>
                                    <td><b>SENT</b></td>
                                    <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalSentInvoiceAmount15Days?'₹'+(this.state.totalInvoice[0].totalSentInvoiceAmount15Days+this.state.totalInvoice[0].totalSentTaxAmount15Days).toFixed(2):'₹0.00'}</td>
                                    <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalSentTaxAmount30Days?'₹'+(this.state.totalInvoice[0].totalSentInvoiceAmount30Days+this.state.totalInvoice[0].totalSentTaxAmount30Days).toFixed(2):'₹0.00'}</td>
                                    <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalSentInvoiceAmount?'₹'+(this.state.totalInvoice[0].totalSentInvoiceAmount+this.state.totalInvoice[0].totalSentTaxAmount).toFixed(2):'₹0.00'}</td>
                                    </tr>
                                    <tr>
                                    <td><b>PAID</b></td>
                                    <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalPaidInvoiceAmount15Days?'₹'+(this.state.totalInvoice[0].totalPaidInvoiceAmount15Days+this.state.totalInvoice[0].totalPaidTaxAmount15Days).toFixed(2):'₹0.00'}</td>
                                    <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalPaidTaxAmount30Days?'₹'+(this.state.totalInvoice[0].totalPaidInvoiceAmount30Days+this.state.totalInvoice[0].totalPaidTaxAmount30Days).toFixed(2):'₹0.00'}</td>
                                    <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalPaidInvoiceAmount?'₹'+(this.state.totalInvoice[0].totalPaidInvoiceAmount+this.state.totalInvoice[0].totalPaidTaxAmount).toFixed(2):'₹0.00'}</td>
                                    </tr>
                                    <tr>
                                    <td><b>VOID</b></td>
                                    <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalVoidInvoiceAmount15Days?'₹'+(this.state.totalInvoice[0].totalVoidInvoiceAmount15Days+this.state.totalInvoice[0].totalVoidTaxAmount15Days).toFixed(2):'₹0.00'}</td>
                                    <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalVoidTaxAmount30Days?'₹'+(this.state.totalInvoice[0].totalVoidInvoiceAmount30Days+this.state.totalInvoice[0].totalVoidTaxAmount30Days).toFixed(2):'₹0.00'}</td>
                                    <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalVoidInvoiceAmount?'₹'+(this.state.totalInvoice[0].totalVoidInvoiceAmount+this.state.totalInvoice[0].totalVoidTaxAmount).toFixed(2):'₹0.00'}</td>
                                    </tr>
                                    <tr>
                                    <td><b>Total</b></td>
                                    <td>
                                    {
                                        this.state.totalInvoice.length > 0 &&
                                        (
                                        '₹'+(this.state.totalInvoice[0].totalSentTaxAmount15Days +
                                        this.state.totalInvoice[0].totalPaidTaxAmount15Days +
                                        this.state.totalInvoice[0].totalVoidTaxAmount15Days +
                                        this.state.totalInvoice[0].totalSentInvoiceAmount15Days +
                                        this.state.totalInvoice[0].totalPaidInvoiceAmount15Days +
                                        this.state.totalInvoice[0].totalVoidInvoiceAmount15Days).toFixed(2) 
                                        )
                                    }
                                    </td>
                                    <td>
                                    {
                                        this.state.totalInvoice.length > 0 &&
                                        (
                                        '₹'+(this.state.totalInvoice[0].totalSentTaxAmount30Days +
                                        this.state.totalInvoice[0].totalPaidTaxAmount30Days +
                                        this.state.totalInvoice[0].totalVoidTaxAmount30Days +
                                        this.state.totalInvoice[0].totalSentInvoiceAmount30Days +
                                        this.state.totalInvoice[0].totalPaidInvoiceAmount30Days +
                                        this.state.totalInvoice[0].totalVoidInvoiceAmount30Days).toFixed(2)
                                        )
                                    }
                                    </td>
                                    <td>
                                    {
                                        this.state.totalInvoice.length > 0 &&
                                        (
                                        '₹'+(this.state.totalInvoice[0].totalSentTaxAmount +
                                        this.state.totalInvoice[0].totalPaidTaxAmount +
                                        this.state.totalInvoice[0].totalVoidTaxAmount +
                                        this.state.totalInvoice[0].totalSentInvoiceAmount +
                                        this.state.totalInvoice[0].totalPaidInvoiceAmount +
                                        this.state.totalInvoice[0].totalVoidInvoiceAmount).toFixed(2)  
                                        )
                                    }
                                    </td>
                                    </tr>
                                    </table>
                                </div>
                            
                            </div>
                        
                            </div>
                        </div>
                        }
                        
                        <div className="card">
                            <div className="sec-t-container m-b-2"><h4 className="card-title">{this.isInvoice?"Invoices":""} List</h4>
                           
                                <ExcelFile element={<button className="btn btn-primary add-new" type="button">Download Excel</button>}>
                                    <ExcelSheet data={excelArray} name="Invoice Report">
                                        <ExcelColumn label="Sl No" value="slNo"/>
                                        <ExcelColumn label="Invoice Date" value="invoiceDate"/>
                                        <ExcelColumn label="Invoice Number" value="invoiceNumber"/>
                                        <ExcelColumn label="Invoice Status" value="invoiceStatus"/>
                                        <ExcelColumn label="Company Name" value="companyName"/>
                                        <ExcelColumn label="Place Of Supply" value="placeOfSupply"/>
                                        <ExcelColumn label="GSTIN" value="gstin"/>
                                        <ExcelColumn label="Currency" value="currency"/>
                                        <ExcelColumn label="Due Date" value="dueDate"/>
                                        <ExcelColumn label="Item Name" value="itemName"/>
                                        <ExcelColumn label="Item Description" value="itemDesc"/>
                                        <ExcelColumn label="Quantity" value="itemQuantity"/>
                                        <ExcelColumn label="Rate" value="itemRate"/>
                                        <ExcelColumn label="Item Tax" value="itemTax"/>
                                        <ExcelColumn label="Item Tax %" value="itemTaxPercentage"/>
                                        <ExcelColumn label="Item Tax Amount" value="itemTaxAmount"/>
                                        <ExcelColumn label="CGST Rate %" value="cgstRatePercentage"/>
                                        <ExcelColumn label="SGST Rate %" value="sgstRatePercentage"/>
                                        <ExcelColumn label="IGST Rate %" value="igstRatePercentage"/>
                                        <ExcelColumn label="CGST" value="cgstRate"/>
                                        <ExcelColumn label="SGST" value="sgstRate"/>
                                        <ExcelColumn label="IGST" value="igstRate"/>
                                        <ExcelColumn label="Item Total" value="itemTotal"/>
                                        <ExcelColumn label="SubTotal" value="subTotal"/>
                                        <ExcelColumn label="Total" value="total"/>
                                        <ExcelColumn label="Customer Notes" value="customerNotes"/>
                                        <ExcelColumn label="Terms & Conditions" value="termsAndConditions"/>
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
                                                <th>{this.isInvoice?"Invoice":""}</th>
                                                <th>{this.isInvoice?"Customer":""}</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody>
                                        {
                                        this.state.invoices && this.state.invoices!=="undefined" && this.state.invoices !==null &&
                                        this.state.invoices.length > 0 && this.state.invoices.map(function(item,index) {
                                            return <tr>
                                                <td>{++index}</td>
                                                <td>
                                                    <a className="row-header" href={(this.isInvoice?"/invoicedetails/":"#")+item.invoiceId}>{item.invoiceNo}</a><br/>
                                                    <b>Date: </b>
                                                    {(new Date(item.invoiceDate).getDate()) + "-" + (new Date(item.invoiceDate).getMonth() + 1) + "-" + (new Date(item.invoiceDate).getFullYear())}
                                                </td>

                                                <td>
                                                    {(item.displayName)?item.displayName:'N/A'}<br/>
                                                    <b>Email: </b>{(item.email)?item.email:'N/A'}<br/>
                                                </td>

                                                <td>
                                                    <b>Total: </b><i className="fa fa-inr" aria-hidden="true"></i>
                                                    {
                                                        item.totalAmount.toFixed(2)
                                                    }
                                                    <br/>
                                                </td>
                                                <td>
                                                    <span className="status-span">
                                                        <b>{(item.status)?item.status:'N/A'}</b>
                                                    </span>
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
export default Downloadexcelinvoice;
