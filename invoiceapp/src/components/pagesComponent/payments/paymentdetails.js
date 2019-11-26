import React, { Component } from 'react';
import * as Constants from '../../../constants';
import Sidebar from '../../layoutsComponent/sidebar';
import PaymentOverview from './paymentoverview';

import {
    BrowserRouter as Router
} from 'react-router-dom';
import SpinnerLoader from 'react-loader-spinner';

class PaymentDetails extends Component {
    constructor(props) {
        super(props);

        //Check URL Path contains /editinvoice 
        this.isInvoice = (this.props.location.pathname.includes(Constants.PAYREC_INVOICE_PATH))?true:false;
        
        this.state = {
            payments:{},
            invoices:{}
        };
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
        Promise.all([
            fetch(Constants.BASE_URL_API+"getpaymentreceived",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams({
                    paymentId:this.props.match.params.id,
                    type:this.isInvoice?Constants.PAY_TYPE_REC:""
                })
            }),
            fetch(Constants.BASE_URL_API+"getsettings",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams({settingsId:Constants.INVOICE_SETTINGS_ID})
            })
            ])
    
            .then(([res1,res2]) => { 
                    return Promise.all([res1.json(), res2.json()]) 
            })
            .then(([res1,res2]) => {
                this.setState(
                    {
                        payments: (res1.payments && res1.payments!=="undefined" && res1.payments !==null)?res1.payments[0]:null,
                        invoices: (res1.invoices && res1.invoices!=="undefined" && res1.invoices !==null)?res1.invoices[0]:null,
                        isRegisteredUnderGST:res2.settings[0].isRegisteredUnderGST,
                    });
                this.operateSpinnerLoader("close");
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
                            <span className="tophead-txt">Payment >> Details</span>
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
                                        </div>

                                        <div className="customer-tabs">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        
                                                        <p><b>Payment No: </b>{(this.state.payments && this.state.payments!=="undefined" && this.state.payments!==null)?this.state.payments.paymentNo:''}</p>
                                                        <p><b>Payment Date: </b> {(new Date(this.state.payments.paymentDate).getDate()) + "-" + (new Date(this.state.payments.paymentDate).getMonth() + 1) + "-" + (new Date(this.state.payments.paymentDate).getFullYear())}</p>
                                                        <p><b>{this.isInvoice?"Invoice":""} No: </b>{(this.state.payments && this.state.payments!=="undefined" && this.state.payments!==null)?this.state.payments.invoiceNo:''}</p>
                                                        <p><b>Company Name: </b>{(this.state.payments && this.state.payments!=="undefined" && this.state.payments!==null)?this.state.payments.displayName:''}</p>
                                                        </div>
                                                    <div className="col-md-9">
                                                        <PaymentOverview 
                                                        isInvoice = {this.isInvoice}
                                                        payment = {this.state.payments}
                                                        isRegisteredUnderGST={this.state.isRegisteredUnderGST}
                                                        totalPaymentAmount = {(this.state.payments && this.state.payments!=="undefined" && this.state.payments!==null)?this.state.payments.totalAmount:''}
                                                        totalTaxAmount = {(this.state.payments && this.state.payments!=="undefined" && this.state.payments!==null)?this.state.payments.taxAmount:''}
                                                        />
                                                    </div>
                                                </div>
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

export default PaymentDetails;