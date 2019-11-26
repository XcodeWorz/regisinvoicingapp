import React, { Component } from 'react';
import * as Constants from '../../../constants';
import Sidebar from '../../layoutsComponent/sidebar';
import Modal from 'react-bootstrap-modal';
import  pdfMake  from '../../../../public/assets/js/pdfmake.min.js';
import "../../../../public/assets/js/vfs_fonts.js";
import Pagination from '../pagination';
import Dropdown from '../uielements/dropdown';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import SpinnerLoader from 'react-loader-spinner';

import {
    BrowserRouter as Router
} from 'react-router-dom';

class Estimatelist extends Component {
    constructor(props) {
    super(props);
    this.state = {
            show: false,
            cloneEstimateId:'',
            cloneEstimateNo:'',
            estimateId: '',
            contactId: '',
            estimateNo: '',
            orderNo: '',
            customerNotes:'',
            termsAndConditions:'',
            status:'',
            itemId:'',
            quantity:'',
            rate:'',
            amount:'',
            pageNo:1,
            totalCount:0,
            pageOfItems: [],
            searchFilter:'',
            searchFilterStatus:'',
            searchFilterFromDate:'',
            searchFilterToDate:'',
            totalInvoice:{},

            pdfInvoice:[],
            pdfLogo:'',
            pdfName:'',
            pdfAddress:'',
            pdfGSTNo:'',
            pdfEstimateNo:'',
            pdfIsIGST:'',
            pdfEstimateDate:'',
            pdfStatus:'',
            pdfDueDate:'',
            pdfPlaceOfSupply:'',
            pdfCustomerName:'',
            pdfCustomerAddress:'',
            pdfCustomerGSTNo:'',
            pdfItems:{},
            pdfWords:'',
            pdfSubTotal:'',
            pdfTax:'',
            pdfTaxPercentage:'',
            pdfTotalAmount:'',
            pdfCustomerNotes:'',
            pdfTermsAndCondition:'',
            
            emailEstimateId:'',
            emailEstimateNo:'',
            emailTo:'',
            emailToName:'',
            emailFrom:'',
            emailSubject:'Estimate',
            emailMessage:'Please find the attached estimate',
            modalerrors:{},
            errors:{},


            modalMsg:"",
            modalEstimateId:'',
            modalStatus:'',
            showStatusModal:false,
        };
        
        this.open = this.open.bind(this);
        this.openMail = this.openMail.bind(this);
        this.close = this.close.bind(this);
        this.closeMail = this.closeMail.bind(this);
        this.getInitialState = this.getInitialState.bind(this);
        this.getInitialStateMail = this.getInitialStateMail.bind(this);
        this.cloneOperate = this.cloneOperate.bind(this);
        this.downloadPdf = this.downloadPdf.bind(this);
        this.mailPdf = this.mailPdf.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSearchStatus = this.handleSearchStatus.bind(this);
        this.handleSearchFromDate = this.handleSearchFromDate.bind(this);
        this.handleSearchToDate = this.handleSearchToDate.bind(this);
        this.handleSearchStatus = this.handleSearchStatus.bind(this);
        this.handleChangeMail = this.handleChangeMail.bind(this);
        this.handleSubmitMail = this.handleSubmitMail.bind(this);
        this.onDropDownItemClick = this.onDropDownItemClick.bind(this);
        this.cloneInvoice = this.cloneInvoice.bind(this);
        this.downloadPdf = this.downloadPdf.bind(this);
        this.mailPdf = this.mailPdf.bind(this);

        this.statusOperate = this.statusOperate.bind(this);
        this.closeStatusModal = this.closeStatusModal.bind(this);
        
    }

    componentDidMount() {
        document.getElementById("spinnerLoaderBody").style.display = "block";
        this.makeList();
    }
    
    handleChangeMail(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    closeStatusModal()
    {
        this.setState({
            modalMsg:"",
            modalEstimateId:"",
            modalStatus:"",
            showStatusModal:false,
        });
    }

    statusOperate()
    {
        fetch(Constants.BASE_URL_API+"changeestimatestatus",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({estimateId:this.state.modalEstimateId,status:this.state.modalStatus})
        })
        .then(response => { return response.json(); } )
        .then(data => {
           this.makeList();
           this.closeStatusModal();
        });
    }

    async handleSearchStatus(e) {
        await this.setState({searchFilterStatus:e.target.value});
    }
    
