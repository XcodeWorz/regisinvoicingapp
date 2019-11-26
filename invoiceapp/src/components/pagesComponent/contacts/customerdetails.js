import React, { Component } from 'react';
import * as Constants from '../../../constants';
import Sidebar from '../../layoutsComponent/sidebar';
import DropdownButton from '../uielements/dropdown';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import InvoiceListTable from '../invoices/invoicelisttable';
import EstimateListTable from '../estimates/estimatelisttable';
import PaymentListTable from '../payments/paymentlisttable';

import {
    BrowserRouter as Router
} from 'react-router-dom';

import SpinnerLoader from 'react-loader-spinner';

const itemsObj = [Constants.CUSTOMER_CREATE_INVOICE, Constants.CUSTOMER_CREATE_ESTIMATE, Constants.CUSTOMER_DELETE_CUSTOMER];
const itemsIconsObj = [Constants.CUSTOMER_CREATE_INVOICE_ICON, Constants.CUSTOMER_CREATE_ESTIMATE_ICON, Constants.CUSTOMER_DELETE_CUSTOMER_ICON];

class CustomerDetails extends Component {
    constructor(props) {
        super(props);
        this.isCustomer = (this.props.location.pathname.includes(Constants.CUST_DETAILS_PATH))?true:false;
        this.state = {
           customer:{},
           invoices:{},
           estimates:{},
           payments:{},
        };
        
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

    componentDidMount()
    {
        this.operateSpinnerLoader("open");
        fetch(Constants.BASE_URL_API+"getcontactdetails",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({contactId:this.props.match.params.id})
        })
        .then(response => { return response.json(); } )
        .then(data => {
            this.setState(
                {
                    customer: (data.list && data.list!=="undefined" && data.list !==null)?data.list.customer:null,
                    invoices: (data.list && data.list!=="undefined" && data.list !==null)?data.list.invoices:null,
                    estimates: (data.list && data.list!=="undefined" && data.list !==null)?data.list.estimates:null,
                    payments: (data.list && data.list!=="undefined" && data.list !==null)?data.list.payments:null,
                });
            this.operateSpinnerLoader("close");
          });
    }

    makeList = ()=>
    {
        Promise.all([fetch(Constants.BASE_URL_API+"getestimates",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams(this.state)
        })])
    
