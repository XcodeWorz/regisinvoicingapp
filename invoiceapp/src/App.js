import React, { Component } from 'react';
import Home from './components/pagesComponent/home';
import Dashboard from './components/pagesComponent/dashboard';

import Useradd from './components/pagesComponent/users/addedituser';
import Userslist from './components/pagesComponent/users/userslist';
import Taxslablist from './components/pagesComponent/taxslabs/taxslablist';
import Contactlist from './components/pagesComponent/contacts/contactlist';
import Contactadd from './components/pagesComponent/contacts/addeditcontact';
import ContactDetails from './components/pagesComponent/contacts/customerdetails';
import Recordpayment from './components/pagesComponent/payments/recordpayment';
import Paymentlist from './components/pagesComponent/payments/paymentlist';
import PaymentDetails from './components/pagesComponent/payments/paymentdetails';
import Invoiceadd from './components/pagesComponent/invoices/addinvoice';
import Invoicelist from './components/pagesComponent/invoices/invoicelist';
import Invoiceedit from './components/pagesComponent/invoices/editinvoice';
import InvoiceDetails from './components/pagesComponent/invoices/invoicedetails';
import Cloneinvoice from './components/pagesComponent/invoices/cloneinvoice';
import Estimateadd from './components/pagesComponent/estimates/addestimate';
import Estimatelist from './components/pagesComponent/estimates/estimatelist';
import Estimateedit from './components/pagesComponent/estimates/editestimate';
import ConvertEstimateInvoice from './components/pagesComponent/estimates/convertestimateinvoice';
import EstimateDetails from './components/pagesComponent/estimates/estimatedetails';
import Cloneestimate from './components/pagesComponent/estimates/cloneestimate';
import Itemslist from './components/pagesComponent/items/itemslist';
import Settingsedit from './components/pagesComponent/settings/editsetting';
import Settings from './components/pagesComponent/settings/settingslist';
import Logout from './components/pagesComponent/logout';
import Downloadexcel from './components/pagesComponent/downloadexcels/downloadexcelinvoice';
import Downloadexcelpayment from './components/pagesComponent/downloadexcels/downloadexcelpayments';
import Gstpayable from './components/pagesComponent/downloadexcels/gstpayable';
import TDSpayable from './components/pagesComponent/downloadexcels/tdspayable';

import Profile from './components/pagesComponent/profile';

import {
    BrowserRouter as Router,
    Route,Redirect
} from 'react-router-dom';

const ProtectedRoute = ({ path, component: Comp }) => {
  return (
    <Route
      path={path}
     
      render={(props) => {
        return localStorage.getItem('loggedInUserDetails') ? (
          <Comp {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/"
            }}
          />
        );
      }}
    />
  );
};

class App extends Component {
  render() {
    return (
        <Router>
            <Route exact path="/" component={Home} />

            <ProtectedRoute exact path="/dashboard" component={Dashboard}/>

            <ProtectedRoute exact path="/adduser" component={Useradd}/>
            <ProtectedRoute exact path="/edituser/:id" component={Useradd}/>
            <ProtectedRoute exact path="/userslist" component={Userslist} />

            <ProtectedRoute exact path="/taxslablist" component={Taxslablist} />

            <ProtectedRoute exact path="/addcontact" component={Contactadd} />
            <ProtectedRoute exact path="/editcontact/:id" component={Contactadd} />
            <ProtectedRoute exact path="/contactlist" component={Contactlist} />
            <ProtectedRoute exact path="/customerdetails/:id" component={ContactDetails} />
            <ProtectedRoute exact path="/recordpaymentinvoice/:id" component={Recordpayment} />

            <ProtectedRoute exact path="/paymentsreceivedlist" component={Paymentlist} />
            <ProtectedRoute exact path="/paymentreceived/:id" component={PaymentDetails} />

            <ProtectedRoute exact path="/addinvoice" component={Invoiceadd} />
            <ProtectedRoute exact path="/invoicelist" component={Invoicelist} />
            <ProtectedRoute exact path="/editinvoice/:id" component={Invoiceedit} />
            <ProtectedRoute exact path="/invoicedetails/:id" component={InvoiceDetails} />
            <ProtectedRoute exact path="/cloneinvoice/:id" component={Cloneinvoice} />
            

            <ProtectedRoute exact path="/addestimate" component={Estimateadd} />
            <ProtectedRoute exact path="/estimatelist" component={Estimatelist} />
            <ProtectedRoute exact path="/editestimate/:id" component={Estimateedit} />
            <ProtectedRoute exact path="/convertestimateinvoice/:id" component={ConvertEstimateInvoice} />
            <ProtectedRoute exact path="/estimatedetails/:id" component={EstimateDetails} />
            <ProtectedRoute exact path="/cloneestimate/:id" component={Cloneestimate} />

            <ProtectedRoute exact path="/editsettings/:id" component={Settingsedit} />
            <ProtectedRoute exact path="/settings" component={Settings} />

            <ProtectedRoute exact path="/downloadinvoices" component={Downloadexcel} />
            <ProtectedRoute exact path="/downloadpaymentreceived" component={Downloadexcelpayment} />
            <ProtectedRoute exact path="/gsttax" component={Gstpayable} />
            <ProtectedRoute exact path="/tdstax" component={TDSpayable} />

            <ProtectedRoute exact path="/itemslist" component={Itemslist} />

            <ProtectedRoute exact path="/profile" component={Profile} />

            <ProtectedRoute exact path="/logout" component={Logout} />
        </Router>
    );
  }
}

export default App;
