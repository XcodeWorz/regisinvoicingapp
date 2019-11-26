import React, { Component } from 'react';
import  Avatar  from '../../../public/assets/images/avatar.png';
import * as Constants from '../../constants';
import Logo from '../../../public/assets/images/logo-website.png';
import {
    BrowserRouter as Router
} from 'react-router-dom';


class Sidebar extends Component {
    constructor(props) {
        super(props);
         this.state = {
            loggedInUserDetails: {}
        };
        
    }
    
    salesClicked()
    {    
        document.querySelector('#users-li').removeAttribute('class');
        document.querySelector('#excel-li').removeAttribute('class');

        if(document.querySelector('#sales-li').hasAttribute('class'))
        {
            document.querySelector('#sales-li').removeAttribute('class');
        }
        else
        {
            document.querySelector('#sales-li').setAttribute('class','open');
        }
        
    }

    usersClicked()
    {   
        document.querySelector('#sales-li').removeAttribute('class');
        document.querySelector('#excel-li').removeAttribute('class');

        if(document.querySelector('#users-li').hasAttribute('class'))
        {
            document.querySelector('#users-li').removeAttribute('class');
        }
        else
        {
            document.querySelector('#users-li').setAttribute('class','open');
        }
    }

    excelClicked()
    {   
        document.querySelector('#sales-li').removeAttribute('class');

        if(document.querySelector('#users-li').hasAttribute('class'))
        {
            document.querySelector('#users-li').removeAttribute('class');
        }

        if(document.querySelector('#excel-li').hasAttribute('class'))
        {
            document.querySelector('#excel-li').removeAttribute('class');
        }
        else
        {
            document.querySelector('#excel-li').setAttribute('class','open');
        }
       
    }

    setDefaultFunct()
    {
        document.querySelector('#dashboard-li').removeAttribute('class');
        document.querySelector('#items-li').removeAttribute('class');

        document.querySelector('#sales-li').removeAttribute('class');
        document.querySelector('#contact-list-li').removeAttribute('class');
        document.querySelector('#estimate-list-li').removeAttribute('class');
        document.querySelector('#invoice-list-li').removeAttribute('class');
        document.querySelector('#payment-received-list-li').removeAttribute('class');
        document.querySelector('#taxslab-list-li').removeAttribute('class');

        document.querySelector('#users-li').removeAttribute('class');
        document.querySelector('#users-add-li').removeAttribute('class');
        document.querySelector('#users-list-li').removeAttribute('class');

        document.querySelector('#excel-li').removeAttribute('class');
        document.querySelector('#profile-li').removeAttribute('class');
        document.querySelector('#settings-li').removeAttribute('class');
   }
    