        .then(([res1]) => { 
            return Promise.all([res1.json()]) 
        })
        .then(([res1]) => {
            this.setState({
                estimates:res1.invoices
            });
        });
    }

    makeListInvoice = ()=>
    {
        Promise.all([fetch(Constants.BASE_URL_API+"getinvoices",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams(this.state)
        })])
    
        .then(([res1]) => { 
            return Promise.all([res1.json()]) 
        })
        .then(([res1]) => {
            this.setState({
                invoices:res1.invoices
            });
        });
    }

    onDropDownItemClick(item, index){
        if(this.isCustomer)
        {
            switch(index){
                case 0://ADD INVOICE
                    this.props.history.push("/addinvoice?id="+this.state.customer.contactId+'&placeofsupply='+this.state.customer.placeOfSupply);
                    break;
                case 1: //ADD ESTIMATE
                    this.props.history.push("/addestimate?id="+this.state.customer.contactId+'&placeofsupply='+this.state.customer.placeOfSupply);
                break;
                case 2://DELETE
                    break;
            }
        }
    }

    getUrlParameterValue(parameter)
    {
        var urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has(parameter))
        {
            return urlParams.get(parameter);
        }
        else
        return null;
    }

    changeUrl(val)
    {
        if(val === "overview")
        {
            if(this.isCustomer)
            {
                this.props.history.push('/customerdetails/'+this.state.customer.contactId);
            }
        }
        else
        {
            this.props.history.push("?type="+val);
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
                            <span className="tophead-txt">{this.isCustomer?"Customer >> Details":""}</span>
                            <span className="tophead-txt pull-right"></span>
                            </a>
                        </div>
                    </nav>

                    <div className="main-content">
                        <div className="content-view">
                            <div className="card">
                                <div className="card-block">
                                    <div id="spinnerLoaderDiv" className="react-spinner">
                                        <SpinnerLoader type={Constants.LOADER_TYPE} color={Constants.LOADER_COLOR} height={50} width={50} />
                                    </div>
                                    <div id="bodyDiv">
                                        <div className="details-header">
                                            <h4>{(this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null)?this.state.customer.displayName:''}</h4>
                                            <div className="details-options">
                                                <a class="btn btn-primary btn-details" href={(this.isCustomer?"/editcontact/":"#")+this.state.customer.contactId}>Edit {this.isCustomer?"Customer":""}</a>
                                                {
                                                    this.isCustomer && 
                                                    <DropdownButton
                                                        items={itemsObj} 
                                                        itemsIconsObj = {itemsIconsObj}
                                                        onDropDownItemClick = {this.onDropDownItemClick} 
                                                    />
                                                }
                                            </div>
                                        </div>

                                        <div className="customer-tabs">
                                        <Tabs defaultActiveKey={(this.getUrlParameterValue('type') && this.getUrlParameterValue('type') !=="undefined")?this.getUrlParameterValue('type'):'overview'} id="uncontrolled-tab-example" onSelect={k => this.changeUrl(k)}>
                                            <Tab eventKey="overview" title="Overview">
                                                <div className="customer-details">
                                                    <h5>{(this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null)?this.state.customer.displayName:''}</h5>
                                                    <p>{(this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null)?this.state.customer.salutation+" "+this.state.customer.firstName+" "+this.state.customer.lastName:''}</p>
                                                    <p>{(this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null)?this.state.customer.companyName:''}</p>
                                                    <p>{(this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null)?this.state.customer.userType:''}</p>
                                                    
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <h5>Contact Details</h5>
                                                            <p><b>Email:</b> {
                                                                (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                (this.state.customer.email && this.state.customer.email!=="undefined" && this.state.customer.email!==null)
                                                                ?
                                                                this.state.customer.email
                                                                :
                                                                'N/A'
                                                            }</p>
                                                            <p><b>Phone:</b> {
                                                                (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                (this.state.customer.phoneNo && this.state.customer.phoneNo!=="undefined" && this.state.customer.phoneNo!==null)
                                                                ?
                                                                this.state.customer.phoneNo
                                                                :
                                                                'N/A'
                                                            }</p>
                                                            <p><b>Website:</b> {
                                                                (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                (this.state.customer.website && this.state.customer.website!=="undefined" && this.state.customer.website!==null)
                                                                ?
                                                                this.state.customer.website
                                                                :
                                                                'N/A'
                                                            }</p>
                                                            <p><b>Address:</b> {
                                                                (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                (this.state.customer.address && this.state.customer.address!=="undefined" && this.state.customer.address!==null)
                                                                ?
                                                                this.state.customer.address
                                                                :
                                                                'N/A'
                                                            }</p>
                                                            <p><b>City:</b> {
                                                                (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                (this.state.customer.city && this.state.customer.city!=="undefined" && this.state.customer.city!==null)
                                                                ?
                                                                this.state.customer.city
                                                                :
                                                                'N/A'
                                                            }
                                                            </p> 
                                                            <p><b>State:</b> {
                                                                (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                (this.state.customer.state && this.state.customer.state!=="undefined" && this.state.customer.state!==null)
                                                                ?
                                                                this.state.customer.state
                                                                :
                                                                'N/A'
                                                            }</p>
                                                            <p><b>Zip Code:</b> {
                                                                (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                (this.state.customer.zipCode && this.state.customer.zipCode!=="undefined" && this.state.customer.zipCode!==null)
                                                                ?
                                                                this.state.customer.zipCode
                                                                :
                                                                'N/A'
                                                            }</p>
                                                            <p><b>Country:</b> {
                                                                (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                (this.state.customer.country && this.state.customer.country!=="undefined" && this.state.customer.country!==null)
                                                                ?
                                                                this.state.customer.country
                                                                :
                                                                'N/A'
                                                            }</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <h5>Other Details</h5>
                                                            <p><b>Is Taxable:</b> {
                                                                (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                (this.state.customer.isTaxable && this.state.customer.isTaxable!=="undefined" && this.state.customer.isTaxable!==null)
                                                                ?
                                                                this.state.customer.isTaxable === 'Y'?'Yes':'No'
                                                                :
                                                                'N/A'
                                                            }</p>
                                                            <p><b>Currency:</b> {
                                                                (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                (this.state.customer.currency && this.state.customer.currency!=="undefined" && this.state.customer.currency!==null)
                                                                ?
                                                                this.state.customer.currency
                                                                :
                                                                'N/A'
                                                            }</p>
                                                            <p><b>GST Treatment:</b> {
                                                                (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                (this.state.customer.gsttreatment_name && this.state.customer.gsttreatment_name!=="undefined" && this.state.customer.gsttreatment_name!==null)
                                                                ?
                                                                this.state.customer.gsttreatment_name
                                                                :
                                                                'N/A'
                                                            }</p>
                                                            {
                                                                (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                (this.state.customer.gstTreatmentId === 1 ||this.state.customer.gstTreatmentId === 2) &&
                                                                <span>
                                                                    <p><b>GST No:</b> {
                                                                        (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                        (this.state.customer.gstNo && this.state.customer.gstNo!=="undefined" && this.state.customer.gstNo!==null)
                                                                        ?
                                                                        this.state.customer.gstNo
                                                                        :
                                                                        'N/A'
                                                                    }</p>
                                                                    <p><b>Place Of Supply:</b> {
                                                                        (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                        (this.state.customer.placeOfSupply && this.state.customer.placeOfSupply!=="undefined" && this.state.customer.placeOfSupply!==null)
                                                                        ?
                                                                        this.state.customer.placeOfSupply
                                                                        :
                                                                        'N/A'
                                                                    }</p>
                                                                </span>
                                                            }
                                                            {
                                                                (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                (this.state.customer.gstTreatmentId === 3 ||this.state.customer.gstTreatmentId === 4) &&
                                                                <span>
                                                                    <p><b>Pan:</b> {
                                                                        (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                        (this.state.customer.pan && this.state.customer.pan!=="undefined" && this.state.customer.pan!==null)
                                                                        ?
                                                                        this.state.customer.pan
                                                                        :
                                                                        'N/A'
                                                                    }</p>
                                                                    <p><b>Place Of Supply:</b> {
                                                                        (this.state.customer && this.state.customer!=="undefined" && this.state.customer!==null) && 
                                                                        (this.state.customer.placeOfSupply && this.state.customer.placeOfSupply!=="undefined" && this.state.customer.placeOfSupply!==null)
                                                                        ?
                                                                        this.state.customer.placeOfSupply
                                                                        :
                                                                        'N/A'
                                                                    }</p>
                                                                </span>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tab>
                                            <Tab eventKey="invoices" title={this.isCustomer?"Invoices":""}>
                                            <InvoiceListTable 
                                                    invoiceList = {this.state.invoices}
                                                    history = {this.props.history}
                                                    isCustomer = {this.isCustomer}
                                                    makeList = {this.makeListInvoice}
                                            />
                                            </Tab>
                                            {
                                                this.isCustomer && 
                                                <Tab eventKey="estimates" title="Estimates">
                                                    <EstimateListTable 
                                                        invoiceList = {this.state.estimates}
                                                        history = {this.props.history}
                                                        makeList = {this.makeList}
                                                    />
                                                </Tab>
                                            }
                                            <Tab eventKey="payments" title="Payments">
                                                <PaymentListTable 
                                                    invoiceList = {this.state.payments}
                                                    history = {this.props.history}
                                                    isCustomer = {this.isCustomer}
                                                />
                                            </Tab>
                                        </Tabs>
                                        </div>
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

export default CustomerDetails;