     handleSubmitMail(e) {
        e.preventDefault();
        
        if(!this.validateForm())
        {
           document.getElementById("modal_email").disabled; 
           this.downloadPdf(this.state.emailEstimateId,'Y');
        }
    }

    async onChangePage(page) {
        if(page != this.state.pageNo){
            this.setState({
                pageNo:page
            },()=>{
                fetch(Constants.BASE_URL_API+"getestimates",
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
                        pageOfItems:data.invoices,
                        totalCount:data.totalCount
                    });
                });
            });
        }
        
    }
   
    validateForm()
    {
        var error_flag = false;
        let modalerrors = {};
        if(this.state.emailTo === "")
        {
            error_flag = true;
            modalerrors['emailTo'] = "Please enter to email!";
        }
        if(this.state.emailTo != "")
        {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if(!pattern.test(this.state.emailTo)) {
                error_flag = true;
                modalerrors["emailTo"] = "Please enter valid email ID!";
            }
        }
        if(this.state.emailSubject === "")
        {
            error_flag = true;
            modalerrors['emailSubject'] = "Please enter subject!";
        }
        
        this.setState({
        modalerrors: modalerrors
      });
        return error_flag;
    }
    
     async handleSearch(e) {
        await this.setState({searchFilter:e.target.value});
    }

    search()
    {
        var error_flag = false;
        let errors = {};
        if (this.state.searchFilter === "" &&
            this.state.searchFilterFromDate==="" &&
            this.state.searchFilterToDate==="" && 
            this.state.searchFilterStatus===""
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
            this.setState({pageNo:1},()=>{
                this.makeList();
            });
        }
    }
    
    makeList()
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
                pageOfItems:res1.invoices,
                totalCount:res1.totalCount});
            document.getElementById("spinnerLoaderBody").style.display = "none";
        });
       
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
    
    getInitialState()
    {
        return { showModal: false };
    }
    getInitialStateMail()
    {
        return { showModalMail: false };
    }
    
    close()
    {
        this.setState({ showModal: false });
    }

  open()
  {
    this.setState({ showModal: true });
  }
  
   openMail()
  {
    this.setState({ showModalMail: true });
  }
    closeMail()
    {
        this.setState({ showModalMail: false });
    }
  
   cloneInvoice(estimateId,estimateNo)
   {
        this.open();
        this.setState({cloneEstimateId:estimateId,cloneEstimateNo:estimateNo});
   }
   
   clearFilter()
   {
        this.setState({
            searchFilter:'',
            searchFilterStatus:'',
            searchFilterFromDate:'',
            searchFilterToDate:'',
            pageNo:1
            },()=>{
                this.makeList();
            });
        
   }

   cloneOperate()
   {
        this.props.history.push('/cloneestimate/'+this.state.cloneEstimateId);
   }
   
    onDropDownItemClick(item, index){
        switch(index){
            case 0://EDIT
                this.props.history.push("/editestimate/"+item.estimateId);
                break;
            case 1: //CLONE
                this.cloneInvoice(item.estimateId, item.estimateNo);
                break;
            case 2://Download PDF
                this.downloadPdf(item.estimateId,'N')
                break;
            case 3://Mail PDF
                this.mailPdf(item.estimateId, item.estimateNo, item.email, item.firstName)
                break;
            case 4://Convert to invoice
                this.props.history.push("/convertestimateinvoice/"+item.estimateId);
                break;
            case 5://status change
                this.changeStatus(item.estimateId,item.invoice_status)
                break;

        }
    }
    changeStatus(id,status,index)
    {
        let msg = "";
        let newstatus = "";
        if(status === Constants.DRAFT_STATUS)
        {
           newstatus = Constants.DUE_ON_DATE_STATUS;
        }
        msg = "Are you sure you want to change the status to "+newstatus;
        this.setState({
            modalEstimateId:id,
            modalMsg:msg,
            modalStatus:newstatus,
            showStatusModal:true,
        });
    }

   async mailPdf(estimateId,estimateNo,emailTo,emailToName)
   {
        this.openMail();
        this.setState({emailEstimateId:estimateId,emailEstimateNo:estimateNo,emailTo:emailTo,emailToName:emailToName,emailSubject:'Estimate-'+estimateNo});
   }

   returnTaxArray()
   {
       let taxArray	=	[];
       let taxTmpArray = [];
       let variableTmpArray = [];
       let totalAmount = 0;
       let subTotal = 0;
       this.state.pdfItems && this.state.pdfItems!=="undefined" && this.state.pdfItems!==null &&
       this.state.pdfItems.map((itemholder2, idx2) => {
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
       this.state.pdfItems && this.state.pdfItems!=="undefined" && this.state.pdfItems!==null &&
       this.state.pdfItems.map((itemholder2, idx2) => {
           if(this.state.pdfInvoice.isTaxExclusive === "Y"){
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
       return taxArray;
   }
   
   async downloadPdf(estimateId,isEmail)
   {
        document.getElementById("spinnerLoaderDivPdf").style.display = "block";
        await Promise.all([fetch(Constants.BASE_URL_API+"getestimatedetails",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({estimateId:estimateId})
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
        this.setState({
            pdfInvoice:res1.invoices[0],
            pdfLogo:res2.settings[0].imagePath,
            pdfName:res1.invoices[0].invoiceCompanyName,
            pdfAddress:res1.invoices[0].companyAddress,
            pdfGSTNo:res1.invoices[0].companyGSTNo,
            pdfEstimateNo:res1.invoices[0].estimateNo,
            pdfIsIGST:res1.invoices[0].isIGST,
            pdfEstimateDate:res1.invoices[0].estimateDate,
            pdfStatus:res1.invoices[0].status,
            pdfDueDate:res1.invoices[0].dueDate,
            pdfPlaceOfSupply:res1.invoices[0].contactPlaceOfSupply,
            pdfCustomerName:res1.invoices[0].contactCompanyName,
            pdfCustomerAddress:res1.invoices[0].contactAddress,
            pdfCustomerGSTNo:res1.invoices[0].contactGSTIN,
            pdfItems:res1.invoices[0].invoiceitems,
            pdfCustomerNotes:res1.invoices[0].customerNotes,
            pdfTermsAndCondition:res1.invoices[0].termsAndConditions,
            pdfSubTotal:res1.invoices[0].subTotal.toFixed(2),
            pdfTotalAmount:res1.invoices[0].totalAmount.toFixed(2)
            });
      });
    
        let variableTmpArray = [];
        let totalAmount = 0;
        let subTotal = 0;

        this.state.pdfItems.map((itemholder2, idx2) => {
        if(this.state.pdfInvoice.isTaxExclusive === "Y"){
            variableTmpArray[itemholder2.tax]+= parseFloat(((itemholder2.quantity * itemholder2.rate ) * (itemholder2.tax)/2)/100); 
        }
        else
        {
            let itemTotalPrice = itemholder2.quantity * itemholder2.rate;
            let taxPercentage = (itemholder2.tax);
            let taxAmount = itemTotalPrice - (itemTotalPrice/(1+(taxPercentage/100)))
            let sub = (itemTotalPrice - taxAmount)
            subTotal += sub
            totalAmount += (sub+taxAmount);
            variableTmpArray[itemholder2.tax] += (taxAmount/2);
        }
    })
    subTotal = subTotal.toFixed(2);
    totalAmount = totalAmount.toFixed(2);

    var itemsResult = [];
    var taxTotal = [];
    var array = [];
    var array1 = [];
   
     var itemObj = {
            text:'#',
            style:'tableHeaderNew',
            alignment:'center',
            rowSpan:2
            };
        array.push(itemObj);
        var itemObj = {
            text:'Item & Description',
            style:'tableHeaderNew',
            alignment:'center',
            rowSpan:2
            };
        array.push(itemObj);
        var itemObj = {
          text:'Qty',
          style:'tableHeaderNew',
          alignment:'center',
          rowSpan:2
          };
        array.push(itemObj);
        var itemObj = {
            text:'Rate',
            style:'tableHeaderNew',
            alignment:'center',
            rowSpan:2
            };
        array.push(itemObj);
        
        if(this.state.pdfIsIGST && this.state.pdfIsIGST == "N")
        {
            var itemObj = {
                text:'CGST',
                style:'tableHeaderNew',
                alignment:'center',
                colSpan:2
                };
            array.push(itemObj);
            var itemObj = {
                text:'',
                style:'tableHeaderNew',
                alignment:'center'
                };
            array.push(itemObj);
             var itemObj = {
                text:'SGST',
                style:'tableHeaderNew',
                alignment:'center',
                colSpan:2
                };
            array.push(itemObj);
            var itemObj = {
                text:'',
                style:'tableHeaderNew',
                alignment:'center'
                };
            array.push(itemObj);
        }
        else if(this.state.pdfIsIGST && this.state.pdfIsIGST == "Y")
        {
              var itemObj = {
                text:'IGST',
                style:'tableHeaderNew',
                alignment:'center',
                colSpan:2
                };
            array.push(itemObj);
            var itemObj = {
                text:'',
                style:'tableHeaderNew',
                alignment:'center'
                };
            array.push(itemObj);
        }
        
        var itemObj = {
            text:'Amount',
            style:'tableHeaderNew',
            alignment:'center',
            rowSpan:2
            };
        array.push(itemObj);
        itemsResult.push(array);
        
        var array=  [];
         var itemObj = {
            text:'',
            style:'tableHeader',
            alignment:'center'
            };
        array.push(itemObj);
        var itemObj = {
            text:'',
            style:'tableHeader',
            alignment:'center'
            };
        array.push(itemObj);
        var itemObj = {
          text:'',
          style:'tableHeader',
          alignment:'center'
          };
        array.push(itemObj);
        var itemObj = {
            text:'',
            style:'tableHeader',
            alignment:'center'
            };
        array.push(itemObj);
       
       if(this.state.pdfIsIGST && this.state.pdfIsIGST == "N")
       {
            var itemObj = {
                text:'%',
                style:'tableHeader',
                alignment:'center'
                };
            array.push(itemObj);
            var itemObj = {
                text:'Amt',
                style:'tableHeader',
                alignment:'center'
                };
            array.push(itemObj);
             var itemObj = {
                text:'%',
                style:'tableHeader',
                alignment:'center'
                };
            array.push(itemObj);
            var itemObj = {
                text:'Amt',
                style:'tableHeader',
                alignment:'center'
                };
            array.push(itemObj);
       }
       else if(this.state.pdfIsIGST && this.state.pdfIsIGST == "Y")
       {
             var itemObj = {
                text:'%',
                style:'tableHeader',
                alignment:'center'
                };
            array.push(itemObj);
            var itemObj = {
                text:'Amt',
                style:'tableHeader',
                alignment:'center'
                };
            array.push(itemObj);
       }
        
        var itemObj = {
            text:'Amount',
            style:'tableHeader',
            alignment:'center'
            };
        array.push(itemObj);
        itemsResult.push(array);
        
        var itemObj1 = {
            text:'Sub Total',
            fontSize:8,
            margin:[5,5,5,5]
            };
        array1.push(itemObj1);
        if(this.state.pdfInvoice.isTaxExclusive==="N")
        {
            var itemObj1 = {
                text:': '+subTotal,
                fontSize:8,
                margin:[5,5,5,5]
                };
        }
        else
        {
            var itemObj1 = {
                text:': '+this.state.pdfSubTotal,
                fontSize:8,
                margin:[5,5,5,5]
                };
        }
        array1.push(itemObj1);
        
        taxTotal.push(array1);
        let taxArray = this.returnTaxArray();
    
    if(this.state.pdfIsIGST && this.state.pdfIsIGST == "N")
    {
        for(let item of taxArray){
            var array1 = [];
            var itemObj1 = {
                text:'CGST'+item.percentage+' ('+item.percentage+'%)',
                fontSize:8,
                margin:[5,5,5,5]
                };
            array1.push(itemObj1);
            
            var itemObj1 = {
                text:': '+parseFloat(item.amount).toFixed(2),
                fontSize:8,
                margin:[5,5,5,5]
                };
            array1.push(itemObj1);
            taxTotal.push(array1);
            
            var array1 = [];
            var itemObj1 = {
                text:'SGST'+item.percentage+' ('+item.percentage+'%)',
                fontSize:8,
                margin:[5,5,5,5]
                };
            array1.push(itemObj1);
            
            var itemObj1 = {
                text:': '+parseFloat(item.amount).toFixed(2),
                fontSize:8,
                margin:[5,5,5,5]
                };
            array1.push(itemObj1);
            taxTotal.push(array1);
        }
    }
    else if(this.state.pdfIsIGST && this.state.pdfIsIGST == "Y")
    {
         for(let item of taxArray){
            var array1 = [];
            var itemObj1 = {
                text:'IGST'+item.percentage*2+' ('+item.percentage*2+'%)',
                fontSize:8,
                margin:[5,5,5,5]
                };
            array1.push(itemObj1);
            
            var itemObj1 = {
                text:': '+(item.amount*2).toFixed(2),
                fontSize:8,
                margin:[5,5,5,5]
                };
            array1.push(itemObj1);
            taxTotal.push(array1);
         } 
    }
    
    
    
    var counter = 0;
    for(let item of this.state.pdfItems){
        counter++;
        var array = [];
        var itemObj = {
            text:counter,
            style:'tableBody',
            alignment:'center'
            };
        array.push(itemObj);
        var itemObj = {
            text:item.itemName,
            style:'tableBody',
            alignment:'center'
            };
        array.push(itemObj);
        var itemObj = {
          text:(item.quantity).toFixed(2),
          style:'tableBody',
          alignment:'center'
          };
        array.push(itemObj);
        var itemObj = {
            text:(item.rate).toFixed(2),
            style:'tableBody',
            alignment:'center'
            };
        array.push(itemObj);
        
        if(this.state.pdfIsIGST && this.state.pdfIsIGST == "N")
        {
            var itemsWidth = [8,120,18,'*',15,50,15,50,'*'];
            var itemObj = {
               text:(item.tax>=0)?(item.tax/2).toString()+'%':'-',
               style:'tableBody',
               alignment:'center'
               };
           array.push(itemObj);
            var itemObj = {
               text:(item.tax>=0)?((item.quantity * item.rate * item.tax/2)/100).toFixed(2):'-',
               style:'tableBody',
               alignment:'center'
               };
           array.push(itemObj);
           
           var itemObj = {
               text:(item.tax>=0)?(item.tax/2).toString()+'%':'-',
               style:'tableBody',
               alignment:'center'
               };
           array.push(itemObj);
            var itemObj = {
               text:(item.tax>=0)?((item.quantity * item.rate * item.tax/2)/100).toFixed(2):'-',
               style:'tableBody',
               alignment:'center'
               };
           array.push(itemObj);
        
        }
        else if(this.state.pdfIsIGST && this.state.pdfIsIGST == "Y")
        {
            var itemsWidth = [8,120,18,'*',15,50,'*'];
             var itemObj = {
               text:(item.tax>=0)?(item.tax).toString()+'%':'-',
               style:'tableBody',
               alignment:'center'
               };
           array.push(itemObj);
            var itemObj = {
               text:(item.tax>=0)?((item.quantity * item.rate * item.tax)/100).toFixed(2):'-',
               style:'tableBody',
               alignment:'center'
               };
           array.push(itemObj);
        }
        
        var itemObj = {
            text:(item.rate*item.quantity).toFixed(2),
            style:'tableBody',
            alignment:'center'
            };
        array.push(itemObj);
        itemsResult.push(array);
       
    }
    
    var array1 = [];
     var itemObj1 = {
        text:'Total',
        fontSize:8,
        bold:true,
        fillColor:'#e6e6e6',
        margin:[5,5,5,5]
        };
    array1.push(itemObj1);
    
    if(this.state.pdfInvoice.isTaxExclusive==="N")
    {
        var itemObj1 = {
            text:': ₹'+totalAmount,
            fontSize:8,
            bold:true,
            fillColor:'#e6e6e6',
            margin:[5,5,5,5]
            };
    }
    else
    {
        var itemObj1 = {
            text:': ₹'+this.state.pdfTotalAmount,
            fontSize:8,
            bold:true,
            fillColor:'#e6e6e6',
            margin:[5,5,5,5]
            };
    }
    array1.push(itemObj1);
    
    taxTotal.push(array1);
    
    var docDefinition = {
        
    content: [
       
        {
            columns: [
				{
                    image: this.state.pdfLogo,
                    width: 120,
                    margin: [0, 20, 0, 0],
                },
                {
                    width: 20,
                    text:''
                },
				{
					width:'*',
                    text: [
                            {text: this.state.pdfName+' \n', fontSize: 12, bold: true},
                            {text: this.state.pdfAddress+' \n', fontSize: 8},
                            {text: 'GSTIN '+this.state.pdfGSTNo, fontSize: 8}
                        ]
				},
                {
					width:50,
                    text:''
				},
               
			]
        },
        
        {
            columns: [
                    {
                        width:'*',
                        text: [
                                {text: 'ESTIMATE \n', fontSize: 16, bold: true, style:'taxInvoice'},
                            ],
                        margin: [400, 0, 0, 6],
                    }
                ]
        },
        
        {
            style: 'firstTable',
            table: {
                widths: ['*', '*'],
                body: [
                        [
                            {
                                style: 'secondTable',
                                table: {
                                    body: [
                                                [
                                                    {text: 'Estimate No.',style:'invoiceHeadHeaderStyle'},
                                                    {text: ': '+this.state.pdfEstimateNo,style:'invoiceHeadContentStyle'}
                                                ],
                                                [
                                                    {text: 'Estimate Date',style:'invoiceHeadHeaderStyle'}, 
                                                    {text: ': '+(new Date(this.state.pdfEstimateDate).getDate()) + "-" + (new Date(this.state.pdfEstimateDate).getMonth() + 1) + "-" + (new Date(this.state.pdfEstimateDate).getFullYear()),style:'invoiceHeadContentStyle'}
                                                ]
                                        ]
                                    },
                                layout: 'noBorders',
                                margin:[0,0,0,6]
                            },
                            
                            {
                                style: 'secondTable',
                                table: {
                                    body: [
                                                [
                                                    {text: 'Place Of Supply',style:'invoiceHeadHeaderStyle'},
                                                    {text: ': '+this.state.pdfPlaceOfSupply,style:'invoiceHeadContentStyle'}
                                                ]
                                        ]
                                    },
                                layout: 'noBorders'
                            }
                       ],
                        [
                            	{colSpan:2, text:'Bill To', fontSize:8},{}
                        ]
                    ]
                },
                layout: {
				
				hLineColor: function (i, node) {
					return '#a6a6a6';
				},
				vLineColor: function (i, node) {
					return '#a6a6a6';
				},
                fillColor: function (rowIndex, node, columnIndex) {
					return (rowIndex % 2 !== 0) ? '#f2f2f2' : null;
				}
				
			}
        },
        
        {
            width:'*',
            text: [
                    {text: this.state.pdfCustomerName+' \n', fontSize: 10, bold: true},
                    {text: this.state.pdfCustomerAddress+' \n', fontSize: 8},
                    {text: 'GSTIN '+this.state.pdfCustomerGSTNo, fontSize: 8}
                ],
            style:'billToAddr'
		},
        
        {
            table: {
                        widths: itemsWidth,
                        body:  itemsResult
                },
                layout: {
				
                    hLineColor: function (i, node) {
                        return '#a6a6a6';
                    },
                    vLineColor: function (i, node) {
                        return '#a6a6a6';
                    },
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex === 0 || rowIndex === 1) ? '#f2f2f2' : null;
                    }
                }
        },
        
        {
            columns: [
				{
                    text: [
                            {text: 'Total In Words \n', fontSize: 8},
                            {text: this.state.pdfInvoice.isTaxExclusive==="N"?this.RsPaise(Math.round(totalAmount*100)/100):this.RsPaise(Math.round(this.state.pdfTotalAmount*100)/100), fontSize: 8, bold:true}
                           ],
                    width: 220,
                    margin: [0, 20, 0, 0],
                },
                {
                    width: 20,
                    text:''
                },
                
                {
                    style: 'bottomTable',
                    margin:[108,5,0,0],
                    table: {
                        widths:[80,'*'],
                        body: taxTotal
                        },
                        layout:'noBorders'
                },
                {
					width:20,
                    text:''
				}
			]
        },
        
        ((this.state.pdfCustomerNotes && this.state.pdfCustomerNotes !="") || (this.state.pdfTermsAndCondition && this.state.pdfTermsAndCondition !="")) &&
         {
            columns: [
				{
                    text: [
                            {text: 'Notes', fontSize: 8, bold: true}
                           ],
                    width: 220,
                    margin: [0, 20, 0, 0],
                },
                {
                    width: 20,
                    text:''
                },
                
                {
					width:20,
                    text:''
				}
			]
        },
        
        (this.state.pdfTermsAndCondition && this.state.pdfTermsAndCondition !="") &&
        {
            columns: [
				{
                    text: [
                             {text: (this.state.pdfTermsAndCondition)?this.state.pdfTermsAndCondition:''+' \n', fontSize: 8}
                        ],
                    width: 220,
                    margin: [0, 5, 0, 0],
                },
                {
                    width: 20,
                    text:''
                },
                
                {
					width:20,
                    text:''
				}
			]
        } ,
        
        (this.state.pdfCustomerNotes && this.state.pdfCustomerNotes !="") &&
        {
            columns: [
				{
                    text: [
                            {text: (this.state.pdfCustomerNotes)?this.state.pdfCustomerNotes:''+' \n', fontSize: 8}
                           ],
                    width: 220,
                    margin: [0, 5, 0, 0],
                },
                {
                    width: 20,
                    text:''
                },
                
                {
					width:20,
                    text:''
				}
			]
        },
        
        {
            columns: [
                  {
                    width: 300,
                    text:''
                },
                
				{
                    text: [
                            {text: 'Authorized signature \n', fontSize: 10}
                           ],
                    width: 200,
                    margin: [90, 80, 0, 0],
                },
                
                {
					width:20,
                    text:''
				}
			]
        },
        
        
	],
   
   		styles: {
            topPadding: {
            margin: [ 0, 10, 0, 0 ]
		 },
         invoiceHeadHeaderStyle:{
            	fontSize: 8,
                margin:[0,0,0,0]
         },
        invoiceHeadContentStyle:{
            	fontSize: 8,
                bold:true,
                margin:[40,0,0,0]
         },
         billToAddr:{
          margin:[0,5,0,10]
         },
         tableHeader:{
           fontSize:8,
           bold:true
         },
          tableHeaderNew:{
           fontSize:8,
           bold:true,
           margin:[0,10,0,0]
         },
         tableBody:{
            fontSize:8,
         },
         
        }
};

pdfMake.fonts = {
   Lato: {
      normal: 'Lato-Regular.ttf',
      bold: 'Lato-Bold.ttf',
      italics: 'Lato-Italic.ttf',
   }
};
if(isEmail == "N")
{
    pdfMake.createPdf(docDefinition).download('estimate-'+this.state.pdfEstimateNo+'.pdf');
}
else
{
    var filename = 'estimate-'+this.state.pdfEstimateNo+'.pdf';
    var emailTo = this.state.emailTo;
    var emailToName = this.state.emailToName;
    var emailSubject = this.state.emailSubject;
    var emailMessage = this.state.emailMessage;
    
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBase64((data1) => {
        fetch(Constants.BASE_URL_API+"sendinvoicemail",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams(
                {
                    sendGridAPIKey:Constants.SEND_GRID_API_KEY,
                    templateID:Constants.INVOICE_TEMPLATE_ID,
                    filename:filename,
                    file:data1,
                    toEmail:emailTo,
                    toName:emailToName,
                    fromEmail:Constants.EMAIL_FROM,
                    fromName:Constants.EMAIL_FROM_NAME,
                    subject:emailSubject,
                    message:emailMessage
                }
            )
        })
        .then(response => { return response.json(); } )
        .then(data =>
              {
                this.closeMail();
            });
    });
   
    
}

document.getElementById("spinnerLoaderDivPdf").style.display = "none";

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
                      <span className="tophead-txt">Estimates >> View List</span>
                      <span className="tophead-txt pull-right"></span>
                    </a>
                   </div>
                </nav>
                
                 <div className="main-content">
        <div className="content-view">
            <div id="spinnerLoaderDivPdf" className="react-spinner-pdf">
                <SpinnerLoader type={Constants.LOADER_TYPE} color={Constants.LOADER_COLOR} height={50} width={50} />
            </div>

        <div className="card">
            <div className="sec-t-container m-b-2">
                <h4 className="card-title">Search Filters</h4>
            </div>

            <div className="card-block">
           
                <div className="row">
                    <div className="col-lg-3">
                        <b>Search</b>
                        <fieldset className="form-group">
                            <input className="srh-fld" id="search_data" value="" onChange={this.handleSearch} value={this.state.searchFilter}/>
                        </fieldset>
                    </div>

                    <div className="col-lg-3">
                        <b>Status:</b>
                        <select className="form-control" name="search_status" onChange={this.handleSearchStatus} value={this.state.searchFilterStatus}>
                        <option value="">--select status--</option>
                        <option value={Constants.DRAFT_STATUS}>{Constants.DRAFT_STATUS}</option>
                        <option value={Constants.SENT_STATUS}>{Constants.SENT_STATUS}</option>
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
            <div className="sec-t-container m-b-2"><h4 className="card-title">Estimates List</h4>
            <a className="btn btn-primary add-new" href="/addestimate">
                <i className="fa fa-plus-circle" aria-hidden="true"></i> Add New
            </a>
            </div>
            <div className="card-block">
                <div id="spinnerLoaderBody" className="react-spinner">
                    <SpinnerLoader type={Constants.LOADER_TYPE} color={Constants.LOADER_COLOR} height={50} width={50} />
                </div>
                <div className="">
                    <table className="table m-b-0">
                        <thead>
                            <tr>
                                <th>Sl No</th>
                                <th>Estimate</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                        {
                            this.state.pageOfItems && this.state.pageOfItems!=="undefined" && this.state.pageOfItems !==null &&
                            this.state.pageOfItems.length > 0 && this.state.pageOfItems.map(function(item,index) {
                                let itemsObj = [Constants.LISTING_EDIT, Constants.LISTING_CLONE, Constants.LISTING_DOWNLOAD, Constants.LISTING_EMAIL, Constants.LISTING_CONVERT];
                                let itemsIconsObj = [Constants.LISTING_EDIT_ICON, Constants.LISTING_CLONE_ICON, Constants.LISTING_DOWNLOAD_ICON, Constants.LISTING_EMAIL_ICON, Constants.LISTING_CONVERT_ICON];
                                
                                if(item.invoice_status === Constants.DRAFT_STATUS)
                                {
                                    itemsObj.push(Constants.LISTING_MARK_SENT);
                                    itemsIconsObj.push(Constants.LISTING_CONVERT_ICON);
                                }
                                return <tr>
                                    <td>{((this.state.pageNo-1)*Constants.RESULT_SET_SIZE)+(++index)}</td>
                                    <td>
                                        <a className="row-header" href={"estimatedetails/"+item.estimateId}>{item.estimateNo}<br/></a>
                                        <b>Date: </b>
                                        {(new Date(item.estimateDate).getDate()) + "-" + (new Date(item.estimateDate).getMonth() + 1) + "-" + (new Date(item.estimateDate).getFullYear())}
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
                                    <span className="status-span"><b>{(item.invoice_status)?item.invoice_status:'N/A'}</b></span>
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
    
     <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
           <Modal.Title>Warning!!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="wr-msg">Are you sure you want to clone <br/> Estimate No. {this.state.cloneEstimateNo}?</div>
            <div className="text-center">
                <button className="btn btn-info btn-md" type="button" onClick={this.close}>No</button>
                <button className="btn btn-primary btn-md" type="button" id="modal_button" onClick={this.cloneOperate}>Yes</button>
            </div>
          </Modal.Body>
         
        </Modal>
        
        <Modal show={this.state.showModalMail} onHide={this.closeMail}>
          <Modal.Header closeButton>
           <Modal.Title>Email Invoice No. {this.state.emailEstimateNo}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          
           <form action="javascript:void(0);" onSubmit={this.handleSubmitMail} id="modal_form_reason">
              <fieldset className="form-group">
                <label for="emailFrom">
                From:<span className="mandatory"></span>
                </label>
                <p>{Constants.EMAIL_FROM_NAME} {Constants.EMAIL_FROM}</p> 
            </fieldset>
             <fieldset className="form-group">
                <label for="emailTo">
                To<span className="mandatory">*</span>
                </label>
                <input className="form-control form-control-md" name="emailTo" onChange={this.handleChangeMail} value={this.state.emailTo} />
                 <span className="err_msg">{this.state.modalerrors.emailTo}</span>
            </fieldset>
            <br/>
             <fieldset className="form-group">
                <label for="emailSubject">
                Subject<span className="mandatory">*</span>
                </label>
                <input className="form-control form-control-md" name="emailSubject" onChange={this.handleChangeMail} value={this.state.emailSubject} />
                 <span className="err_msg">{this.state.modalerrors.emailSubject}</span>
            </fieldset>
             <fieldset className="form-group">
                <label for="emailMessage">
                Message<span className="mandatory"></span>
                </label>
                <textarea className="form-control form-control-md" name="emailMessage" onChange={this.handleChangeMail} value={this.state.emailMessage}>{this.state.emailMessage}</textarea>
                 <span className="err_msg">{this.state.modalerrors.emailMessage}</span>
            </fieldset>
           <button className="btn btn-info btn-md" type="button" onClick={this.closeMail}>Close</button>
           <button className="btn btn-primary btn-md" type="submit" id="modal_email">Send Email</button>
           </form>

          </Modal.Body>
         
        </Modal>

        <Modal show={this.state.showStatusModal} onHide={this.closeStatusModal}>
            <Modal.Header closeButton>
                <Modal.Title>Warning!!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="wr-msg">{this.state.modalMsg}</div>
                <div className="text-center">
                    <button className="btn btn-info btn-md" type="button" onClick={this.closeStatusModal}>No</button>
                    <button className="btn btn-primary btn-md" type="button" id="modal_button" onClick={this.statusOperate}>Yes</button>
                </div>
            </Modal.Body>
        </Modal>
       
        </Router>
    );
  }
}
export default Estimatelist;