    componentDidMount() {
        this.setDefaultFunct();
        var url = window.location.href;
        var urlArray = url.split("/");
        if(urlArray.length > 0)
        {
            if(urlArray.length >= 5)
            {
                if(urlArray[urlArray.length-2] == 'editcontact')
                {
                    document.querySelector('#sales-li').setAttribute('class','open');
                    document.querySelector('#contact-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-2] == 'editestimate')
                {
                    document.querySelector('#sales-li').setAttribute('class','open');
                    document.querySelector('#estimate-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-2] == 'convertestimateinvoice')
                {
                    document.querySelector('#sales-li').setAttribute('class','open');
                    document.querySelector('#estimate-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-2] == 'editinvoice')
                {
                    document.querySelector('#sales-li').setAttribute('class','open');
                    document.querySelector('#invoice-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-2] == 'edituser')
                {
                    document.querySelector('#users-li').setAttribute('class','open');
                    document.querySelector('#users-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-2] == 'customerdetails')
                {
                    document.querySelector('#sales-li').setAttribute('class','open');
                    document.querySelector('#contact-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-2] == 'invoicedetails')
                {
                    document.querySelector('#sales-li').setAttribute('class','open');
                    document.querySelector('#invoice-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-2] == 'paymentdetails')
                {
                    document.querySelector('#sales-li').setAttribute('class','open');
                    document.querySelector('#contact-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-2] == 'estimatedetails')
                {
                    document.querySelector('#sales-li').setAttribute('class','open');
                    document.querySelector('#contact-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-2] == 'recordpaymentinvoice')
                {
                    document.querySelector('#sales-li').setAttribute('class','open');
                    document.querySelector('#contact-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-2] == 'cloneestimate')
                {
                    document.querySelector('#sales-li').setAttribute('class','open');
                    document.querySelector('#estimate-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-2] == 'cloneinvoice')
                {
                    document.querySelector('#sales-li').setAttribute('class','open');
                    document.querySelector('#invoice-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-2] == 'paymentreceived')
                {
                    document.querySelector('#sales-li').setAttribute('class','open');
                    document.querySelector('#payment-received-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-2] == 'editsettings')
                {
                    document.querySelector('#settings-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-2] == 'expensedetails')
                {
                    document.querySelector('#excel-li').setAttribute('class','open');
                }
            }
            else
            {
                if(urlArray[urlArray.length-1] == 'dashboard'
                )
                {
                    document.querySelector('#dashboard-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-1] == 'itemslist'
                )
                {
                    document.querySelector('#items-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-1] == 'contactlist' ||
                urlArray[urlArray.length-1] == 'addcontact' 
                )
                {
                    document.querySelector('#sales-li').setAttribute('class','open');
                    document.querySelector('#contact-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-1] == 'estimatelist' ||
                urlArray[urlArray.length-1].indexOf('addestimate') >=0 
                )
                {
                    document.querySelector('#sales-li').setAttribute('class','open');
                    document.querySelector('#estimate-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-1] == 'invoicelist' ||
                urlArray[urlArray.length-1].indexOf('addinvoice') >=0 
                )
                {
                    document.querySelector('#sales-li').setAttribute('class','open');
                    document.querySelector('#invoice-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-1] == 'paymentsreceivedlist')
                {
                    document.querySelector('#sales-li').setAttribute('class','open');
                    document.querySelector('#payment-received-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-1] == 'userslist')
                {
                    document.querySelector('#users-li').setAttribute('class','open');
                    document.querySelector('#users-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-1] == 'adduser')
                {
                    document.querySelector('#users-li').setAttribute('class','open');
                    document.querySelector('#users-add-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-1] == 'downloadexcel')
                {
                    document.querySelector('#excel-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-1] == 'profile')
                {
                    document.querySelector('#profile-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-1] == 'settings')
                {
                    document.querySelector('#settings-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-1] == 'taxslablist')
                {
                    document.querySelector('#taxslab-list-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-1] == 'downloadinvoices')
                {
                    document.querySelector('#excel-li').setAttribute('class','open');
                    document.querySelector('#invoices-download-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-1] == 'downloadpaymentreceived')
                {
                    document.querySelector('#excel-li').setAttribute('class','open');
                    document.querySelector('#paymentsreceived-download-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-1] == 'gsttax')
                {
                    document.querySelector('#excel-li').setAttribute('class','open');
                    document.querySelector('#gst-download-li').setAttribute('class','active-li');
                }
                else if(urlArray[urlArray.length-1] == 'tdstax')
                {
                    document.querySelector('#excel-li').setAttribute('class','open');
                    document.querySelector('#tds-download-li').setAttribute('class','active-li');
                }
            }
        }
    }
   
 render() {
    let displayImg = false;
    if(JSON.parse(localStorage.getItem('loggedInUserDetails')).loggedInProPic){
        displayImg = true
    }

    return(
        <Router>
       <div className="off-canvas-overlay" data-toggle="sidebar"></div>  
        <div className="sidebar-panel">
        <div className="brand">
            <a href="javascript:;" data-toggle="sidebar" className="toggle-offscreen hidden-lg-up">
            <i className="material-icons">menu</i>
            </a>
            <a className="brand-logo">
                <img src={Logo}/>
            </a>
        </div>

        <div className="nav-profile dropdown">
            <a href="javascript:;" className="dropdown-toggle" data-toggle="dropdown">
                <div className="user-image">
                {displayImg && 
                    <img src={Constants.BASE_URL_API+ JSON.parse(localStorage.getItem('loggedInUserDetails')).loggedInProPic} className="avatar img-circle" alt="user" title="user"/>
                }
                {!displayImg && 
                    <img src={Avatar} className="avatar img-circle" alt="user" title="user"/>
                }
                </div>
                <div className="user-info expanding-hidden">
                    {localStorage.getItem('loggedInUserDetails')?JSON.parse(localStorage.getItem('loggedInUserDetails')).loggedInUserName:''}
                    <small className="sentence-case">
                        {localStorage.getItem('loggedInUserDetails')?JSON.parse(localStorage.getItem('loggedInUserDetails')).loggedInUserEmail:''}
                    </small>            
                </div>
            </a>
        </div>

        <nav>
          <p className="nav-title">NAVIGATION</p>
          <ul className="nav">
            <li id="dashboard-li">
                <a href="/dashboard">
                <i className="material-icons">home</i>
                <span>Dashboard</span>
                </a>
            </li>

            <li id="items-li">
                <a href="/itemslist">
                    <i className="material-icons">opacity</i>
                    <span>Items</span>
                </a>
            </li>

            <li id="sales-li">
                <a href="javascript:;" onClick={this.salesClicked.bind(this)}>
                    <span className="menu-caret">
                        <i className="material-icons">arrow_drop_down</i>
                    </span>
                    <i className="material-icons">list</i>
                    <span>Sales</span>
                </a>
                
                <ul className="sub-menu">
                    <li id="contact-list-li">
                        <a href="/contactlist">
                            <span>Customers</span>
                        </a>
                    </li>
                    <li id="estimate-list-li">
                        <a href="/estimatelist">
                            <span>Estimates</span>
                        </a>
                    </li>
                    <li id="invoice-list-li">
                        <a href="/invoicelist">
                            <span>Invoices</span>
                        </a>
                    </li>
                    <li id="payment-received-list-li">
                        <a href="/paymentsreceivedlist">
                            <span>Payment Received</span>
                        </a>
                    </li>
                </ul>
            </li>

            { 
                localStorage.getItem('loggedInUserDetails') && JSON.parse(localStorage.getItem('loggedInUserDetails')).loggedInUserType == Constants.USER_TYPE_ADMIN && JSON.parse(localStorage.getItem('loggedInUserDetails')).loggedInUserType != "" && 
                <li id="users-li">
                    <a href="javascript:;" onClick={this.usersClicked.bind(this)}>
                        <span className="menu-caret">
                            <i className="material-icons">arrow_drop_down</i>
                        </span>
                        <i className="material-icons">perm_identity</i>
                        <span>Users</span>
                    </a>
                
                    <ul className="sub-menu">
                        <li id="users-add-li">
                            <a href="/adduser">
                                <span>Add New</span>
                            </a>
                        </li>
                        <li id="users-list-li">
                            <a href="/userslist">
                                <span>View Users</span>
                            </a>
                        </li>
                    </ul>
                </li>
            }
            <li id="excel-li">
                <a href="javascript:;" onClick={this.excelClicked.bind(this)}>
                    <span className="menu-caret">
                        <i className="material-icons">arrow_drop_down</i>
                    </span>
                    <i className="material-icons">get_app</i>
                    <span>Report</span>
                </a>
                <ul className="sub-menu">
                    <li id="invoices-download-li">
                        <a href="/downloadinvoices">
                            <span>Invoices</span>
                        </a>
                    </li>
                    <li id="paymentsreceived-download-li">
                        <a href="/downloadpaymentreceived">
                            <span>Payments Received</span>
                        </a>
                    </li>
                    <li id="gst-download-li">
                        <a href="/gsttax">
                            <span>GST Tax</span>
                        </a>
                    </li>
                    <li id="tds-download-li">
                        <a href="/tdstax">
                            <span>TDS Tax</span>
                        </a>
                    </li>
                </ul>
            </li>

            <li id="profile-li">
                <a href="/profile">
                <i className="material-icons">opacity</i>
                <span>Profile</span>
              </a>
            </li>

            <li id="settings-li">
                <a href="/settings">
                    <i className="material-icons">build</i>
                    <span>Settings</span>
                </a>
            </li>
            <li id="taxslab-list-li">
                <a href="/taxslablist">
                    <i className="material-icons">attach_money</i>
                    <span>Tax Slabs</span>
                </a>
            </li>
            
			<li>
                <a href="/logout">
                    <i className="material-icons">power_settings_new</i>
                    <span>Logout</span>
                </a>
            </li>
            <li><hr/></li>
          </ul>
       
		</nav>
        
        </div>
        </Router>
         );

  }
}
export default Sidebar;
