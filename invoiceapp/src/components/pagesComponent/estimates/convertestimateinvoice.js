import React, { Component } from 'react';
import  Loader  from '../../../../public/assets/images/spinner.GIF';
import * as Constants from '../../../constants';
import Sidebar from '../../layoutsComponent/sidebar';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Modal from 'react-bootstrap-modal';
import ReactSelectDropdown from 'react-select';
import {
    BrowserRouter as Router
} from 'react-router-dom';
import SpinnerLoader from 'react-loader-spinner';

const current_date = new Date();
const totalTaxAmount = 0;
const due_date = current_date.setMonth( current_date.getMonth() + 1 );

class Convertestimateinvoice extends Component {
    constructor(props) {
        super(props);

        //Check URL Path contains /editinvoice 
        this.isInvoice = true;
        
        this.state = {
            contacts:{},
            taxSlabs:{},
            invoiceDetails:{},
            invoiceId:'',
            itemholders: [{ itemName: "",quantity: "1",rate: "",amount:"",tax:"-1" }],
            listitems:[],
            isRegisteredUnderGST:"N",

            contactId:'',
            valueContact:'',
            invoiceNo:'',
            orderNo:'',
            invoiceDate:new Date(),
            dueDate:due_date,
            customerNotes:'',
            termsAndConditions:'',
            status:Constants.DUE_ON_DATE_STATUS,
            isTaxExclusive:'Y',
            errors:{},
            companyPlaceOfSupply:'',
            contactPlaceOfSupply:'',
            isIGST:'',
            warningmsg:'Remove duplicate item from items list.',
            customerStatus:Constants.ACTIVE_STATUS,

            placeholderItemStr:'',
            placeholderStr:'',
            
            showModal: false,
            showModalReason: false,
            modalerrors:{},
            modalName:'',
            modalDescription:'',
            modalIsTaxable:'',
            modalType:'',
            modalHsnCode:'',
            modalSacCode:'',
            modalSellingPrice:'',
            modalHsnCodeDisplay:false,
            modalSacCodeDisplay:false,
            modalReason:'',

            isSales:(this.isInvoice)?"Y":"N",
            type:(this.isInvoice)?"invoice":"",
            userType:(this.isInvoice)?Constants.USER_TYPE_CUSTOMER:"",

            contactCompanyName:'',
            contactAddress:'',
            contactGSTIN:'',
            contactPlaceOfSupply:''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeDue = this.handleChangeDue.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitModal = this.handleSubmitModal.bind(this);
        
        this.open = this.open.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.getInitialState = this.getInitialState.bind(this);
        this.getInitialStateReason = this.getInitialStateReason.bind(this);

        this.closeWarning = this.closeWarning.bind(this);
        this.openWarning = this.openWarning.bind(this);
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
        Promise.all([fetch(Constants.BASE_URL_API+"getcontacts",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams(this.state)
            }),
            fetch(Constants.BASE_URL_API+"getestimatedetails",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams({estimateId:this.props.match.params.id})
            }),
            fetch(Constants.BASE_URL_API+"getsettings",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams({settingsId:Constants.INVOICE_SETTINGS_ID})
            }),
            fetch(Constants.BASE_URL_API+"gettaxslabs",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams({taxSlabId:''})
            })
        ])
        .then(([res1,res2,res3,res4]) => { 
            return Promise.all([res1.json(), res2.json(), res3.json(), res4.json()]) 
        })
        .then(([res1,res2,res3,res4]) => {
            var contactsArray = [];
            res1.contacts.length > 0 && res1.contacts.map(function(item,index) {
                var obj = {};
                obj["value"] = item.contactId;
                obj["label"] = item.displayName;
                obj["supply"] = item.placeOfSupply;

                obj["contactCompanyName"] = item.companyName;
                obj["contactAddress"] = item.address;
                obj["contactGSTIN"] = item.gstNo;
                obj["contactPlaceOfSupply"] = item.placeOfSupply;
                contactsArray.push(obj);
            });
            
            let resInvoiceDate = new Date(res2.invoices[0].estimateDate);
            const current_date = new Date();
            let resDueDate = current_date.setMonth( current_date.getMonth() + 1 );
            this.setState({
                invoiceId:this.props.match.params.id,
                contacts: contactsArray,
                invoiceDetails:res2.invoices,
                contactId:res2.invoices[0].contactId,
                valueContact:res2.invoices[0].displayName,
                invoiceNo:(this.isInvoice)?(res3.settings[0].invoicePrefix+res3.settings[0].invoiceNo):"",
                orderNo:res2.invoices[0].orderNo,
                invoiceDate:resInvoiceDate,
                dueDate:resDueDate,
                status:res2.invoices[0].status,
                itemholders:res2.invoices[0].invoiceitems,
                companyPlaceOfSupply:res3.settings[0].companyPlaceOfSupply,
                contactPlaceOfSupply:res2.invoices[0].placeOfSupply,
                isIGST:res2.invoices[0].isIGST,
                taxSlabs:res4,
                isTaxExclusive:this.isInvoice?res2.invoices[0].isTaxExclusive:'Y',
                isRegisteredUnderGST:res3.settings[0].isRegisteredUnderGST,
                customerNotes:(res2.invoices[0].customerNotes && res2.invoices[0].customerNotes !=="undefined" && res2.invoices[0].customerNotes !==null && this.isInvoice)?res2.invoices[0].customerNotes:(res3.settings[0].invoiceCustomerNotes && res3.settings[0].invoiceCustomerNotes!=="undefined" && res3.settings[0].invoiceCustomerNotes!==null && this.isInvoice)?res3.settings[0].invoiceCustomerNotes:'',
                termsAndConditions:(res2.invoices[0].termsAndConditions && res2.invoices[0].termsAndConditions !=="undefined" && res2.invoices[0].termsAndConditions !==null && this.isInvoice)?res2.invoices[0].termsAndConditions:(res3.settings[0].invoiceTermsAndConditions && res3.settings[0].invoiceTermsAndConditions!=="undefined" && res3.settings[0].invoiceTermsAndConditions!==null && this.isInvoice)?res3.settings[0].invoiceTermsAndConditions:'',
                settings:res3.settings[0],     

                contactCompanyName:(res2.invoices[0].contactCompanyName && res2.invoices[0].contactCompanyName !=="undefined" && res2.invoices[0].contactCompanyName !==null)?res2.invoices[0].contactCompanyName:'',
                contactAddress:(res2.invoices[0].contactAddress && res2.invoices[0].contactAddress !=="undefined" && res2.invoices[0].contactAddress !==null)?res2.invoices[0].contactAddress:'',
                contactGSTIN:(res2.invoices[0].contactGSTIN && res2.invoices[0].contactGSTIN !=="undefined" && res2.invoices[0].contactGSTIN !==null)?res2.invoices[0].contactGSTIN:'',
                contactPlaceOfSupply:(res2.invoices[0].contactPlaceOfSupply && res2.invoices[0].contactPlaceOfSupply !=="undefined" && res2.invoices[0].contactPlaceOfSupply !==null)?res2.invoices[0].contactPlaceOfSupply:'',
            });
            this.getItemsList();
            this.operateSpinnerLoader("close");
        });
    }

    getInitialState() {
        return { showModal: false };
    }
  
    getInitialStateReason() {
        return { showModalReason: false };
    }

    closeModal() {
        this.setState({ showModal: false, modalerrors:{} });
    }

    open() {
        this.setState({ showModal: true, modalerrors:{} });
    }
    
    handleItemholderItemIdChange = idx => evt => {
        const newItemholders = this.state.itemholders.map((itemholder, sidx) => {
        if (idx !== sidx) return itemholder;
        return { ...itemholder, itemName: evt.target.value };
        });

        this.setState({ itemholders: newItemholders });
    };
  
    handleItemholderItemQuantityChange = idx => evt => {
        const newItemholders = this.state.itemholders.map((itemholder, sidx) => {
        if (idx !== sidx) return itemholder;
        return { ...itemholder, quantity: evt.target.value };
        });
        this.setState({ itemholders: newItemholders });
    };
  
    handleItemholderItemRateChange = idx => evt => {
        const newItemholders = this.state.itemholders.map((itemholder, sidx) => {
        if (idx !== sidx) return itemholder;
        return { ...itemholder, rate: evt.target.value };
        });
        this.setState({ itemholders: newItemholders });
    };
  
    handleItemholderItemTaxChange = idx => evt => {
        const newItemholders = this.state.itemholders.map((itemholder, sidx) => {
        if (idx !== sidx) return itemholder;
        return { ...itemholder, tax: evt.target.value };
        });
        this.setState({ itemholders: newItemholders });
    };

    handleItemReactSelect = (idx,e) => {
        const newItemholders = this.state.itemholders.map((itemholder, sidx) => {
            if (idx !== sidx) return itemholder;
            return { ...itemholder,
                rate:e.sellingPrice,
                itemId: e.value,
                itemName: e.label,
                valueItem:e.value,
                placeholderItemStr:e.label
            };
        });
        this.setState({ itemholders: newItemholders });
    }

    handleContactReactSelect = (e) => {
        this.setState({
            valueContact:e.value,
            placeholderStr:e.label,
            contactPlaceOfSupply:e.supply,
            contactId:e.value,

            contactCompanyName:e.contactCompanyName,
            contactAddress:e.contactAddress,
            contactGSTIN:e.contactGSTIN,
            contactPlaceOfSupply:e.contactPlaceOfSupply

        });
    }


    handleChange(e) {
        if(e.target)
        {
            const { name, value } = e.target;
            this.setState({ [name]: value });
        }
        else
        {
            this.setState({ invoiceDate: e });
        }

        if(e.target.name==="modalType" && e.target.value === Constants.ITEM_TYPE_GOODS)
        {
            this.setState({ modalHsnCodeDisplay: true, modalSacCodeDisplay:false });
        }
        else if(e.target.name==="modalType" && e.target.value === Constants.ITEM_TYPE_SERVICE)
        {
            this.setState({ modalSacCodeDisplay: true, modalHsnCodeDisplay:false });
        }
    }
    
    handleChangeDue(e) {
        this.setState({ dueDate: e });
    }
    
    handleSubmit(status,e) {
        e.preventDefault();
        this.setState({ submitted: true });
        
        document.getElementById("wait").style.display="block";
        
        if(!this.validateForm())
        {
            document.getElementById("wait").style.display="none";


            let resInvoiceDate = new Date(this.state.invoiceDate);
            let formatted_date = resInvoiceDate.getFullYear() + "-" + (resInvoiceDate.getMonth() + 1) + "-" + resInvoiceDate.getDate();
            let subTotalFromSpan = document.getElementById("invoice-subTotal").innerHTML;
            let totalAmountFromSpan = document.getElementById("invoice-totalAmount").innerHTML;
        
            let formatted_due_date  =   null;
            if(this.state.dueDate && this.state.dueDate !="")
            {
                let resDueDate = new Date(this.state.dueDate);
                formatted_due_date = resDueDate.getFullYear() + "-" + (resDueDate.getMonth() + 1) + "-" + resDueDate.getDate();
            }
            
            let isIGST = "Y"
            if(
                this.state.companyPlaceOfSupply && 
                this.state.companyPlaceOfSupply !=="" && 
                this.state.contactPlaceOfSupply && 
                this.state.contactPlaceOfSupply !=="" &&
                this.state.companyPlaceOfSupply === this.state.contactPlaceOfSupply
                )
            {
                isIGST = "N"
            }

            if(
                this.state.settings.length > 0 &&
                this.state.settings.companyName === "" || !this.state.settings.companyName ||
                this.state.settings.companyAddress === "" || !this.state.settings.companyAddress ||
                this.state.settings.companyPlaceOfSupply === "" || !this.state.settings.companyPlaceOfSupply || 
                this.state.settings.gstNo === "" || !this.state.settings.gstNo)
            {
                this.setState({ showModalWarning: true, modalerrors:{} });
                return;
            }
            else
            {
                fetch(Constants.BASE_URL_API+"insertinvoice",
                {
                    method: "POST",
                    mode:'cors',
                    body: new URLSearchParams({
                        contactId:this.state.contactId,
                        invoiceNo:this.state.invoiceNo,
                        orderNo:this.state.orderNo,
                        invoiceDate:formatted_date,
                        dueDate:formatted_due_date,
                        customerNotes:this.state.customerNotes,
                        termsAndConditions:this.state.termsAndConditions,
                        status:status,
                        type:(this.isInvoice?Constants.INVOICE_TYPE_INV:""),
                        isIGST:isIGST,
                        subTotal:subTotalFromSpan,
                        totalAmount:totalAmountFromSpan,
                        totalTax:totalTaxAmount,
                        companyName:this.state.settings.companyName,
                        companyAddress:this.state.settings.companyAddress,
                        companyPlaceOfSupply:this.state.settings.companyPlaceOfSupply,
                        companyGSTNo:this.state.settings.gstNo,
                        items:JSON.stringify(this.state.itemholders),
                        isTaxExclusive:this.state.isTaxExclusive,
                        contactCompanyName:this.state.contactCompanyName,
                        contactAddress:this.state.contactAddress,
                        contactGSTIN:this.state.contactGSTIN,
                        contactPlaceOfSupply:this.state.contactPlaceOfSupply
                    })
                })
                .then(response => { return response.json(); } )
                .then(data =>
                {
                    document.getElementById("wait").style.display="none";
                    document.getElementById("contact_submit").disabled; 
                    if(data.responseCode)
                    {
                        if(this.isInvoice)
                            this.props.history.push('/invoicelist');
                    }
                    else
                    {
                        let errors = {};
                        errors['invoiceNo'] = data.responseMessage;  
                        this.setState({
                            errors: errors
                        });
                        document.getElementById("resp-msg").innerHTML = data.responseMessage;
                        setTimeout(function(){
                            this.setState({errors:{}});
                            document.getElementById("resp-msg").innerHTML = "";
                        }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
                        
                    }    
                });
            }
        }
        else
        {
            document.getElementById("wait").style.display="none";
        }
    }

    handleSubmitModal(e) {
        e.preventDefault();
        if(!this.validateFormModal())
        {
            fetch(Constants.BASE_URL_API+"insertitem",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams(
                    {
                        name:this.state.modalName,
                        description:this.state.modalDescription,
                        type:this.state.modalType,
                        isTaxable:this.state.modalIsTaxable,
                        hsnCode:this.state.modalHsnCode,
                        sacCode:this.state.modalSacCode,
                        price:this.state.modalSellingPrice,
                        isSales:this.state.isSales,
                    }
                )

            })
            .then(response => { return response.json(); })
            .then(data =>
                {
                    document.getElementById("modal_submit").disabled; 
                    if(data.responseCode)
                    {
                        this.close();
                        this.getItemsList();
                    }
                    else
                    {
                        document.getElementById("modal-resp-msg").innerHTML = data.responseMessage;
                    }    
                });
        }
        else
        {
        }
        
    }
    
    openWarning() {
        this.setState({ showModalWarning: true, modalerrors:{} });
    }
  
    closeWarning() {
        this.setState({ showModalWarning: false, modalerrors:{} });
    }
    
    isNumeric(val)
    {
        var reg = /^\d+$/;
        if( !reg.test( val ) )
        {
            return false;
        }
        return true;
    }
    
    validateForm()
    {
        var error_flag = false;
        let errors = {};
        if(this.state.contactId === "")
        {
            error_flag = true;
            errors['contactId'] = (this.isInvoice?"Please select customer!":"");
        }
        if(this.state.invoiceNo === "")
        {
            error_flag = true;
            errors['invoiceNo'] = (this.isInvoice?"Please select invoice number!":"");
        }
        if(this.state.isTaxExclusive === "" && this.isInvoice)
        {
            error_flag = true;
            errors['isTaxExclusive'] = "Please select tax exclusive or tax inclusive!";
        }
        
        if(this.state.itemholders.length > 0)
        {
            var items_list = this.state.itemholders;
            items_list.map(function(item,index) {
                if(item.itemId === "")
                {
                    error_flag = true;
                    errors['itemslist'] = "Please select an item!";
                }
                if(item.quantity === "")
                {
                    error_flag = true;
                    errors['itemslistquantity'] = "Please enter quantity!";
                }
                else
                {
                    var reg = /^\d+$/;
                    if( !reg.test( item.quantity ) )
                    {
                        error_flag = true;
                        errors['itemslistquantity'] = "Please enter a valid quantity!";
                    }
                    
                }
                if(item.rate === "")
                {
                    error_flag = true;
                    errors['itemslistrate'] = "Please enter rate!";
                }
                else
                {
                    var reg = /^\d*\.?\d*$/;
                    if( !reg.test( item.rate ) )
                    {
                        error_flag = true;
                        errors['itemslistrate'] = "Please enter a valid rate!";
                    }
                    
                }
            });
        }
        else
        {   
            error_flag = true;
            errors['itemslist'] = "Please select atleast one item!";   
        }
        
        this.setState({
            errors: errors
        });
        return error_flag;
    }

    isAmount(val)
    {
        var reg = /^\s*[+-]?(\d+|\.\d+|\d+\.\d+|\d+\.)(e[+-]?\d+)?\s*$/;
        if( !reg.test( val ) )
        {
            return false;
        }
        return true;
    }
    
    
    validateFormModal()
    {
        var error_flag = false;
        let errors = {};
        if(this.state.modalType ==="")
        {
            error_flag = true;
            errors["modalType"] = "Please enter type!";
            setTimeout(function(){
                this.setState({modalerrors:{}});
            }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
        }
        if(this.state.modalName === "")
        {
            error_flag = true;
            errors["modalName"] = "Please enter name!";
            setTimeout(function(){
                this.setState({modalerrors:{}});
            }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
        }
        if(this.state.modalIsTaxable ==="" && this.state.isRegisteredUnderGST === "Y")
        {
            error_flag = true;
            errors["modalIsTaxable"] = "Please select taxable or tax exempt!";
            setTimeout(function(){
                this.setState({modalerrors:{}});
            }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
        }
        if(this.state.modalSellingPrice ==="")
        {
            error_flag = true;
            errors["modalSellingPrice"] = "Please enter selling price!";
            setTimeout(function(){
                this.setState({modalerrors:{}});
            }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
        }
        else
        {
            if(!this.isAmount(this.state.modalSellingPrice))
            {
                error_flag = true;
                errors["modalSellingPrice"] = "Please enter valid selling price!";
                setTimeout(function(){
                    this.setState({modalerrors:{}});
                }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
            }
        }
        
        this.setState({
        modalerrors: errors
        });
        return error_flag;
    }
    
    handleAddItemholder = () => {
        this.setState({
        itemholders: this.state.itemholders.concat([{ itemName: "", quantity:"1", rate:"", tax:0, amount:""}])
        });
    };
  
    handleRemoveItemholder = idx => () => {
    if(idx !=0)
        this.setState({
        itemholders: this.state.itemholders.filter((s, sidx) => idx !== sidx)
        });
    };
  
    getItemsList()
    {
        Promise.all([fetch(Constants.BASE_URL_API+"getitems",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({isSales:this.state.isSales})
        })])
        .then(([res2]) => { 
            return Promise.all([res2.json()]) 
        })
        .then(([res2]) => {
            var itemsArray = [];
                res2.items.length > 0 && res2.items.map(function(item,index) {
                var objI = {};
                objI["value"] = item.itemId;
                objI["label"] = item.name;
                objI["sellingPrice"] = (item.price && item.price !=="undefined" && item.price !==null)?item.price:"";
                itemsArray.push(objI);
                });
            this.setState({listitems: itemsArray});
            console.log("Items list"+JSON.stringify(this.state.listitems));
        });
  
    }

  render() {
    const {
            invoiceNo,
            orderNo,
            customerNotes,
            termsAndConditions
        } = this.state;
        
    totalTaxAmount = 0;
        
    let taxArray	=	[];
    let taxTmpArray = [];
    let variableTmpArray = [];
    let totalAmount = 0;
    let subTotal = 0;
   
    this.state.itemholders.map((itemholder2, idx2) => {
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

    this.state.itemholders.map((itemholder2, idx2) => {
        if(this.state.isTaxExclusive === "Y"){
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
    var objTax	=	{
        percentage:(element/2).toString(),
        amount:variableTmpArray[element].toFixed(2)
    };
    totalTaxAmount += (variableTmpArray[element].toFixed(2))*2;
    
    taxArray.push(objTax);
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
                            <span className="tophead-txt">{this.isInvoice?"Invoices >> Convert To Invoice":""}</span>
                            <span className="tophead-txt pull-right"></span>
                        </a>
                    </div>
                </nav>
        
                <div className="main-content">
                    <div className="content-view">
                        <div className="card">
                            <div className="sec-t-container m-b-2"><h4 className="card-title">{this.isInvoice?"Convert To Invoice":""}</h4></div>
                            <div className="card-block">
                                <div id="spinnerLoaderDiv" className="react-spinner">
                                    <SpinnerLoader type={Constants.LOADER_TYPE} color={Constants.LOADER_COLOR} height={50} width={50} />
                                </div>
                                <div id="bodyDiv">
                                    <div id="wait" className="loader-login">
                                        <img src={Loader} width="64" height="64" />
                                    </div>	
                                    <form action="javascript:void(0);" id="contact_form">
                                        <div className="row">
                                            <div className="col-md-4 modal-ant">
                                                <fieldset className="form-group">
                                                    <label for="customerName">
                                                    {this.isInvoice?"Customer Name":""}<span className="mandatory">*</span>
                                                    </label>
                                                    <br/>
                                                    <ReactSelectDropdown
                                                        value={this.state.contacts && this.state.contacts !=="undefined" && this.state.contacts!==null && this.state.contacts.length > 0 && this.state.contacts.filter(option => option.value == this.state.contactId)}
                                                        options={this.state.contacts}
                                                        placeholder={this.state.placeholderStr}
                                                        onChange={this.handleContactReactSelect}
                                                        />
                                                    <span className="err_msg">{this.state.errors.contactId}</span>
                                                </fieldset>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4">
                                                <fieldset className="form-group">
                                                    <label for="invoiceNo">
                                                    {this.isInvoice?"Invoice No":""}<span className="mandatory">*</span>
                                                    </label>
                                                    <input type="text" className="form-control form-control-md" name="invoiceNo" onChange={this.handleChange} value={invoiceNo}/>
                                                    <span className="err_msg">{this.state.errors.invoiceNo}</span>
                                                </fieldset> 
                                            </div>
                                            <div className="col-md-4">
                                                <fieldset className="form-group">
                                                    <label for="orderNo">
                                                    Order Number<span className="mandatory"></span>
                                                    </label>
                                                    <input type="text" className="form-control form-control-md" name="orderNo" onChange={this.handleChange} value={orderNo}/>
                                                    <span className="err_msg">{this.state.errors.orderNo}</span>
                                                </fieldset>
                                            </div>
                                        </div>
                                        
                                        <div className="row">
                                            <div className="col-md-4"> 
                                                <fieldset className="form-group">
                                                    <label for="orderNo">
                                                    {this.isInvoice?"Invoice Date":""}<span className="mandatory">*</span>
                                                    </label>
                                                    <DatePicker
                                                    name="invoiceDate"
                                                    selected={this.state.invoiceDate}
                                                    onChange={this.handleChange}
                                                    dateFormat = "dd-MM-yyyy"
                                                />
                                                <span className="err_msg">{this.state.errors.invoiceDate}</span>
                                                </fieldset>
                                            </div>
                                            <div className="col-md-4"> 
                                                <fieldset className="form-group">
                                                    <label for="dueDate">
                                                    Due Date<span className="mandatory">*</span>
                                                    </label>
                                                    <DatePicker
                                                    name="dueDate"
                                                    selected={this.state.dueDate}
                                                    onChange={this.handleChangeDue}
                                                    dateFormat = "dd-MM-yyyy"
                                                />
                                                <span className="err_msg">{this.state.errors.dueDate}</span>
                                                </fieldset>
                                            </div>
                                        </div>

                                        { 
                                            this.state.isRegisteredUnderGST === "Y" && this.isInvoice && 
                                            <fieldset className="form-group">
                                                <label for="customerType">
                                                Tax Preference<span className="mandatory">*</span>
                                                </label>
                                                <br/>
                                                <input type="radio" className="sal-radio" name="isTaxExclusive" onChange={this.handleChange} value="Y" checked={this.state.isTaxExclusive === "Y"}/><span className="contact-radio-label">Tax Exclusive</span>
                                                <input type="radio" className="sal-radio" name="isTaxExclusive" onChange={this.handleChange} value="N" checked={this.state.isTaxExclusive === "N"}/><span className="contact-radio-label">Tax Inclusive</span>
                                                <br/>
                                                <span className="err_msg">{this.state.errors.isTaxExclusive}</span>
                                            </fieldset>
                                        }
                                        
                                        <div className="invtbl-bg">
                                            <table className="table table-bordered">
                                            <tbody>
                                            <tr className="invtbl">
                                            <th>Item Details</th>
                                            <th>Quantity</th>
                                            <th>Rate</th>
                                            {
                                                this.state.isRegisteredUnderGST ==="Y" &&
                                                <th>Tax</th>
                                            }
                                            <th>Amount</th>
                                            <th>Action</th>
                                            </tr>
                                            { this.state.itemholders.map((itemholder, idx) => {
                                                return (
                                            <tr>
                                            <td className="itm-dtls modal-ant">

                                            <ReactSelectDropdown
                                                value={this.state.listitems.filter(option => option.label === itemholder.itemName)}
                                                options={this.state.listitems}
                                                onChange={this.handleItemReactSelect.bind(this,idx)}
                                            />

                                            {
                                                idx === (this.state.itemholders.length-1) &&
                                                <button onClick={this.open} className="add-btn-item itmdtls-btn" type="button">
                                                    <i className="fa fa-plus" aria-hidden="true"></i> New Item
                                                </button>
                                            }
                                            </td>
                                            <td>
                                            <input placeholder = "quantity" type="text" className="cust-inp qty-width" name="quantity" onChange={this.handleItemholderItemQuantityChange(idx)} value={itemholder.quantity}/>
                                            </td>
                                            <td>
                                            <input placeholder = "rate" type="text" className="cust-inp rate-width" name="rate" onChange={this.handleItemholderItemRateChange(idx)} value={itemholder.rate}/>
                                            </td>
                                                {
                                                    this.state.isRegisteredUnderGST ==="Y" &&
                                                    <td className="gstx">
                                                    <select className="form-control cust-inp" name="tax" onChange={this.handleItemholderItemTaxChange(idx)} value={itemholder.tax}>
                                                        <option value="-1">{Constants.TAX_SLAB_NON_TAXABLE}</option>
                                                            <option value="-2">{Constants.TAX_SLAB_OUT_OF_SCOPE}</option>
                                                            <option value="-3">{Constants.TAX_SLAB_NON_GST_SUPPLY}</option>
                                                            {
                                                                this.state.taxSlabs.result && this.state.taxSlabs.result.length > 0 &&
                                                                this.state.taxSlabs.result.map(function(item,index) {
                                                                    return <option value={item.percentage}>{item.name+" ["+item.percentage+"%"+"]"}</option>;
                                                                })
                                                            }
                                                    </select>
                                                    </td>
                                                }
                                            <td>
                                            <span className="amount-sec amt-width">
                                                {
                                                    ((itemholder.quantity*itemholder.rate).toFixed(2) !="NaN")?(itemholder.quantity*itemholder.rate).toFixed(2):'0.00'
                                                }
                                                </span>
                                            </td>
                                            <td className="acti-col">
                                            <button type="button" onClick={this.handleRemoveItemholder(idx)} className="del-btn">
                                            <i className="fa fa-trash" aria-hidden="true"></i>
                                            </button>
                                            </td>
                                            </tr>
                                            )})}
                                            </tbody>
                                            </table>
                                            <div className="addbtn-bg adbutn-new">
                                                <button type="button" onClick={this.handleAddItemholder} className="add-btn">
                                                <i className="fa fa-plus" aria-hidden="true"></i> Add another line
                                                </button>
                                            </div>
                                            <br/>
                                            <span className="err_msg">{this.state.errors.itemslist}</span><br/>
                                            <span className="err_msg">{this.state.errors.itemslistquantity}</span><br/>
                                            <span className="err_msg">{this.state.errors.itemslistrate}</span>
                                        </div>
                                        
                                        <div className="row">
                                            <div className="col-md-7">
                                            </div>
                                            <div className="col-md-5">
                                                <table className="subttl-col">
                                                <tbody>
                                                <tr>
                                                    <td>Sub Total</td>
                                                    <td><span id="invoice-subTotal">
                                                    {
                                                        this.state.isTaxExclusive === "Y"
                                                        ?
                                                        this.state.itemholders.reduce((sum, item) => (
                                                            sum += item.quantity * item.rate
                                                        ), 0).toFixed(2)
                                                        :
                                                        subTotal
                                                    }
                                                    </span></td>
                                                </tr>
                                                
                                                {  
                                                    this.state.isRegisteredUnderGST ==="Y" && taxArray.map((itemholder1, idx1) => {
                                                    return (
                                                    <Router>
                                                    { 
                                                        this.state.isIGST && 
                                                        this.state.isIGST !="" && 
                                                        itemholder1.percentage >= 0 &&
                                                        this.state.isIGST == "N"
                                                        &&
                                                        <tr>
                                                            <td>CGST{itemholder1.percentage}[{itemholder1.percentage+"%"}]</td>
                                                            <td>
                                                            {itemholder1.amount}
                                                            </td>
                                                        </tr>
                                                    }
                                                    { 
                                                        this.state.isIGST && 
                                                        this.state.isIGST !="" && 
                                                        itemholder1.percentage >= 0 &&
                                                        this.state.isIGST == "N"
                                                        &&
                                                        <tr>
                                                            <td>SGST{itemholder1.percentage}[{itemholder1.percentage+"%"}]</td>
                                                            <td>
                                                            {itemholder1.amount}
                                                            </td>
                                                        </tr>
                                                    }
                                                    { 
                                                        this.state.isIGST && 
                                                        this.state.isIGST !="" && 
                                                        itemholder1.percentage >= 0 &&
                                                        this.state.isIGST == "Y"
                                                        &&
                                                            <tr>
                                                                <td>IGST{(itemholder1.percentage)*2}[{(itemholder1.percentage)*2+"%"}]</td>
                                                                <td>
                                                                {itemholder1.amount*2}
                                                                </td>
                                                            </tr>
                                                        }
                                                    </Router>
                                                )})}
                                                
                                                <tr className="total-bg">
                                                    <td>Total</td>
                                                    <td><i className="fa fa-inr" aria-hidden="true"></i>
                                                    <span id="invoice-totalAmount">
                                                    {
                                                        this.state.isRegisteredUnderGST ==="Y"
                                                        ?
                                                            this.state.isTaxExclusive === "Y"
                                                            ?
                                                                (this.state.itemholders.reduce((sum, i) => (
                                                                    sum += i.quantity * i.rate
                                                                ), 0)+
                                                                    (this.state.itemholders.reduce((sum, i) => (
                                                                    sum += (i.tax >=0)?i.quantity * i.rate * i.tax:0
                                                                ), 0)/100)
                                                                ).toFixed(2)
                                                            :
                                                                totalAmount
                                                        :
                                                            (this.state.itemholders.reduce((sum, i) => (
                                                                sum += i.quantity * i.rate
                                                            ), 0)
                                                            ).toFixed(2)
                                                    }
                                                    </span>
                                                    </td>
                                                </tr>
                                                </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        {
                                        this.isInvoice && 
                                        <div className="invoicenotes">
                                        <div className="row">
                                            <div className="col-md-5">
                                                <fieldset className="form-group">
                                                    <label for="customerNotes">
                                                    Customer Notes<span className="mandatory"></span>
                                                    </label>
                                                    <textarea className="form-control" name="customerNotes" onChange={this.handleChange} value={customerNotes}>{customerNotes}</textarea>
                                                    <span className="err_msg">{this.state.errors.customerNotes}</span>
                                                </fieldset>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-5">
                                                <fieldset className="form-group">
                                                    <label for="termsAndConditions">
                                                    Terms and Conditions<span className="mandatory"></span>
                                                    </label>
                                                    <textarea className="form-control" name="termsAndConditions" onChange={this.handleChange} value={termsAndConditions}>{termsAndConditions}</textarea>
                                                    <span className="err_msg">{this.state.errors.termsAndConditions}</span>
                                                </fieldset>
                                            </div>
                                        </div>
                                        </div>
                                        }
                                        
                                            <a className="btn btn-info btn-md" type="button" href={this.isInvoice?"/invoicelist":"#"}>
                                                Cancel
                                            </a>
                                            <button className="btn btn-primary btn-md" type="button" id="contact_submit"  onClick={this.handleSubmit.bind(this,Constants.DRAFT_STATUS)}>
                                                Save as Draft
                                            </button>
                                            <button className="btn btn-primary btn-md" type="button" id="contact_submit"  onClick={this.handleSubmit.bind(this,Constants.SENT_STATUS)}>
                                                Save and Send
                                            </button>
                                        
                                            <span className="err_msg" id="resp-msg"></span>
                                        </form>
                                </div>     
                            </div>
                        </div>
                    </div>
                </div>
            
            </div>
            
            <Modal show={this.state.showModal} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div id="wait" className="loader-login">
                    <img src={Loader} width="64" height="64" />
                </div>
                <form action="javascript:void(0);" onSubmit={this.handleSubmitModal} id="contact_form">
                    <fieldset className="form-group">
                        <label for="customerType">
                        Type<span className="mandatory">*</span>
                        </label>
                        <br/>
                        <input type="radio" className="sal-radio" name="modalType" onChange={this.handleChange} value={Constants.ITEM_TYPE_GOODS} checked={this.state.modalType === Constants.ITEM_TYPE_GOODS}/><span className="contact-radio-label">{Constants.ITEM_TYPE_GOODS}</span>
                        <input type="radio" className="sal-radio" name="modalType" onChange={this.handleChange} value={Constants.ITEM_TYPE_SERVICE} checked={this.state.modalType === Constants.ITEM_TYPE_SERVICE}/><span className="contact-radio-label">{Constants.ITEM_TYPE_SERVICE}</span>
                    </fieldset>
                    <span className="err_msg">{this.state.modalerrors.modalType}</span>

                    <fieldset className="form-group">
                        <label for="name">
                        Name<span className="mandatory">*</span>
                        </label>
                        <input type="text" className="form-control form-control-md" name="modalName" onChange={this.handleChange} value={this.state.modalName}/>
                        <span className="err_msg">{this.state.modalerrors.modalName}</span>
                    </fieldset>
                    
                    <fieldset className="form-group">
                        <label for="description">
                        Description<span className="mandatory"></span>
                        </label>
                        <textarea rows="5" className="form-control" name="modalDescription" onChange={this.handleChange} value={this.state.modalDescription}></textarea>
                        <span className="err_msg">{this.state.modalerrors.modalDescription}</span>
                    </fieldset>

                    { 
                        this.state.isRegisteredUnderGST === "Y" &&
                        <fieldset className="form-group">
                            <label for="customerType">
                            Tax Preference<span className="mandatory">*</span>
                            </label>
                            <br/>
                            <input type="radio" className="sal-radio" name="modalIsTaxable" onChange={this.handleChange} value="Y" checked={this.state.modalIsTaxable === "Y"}/><span className="contact-radio-label">Taxable</span>
                            <input type="radio" className="sal-radio" name="modalIsTaxable" onChange={this.handleChange} value="N" checked={this.state.modalIsTaxable === "N"}/><span className="contact-radio-label">Non Taxable</span>
                            <br/>
                            <span className="err_msg">{this.state.modalerrors.modalIsTaxable}</span>
                        </fieldset>
                    }

                    {   this.state.modalHsnCodeDisplay && this.state.isRegisteredUnderGST === "Y" &&
                        <fieldset className="form-group" id="hsnCodeId">
                            <label for="name">
                            HSN Code<span className="mandatory"></span>
                            </label>
                            <input type="text" className="form-control form-control-md" name="modalHsnCode" onChange={this.handleChange} value={this.state.modalHsnCode}/>
                            <span className="err_msg">{this.state.modalerrors.modalHsnCode}</span>
                        </fieldset>
                    }

                    {   this.state.modalSacCodeDisplay && this.state.isRegisteredUnderGST === "Y" &&
                        <fieldset className="form-group" id="sacCodeId">
                            <label for="name">
                            SAC Code<span className="mandatory"></span>
                            </label>
                            <input type="text" className="form-control form-control-md" name="modalSacCode" onChange={this.handleChange} value={this.state.modalSacCode}/>
                            <span className="err_msg">{this.state.modalerrors.modalSacCode}</span>
                        </fieldset>
                    }

                    <fieldset className="form-group">
                        <label for="name">
                        Selling Price<span className="mandatory">*</span>
                        </label>
                        <input type="text" className="form-control form-control-md" name="modalSellingPrice" onChange={this.handleChange} value={this.state.modalSellingPrice}/>
                        <span className="err_msg">{this.state.modalerrors.modalSellingPrice}</span>
                    </fieldset>
                    <button className="btn btn-primary btn-md" type="submit" id="contact_submit">
                    Save
                    </button>
                    <span className="err_msg" id="resp-msg"></span>
                </form>
                <span className="err_msg" id="resp-msg"></span>
            </Modal.Body>
            </Modal>

              <Modal show={this.state.showModalWarning} onHide={this.closeWarning}>
                    <Modal.Header closeButton>
                        <Modal.Title>Warning!!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="wr-msg">Please complete the company details in Settings before creating invoice.!!</div>
                        <div className="text-center">
                            <button className="btn btn-info btn-md" type="button" onClick={this.closeWarning}>OK</button>
                        </div>
                    </Modal.Body>
            
                </Modal>
        
        </Router>
    );
  }
}
export default Convertestimateinvoice;
