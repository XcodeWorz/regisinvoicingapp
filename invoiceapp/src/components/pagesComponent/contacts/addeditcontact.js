import React, { Component } from 'react';
import  Loader  from '../../../../public/assets/images/spinner.GIF';
import * as Constants from '../../../constants';
import Sidebar from '../../layoutsComponent/sidebar';
import SpinnerLoader from 'react-loader-spinner';

import {
    BrowserRouter as Router
} from 'react-router-dom';

class Addeditcontact extends Component {
    constructor(props) {
    super(props);
    this.state = {
        city:'',
        state:'',
        zipCode:'',
        country:'',
        customerType:'',
        gstTreatmentId:'',
        gsttreatments:[],
        pan:'',
        userType:Constants.USER_TYPE_CUSTOMER,
        salutation: '',
        firstName: '',
        lastName: '',
        companyName: '',
        displayName:'',
        email:'',
        phoneNo:'',
        website:'',
        address:'',
        gstNo:'',
        placeOfSupply:'',
        isTaxable:'Y',
        currency:'',
        submitted: false,
        currencyList:[
          'United States Dollar',
          'India Rupee'
        ],
        indianStates: [
                                        'Arunachal Pradesh',
                                        'Assam',
                                        'Bihar',
                                        'Chhattisgarh',
                                        'Goa',
                                        'Gujarat',
                                        'Haryana',
                                        'Himachal Pradesh',
                                        'Jammu and Kashmir',
                                        'Jharkhand',
                                        'Karnataka',
                                        'Kerala',
                                        'Madhya Pradesh',
                                        'Maharashtra',
                                        'Manipur',
                                        'Meghalaya',
                                        'Mizoram',
                                        'Nagaland',
                                        'Odisha',
                                        'Punjab',
                                        'Rajasthan',
                                        'Sikkim',
                                        'Tamil Nadu',
                                        'Telangana',
                                        'Tripura',
                                        'Uttar Pradesh',
                                        'Uttarakhand',
                                        'West Bengal',
                                        'Andaman and Nicobar Islands',
                                        'Chandigarh',
                                        'Dadra and Nagar Haveli',
                                        'Daman and Diu',
                                        'Lakshadweep',
                                        'National Capital Territory of Delhi',
                                        'Puducherry'],
       
        errors:{},
        usertask:(props.match.path.match(/editcontact/g) !==null && props.match.path.match(/editcontact/g) !=="undefined")?'edit':'add'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    if(this.state.usertask ==="edit")
    {
        Promise.all([fetch(Constants.BASE_URL_API+"getcontacts",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({contactId:this.props.match.params.id,userType:this.state.userType})
        }),
        fetch(Constants.BASE_URL_API+"getgsttreatment",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams()
        })
        ])
        .then(([res1,res2]) => { 
            return Promise.all([res1.json(),res2.json()]) 
        })
        .then(([res1,res2]) => {
            if(res1.contacts[0].gstTreatmentId === 1 || res1.contacts[0].gstTreatmentId === 2)
            {
                document.getElementById("gstNoId").style.display="block";
                document.getElementById("placeOfSupplyId").style.display="block";
                document.getElementById("panId").style.display="none";
            }
            else if(res1.contacts[0].gstTreatmentId === 3 || res1.contacts[0].gstTreatmentId === 4)
            {
                document.getElementById("gstNoId").style.display="none";
                document.getElementById("placeOfSupplyId").style.display="block";
                document.getElementById("panId").style.display="block";
            }
            else if(res1.contacts[0].gstTreatmentId === 5)
            {
                document.getElementById("gstNoId").style.display="none";
                document.getElementById("placeOfSupplyId").style.display="none";
                document.getElementById("panId").style.display="none";
            }
            else
            {
                document.getElementById("gstNoId").style.display="none";
                document.getElementById("placeOfSupplyId").style.display="none";
                document.getElementById("panId").style.display="none";
            }
            this.setState(
                {
                    contactId:this.props.match.params.id,
                    salutation: res1.contacts[0].salutation,
                    firstName: res1.contacts[0].firstName,
                    lastName: res1.contacts[0].lastName,
                    companyName: res1.contacts[0].companyName,
                    displayName: res1.contacts[0].displayName,
                    email: res1.contacts[0].email,
                    phoneNo: res1.contacts[0].phoneNo,
                    website: res1.contacts[0].website,
                    address: res1.contacts[0].address,
                    gstNo: res1.contacts[0].gstNo,
                    placeOfSupply: res1.contacts[0].placeOfSupply,
                    isTaxable: res1.contacts[0].isTaxable,
                    currency: res1.contacts[0].currency,
                    customerType:res1.contacts[0].customerType,
                    gsttreatments:res2.list,
                    pan:res1.contacts[0].pan,
                    city:res1.contacts[0].city,
                    state:res1.contacts[0].state,
                    zipCode:res1.contacts[0].zipCode,
                    country:res1.contacts[0].country,
                    gstTreatmentId:res1.contacts[0].gstTreatmentId,
                });
            this.operateSpinnerLoader("close");
        });
    }
    else
    {
        Promise.all([fetch(Constants.BASE_URL_API+"getgsttreatment",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams()
        })
        ])
        .then(([res1]) => { 
            return Promise.all([res1.json()]) 
        })
        .then(([res1]) => {
            this.setState(
                {
                    gsttreatments:res1.list
                });
            this.operateSpinnerLoader("close");
        });
        document.getElementById("gstNoId").style.display="none";
        document.getElementById("placeOfSupplyId").style.display="none";
        document.getElementById("panId").style.display="none";
    }
}

 handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
        if(e.target.name === "gstTreatmentId")
        {
            if(e.target.value === "1" || e.target.value === "2")
            {
                document.getElementById("gstNoId").style.display="block";
                document.getElementById("placeOfSupplyId").style.display="block";
                document.getElementById("panId").style.display="none";
            }
            else if(e.target.value === "3" || e.target.value === "4")
            {
                document.getElementById("gstNoId").style.display="none";
                document.getElementById("placeOfSupplyId").style.display="block";
                document.getElementById("panId").style.display="block";
            }
            else if(e.target.value === "5")
            {
                document.getElementById("gstNoId").style.display="none";
                document.getElementById("placeOfSupplyId").style.display="none";
                document.getElementById("panId").style.display="none";
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        document.getElementById("wait").style.display="block";

        let apiname =   "";
        if(this.state.usertask === "add")
        {
            apiname = "insertcontact";
        }
        else if(this.state.usertask === "edit")
        {
            apiname = "editcontact";
        }
        
        
        if(!this.validateForm())
        {
            fetch(Constants.BASE_URL_API+apiname,
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams(this.state)
            })
            .then(response => { return response.json(); } )
            .then(data =>
                  {
                    document.getElementById("wait").style.display="none";
                    document.getElementById("contact_submit").disabled; 
                    if(data.responseCode)
                    {
                        this.props.history.push('/contactlist');
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
    
    isNumeric(val)
    {
        var reg = /^\d+$/;
        if( !reg.test( val ) )
        {
            return false;
        }
        return true;
    }
    
    isPhone(val)
    {
        if(!this.isNumeric(val))
        {
            return false;
        }
        else
        {
            var len	=	val.length;
            var count_len	=	10;
            if(len == count_len)
            {
                return true;
            }
            else
            return false;
        }
        
    }
    
    validateForm()
    {
        var error_flag = false;
        let errors = {};
        if(this.state.customerType === "")
        {
            error_flag = true;
            errors['customerType'] = "Please select customer type!";
            setTimeout(function(){
                this.setState({errors:{}});
           }.bind(this),Constants.WRNG_MSG_TIMEOUT);
        }
        if(this.state.salutation === "")
        {
            error_flag = true;
            errors['salutation'] = "Please select salutation!";
            setTimeout(function(){
                this.setState({errors:{}});
           }.bind(this),Constants.WRNG_MSG_TIMEOUT);
        }
        if(this.state.firstName === "")
        {
            error_flag = true;
            errors["firstName"] = "Please enter first name!";
            setTimeout(function(){
                this.setState({errors:{}});
           }.bind(this),Constants.WRNG_MSG_TIMEOUT);
        }
        if(this.state.lastName === "")
        {
            error_flag = true;
            errors["lastName"] = "Please enter last name!";
            setTimeout(function(){
                this.setState({errors:{}});
           }.bind(this),Constants.WRNG_MSG_TIMEOUT);
        }
        if(this.state.displayName === "")
        {
            error_flag = true;
            errors["displayName"] = "Please enter display name!";
            setTimeout(function(){
                this.setState({errors:{}});
           }.bind(this),Constants.WRNG_MSG_TIMEOUT);
        }
        
        if(this.state.email === "")
        {
            error_flag = true;
            errors["email"] = "Please enter email!";
            setTimeout(function(){
                this.setState({errors:{}});
           }.bind(this),Constants.WRNG_MSG_TIMEOUT);
        }
        
        if(this.state.email != "")
        {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if(!pattern.test(this.state.email)) {
                error_flag = true;
                errors["email"] = "Please enter valid email ID!";
                setTimeout(function(){
                    this.setState({errors:{}});
               }.bind(this),Constants.WRNG_MSG_TIMEOUT);
            }
        }
            
        if(this.state.phoneNo != "")
        {
           if(!this.isPhone(this.state.phoneNo))
           {
                error_flag = true;
                errors["phoneNo"] = "Please enter valid phone no!";
                setTimeout(function(){
                    this.setState({errors:{}});
               }.bind(this),Constants.WRNG_MSG_TIMEOUT);
           }
        }
        
        if(this.state.isTaxable === "")
        {
            error_flag = true;
            errors["isTaxable"] = "Please select taxable or tax exempt!";
            setTimeout(function(){
                this.setState({errors:{}});
           }.bind(this),Constants.WRNG_MSG_TIMEOUT);
        }
        
        if(this.state.currency === "")
        {
            error_flag = true;
            errors["currency"] = "Please select currency!";
            setTimeout(function(){
                this.setState({errors:{}});
           }.bind(this),Constants.WRNG_MSG_TIMEOUT);
        }
        
        this.setState({
        errors: errors
      });
        return error_flag;
    }
    
  render() {
    const {
            customerType,    
            salutation,
            firstName,
            lastName,
            companyName,
            displayName,
            email,
            phoneNo,
            website,
            address,
            gstNo,
            placeOfSupply,
            isTaxable,
            currency,
            usertask,
            gstTreatmentId,
            pan,
            city,
            state,
            zipCode,
            country,
        } = this.state;
        
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
                            <span className="tophead-txt">Contacts >>  {(usertask ==="add")?"Add New Contact":"Edit Contact"}</span>
                            <span className="tophead-txt pull-right"></span>
                        </a>
                    </div>
                </nav>
                <div className="main-content">
                    <div className="content-view">
                        <div className="card">
                            <div className="sec-t-container m-b-2"><h4 className="card-title">
                            {(usertask ==="add")?"Add New Contact":"Edit Contact"}
                            </h4></div>
                            <div className="card-block">
                                <div id="spinnerLoaderDiv" className="react-spinner">
                                    <SpinnerLoader type={Constants.LOADER_TYPE} color={Constants.LOADER_COLOR} height={50} width={50} />
                                </div>
                                <div id="bodyDiv">
                                    <div id="wait" className="loader-login">
                                        <img src={Loader} width="64" height="64" />
                                    </div>	
                                    <form action="javascript:void(0);" onSubmit={this.handleSubmit} id="contact_form">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <fieldset className="form-group">
                                                    <label for="customerType">
                                                    Type<span className="mandatory">*</span>
                                                    </label>
                                                    <br/>
                                                    <input type="radio" className="sal-radio" name="customerType" onChange={this.handleChange} value={Constants.CUSTOMER_TYPE_BUSINESS} checked={customerType === Constants.CUSTOMER_TYPE_BUSINESS}/><span className="contact-radio-label">{Constants.CUSTOMER_TYPE_BUSINESS}</span>
                                                    <input type="radio" className="sal-radio" name="customerType" onChange={this.handleChange} value={Constants.CUSTOMER_TYPE_INDIVIDUAL} checked={customerType === Constants.CUSTOMER_TYPE_INDIVIDUAL}/><span className="contact-radio-label">{Constants.CUSTOMER_TYPE_INDIVIDUAL}</span>
                                                </fieldset>
                                                <span className="err_msg">{this.state.errors.customerType}</span>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <fieldset className="form-group">
                                                    <label for="salutation">
                                                    Salutation<span className="mandatory">*</span>
                                                    </label>
                                                    <br/>
                                                    <input type="radio" className="sal-radio" name="salutation" onChange={this.handleChange} value="Mr." checked={salutation === 'Mr.'}/><span className="contact-radio-label">Mr.</span>
                                                    <input type="radio" className="sal-radio" name="salutation" onChange={this.handleChange} value="Mrs." checked={salutation === 'Mrs.'}/><span className="contact-radio-label">Mrs.</span>
                                                    <input type="radio" className="sal-radio" name="salutation" onChange={this.handleChange} value="Miss." checked={salutation === 'Miss.'}/><span className="contact-radio-label">Miss.</span>
                                                </fieldset>
                                                <span className="err_msg">{this.state.errors.salutation}</span>
                                            </div>
                                            <div className="col-md-4">  
                                                <fieldset className="form-group">
                                                    <label for="firstName">
                                                    First Name<span className="mandatory">*</span>
                                                    </label>
                                                    <input type="text" className="form-control form-control-md" name="firstName" onChange={this.handleChange} value={firstName}/>
                                                    <span className="err_msg">{this.state.errors.firstName}</span>
                                                </fieldset>
                                            </div>
                                            <div className="col-md-4">
                                                <fieldset className="form-group">
                                                    <label for="lastName">
                                                    Last Name<span className="mandatory">*</span>
                                                    </label>
                                                    <input type="text" className="form-control form-control-md" name="lastName" onChange={this.handleChange} value={lastName}/>
                                                    <span className="err_msg">{this.state.errors.lastName}</span>
                                                </fieldset>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <fieldset className="form-group">
                                                    <label for="companyName">
                                                    Company Name<span className="mandatory"></span>
                                                    </label>
                                                    <input type="text" className="form-control form-control-md" name="companyName" onChange={this.handleChange} value={companyName}/>
                                                    <span className="err_msg">{this.state.errors.companyName}</span>
                                                </fieldset>
                                            </div>
                                            <div className="col-md-4">
                                                <fieldset className="form-group">
                                                    <label for="displayName">
                                                    Display Name<span className="mandatory">*</span>
                                                    </label>
                                                    <input type="text" className="form-control form-control-md" name="displayName" onChange={this.handleChange} value={displayName}/>
                                                    <span className="err_msg">{this.state.errors.displayName}</span>
                                                </fieldset>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <fieldset className="form-group">
                                                    <label for="email">
                                                    Email<span className="mandatory">*</span>
                                                    </label>
                                                    <input type="text" className="form-control form-control-md" name="email" onChange={this.handleChange} value={email}/>
                                                    <span className="err_msg">{this.state.errors.email}</span>
                                                </fieldset>
                                            </div>
                                            <div className="col-md-4">
                                                <fieldset className="form-group">
                                                    <label for="phoneNo">
                                                    Phone No<span className="mandatory"></span>
                                                    </label>
                                                    <input type="text" className="form-control form-control-md" name="phoneNo" onChange={this.handleChange} value={phoneNo}/>
                                                    <span className="err_msg">{this.state.errors.phoneNo}</span>
                                                </fieldset>
                                            </div>
                                            <div className="col-md-4">
                                                <fieldset className="form-group">
                                                    <label for="website">
                                                    Website<span className="mandatory"></span>
                                                    </label>
                                                    <input type="text" className="form-control form-control-md" name="website" onChange={this.handleChange} value={website}/>
                                                    <span className="err_msg">{this.state.errors.website}</span>
                                                </fieldset>
                                            </div>
                                        </div>
                                        
                                        <div className="row">
                                            <div className="col-md-6">
                                                <fieldset className="form-group">
                                                <label for="address">
                                                Address<span className="mandatory"></span>
                                                </label>
                                                <textarea rows="5" className="form-control" name="address" onChange={this.handleChange} value={address}></textarea>
                                                <span className="err_msg">{this.state.errors.address}</span>
                                                </fieldset>
                                            </div>
                                            <div className="col-md-3">
                                                <fieldset className="form-group">
                                                    <label for="city">
                                                    City<span className="mandatory"></span>
                                                    </label>
                                                    <input type="text" className="form-control form-control-md" name="city" onChange={this.handleChange} value={city}/>
                                                    <span className="err_msg">{this.state.errors.city}</span>
                                                </fieldset>
                                            </div>
                                            <div className="col-md-3">
                                                <fieldset className="form-group">
                                                    <label for="state">
                                                    State<span className="mandatory"></span>
                                                    </label>
                                                    <input type="text" className="form-control form-control-md" name="state" onChange={this.handleChange} value={state}/>
                                                    <span className="err_msg">{this.state.errors.state}</span>
                                                </fieldset>
                                            </div>
                                            <div className="col-md-3">
                                                <fieldset className="form-group">
                                                    <label for="zipCode">
                                                    ZipCode<span className="mandatory"></span>
                                                    </label>
                                                    <input type="text" className="form-control form-control-md" name="zipCode" onChange={this.handleChange} value={zipCode}/>
                                                    <span className="err_msg">{this.state.errors.zipCode}</span>
                                                </fieldset>
                                            </div>
                                            <div className="col-md-3">
                                                <fieldset className="form-group">
                                                    <label for="country">
                                                    Country<span className="mandatory"></span>
                                                    </label>
                                                    <select className="form-control" name="country" onChange={this.handleChange} value={country}>
                                                    <option value="">--select--</option>
                                                    <option value="INDIA">India</option>
                                                    </select>
                                                    <span className="err_msg">{this.state.errors.country}</span>
                                                </fieldset>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4">
                                                <fieldset className="form-group">
                                                <label for="gsttreatment">
                                                Gst Treatment<span className="mandatory">*</span>
                                                </label>
                                                <select className="form-control" name="gstTreatmentId" onChange={this.handleChange} value={gstTreatmentId}>
                                                <option value="">--select--</option>
                                                {this.state.gsttreatments.map(item => (
                                                <option value={item.gstTreatmentId}>{item.name}</option>
                                                ))}
                                                    </select>
                                                <span className="err_msg">{this.state.errors.gstTreatmentId}</span>
                                                </fieldset>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-4" id="gstNoId">
                                                <fieldset className="form-group">
                                                <label for="gstNo">
                                                GST No<span className="mandatory"></span>
                                                </label>
                                                <input type="text" className="form-control form-control-md" name="gstNo" onChange={this.handleChange} value={gstNo}/>
                                                <span className="err_msg">{this.state.errors.gstNo}</span>
                                                </fieldset>
                                            </div>
                                            <div className="col-md-4" id="placeOfSupplyId">
                                                <fieldset className="form-group">
                                                <label for="placeOfSupply">
                                                Places Of Supply<span className="mandatory">*</span>
                                                </label>
                                                <select className="form-control" name="placeOfSupply" onChange={this.handleChange} value={placeOfSupply}>
                                                <option value="">--select--</option>
                                                {this.state.indianStates.map(item => (
                                                <option value={item}>{item}</option>
                                                ))}
                                                    </select>
                                                <span className="err_msg">{this.state.errors.placeOfSupply}</span>
                                                </fieldset>
                                            </div>
                                            <div className="col-md-4" id="panId">
                                                <fieldset className="form-group">
                                                <label for="pan">
                                                Pan<span className="mandatory"></span>
                                                </label>
                                                <input type="text" className="form-control form-control-md" name="pan" onChange={this.handleChange} value={pan}/>
                                                <span className="err_msg">{this.state.errors.pan}</span>
                                                </fieldset>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                            <fieldset className="form-group">
                                            <label for="currency">
                                            Currency<span className="mandatory">*</span>
                                            </label>
                                            <select className="form-control" name="currency" onChange={this.handleChange} value={currency}>
                                            <option value="">--select--</option>
                                            <option value="USD">USD - United States Dollar</option>
                                                <option value="EUR">EUR - Euro</option>
                                                <option value="AUD">AUD - Australian dollar</option>
                                                <option value="BGN">BGN - Bulgarian lev</option>
                                                <option value="BRL">BRL - Brazilian real</option>
                                                <option value="CAD">CAD - Canadian dollar</option>
                                                <option value="CHF">CHF - Swiss franc</option>
                                                <option value="CNY">CNY - Renminbi</option>
                                                <option value="CZK">CZK - Czech koruna</option>
                                                <option value="DKK">DKK - Danish krone</option>
                                                <option value="GBP">GBP - Pound sterling</option>
                                                <option value="HKD">HKD - Hong Kong dollar</option>
                                                <option value="HRK">HRK - Croatian kuna</option>
                                                <option value="HUF">HUF - Hungarian forint</option>
                                                <option value="IDR">IDR - Indonesian rupiah</option>
                                                <option value="ILS">ILS - Israeli new shekel</option>
                                                <option value="INR">INR - Indian rupee</option>
                                                <option value="JPY">JPY - Japan Yen</option>
                                                <option value="KRW">KRW - South Korean won</option>
                                                <option value="MXN">MXN - Mexican peso</option>
                                                <option value="MYR">MYR - Malaysian ringgit</option>
                                                <option value="NOK">NOK - Norwegian krone</option>
                                                <option value="NZD">NZD - New Zealand dollar</option>
                                                <option value="PHP">PHP - Philippine peso</option>
                                                <option value="PLN">PLN - Polish złoty</option>
                                                <option value="RON">RON - Romanian leu</option>
                                                <option value="RUB">RUB - Russian ruble</option>
                                                <option value="SEK">SEK - Swedish krona</option>
                                                <option value="SGD">SGD - Singapore dollar</option>
                                                <option value="THB">THB - Thai baht</option>
                                                <option value="TRY">TRY - Turkish lira</option>
                                                <option value="ZAR">ZAR - South African rand</option>
                                            </select>
                                            <span className="err_msg">{this.state.errors.currency}</span>
                                        </fieldset>
                                            </div>
                                        </div>
                                        <a className="btn btn-info btn-md" type="button" href="/contactlist">
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
        </Router>
    );
  }
}
export default Addeditcontact;
