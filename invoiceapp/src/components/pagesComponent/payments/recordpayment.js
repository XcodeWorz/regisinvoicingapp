import React, { Component } from 'react';
import * as Constants from '../../../constants';
import Sidebar from '../../layoutsComponent/sidebar';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import Modal from 'react-bootstrap-modal';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

const createdBy =  localStorage.getItem('loggedInUserDetails')?JSON.parse(localStorage.getItem('loggedInUserDetails')).loggedInUserId:'';

class Recordpayment extends Component {
    constructor(props) {
        super(props);
        //Check URL Path contains /editinvoice 
        this.isInvoice = (this.props.location.pathname.includes(Constants.RECORD_INVOICE_PATH))?true:false;
            
        this.state = {
            paymentNo:'',
            amountReceived:'',
            bankCharges:'',
            isTaxDeducted:false,
            taxAmount:'',
            paymentDate:new Date(),
            paymentMode:'',
            notes:'',
            errors:{},
            invoiceId:'',
            tmpImagePathArray:[],
            showImageDialogModal:false,
            showImageMsg:'',
            showDeleteImage:false,
            deleteImagePath:'',
            isRegisteredUnderGST:'N',
            isTaxExclusive:'',
            invoiceItems:[],
            totalInvoiceAmount:0,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeImageModal = this.closeImageModal.bind(this);
        this.closeImageDeleteModal = this.closeImageDeleteModal.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.imageDelete = this.imageDelete.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }

componentDidMount() {
    Promise.all([
        fetch(Constants.BASE_URL_API+"getinvoicedetails",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({
                invoiceId:this.props.match.params.id,
                type:this.isInvoice?Constants.INVOICE_TYPE_INV:""
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
                return Promise.all([res1.json(),res2.json()]) 
        })
        .then(([res1,res2]) => {

            this.setState({
                invoiceId:this.props.match.params.id,
                customerName:res1.invoices[0].displayName,
                isTaxExclusive:res1.invoices[0].isTaxExclusive,
                totalInvoiceAmount:res1.invoices[0].totalAmount,
                invoiceItems:res1.invoices[0].invoiceitems,
                isRegisteredUnderGST:res2.settings[0].isRegisteredUnderGST,
                paymentNo:(res2.settings[0].paymentNo)
            });
        });
}

handleChange(e)
{
    if(e.target)
    {
        if(e.target.name === "isTaxDeducted")
        {
            const { isTaxDeducted } = e.target;
            this.setState({
                isTaxDeducted: !this.state.isTaxDeducted 
            });
        }
        else
        {
            const { name, value } = e.target;
            this.setState({ [name]: value });
        }
    }
    else
    {
        this.setState({ paymentDate: e });
    }
}

handleSubmit(e) {
    e.preventDefault();
    let apiname =   "recordpayment";
    if(!this.validateForm())
    {
        let resInvoiceDate = new Date(this.state.paymentDate);
        let formatted_date = resInvoiceDate.getFullYear() + "-" + (resInvoiceDate.getMonth() + 1) + "-" + resInvoiceDate.getDate();

        fetch(Constants.BASE_URL_API+apiname,
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({
                invoiceId:this.state.invoiceId,
                paymentNo:this.state.paymentNo,
                amountReceived:this.state.amountReceived,
                isTaxDeducted:this.state.isTaxDeducted?'Y':'N',
                taxAmount:this.state.taxAmount,
                paymentDate:formatted_date,
                paymentMode:this.state.paymentMode,
                notes:this.state.notes,
                type:this.isInvoice?Constants.PAY_TYPE_REC:"",
                createdBy:createdBy,
                imageArray:this.state.tmpImagePathArray
            })
        })
        .then(response => { return response.json(); } )
        .then(data =>
              {
                document.getElementById("contact_submit").disabled; 
                if(data.responseCode)
                {
                    if(this.isInvoice)
                    this.props.history.push('/invoicedetails/'+this.state.invoiceId);
                   
                }
                else
                {
                    document.getElementById("resp-msg").innerHTML = data.responseMessage;
                }    
            });
    }
    else
    {
        document.getElementById("wait").style.display="none";
    }
    
}

handleCategoryReactSelect = (e) => {
    this.setState({
        valueCategory:e.value,
        placeholderStrCategory:e.label,
        expenseCategoryId:e.value
    });
}

validateForm()
{
    var error_flag = false;
    let errors = {};
    if(this.state.paymentNo === "")
    {
        error_flag = true;
        errors['paymentNo'] = "Please enter payment no!";
        setTimeout(function(){
            this.setState({errors:{}});
        }.bind(this),Constants.WRNG_MSG_TIMEOUT);
    }
    if(this.state.amountReceived === "")
    {
        error_flag = true;
        errors['amountReceived'] = this.isInvoice?"Please enter amount received!":"";
        setTimeout(function(){
            this.setState({errors:{}});
       }.bind(this),Constants.WRNG_MSG_TIMEOUT);
    }
    else if(!this.isAmount(this.state.amountReceived))
    {
        error_flag = true;
        errors['amountReceived'] = "Please enter valid amount!";
        setTimeout(function(){
            this.setState({errors:{}});
       }.bind(this),Constants.WRNG_MSG_TIMEOUT);
    }   

    if(!this.isInvoice && this.state.expenseCategoryId ==="")
    {
        error_flag = true;
        errors['expenseCategoryId'] = "Please select category!";
    }
    if(this.state.isTaxDeducted)
    {
        if(this.state.taxAmount === "")
        {
            error_flag = true;
            errors["taxAmount"] = "Please enter tax amount!";
            setTimeout(function(){
                this.setState({errors:{}});
            }.bind(this),Constants.WRNG_MSG_TIMEOUT);
        }
        else if(!this.isAmount(this.state.taxAmount))
        {
            error_flag = true;
            errors['taxAmount'] = "Please enter valid tax amount!";
                setTimeout(function(){
                    this.setState({errors:{}});
            }.bind(this),Constants.WRNG_MSG_TIMEOUT);
        }   
        
    }
    if(this.state.paymentDate === "")
    {
        error_flag = true;
        errors["paymentDate"] = "Please enter payment date!";
        setTimeout(function(){
            this.setState({errors:{}});
       }.bind(this),Constants.WRNG_MSG_TIMEOUT);
    }
    
    if(this.state.paymentMode === "")
    {
        error_flag = true;
        errors["paymentMode"] = "Please select payment mode!";
        setTimeout(function(){
            this.setState({errors:{}});
       }.bind(this),Constants.WRNG_MSG_TIMEOUT);
    }
    let totalInputAmt = 0;
    if(this.state.isTaxDeducted)
    {
        totalInputAmt = parseInt(this.state.amountReceived) + parseInt(this.state.taxAmount);
    }
    else
    {
        totalInputAmt = parseInt(this.state.amountReceived);
    }
    
    let totalAmount = this.state.totalInvoiceAmount;
    if(parseFloat(totalInputAmt) !== parseFloat(totalAmount))
    {
        error_flag = true;
        this.setState({
            errors: errors,
            showImageDialogModal:true,
            showImageMsg:this.isInvoice?'Total Amount should be same as the Invoice Amount.':''
        });
    }
    else
    {
        this.setState({
            errors: errors
          });
    }
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

uploadImage(event)
{
    var sizeInMB    =  (event.target.files[0].size / (1024*1024)).toFixed(2);
    if(sizeInMB > Constants.VALID_IMAGE_SIZE)
    {
        this.setState(
            {
                showImageDialogModal:true,
                showImageMsg:'Please upload image size less than '+Constants.VALID_IMAGE_SIZE+' MB'
            }
        );
    }
    else
    {
        document.getElementById("uploadimagespinner").style.display="inline-block";
        const formData = new FormData();
        formData.append('file',event.target.files[0]);

        var apiname = "uploadpaymentattachments";
       
        axios.post(Constants.BASE_URL_API + apiname,formData, {
            mode: 'cors',
        })
        .then(res => {
            this.setState(prevState => ({
                tmpImagePathArray: [...prevState.tmpImagePathArray,res.data]
            }));
            document.getElementById("uploadimagespinner").style.display="none";
        })
    }
}

closeImageModal()
{
    this.setState({
        showImageDialogModal:false,
        showImageMsg:''
    },()=>{
       
    });
}

async imageDelete(fileName)
{
    await this.setState({
        showDeleteImage:true,
        deleteImagePath:fileName
    });
}

closeImageDeleteModal()
{
    this.setState({
        showDeleteImage:false,
        deleteImagePath:""
    });
}

deleteImage()
{
    fetch(Constants.BASE_URL_API+"deletepaymentattachment",
    {
        method: "POST",
        mode:'cors',
        body: new URLSearchParams({path:this.state.deleteImagePath})
    })
    .then(response => { return response.json(); })
    .then(data =>
    {
        if(data.responseCode == 1)
        {
            var imgArray = [];
            if(this.state.tmpImagePathArray.length > 0)
            {
                this.state.tmpImagePathArray.map((img, idx) => {
                    if(img !== this.state.deleteImagePath)
                    {
                        imgArray.push(img);
                    }
                });
            }
            this.setState({showDeleteImage:false,tmpImagePathArray:imgArray});
        }
        else
        {
            
        }
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
                      <span className="tophead-txt">Record Payment</span>
                      <span className="tophead-txt pull-right"></span>
                    </a>
                   </div>
                </nav>
        
                    <div className="main-content">
                    <div className="content-view">
                        <div className="card">
                            <div className="sec-t-container m-b-2">
                            <h4 className="card-title">Record Payment</h4></div>
                            <div className="card-block">
                              <div id="userDiv">
                                <form action="javascript:void(0);" onSubmit={this.handleSubmit} id="contact_form">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <fieldset className="form-group">
                                                <label for="customerNo">
                                                {this.isInvoice?"Customer Name":""}<span className="mandatory">*</span>
                                                </label>
                                                <br/>
                                                <input type="text" className="form-control form-control-md" value={this.state.customerName} disabled/>
                                            <br/>
                                            <p><b>{this.isInvoice?"Invoice Amount":""}:&nbsp;&nbsp;&nbsp;
                                            <i className="fa fa-inr" aria-hidden="true"></i>
                                            {
                                                this.state.totalInvoiceAmount.toFixed(2)
                                            }
                                            </b>
                                            </p>
                                            </fieldset> 
                                        </div>
                                        <div className="col-md-3">
                                            <fieldset className="form-group">
                                                <label for="paymentNo">
                                                Payment No<span className="mandatory">*</span>
                                                </label>
                                                <br/>
                                                <input type="text" className="form-control form-control-md" name="paymentNo" onChange={this.handleChange} value={this.state.paymentNo}/>
                                            </fieldset>
                                            <span className="err_msg">{this.state.errors.paymentNo}</span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">  
                                            <fieldset className="form-group">
                                                <label for="amount Received">
                                                {this.isInvoice?"Amount Received":""}<span className="mandatory">*</span>
                                                </label>
                                                <input type="text" className="form-control form-control-md" name="amountReceived" onChange={this.handleChange} value={this.state.amountReceived}/>
                                                <span className="err_msg">{this.state.errors.amountReceived}</span>
                                            </fieldset>
                                        </div>
                                        
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <fieldset className="form-group">
                                            <label for="isTaxDeducted">
                                                <input type="checkbox" className="" name="isTaxDeducted" onChange={this.handleChange} value={this.state.isTaxDeducted}/>
                                                Tax Deducted<span className="mandatory"></span>
                                                </label>
                                                <span className="err_msg">{this.state.errors.isTaxDeducted}</span>
                                            </fieldset>
                                        </div>
                                    </div>

                                    {
                                        this.state.isTaxDeducted &&
                                        <div className="row">
                                            <div className="col-md-4">
                                                <fieldset className="form-group">
                                                    <label for="taxAmount">
                                                    Tax Amount<span className="mandatory">*</span>
                                                    </label>
                                                    <input type="text" className="form-control form-control-md" name="taxAmount" onChange={this.handleChange} value={this.state.taxAmount}/>
                                                    <span className="err_msg">{this.state.errors.taxAmount}</span>
                                                </fieldset>
                                            </div>
                                        </div>
                                    }
                                    <div className="row">
                                        <div className="col-md-4">
                                            <fieldset className="form-group">
                                                <label for="paymentDate">
                                                Payment Date<span className="mandatory">*</span>
                                                </label>
                                                <DatePicker
                                                    name="paymentDate"
                                                    selected={this.state.paymentDate}
                                                    onChange={this.handleChange}
                                                    dateFormat = "dd-MM-yyyy"
                                                    />
                                                <span className="err_msg">{this.state.errors.paymentDate}</span>
                                            </fieldset>
                                        </div>
                                        <div className="col-md-4">
                                            <fieldset className="form-group">
                                                <label for="paymentMode">
                                                Payment Mode<span className="mandatory">*</span>
                                                </label>
                                                <select className="form-control cust-inp" name="paymentMode" onChange={this.handleChange} value={this.state.paymentMode}>
                                                    <option value="">--Select--</option>
                                                    <option value="Bank Remittance">Bank Remittance</option>
                                                    <option value="Bank Transfer">Bank Transfer</option>
                                                    <option value="Cash">Cash</option>
                                                    <option value="Cheque">Cheque</option>
                                                    <option value="Credit Card">Credit Card</option>
                                                </select>
                                                <span className="err_msg">{this.state.errors.paymentMode}</span>
                                            </fieldset>
                                        </div>
                                    </div>
                                    
                                    <div className="row">
                                        <div className="col-md-6">
                                            <fieldset className="form-group">
                                            <label for="notes">
                                            Notes<span className="mandatory"></span>
                                            </label>
                                            <textarea rows="5" className="form-control" name="notes" onChange={this.handleChange} value={this.state.notes}></textarea>
                                            <span className="err_msg">{this.state.errors.notes}</span>
                                            </fieldset>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <fieldset className="form-group">
                                            <label for="Attachments">
                                            Attachments<span className="mandatory"></span>
                                            </label>
                                            <br/>
                                            <input type="file" name="uploadImage" onChange= {this.uploadImage} />
                                            </fieldset>
                                            <div id="uploadimagespinner" className="upload-image-spinner">
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                    {
                                        this.state.tmpImagePathArray.length > 0 && this.state.tmpImagePathArray.map(function(itemF,indexF) {
                                            return <div className="col-md-2">
                                                        <p className="atch-nm atc-log">
                                                        <a href={Constants.BASE_URL_API+"/tmp_payment_attachments/"+itemF} target="_blank">{itemF}</a>
                                                        </p>
                                                        <a href="#" onClick={this.imageDelete.bind(this,itemF)}>Delete</a>
                                                </div>
                                        },this)
                                    }
                                    </div>

                                        <a className="btn btn-info btn-md" type="button" href="#">
                                        Cancel
                                        </a>
                                        
                                        <button className="btn btn-primary btn-md" type="submit" id="contact_submit">
                                        Save
                                        </button>
                                        <span className="err_msg" id="resp-msg"></span>
                                    </form>
                                </div>     
                            </div>
                        </div>
                       
                    </div>
                    </div>
            
            </div>
            <Modal show={this.state.showImageDialogModal} onHide={this.closeImageModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.showImageTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="image-msg-div">
                        <div className="wr-msg">{this.state.showImageMsg}</div>
                        <div className="text-center">
                            <button className="btn btn-info btn-md" type="button" onClick={this.closeImageModal}>OK</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={this.state.showDeleteImage} onHide={this.closeImageDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="wr-msg">Are you sure you want to delete this image?</div>
                    <div className="text-center">
                        <button className="btn btn-info btn-md" type="button" onClick={this.closeImageDeleteModal}>No</button>
                        <button className="btn btn-primary btn-md" type="button" id="modal_button" onClick={this.deleteImage}>Yes</button>
                    </div>
                </Modal.Body>
            </Modal>
        </Router>
    );
  }
}
export default Recordpayment;
