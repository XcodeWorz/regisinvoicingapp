import React, { Component } from 'react';
import  Loader  from '../../../../public/assets/images/spinner.GIF';
import * as Constants from '../../../constants';
import Sidebar from '../../layoutsComponent/sidebar';
import Modal from 'react-bootstrap-modal';

import {
    BrowserRouter as Router
} from 'react-router-dom';

class Editsetting extends Component {
        constructor(props) {
        super(props);
        this.state = {
            isRegisteredUnderGST:'',
            settingsId:'',
            companyName:'',
            companyAddress:'',
            companyPlaceOfSupply:'',
            imagePath:'',
            gstNo:'',
            dialogMessage:'',
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
            invoiceCustomerNotes:'',
            invoiceTermsAndConditions:'',
        };
        this.open = this.open.bind(this);
        this.openDelete = this.openDelete.bind(this);
        this.close = this.close.bind(this);
        this.closeDelete = this.closeDelete.bind(this);
        this.getInitialState = this.getInitialState.bind(this);
        this.getInitialStateDelete = this.getInitialStateDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeImage = this.handleChangeImage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteLogo = this.deleteLogo.bind(this);
    }

    getInitialState()
    {
        return { showModal: false };
    }
    
    getInitialStateDelete()
    {
        return { showModalDelete: false };
    }
    
    
    close()
    {
        this.setState({ showModal: false });
    }
    
    closeDelete()
    {
        this.setState({ showModalDelete: false });
    }

    open()
    {
      this.setState({ showModal: true });
    }
    
    openDelete()
    {
      this.setState({ showModalDelete: true });
    }
    
