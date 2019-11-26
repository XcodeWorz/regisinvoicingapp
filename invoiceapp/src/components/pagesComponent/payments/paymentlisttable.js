import React, { Component } from 'react';
import "../../../../public/assets/js/vfs_fonts.js";
import "react-datepicker/dist/react-datepicker.css";
import {
    BrowserRouter as Router
} from 'react-router-dom';

class Paymentlisttable extends Component {
    constructor(props) {
        super(props);
        this.isInvoice = (this.props.isInvoice && this.props.isInvoice !=="undefined" && this.props.isInvoice !==null)?this.props.isInvoice:this.props.isCustomer;
        this.state = {
            };
        }
       
    
    render() {
        return (
            <Router>
               <table className="table m-b-0">
                        <thead>
                            <tr>
                                <th>Sl No</th>
                                <th>Payment</th>
                                <th>Customer</th>
                                <th>{this.isInvoice?"Invoice":""} No</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                        {
                            this.props.invoiceList && this.props.invoiceList!=="undefined" && this.props.invoiceList !==null && 
                            this.props.invoiceList.length > 0 && this.props.invoiceList.map(function(item,index) {
                                
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
                                        <b>No:</b>
                                        <span style={{fontSize:15}}><a href={(this.isInvoice?"/paymentreceived/":"#")+item.paymentId}>{(item.paymentNo)?item.paymentNo:'N/A'}</a></span>
                                        <br/>
                                        <b>Date:</b>{(new Date(item.paymentDate).getDate()) + "-" + (new Date(item.paymentDate).getMonth() + 1) + "-" + (new Date(item.paymentDate).getFullYear())}
                                    </td>
                                    <td><a href={(this.isInvoice?"/customerdetails/":"#")+item.contactId}><span style={{fontSize:15}}>{(item.displayName)?item.displayName:'N/A'}</span></a></td>
                                    <td><a href={(this.isInvoice?"/invoicedetails/":"#")+item.invoiceId}><span style={{fontSize:15}}>{(item.invoiceNo)?item.invoiceNo:'N/A'}</span></a></td>
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
                </Router>
        );
    }
}
export default Paymentlisttable;