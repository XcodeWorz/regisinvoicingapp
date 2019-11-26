import React, { Component } from 'react';
import Logo from '../../../../public/assets/images/logo-website.png';
import {
    BrowserRouter as Router
} from 'react-router-dom';

class Paymentoverview extends Component {
    constructor(props) {
        super(props);
    }

    RsPaise(n){
        var nums = n.toString().split('.')
        var whole = this.Rs(nums[0]);
        if(nums[1]==null)nums[1]=0;
        if(nums[1].length == 1 )nums[1]=nums[1]+'0';
        if(nums[1].length> 2){nums[1]=nums[1].substring(2,length - 1)}
        if(nums.length == 2)
        {
            if(nums[0]<=9){nums[0]=nums[0]*10} else {nums[0]=nums[0]};
            var fraction = this.Rs(nums[1]);
            var op = "";
            if(whole=='' && fraction==''){op= 'zero only';}
            if(whole=='' && fraction!=''){op= 'paise ' + fraction.toLowerCase() + ' only';}
            if(whole!='' && fraction==''){op='Rupees ' + whole.toLowerCase() + ' only';} 
            if(whole!='' && fraction!=''){op='Rupees ' + whole.toLowerCase() + 'and ' + fraction.toLowerCase() + ' paise' + ' only';}
            return op;
        }
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
        return words_string;
    }

    render(){
        let totalAmountReceived = 0;

        if(this.props.payment.amountReceived && this.props.payment.amountReceived !=="undefined" && this.props.payment.amountReceived !==null)
        {
            totalAmountReceived+= parseFloat(this.props.payment.amountReceived);
        }
        totalAmountReceived =   totalAmountReceived.toFixed(2);
        let amountInWords = this.RsPaise(totalAmountReceived);
        return(
            <Router>
                <div className="invoice-bg">
                    <div className="invoice-overview">
                    <div className="io-header">
                        <table className="table m-b-0">
                            <tr>
                                <td className="payment-details" width="50%">
                                    <img src={Logo}/>
                                    <div className="company-address">
                                    <p style={{fontWeight:"bold"}}>
                                        {(this.props.payment.invoiceCompanyName && this.props.payment.invoiceCompanyName!=="undefined" && this.props.payment.invoiceCompanyName!==null)?this.props.payment.invoiceCompanyName:''}
                                    </p>
                                    <p>{(this.props.payment.companyAddress && this.props.payment.companyAddress!=="undefined" && this.props.payment.companyAddress!==null)?this.props.payment.companyAddress:''}</p>
                                    {
                                        this.props.isRegisteredUnderGST ==="Y" &&
                                        <p>GSTIN:{(this.props.payment.companyGSTNo && this.props.payment.companyGSTNo!=="undefined" && this.props.payment.companyGSTNo!==null)?this.props.payment.companyGSTNo:''}</p>
                                    }
                                    </div>
                                </td>
                                <td width="50%"  style={{verticalAlign:"bottom", textAlign:"right"}}>
                                    <h3>{this.props.isInvoice?"PAYMENT RECEIPT":""}</h3>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className="row" style={{marginTop:50}}>
                        <div className="col-md-8">
                            <table className="table-header-info">
                                <tr>
                                    <td>
                                        Payment Date
                                    </td>
                                    <td>
                                        : {(this.props.payment.paymentDate && this.props.payment.paymentDate!==null)?(new Date(this.props.payment.paymentDate).getDate()) + "-" + (new Date(this.props.payment.paymentDate).getMonth() + 1) + "-" + (new Date(this.props.payment.paymentDate).getFullYear()):''}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Payment Mode
                                    </td>
                                    <td>
                                        : {(this.props.payment.paymentMode && this.props.payment.paymentMode!=="undefined" && this.props.payment.paymentMode!==null)?this.props.payment.paymentMode:''}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        {this.props.isInvoice?"Amount Received in words":""}
                                    </td>
                                    <td>
                                        : {amountInWords}
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div className="col-md-4">
                            <div className="payment-amount">
                                <h6>{this.props.isInvoice?"Amount Received":""}</h6>
                                <h4><i className="fa fa-inr" aria-hidden="true"></i>{totalAmountReceived}</h4>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="info-address payment">
                                <p>{this.props.isInvoice?"Bill To":""}</p>
                                <p style={{fontWeight:"bold"}}>
                                {(this.props.payment.contactCompanyName && this.props.payment.contactCompanyName!=="undefined" && this.props.payment.contactCompanyName!==null)?this.props.payment.contactCompanyName:''}
                                    </p>
                                    <p>
                                    {(this.props.payment.contactAddress && this.props.payment.contactAddress!=="undefined" && this.props.payment.contactAddress!==null)?this.props.payment.contactAddress:''}
                                    </p>
                                    {
                                        this.props.isRegisteredUnderGST === "Y" &&
                                        <p>
                                        GSTIN:{(this.props.payment.contactGSTIN && this.props.payment.contactGSTIN!=="undefined" && this.props.payment.contactGSTIN!==null)?this.props.payment.contactGSTIN:''}
                                        </p>
                                    }
                            </div>
                        </div>
                    </div>
                        <h4>Payment For</h4>
                        <table className="table itemdesc-table table-bordered m-b-0">
                                <tr className="grey-bg"> 
                                    <th>
                                        {this.props.isInvoice?"Invoice No":""} 
                                    </th>
                                    <th>
                                        {this.props.isInvoice?"Invoice Date":""}
                                    </th>
                                    <th>
                                        {this.props.isInvoice?"Invoice Amount":""}
                                    </th>
                                    <th>
                                       Tax Amount
                                    </th>
                                    <th>
                                        Payment Amount
                                    </th>
                                </tr>
                                <tr>
                                    <td>{this.props.payment.invoiceNo}</td>
                                    <td>{(this.props.payment.invoiceDate && this.props.payment.invoiceDate!==null)?(new Date(this.props.payment.invoiceDate).getDate()) + "-" + (new Date(this.props.payment.invoiceDate).getMonth() + 1) + "-" + (new Date(this.props.payment.invoiceDate).getFullYear()):''}</td>
                                    <td><i className="fa fa-inr" aria-hidden="true"></i>{parseFloat(this.props.totalPaymentAmount).toFixed(2)}</td>
                                    <td><i className="fa fa-inr" aria-hidden="true"></i>{parseFloat(this.props.totalTaxAmount).toFixed(2)}</td>
                                    <td><i className="fa fa-inr" aria-hidden="true"></i>{parseFloat(totalAmountReceived).toFixed(2)}</td>
                                </tr>
                        </table>
                   
                </div>
                </div>
            </Router>
        );
    }
}

export default Paymentoverview;