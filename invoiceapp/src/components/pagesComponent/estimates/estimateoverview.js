import React, { Component } from 'react';
import Logo from '../../../../public/assets/images/logo-website.png';
import {
    BrowserRouter as Router
} from 'react-router-dom';

class Estimateoverview extends Component {
    constructor(props) {
        super(props);
    }

    returnTotalAmount()
    {
        let taxTmpArray = [];
        let variableTmpArray = [];
        let totalAmount = 0;
        let subTotal = 0;
        this.props.invoices.invoiceitems && this.props.invoices.invoiceitems!=="undefined" && this.props.invoices.invoiceitems!==null &&
        this.props.invoices.invoiceitems.map((itemholder2, idx2) => {
        if(taxTmpArray.indexOf(itemholder2.tax) > -1)
        {
            
        }
        else
        {
            taxTmpArray.push(parseInt(itemholder2.tax));
            variableTmpArray[itemholder2.tax] = 0;
        }
        })
        let sub = 0;
        let subTax = 0;
        this.props.invoices.invoiceitems && this.props.invoices.invoiceitems!=="undefined" && this.props.invoices.invoiceitems!==null &&
        this.props.invoices.invoiceitems.map((itemholder2, idx2) => {
            if(this.props.invoices.isTaxExclusive === "Y"){
                subTotal = this.props.invoices.invoiceitems.reduce((sum, i) => (
                    sum += i.quantity * i.rate
                  ), 0);

                  totalAmount = this.props.invoices.invoiceitems.reduce((sum, i) => (
                    sum += i.quantity * i.rate
                  ), 0)+(this.props.invoices.invoiceitems.reduce((sum, i) => (
                    sum += (i.tax >=0)?i.quantity * i.rate * i.tax:0
                  ), 0)/100);
            }
            else
            {
                let itemTotalPrice = itemholder2.quantity * itemholder2.rate;
                let taxPercentage = (itemholder2.tax>=0?itemholder2.tax:0);
                let taxAmount = itemTotalPrice - (itemTotalPrice/(1+(taxPercentage/100)))
                let sub = (itemTotalPrice - taxAmount)
                subTotal += sub
                totalAmount += (sub+taxAmount);
                variableTmpArray[itemholder2.tax] += (taxAmount/2);
            }
        })
        totalAmount = totalAmount.toFixed(2);
        subTotal = subTotal.toFixed(2);
        let returnArray = [];
        returnArray['subTotal'] = subTotal;
        returnArray['totalAmount'] = totalAmount;
        return returnArray;
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

    render(){
        let taxArray	=	[];
        let taxTmpArray = [];
        let variableTmpArray = [];
        let totalAmount = 0;
        let subTotal = 0;
        this.props.invoices.invoiceitems && this.props.invoices.invoiceitems!=="undefined" && this.props.invoices.invoiceitems!==null &&
        this.props.invoices.invoiceitems.map((itemholder2, idx2) => {
        if(taxTmpArray.indexOf(itemholder2.tax) > -1)
        {
            
        }
        else
        {
            taxTmpArray.push(parseInt(itemholder2.tax));
            variableTmpArray[itemholder2.tax] = 0;
        }
        })

        var taxTmpArrayResult    =   [];
        for(var i=0; i < taxTmpArray.length; i++){
            if(taxTmpArrayResult.indexOf(taxTmpArray[i]) === -1) {
                taxTmpArrayResult.push(taxTmpArray[i]);
            }
        }
        this.props.invoices.invoiceitems && this.props.invoices.invoiceitems!=="undefined" && this.props.invoices.invoiceitems!==null &&
        this.props.invoices.invoiceitems.map((itemholder2, idx2) => {
            if(this.props.invoices.isTaxExclusive === "Y"){
                variableTmpArray[itemholder2.tax]+= parseFloat(((itemholder2.quantity * itemholder2.rate ) * (itemholder2.tax)/2)/100); 
            }
            else
            {
                let itemTotalPrice = itemholder2.quantity * itemholder2.rate;
                let taxPercentage = (itemholder2.tax>=0?itemholder2.tax:0);
                let taxAmount = itemTotalPrice - (itemTotalPrice/(1+(taxPercentage/100)))
                let sub = (itemTotalPrice - taxAmount)
                subTotal += sub
                totalAmount += (sub+taxAmount);
                variableTmpArray[itemholder2.tax] += (taxAmount/2);
            }
        })
        subTotal = subTotal.toFixed(2)
        totalAmount = totalAmount.toFixed(2)

        taxTmpArrayResult.forEach(function(element) {
            if(element >= 0)
            {
                var objTax	=	{
                                    percentage:(element/2).toString(),
                                    amount:variableTmpArray[element].toFixed(2)
                                };
                taxArray.push(objTax);
            }
        });
    
        return(
            <Router>
                <div className="invoice-bg">
                    <div className="invoice-overview">
                    <div className="io-header">
                        <table className="table m-b-0">
                            <tr>
                                <td width="20%" style={{verticalAlign:"middle"}}>
                                    <img src={Logo}/>
                                </td>
                                <td width="35%">
                                    <div className="company-address">
                                    <p style={{fontWeight:"bold"}}>{(this.props.invoices.invoiceCompanyName && this.props.invoices.invoiceCompanyName!=="undefined" && this.props.invoices.invoiceCompanyName!==null)?this.props.invoices.invoiceCompanyName:''}</p>
                                    <p>{(this.props.invoices.companyAddress && this.props.invoices.companyAddress!=="undefined" && this.props.invoices.companyAddress!==null)?this.props.invoices.companyAddress:''}</p>
                                    {
                                        this.props.isRegisteredUnderGST ==="Y" &&
                                        <p>GSTIN:{(this.props.invoices.companyGSTNo && this.props.invoices.companyGSTNo!=="undefined" && this.props.invoices.companyGSTNo!==null)?this.props.invoices.companyGSTNo:''}</p>
                                    }
                                    </div>
                                </td>
                                <td width="35%"  style={{verticalAlign:"bottom", textAlign:"right"}}>
                                    <h3>ESTIMATE</h3>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <table className="table tab-info table-bordered m-b-0">
                        <tr>
                            <td>
                                <table className="table-header-info">
                                    <tr>
                                        <td>
                                            Estimate No
                                        </td>
                                        <td>
                                            : {(this.props.invoices.estimateNo && this.props.invoices.estimateNo!=="undefined" && this.props.invoices.estimateNo!==null)?this.props.invoices.estimateNo:''}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Estimate Date
                                        </td>
                                        <td>
                                            : {(this.props.invoices.estimateDate && this.props.invoices.estimateDate!==null)?(new Date(this.props.invoices.estimateDate).getDate()) + "-" + (new Date(this.props.invoices.estimateDate).getMonth() + 1) + "-" + (new Date(this.props.invoices.estimateDate).getFullYear()):''}
                                        </td>
                                    </tr>
                                   
                                </table>
                            </td>
                            <td>
                                <table className="table-header-info">
                                    <tr>
                                        <td>
                                            Place Of Supply
                                        </td>
                                        <td>
                                            : {(this.props.invoices.contactPlaceOfSupply && this.props.invoices.contactPlaceOfSupply!=="undefined" && this.props.invoices.contactPlaceOfSupply!==null)?this.props.invoices.contactPlaceOfSupply:''}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr className="billto-col">
                            <td colSpan="2">
                                Bill To
                            </td>
                        </tr>
                    </table>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="info-address">
                                <p style={{fontWeight:"bold"}}>
                                {(this.props.invoices.contactCompanyName && this.props.invoices.contactCompanyName!=="undefined" && this.props.invoices.contactCompanyName!==null)?this.props.invoices.contactCompanyName:''}
                                </p>
                                <p>
                                {(this.props.invoices.contactAddress && this.props.invoices.contactAddress!=="undefined" && this.props.invoices.contactAddress!==null)?this.props.invoices.contactAddress:''}
                                </p>
                                {
                                    this.props.isRegisteredUnderGST === "Y" &&
                                    <p>
                                    GSTIN:{(this.props.invoices.contactGSTIN && this.props.invoices.contactGSTIN!=="undefined" && this.props.invoices.contactGSTIN!==null)?this.props.invoices.contactGSTIN:''}
                                    </p>
                                }
                            </div>
                        </div>
                    </div>
                    {
                        this.props.invoices.isIGST ==="Y" &&
                        <table className="table itemdesc-table table-bordered m-b-0">
                                <tr className="grey-bg"> 
                                    <th rowSpan="2">#</th>
                                    <th rowSpan="2">
                                        Item and Description
                                    </th>
                                    <th rowSpan="2">
                                        Qty
                                    </th>
                                    <th rowSpan="2">
                                        Rate
                                    </th>
                                    <th colSpan="2">
                                        IGST
                                    </th>
                                    <th rowSpan="2">
                                        Amount
                                    </th>
                                </tr>
                                <tr className="grey-bg"> 
                                    <th>%</th>
                                    <th style={{borderRight:'1px solid #ddd'}}>Amt</th>
                                </tr>
                            {
                                this.props.invoices.invoiceitems.map((item, index) => {
                                return <tr>
                                        <td>{++index}</td>
                                        <td>{item.itemName}</td>
                                        <td>{(item.quantity).toFixed(2)}</td>
                                        <td>{(item.rate).toFixed(2)}</td>
                                        <td>{item.tax>=0?(item.tax).toString()+'%':"-"}</td>
                                        <td>{item.tax>=0?((item.quantity * item.rate * item.tax)/100).toFixed(2):"-"}</td>
                                        <td>{(item.rate*item.quantity).toFixed(2)}</td>
                                    </tr>;
                                })
                            }
                        </table>
                    }
                    {
                        this.props.invoices.isIGST ==="N" &&
                        <table className="table itemdesc-table table-bordered m-b-0">
                                <tr className="grey-bg"> 
                                    <th rowSpan="2">#</th>
                                    <th rowSpan="2">
                                        Item and Description
                                    </th>
                                    <th rowSpan="2">
                                        Qty
                                    </th>
                                    <th rowSpan="2">
                                        Rate
                                    </th>
                                    <th colSpan="2">
                                        CGST
                                    </th>
                                    <th colSpan="2">
                                        SGST
                                    </th>
                                    <th rowSpan="2">
                                        Amount
                                    </th>
                                </tr>
                                <tr className="grey-bg"> 
                                    <th>%</th>
                                    <th style={{borderRight:'1px solid #ddd'}}>Amt</th>
                                    <th>%</th>
                                    <th style={{borderRight:'1px solid #ddd'}}>Amt</th>
                                </tr>

                             {
                                this.props.invoices.invoiceitems.map((item, index) => {
                                return <tr>
                                        <td>{++index}</td>
                                        <td>{item.itemName}</td>
                                        <td>{(item.quantity).toFixed(2)}</td>
                                        <td>{(item.rate).toFixed(2)}</td>
                                        <td>{item.tax>=0?(item.tax/2).toString()+'%':"-"}</td>
                                        <td>{item.tax>=0?((item.quantity * item.rate * item.tax/2)/100).toFixed(2):"-"}</td>
                                        <td>{item.tax>=0?(item.tax/2).toString()+'%':"-"}</td>
                                        <td>{item.tax>=0?((item.quantity * item.rate * item.tax/2)/100).toFixed(2):"-"}</td>
                                        <td>{(item.rate*item.quantity).toFixed(2)}</td>
                                    </tr>;
                                })
                            }
                        </table>
                    }
                    <div className="row">
                        <div className="col-md-7">
                            <p className="font-bold">{this.RsPaise(Math.round(this.returnTotalAmount()['totalAmount']*100)/100)}</p>
                        </div>
                        <div className="col-md-5">
                            <table className="subtotal-table">
                                <tr>
                                    <td>Subtotal</td>
                                    <td>: {this.returnTotalAmount()['subTotal']}</td>
                                </tr> 
                                {
                                    taxArray && taxArray!=="undefined" && taxArray!==null && taxArray.length > 0 &&
                                    this.props.invoices.isIGST === "Y" &&
                                    taxArray.map((itemTax, indexTax) => {   
                                        return <tr>
                                            <td>{'IGST'+itemTax.percentage*2+' ('+itemTax.percentage*2+'%)'}</td>
                                            <td>: {(itemTax.amount*2).toFixed(2)}</td>
                                        </tr> 
                                        })
                                }
                                {
                                    taxArray && taxArray!=="undefined" && taxArray!==null && taxArray.length > 0 &&
                                    this.props.invoices.isIGST === "N" &&
                                    taxArray.map((itemTax, indexTax) => {   
                                        return <Router><tr>
                                            <td>{'CGST'+itemTax.percentage+' ('+itemTax.percentage+'%)'}</td>
                                            <td>: {parseFloat(itemTax.amount).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>{'SGST'+itemTax.percentage+' ('+itemTax.percentage+'%)'}</td>
                                            <td>: {parseFloat(itemTax.amount).toFixed(2)}</td>
                                        </tr>  
                                        </Router>
                                        })
                                }
                                <tr className="grey-bg" style={{fontWeight:600}}>
                                    <td>Total</td>
                                    <td>: <i className="fa fa-inr" aria-hidden="true"></i>{this.returnTotalAmount()['totalAmount']}</td>
                                </tr> 
                            </table>
                        </div>
                    </div>
                    <p className="m-b-0 font-bold">Notes</p>
                    <p>
                    {(this.props.invoices.customerNotes && this.props.invoices.customerNotes!=="undefined" && this.props.invoices.customerNotes!==null)?this.props.invoices.customerNotes:''}
                    </p>
                    <p className="m-b-0 font-bold">Terms and Conditions</p>
                    <p>
                    {(this.props.invoices.termsAndConditions && this.props.invoices.termsAndConditions!=="undefined" && this.props.invoices.termsAndConditions!==null)?this.props.invoices.termsAndConditions:''}
                    </p>
                </div>
                </div>
            </Router>
        );
    }
}

export default Estimateoverview;