    deleteLogo()
    {
        fetch(Constants.BASE_URL_API+"deletelogosetting",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({settingsId:Constants.INVOICE_SETTINGS_ID})
        })
        .then(response => { return response.json(); } )
        .then(data =>
              {
                document.getElementById('img-sett').src = "";
                document.getElementById('logo-delete-btn').style.display = "none";
                this.setState({ showModalDelete: false });
            });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    
    handleChangeImage(e) {
        var file = e.target.files[0];
        var type = file.type.split("/")[0];
        if(type !=="image")
        {
            this.open();
            this.setState({dialogMessage:'Please upload an image!'});
        }
        else
        {
            var reader = new FileReader();
            reader.onload = (e) => {
                var img = document.createElement("img");
                img.onload = () => {
                  if(img.width > Constants.SETTINGS_IMG_WIDTH)
                  {
                      this.open();
                      let msg = "Logo height should be less than "+Constants.SETTINGS_IMG_HEIGHT+"px.";
                       msg+="\n";
                       msg+="Logo width should be less than "+Constants.SETTINGS_IMG_WIDTH+"px.";
                       this.setState({dialogMessage:msg});
                  }
                  else if(img.width > Constants.SETTINGS_IMG_WIDTH)
                  {
                      this.open();
                      let msg = "Logo height should be less than "+Constants.SETTINGS_IMG_HEIGHT+"px";
                       msg+="\n";
                       msg+="Logo width should be less than "+Constants.SETTINGS_IMG_WIDTH+"px";
                       this.setState({dialogMessage:msg});
                  }
                  else
                  {
                      this.setState({imagePath: e.target.result});
                  }
                }
                img.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        document.getElementById("wait").style.display="block";
        
        if(!this.validateForm())
        {
            fetch(Constants.BASE_URL_API+"editsetting",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams(this.state)
            })
            .then(response => { return response.json(); } )
            .then(data =>
                  {
                    document.getElementById("wait").style.display="none";
                    document.getElementById("settings_submit").disabled; 
                    if(data.responseCode)
                    {
                        let parameters = {
                            loggedInUserName:JSON.parse(localStorage.getItem('loggedInUserDetails')).loggedInUserName,
                            loggedInUserType:JSON.parse(localStorage.getItem('loggedInUserDetails')).loggedInUserType,
                            loggedInUserEmail:JSON.parse(localStorage.getItem('loggedInUserDetails')).loggedInUserEmail,
                            loggedInUserId:JSON.parse(localStorage.getItem('loggedInUserDetails')).loggedInUserId,
                            isRegisteredUnderGST:this.state.isRegisteredUnderGST,
                        };
                        localStorage.clear();
                        localStorage.setItem('loggedInUserDetails', JSON.stringify(parameters));
                        
                        this.props.history.push('/settings');
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
    
    validateForm()
    {
        var error_flag = false;
        let errors = {};
        if(this.state.companyName === "")
        {
            error_flag = true;
            errors['companyName'] = "Please enter company name!";
        }
        if(this.state.companyAddress === "")
        {
            error_flag = true;
            errors["companyAddress"] = "Please enter company address!";
        }
        if(this.state.gstNo === "")
        {
            error_flag = true;
            errors["gstNo"] = "Please enter gst no!";
        }
        if(!this.state.companyPlaceOfSupply || this.state.companyPlaceOfSupply === "")
        {
            error_flag = true;
            errors["companyPlaceOfSupply"] = "Please select Place Of Supply!";
        }
        if(!this.state.isRegisteredUnderGST || this.state.isRegisteredUnderGST === "")
        {
            error_flag = true;
            errors["isRegisteredUnderGST"] = "Please select either register under gst or not!";
        }
        
        this.setState({
        errors: errors
      });
        return error_flag;
    }
    
     componentDidMount() {
        Promise.all([fetch(Constants.BASE_URL_API+"getsettings",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({settingsId:this.props.match.params.id})
        })
        ])

      .then(([res1]) => { 
         return Promise.all([res1.json()]) 
      })
      .then(([res1]) => {
            this.setState(
                          {
                            settingsId:this.props.match.params.id,
                            companyName: res1.settings[0].companyName,
                            companyAddress: res1.settings[0].companyAddress,
                            gstNo: res1.settings[0].gstNo,
                            isRegisteredUnderGST: res1.settings[0].isRegisteredUnderGST,
                            companyPlaceOfSupply: res1.settings[0].companyPlaceOfSupply,
                            invoiceCustomerNotes: res1.settings[0].invoiceCustomerNotes,
                            invoiceTermsAndConditions: res1.settings[0].invoiceTermsAndConditions,
                            imagePath:res1.settings[0].imagePath
                            });
      });
       
    }
    
  render() {
    const {
            companyName,
            companyAddress,
            gstNo,
            companyPlaceOfSupply,
            invoiceCustomerNotes,
            invoiceTermsAndConditions
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
                      <span className="tophead-txt">Settings >> Edit</span>
                      <span className="tophead-txt pull-right"></span>
                    </a>
                   </div>
                </nav>
        
                    <div className="main-content">
                    <div className="content-view">
                        <div className="card">
                            <div className="sec-t-container m-b-2"><h4 className="card-title">Edit Settings</h4></div>
                            <div className="card-block">
                              <div id="userDiv">
                                <div id="wait" className="loader-login">
                                    <img src={Loader} width="64" height="64" />
                                </div>	
                                <form action="javascript:void(0);" onSubmit={this.handleSubmit} id="settings_form">
                                
                                    <fieldset className="form-group">
                                        <label for="companyName">
                                        Company Name<span className="mandatory"></span>
                                        </label>
                                        <input type="text" className="form-control form-control-md" name="companyName" onChange={this.handleChange} value={companyName}/>
                                        <span className="err_msg">{this.state.errors.companyName}</span>
                                    </fieldset>
                                    
                                    <fieldset className="form-group">
                                        <label for="address">
                                        Company Address<span className="mandatory"></span>
                                        </label>
                                        <textarea rows="4" className="form-control" name="companyAddress" onChange={this.handleChange} value={companyAddress}>{companyAddress}</textarea>
                                        <span className="err_msg">{this.state.errors.companyAddress}</span>
                                    </fieldset>
                                    
                                      <fieldset className="form-group">
                                        <label for="companyName">
                                        GST No<span className="mandatory"></span>
                                        </label>
                                        <input type="text" className="form-control form-control-md" name="gstNo" onChange={this.handleChange} value={gstNo}/>
                                        <span className="err_msg">{this.state.errors.gstNo}</span>
                                    </fieldset>
                                    
                                  <fieldset className="form-group">
                                        <label for="placeOfSupply">
                                        Place Of Supply<span className="mandatory">*</span>
                                        </label>
                                        <select className="form-control" name="companyPlaceOfSupply" onChange={this.handleChange} value={companyPlaceOfSupply}>
                                        <option value="">--select--</option>
                                        {this.state.indianStates.map(item => (
                                         <option value={item}>{item}</option>
                                       ))}
                                        </select>
                                      <span className="err_msg">{this.state.errors.companyPlaceOfSupply}</span>
                                    </fieldset>

                                    <fieldset className="form-group">
                                        <label for="customerType">
                                        Registered Under GST<span className="mandatory">*</span>
                                        </label>
                                        <br/>
                                        <input type="radio" className="sal-radio" name="isRegisteredUnderGST" onChange={this.handleChange} value="Y" checked={this.state.isRegisteredUnderGST === "Y"}/><span className="contact-radio-label">Yes</span>
                                        <input type="radio" className="sal-radio" name="isRegisteredUnderGST" onChange={this.handleChange} value="N" checked={this.state.isRegisteredUnderGST === "N"}/><span className="contact-radio-label">No</span>
                                    </fieldset>
                                    <span className="err_msg">{this.state.errors.isRegisteredUnderGST}</span>
                                    <fieldset className="form-group">
                                        <label for="address">
                                        Invoice Customer Notes<span className="mandatory"></span>
                                        </label>
                                        <textarea rows="4" className="form-control" name="invoiceCustomerNotes" onChange={this.handleChange} value={invoiceCustomerNotes}>{invoiceCustomerNotes}</textarea>
                                        <span className="err_msg">{this.state.errors.invoiceCustomerNotes}</span>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label for="address">
                                        Invoice Terms and Conditions<span className="mandatory"></span>
                                        </label>
                                        <textarea rows="4" className="form-control" name="invoiceTermsAndConditions" onChange={this.handleChange} value={invoiceTermsAndConditions}>{invoiceTermsAndConditions}</textarea>
                                        <span className="err_msg">{this.state.errors.invoiceTermsAndConditions}</span>
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <label for="address">
                                        Logo<span className="mandatory"></span>
                                        </label>
                                        <br/>
                                        <input type="file" name="myImage" onChange= {this.handleChangeImage} />
                                        <img className="st-img" id="img-sett" src={this.state.imagePath}/>
                                        { this.state.imagePath && this.state.imagePath !="" && 
                                        <b className="ed-del text-center" id="logo-delete-btn">
                                        <a href="javascript:void(0);" onClick={this.openDelete}><i className="fa fa-trash" aria-hidden="true"></i></a>
                                        </b>
                                        }
                                        <span className="err_msg">{this.state.errors.myImage}</span>
                                    </fieldset>
                                    
                                    <a className="btn btn-info btn-md" type="button" href="/settings">
                                         Cancel
                                        </a>
                                        
                                        <button className="btn btn-primary btn-md" type="submit" id="settings_submit">
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
            
              <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                 <Modal.Title>Warning!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="wr-msg">{this.state.dialogMessage}</div>
                  <div className="text-center">
                      <button className="btn btn-primary btn-md" type="button" onClick={this.close}>Close</button>
                  </div>
                </Modal.Body>
               
            </Modal>
            
               <Modal show={this.state.showModalDelete} onHide={this.closeDelete}>
                <Modal.Header closeButton>
                 <Modal.Title>Warning!!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="wr-msg">Are you sure you want to remove this logo?</div>
                  <div className="text-center">
                    <button className="btn btn-info btn-md" type="button" onClick={this.closeDelete}>No</button>
                    <button className="btn btn-primary btn-md" type="button" onClick={this.deleteLogo}>Yes</button>
                  </div>
                </Modal.Body>
               
            </Modal>
        
            
        </Router>
    );
  }
}
export default Editsetting;
