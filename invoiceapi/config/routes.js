const home = require('../app/controllers/home');

module.exports = function(app, passport) {

    app.get('/', home.index);
	/** **********************************API SECTION STARTS*****************************************************/
	
    app.post('/checklogin', home.checklogin);
    
    //DASHBOARD SECTION STARTS HERE
    app.post('/getinvoicetotal', home.getinvoicetotal);
    app.post('/getmonthwisepayments', home.getmonthwisepayments);
    app.post('/getmonthwiseinvoices', home.getmonthwiseinvoices);
    
    // SETTINGS SECTION STARTS HERE
    app.post('/editsetting', home.editsetting);
    app.post('/getsettings', home.getsettings);
	app.post('/deletelogosetting', home.deletelogosetting);
    
	//PROFILE SECTION
	app.post('/resetpassword', home.resetpassword);
	app.post('/uploadprofileimage', home.uploadprofileimage);
    app.post('/changepassword', home.changepassword);
    
    // ITEMS SECTION STARTS HERE
    app.post('/insertitem', home.insertitem);
    app.post('/getitems', home.getitems);
    app.post('/edititem', home.edititem);
	app.post('/deleteitem', home.deleteitem);
    
	//CONTACT SECTION
	app.post('/insertcontact', home.insertcontact);
	app.post('/editcontact', home.editcontact);
	app.post('/getcontacts', home.getcontacts);
	app.post('/checkcontact', home.checkcontact);
	app.post('/getcontactdetails', home.getcontactdetails);
    app.post('/changecontactstatus', home.changecontactstatus);
	
	//USER SECTION
	app.post('/insertuser', home.insertuser);
	app.post('/edituser', home.edituser);
	app.post('/getusers', home.getusers);
	
	//TAXSLAB SECTION
	app.post('/inserttaxslab', home.inserttaxslab);
	app.post('/gettaxslabs', home.gettaxslabs);
	app.post('/edittaxslab', home.edittaxslab);
	
    //INVOICE & BILLS SECTION
	app.post('/editinvoice', home.editinvoice);
	app.post('/insertinvoice', home.insertinvoice);
	app.post('/getinvoices', home.getinvoices);
	app.post('/getinvoicesold', home.getinvoicesold);
	app.post('/getinvoicedetails', home.getinvoicedetails);
	app.post('/sendinvoicemail', home.sendinvoicemail);
    app.post('/changeinvoicestatus', home.changeinvoicestatus);
	
	//ESTIMATE SECTION
    app.post('/editestimate', home.editestimate);
    app.post('/insertestimate', home.insertestimate);
    app.post('/getestimates', home.getestimates);
    app.post('/getestimatesold', home.getestimatesold);
    app.post('/getestimatedetails', home.getestimatedetails);
    app.post('/getgsttreatment', home.getgsttreatment);
    app.post('/changeestimatestatus', home.changeestimatestatus);
    
    //PAYMENT RECEIVED SECTION
    app.post('/uploadpaymentattachments', home.uploadpaymentattachments);
    app.post('/deletepaymentattachment', home.deletepaymentattachment);
    app.post('/recordpayment', home.recordpayment);
    app.post('/getpaymentreceived', home.getpaymentreceived);
    
    app.post('/gstpayable', home.gstpayable);
    app.post('/tdsreceivable', home.tdsreceivable);
    
    app.post('/deletecustomer', home.deletecustomer);
    
	/** **********************************API SECTION ENDS*******************************************************/
};
