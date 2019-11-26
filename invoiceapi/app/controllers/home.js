const dateFormat = require('dateformat');
var Transaction = require('../models/homemodel');
const constants = require('../../config/constants');

exports.index   =   function(req,res){
  res.render('index');  
};

/*
 * Check Login API.
 * Parameters: email, password.
 * Return: Response Code 1 and Userdetails if success, else returns Response Code 0.
 */
exports.checklogin = function(req, res) {
	
	var responseCode=1;
	var responseMessage='Login Successful';
	var userName = req.body.email;
	var password = req.body.password;
	
    var callbackCheckLogin	=	function(err1,result1)
    {
        if ( !result1 ) {
            responseCode    =   0;
            responseMessage='Login invalid';
            var result_array=	{
                "responseCode":responseCode,
                "responseMessage":responseMessage
            };
            res.send(JSON.stringify(result_array));
        }
        else
        {
            var result_array1=	{
                "responseCode":1,
                "responseMessage":'Login Successful',
                "accessToken":result1.accessToken,
                "name":result1.name,
                "email":result1.email,
                "phoneNo":result1.phoneNo,
                "userType":result1.userType,
                "status":result1.status,
                "userId":result1.userId,
                "isSettings":result1.isSettings,
                "isRegisteredUnderGST":result1.isRegisteredUnderGST
            };
            res.send(JSON.stringify(result_array1));
        }
    };
	
    Transaction.checkLogin(userName,password,callbackCheckLogin);
};

exports.deletecustomer = function(req, res) {
    //console.log("Settings Id"+req.body.settingsId);
    const contactId   =   req.body.contactId;
    const type   =   req.body.type;
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({responseCode: 1, responseMessage:"Deleted successfully",result:result}));
    };
    Transaction.deleteCustomer(contactId,type,callback);
};

/**************************SETTINGS SECTION STARTS HERE*****************************************/

/*
 * Edit Settings
 */
exports.editsetting = function(req, res) {
    const currentDate   =   dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
	
    var callback	=	function(err2,result2)
    {
        res.end(JSON.stringify({responseCode: 1, responseMessage:constants.response_msg_success, response:result2}));
    };
	
    var post = {
        'companyName':req.body.companyName,  
        'companyAddress':req.body.companyAddress,  
        'gstNo':req.body.gstNo,  
        'isRegisteredUnderGST':req.body.isRegisteredUnderGST,  
        'companyPlaceOfSupply':req.body.companyPlaceOfSupply,  
        'invoiceCustomerNotes':req.body.invoiceCustomerNotes,  
        'invoiceTermsAndConditions':req.body.invoiceTermsAndConditions,  
        'imagePath':req.body.imagePath,
        'updateDate':currentDate  
    };
	
    var where = {
		'settingsId':parseInt(req.body.settingsId)
	};
	
    Transaction.editSetting(post,where,callback);
};

/*
 * GET Settings
 */
exports.getsettings = function(req, res) {
    
	var callback	=	function(err,result)
    {
        res.end(JSON.stringify({responseCode: 1, responseMessage:constants.response_msg_success, settings:result}));
    };
	
    Transaction.getSettings(req.body.settingsId,callback);
};

/*
 * DELETE LOGO FROM SETTINGS TABLE
 */
exports.deletelogosetting = function(req, res) {
    //console.log("Settings Id"+req.body.settingsId);
    const currentDate   =   dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({responseCode: 1, responseMessage:constants.response_msg_success, response:result}));
    };
    var post = {
        'imagePath':'',
        'updateDate':currentDate  
    };
    var where = {
        'settingsId':parseInt(req.body.settingsId)
    };
    Transaction.editSetting(post,where,callback);
};

/**************************SETTINGS SECTION ENDS HERE*****************************************/

/**************************PROFILE SECTION STARTS HERE*****************************************/
/*
 * Reset Password of logged in user
 */
exports.resetpassword = function(req, res) {
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({responseCode: 1, responseMessage:'Successfully editted', response:result}));
    };
	
    var post = {
        'userId':req.body.userId,  
        'password':req.body.password
    };
	
    Transaction.resetpassword(post,callback);
};

/*
 * Upload Profie Picture and save it in ./public/profile_images/ folder
 */
exports.uploadprofileimage = function(req, res) {
    
	const timestamp = new Date().getTime();
    //var mime = require('mime');
    var formidable = require('formidable');
    //var util = require('util');
	
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.maxFields = 1000;
    form.multiples = false;
	
    //var dir = './public/profile_images/';
    
    form.on('fileBegin', function (name, file){
        file.path = './public/profile_images/' + timestamp+"_"+file.name;
    });
	
    form.parse(req, function(err, fields, files) {
		
		console.log("FIELDS"+JSON.stringify(fields));
		var userId = fields.userId;
		
		//var file = util.inspect(files);
		var filename = files.file.name;
		var filepath = "/profile_images/"+timestamp+"_"+filename;
    
		const currentDate = dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
		var updParams = {
			"proPicPath":filepath,
			"updateDate":currentDate
		};
		
		var callbackProfileImg	=	function(addErr,addResult)
		{
			if ( !addErr ) {
				responseCode    =   0;
				responseMessage = addResult;
				var result_array=	{
					"responseCode":responseCode,
					"responseMessage":responseMessage
				};
				res.send(JSON.stringify(result_array));
			}
			else
			{
				var responseArray =	{
					"responseCode":1,
					"responseMessage":'Image updated successfully',
					"imageId":addResult,
                    "imagePath":filepath
				};
				
				res.send(JSON.stringify(responseArray));
			}
		};
		
		Transaction.updateProfileImage(updParams,userId, callbackProfileImg);
    });
};
   
/*
 * Change password
 */
exports.changepassword = function(req, res) {
	
    var responseCode=1;
	var responseMessage='Data updated successfully';
    
	var callback	=	function(err,result)
    {
		if ( !result ) {
			responseCode    =   0;
			responseMessage = result;
			var result_array=	{
				"responseCode":responseCode,
				"responseMessage":"Invalid old password"
			};
			res.send(JSON.stringify(result_array));
		}
		else
		{
			var responseArray =	{
				"responseCode":1,
				"responseMessage":"Password changed Successfully",
				"userId":result
			};
			
			res.send(JSON.stringify(responseArray));
		}
    };
	
    var userId = req.body.userId;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
	
	Transaction.changePassword(userId,oldPassword,newPassword,callback);
};
/**************************PROFILE SECTION ENDS HERE*****************************************/

/**************************ITEMS SECTION STARTS HERE*****************************************/
/*
 * Insert Items to items table.
 * Parameters: items table columns
 */

exports.insertitem = function(req, res) {
    const currentDate = dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
	
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({responseCode: 1, responseMessage:constants.response_msg_success, response:result}));
    };
	
    var post = {
        'name':req.body.name,
        'description':req.body.description,
        'type':req.body.type,
        'hsnCode':req.body.hsnCode,
        'sacCode':req.body.sacCode,
        'price':req.body.price,
        'createDate':currentDate,  
    };
    Transaction.insertItem(post,callback);
};

/*
 * Get Items
 * Return: Items Array
 */
exports.getitems = function(req, res) {
    
	var callback	=	function(err,result)
    {
        res.end(JSON.stringify({responseCode: 1,
							   responseMessage:constants.response_msg_success,
							   items:result.result,
							   totalCount:result.count}));
    };
	
    var post = {
        'contactId':req.body.contactId,
        'itemId':req.body.itemId,
        'name':req.body.name,
        'pageNo':req.body.pageNo,
        'searchFilter':(req.body.searchFiltersItems && req.body.searchFiltersItems !=="undefined")?req.body.searchFiltersItems:''
    };
	
    Transaction.getItems(post,callback);
	
};

/*
 * Edit Item API.
 * Parameters: table items fields.
 * Return: Response Code 1.
 */
exports.edititem = function(req, res) {
	
    var callback	=	function(err2,result2)
    {
        res.end(JSON.stringify({responseCode: 1, responseMessage:constants.response_msg_success, response:result2}));
    };
	
    let hsnCode = "";
    let sacCode = "";
	
    if(req.body.type === "Goods")
    {
        hsnCode = req.body.hsnCode;
    }
    else
    {
        sacCode = req.body.sacCode;
    }
	
    var post = {
        'name':req.body.name,
        'description':req.body.description,
        'type':req.body.type,
        'hsnCode':hsnCode,
        'sacCode':sacCode,
        'price':req.body.price,
    };
    var where = {
        'itemId':parseInt(req.body.itemId)
    };
	
    Transaction.editItem(post,where,callback);
};


exports.deleteitem = function(req, res) {
	
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({responseCode: 1, responseMessage:constants.response_msg_success, response:result}));
    };
	
    Transaction.deleteItem(parseInt(req.body.itemId),callback);
};
/**************************ITEMS SECTION ENDS HERE******************************************/

/**************************DASHBOARD SECTION STARTS HERE******************************************/

/*
 * GET Total Invoices API.
 * Return: Invoices array.
 */
exports.getinvoicetotal = function(req, res) {
    var callback	=	function(err,result)
    {
        const invoices =   [];
        const invoicescleared =   [];
        if (result[1] && result[1].length > 0) {
            const tmpMasterArray = [];
            const countInvoices   =   [];
            const tmpItemsArray =   [];
                    
                 result[1].forEach(function(cust) {
                    eval('items'+cust.invoiceId+'= []');
                    if (countInvoices[cust.invoiceId]) {
						let tmp1 = countInvoices[cust.invoiceId];
						countInvoices[cust.invoiceId] = ++tmp1;
					} else {
						countInvoices[cust.invoiceId] = 1;
					}
                 });
                 
                result[1].forEach(function(cust) {
                //console.log("Invoice Id"+cust.invoiceId);
               	if (tmpMasterArray[cust.invoiceId]) {
                    const cnt = eval('countInvoices'+cust.invoiceId);
                    const newCnt = cnt+1;
                    eval('countInvoices'+cust.invoiceId+' = '+newCnt);
                }
                else
                {
                    tmpMasterArray[cust.invoiceId]	=	cust.invoiceId;
					eval('countInvoices'+cust.invoiceId+' = 1');
                }
                
                const itemObj	= {
						'invoiceItemId': cust.invoiceItemId,
                        'itemName':cust.name,
                        'itemDescription':cust.description,
						'quantity': cust.quantity,
						'rate': cust.rate,
						'tax': cust.tax
					};
                
                if (tmpItemsArray[cust.invoiceItemId]) {
                    //nothing inside
                } else {
                    tmpItemsArray[cust.invoiceItemId]	=	cust.invoiceItemId;
                    eval('items'+cust.invoiceId).push(itemObj);
                }
                 
                const tmpInvoices = {
						'invoiceId': cust.invoiceId,
						'contactId': cust.contactId,
                        'invoiceNo':cust.invoiceNo,
                        'orderNo':cust.orderNo,
                        'isIGST':cust.isIGST,
                        'invoiceCompanyName':cust.invoiceCompanyName,
                        'companyAddress':cust.companyAddress,
                        'companyPlaceOfSupply':cust.companyPlaceOfSupply,
                        'companyGSTNo':cust.companyGSTNo,
                        'invoiceDate':cust.invoiceDate,
                        'dueDate':cust.dueDate,
                        'amount':cust.amount,
                        'status':cust.invoice_status,
                        'salutation':cust.salutation,
                        'firstName':cust.firstName,
                        'lastName':cust.lastName,
                        'companyName':cust.companyName,
                        'displayName':cust.displayName,
                        'email':cust.email,
                        'address':cust.address,
                        'phoneNo':cust.phoneNo,
                        'website':cust.website,
                        'gstNo':cust.gstNo,
                        'placeOfSupply':cust.placeOfSupply,
                        'isTaxable':cust.isTaxable,
                        'currency':cust.currency,
                        'customerNotes':cust.customerNotes,
                        'termsAndConditions':cust.termsAndConditions,
                        'createDate':cust.invoice_createdate,
                        'reasonToEdit':cust.reasonToEdit,
                        'totalAmount':cust.totalAmount,
						'invoiceitems': eval('items'+cust.invoiceId)
					};
                const evalCount = eval('countInvoices'+cust.invoiceId);
                //console.log("count"+countInvoices[cust.invoiceId]);
                if (evalCount == countInvoices[cust.invoiceId]) {
                    invoices.push(tmpInvoices);
                }  
               });
			}
            
            if (result[2] && result[2].length > 0) {
            const tmpMasterArray = [];
            const countInvoices   =   [];
            const tmpItemsArray =   [];
                    
                 result[2].forEach(function(cust) {
                    eval('items'+cust.invoiceId+'= []');
                    if (countInvoices[cust.invoiceId]) {
						let tmp1 = countInvoices[cust.invoiceId];
						countInvoices[cust.invoiceId] = ++tmp1;
					} else {
						countInvoices[cust.invoiceId] = 1;
					}
                 });
                 
                result[2].forEach(function(cust) {
                //console.log("Invoice Id"+cust.invoiceId);
               	if (tmpMasterArray[cust.invoiceId]) {
                    const cnt = eval('countInvoices'+cust.invoiceId);
                    const newCnt = cnt+1;
                    eval('countInvoices'+cust.invoiceId+' = '+newCnt);
                }
                else
                {
                    tmpMasterArray[cust.invoiceId]	=	cust.invoiceId;
					eval('countInvoices'+cust.invoiceId+' = 1');
                }
                
                const itemObj	= {
						'invoiceItemId': cust.invoiceItemId,
                        'itemId':cust.itemId,
                        'itemName':cust.name,
                        'itemDescription':cust.description,
						'quantity': cust.quantity,
						'rate': cust.rate,
						'tax': cust.tax
					};
                
                if (tmpItemsArray[cust.invoiceItemId]) {
                    //nothing inside
                } else {
                    tmpItemsArray[cust.invoiceItemId]	=	cust.invoiceItemId;
                    eval('items'+cust.invoiceId).push(itemObj);
                }
                 
                const tmpInvoices = {
						'invoiceId': cust.invoiceId,
						'contactId': cust.contactId,
                        'invoiceNo':cust.invoiceNo,
                        'orderNo':cust.orderNo,
                        'isIGST':cust.isIGST,
                        'invoiceCompanyName':cust.invoiceCompanyName,
                        'companyAddress':cust.companyAddress,
                        'companyPlaceOfSupply':cust.companyPlaceOfSupply,
                        'companyGSTNo':cust.companyGSTNo,
                        'invoiceDate':cust.invoiceDate,
                        'dueDate':cust.dueDate,
                        'amount':cust.amount,
                        'status':cust.invoice_status,
                        'salutation':cust.salutation,
                        'firstName':cust.firstName,
                        'lastName':cust.lastName,
                        'companyName':cust.companyName,
                        'displayName':cust.displayName,
                        'email':cust.email,
                        'address':cust.address,
                        'phoneNo':cust.phoneNo,
                        'website':cust.website,
                        'gstNo':cust.gstNo,
                        'placeOfSupply':cust.placeOfSupply,
                        'isTaxable':cust.isTaxable,
                        'currency':cust.currency,
                        'customerNotes':cust.customerNotes,
                        'termsAndConditions':cust.termsAndConditions,
                        'createDate':cust.invoice_createdate,
                        'reasonToEdit':cust.reasonToEdit,
                        'totalAmount':cust.totalAmount,
						'invoiceitems': eval('items'+cust.invoiceId)
					};
                const evalCount = eval('countInvoices'+cust.invoiceId);
                //console.log("count"+countInvoices[cust.invoiceId]);
                if (evalCount == countInvoices[cust.invoiceId]) {
                    invoicescleared.push(tmpInvoices);
                }  
               });
			}
        
        res.end(JSON.stringify({responseCode: 1, responseMessage:'Successfull', responseResult:result[0], invoicespending:invoices, invoicescleared:invoicescleared}));
    };
    var post = {
        contactId:req.body.contactId
        };
    Transaction.getinvoicetotal(post,callback);
};

exports.getmonthwisepayments = function(req,res)
{
	var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
	
	Transaction.getMonthWisePayments(fromDate, toDate, function(err,result){
		res.end(JSON.stringify({
			responseCode: 1,
			responseMessage:constants.response_msg_success,
			list:result
		}));
	});
};


exports.getmonthwiseinvoices = function(req,res)
{
	var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
	
	Transaction.getMonthWiseInvoices(fromDate, toDate, function(err,result){
		res.end(JSON.stringify({
			responseCode: 1,
			responseMessage:constants.response_msg_success,
			list:result
		}));
	});
};

/**************************DASHBOARD SECTION ENDS HERE******************************************/


/**************************CONTACTS SECTION STARTS HERE******************************************/

/*
 * Insert Contact.
 * Parameters: contacts table fields.
 */
exports.insertcontact = function(req, res) {
	
    var email = req.body.email;
    const currentDate = dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
	
	var callbackEmail	=    function(err1,result1)
    {
        if(result1 && result1.length <= 0)
        {
            var callback	=	function(err,result)
            {
                res.end(JSON.stringify({responseCode: 1, responseMessage:constants.response_msg_success, response:result}));
            };
			
            var post = {
              'salutation':req.body.salutation,  
              'firstName':req.body.firstName,  
              'lastName':req.body.lastName,  
              'companyName':req.body.companyName,  
              'displayName':req.body.displayName,  
              'email':req.body.email,  
              'phoneNo':req.body.phoneNo,  
              'website':req.body.website,  
              'address':req.body.address,  
              'gstNo':req.body.gstNo,  
              'placeOfSupply':req.body.placeOfSupply,  
              'isTaxable':req.body.isTaxable,  
              'currency':req.body.currency,  
              'createDate':currentDate,  
              'updateDate':currentDate,
              'userType':req.body.userType,
              'customerType':req.body.customerType,
              'gstTreatmentId':req.body.gstTreatmentId,
              'pan':req.body.pan,
              'state':req.body.state,
              'city':req.body.city,
              'country':req.body.country,
              'zipCode':req.body.zipCode,
            };
            Transaction.insertContact(post,callback);
        }
        else
        {
            res.end(JSON.stringify({responseCode: 0, responseMessage: "Email already exists"}));
        }
    };
        
    Transaction.checkEmail(email,callbackEmail);
};

/*
 * Edit Contact
 * Parameters: contacts table fields
 */
exports.editcontact = function(req, res) {
    const currentDate   =   dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
	
    var callback	=	function(err2,result2)
    {
        res.end(JSON.stringify({responseCode: 1, responseMessage:constants.response_msg_success, response:result2}));
    };
    
    var post = {
        'salutation':req.body.salutation,  
        'firstName':req.body.firstName,  
        'lastName':req.body.lastName,  
        'companyName':req.body.companyName,  
        'displayName':req.body.displayName,  
        'email':req.body.email,  
        'phoneNo':req.body.phoneNo,  
        'website':req.body.website,  
        'address':req.body.address,  
        'gstNo':req.body.gstNo,  
        'placeOfSupply':req.body.placeOfSupply,  
        'isTaxable':req.body.isTaxable,  
        'currency':req.body.currency,  
        'updateDate':currentDate,
        'customerType':req.body.customerType,
        'gstTreatmentId':req.body.gstTreatmentId,
        'pan':req.body.pan,
        'state':req.body.state,
        'city':req.body.city,
        'country':req.body.country,
        'zipCode':req.body.zipCode,
    };
    var where = {
        'contactId':parseInt(req.body.contactId)
    };
	
    Transaction.editContact(post,where,callback);
};

/*
 * Change Contact Status
 * Parameters: contacts table fields
 */
exports.changecontactstatus = function(req, res) {
    const currentDate   =   dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
	
    var callback	=	function(err2,result2)
    {
        res.end(JSON.stringify({responseCode: 1, responseMessage:constants.response_msg_success, response:result2}));
    };
    
    var post = {
        'status':req.body.status,
        'updateDate':currentDate,
    };
    var where = {
        'contactId':parseInt(req.body.contactId)
    };
	
    Transaction.editContact(post,where,callback);
};

/*
 * GET Contacts
 */
exports.getcontacts = function(req, res) {
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({
			responseCode: 1,
			responseMessage:constants.response_msg_success,
			totalCount:result.count,
			contacts:result.result}));
    };
	
    var post = {
        'contactId':req.body.contactId,
        'firstName':req.body.firstName,
        'lastName':req.body.lastName,
        'companyName':req.body.companyName,
        'displayName':req.body.displayName,
        'email':req.body.email,
        'phoneNo':req.body.phoneNo,
        'status':req.body.customerStatus,
        'gstNo':req.body.gstNo,
        'pageNo':req.body.pageNo,
        'searchFilter':req.body.searchFilter,
        'searchFilterStatus':req.body.searchFilterStatus,
        'userType':req.body.userType,
    };
	
    Transaction.getContacts(post,callback);
};

/*
 * Check contact is there in the contact table or not
 */
exports.checkcontact = function(req, res) {
   
    var callback	=	function(err,result)
    {
        if(result.length > 0)
        {
             res.end(JSON.stringify({responseCode: 1, responseMessage:constants.response_msg_success, response:result}));
        }
        else
        {
             res.end(JSON.stringify({responseCode: 0, responseMessage:constants.response_msg_failure, response:result}));
        }
    };
    
    Transaction.getSearchContacts(req.body.contactId,callback);
};

/*
 * Get contact details
 */
exports.getcontactdetails = function(req, res) {
    var contactId = req.body.contactId;
    var callback = function(err,result)
    {
        var responseArray =	{
                "responseCode":1,
                "responseMessage":constants.response_msg_success,
                "list":result
            };
            res.send(JSON.stringify(responseArray));
    };
	
    Transaction.contactDetails(contactId,callback);
};

/**************************CONTACTS SECTION ENDS HERE******************************************/

/**************************USERS SECTION STARTS HERE******************************************/

/*
 * Insert User
 * Parameters: users table fields
 */
exports.insertuser = function(req, res) {
    console.log("User"+req.body);
    var email = req.body.email;
    const currentDate = dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
	var callbackEmail	=    function(err1,result1)
    {
        if(result1 && result1.length <= 0)
        {
            var callback	=	function(err,result)
            {
                res.end(JSON.stringify({responseCode: 1,
									   responseMessage:constants.response_msg_success,
									   response:result
									}));
            };
            var post = {
                'name':req.body.name,  
                'email':req.body.email,  
                'userName':req.body.email,  
                'password':req.body.password,
                'salt':'',
                'phoneNo':req.body.phoneNo,  
                'accessToken':Transaction.createAccessToken(),
                'createDate':currentDate,  
                'updateDate':currentDate  
            };
            Transaction.insertUser(post,callback);
        }
        else
        {
            res.end(JSON.stringify({responseCode: 0, responseMessage: "Email already exists"}));
        }
    };
    Transaction.checkUserEmail(email,callbackEmail);
};

/*
 * Edit user
 */
exports.edituser = function(req, res) {
    const currentDate   =   dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
    var callback	=	function(err2,result2)
    {
        res.end(JSON.stringify({
			responseCode: 1,
			responseMessage:constants.response_msg_success,
			response:result2
		}));
    };
    
    var post = {
        'name':req.body.name,  
        'email':req.body.email,  
        'phoneNo':req.body.phoneNo,  
        'updateDate':currentDate  
    };
    var where = {
        'userId':parseInt(req.body.userId)
    };
	
    Transaction.editUser(post,where,callback);
};

/*
 * GET Users
 * Parameters: users table fields.
 * Return: Response Code 1 and users array.
 */
exports.getusers = function(req, res) {
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({responseCode: 1, responseMessage:'Successfull', users:result.result,totalCount:result.count}));
    };
	
    var post = {
        'name':req.body.name,
        'userId':req.body.userId,
        'email':req.body.email,
        'phoneNo':req.body.phoneNo,
        'pageNo':req.body.pageNo,
        'searchFilter':req.body.searchFilter,
        'searchFilterType':req.body.searchFilterType
    };
    Transaction.getUsers(post,callback);
};

/**************************USERS SECTION ENDS HERE******************************************/

/**************************TAXSLABS SECTION ENDS HERE******************************************/
/*
 * Insert a row into taxslab table
 */
exports.inserttaxslab = function(req, res) {
    var name = req.body.name;
    var percentage = req.body.percentage;
    const currentDate = dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
	
	var callback	=	function(err,result)
    {
        res.end(JSON.stringify({
			responseCode: 1,
			responseMessage:constants.response_msg_success,
			response:result
		}));
    };
	
    var post = {
		'name':name,
		'percentage':percentage,
		'createDate':currentDate,  
		'updateDate':currentDate  
    };
    Transaction.insertTaxSlab(post,callback);
};

/*
 * GET List of tax slabs
 */
exports.gettaxslabs = function(req, res) {
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({
			responseCode: 1,
			responseMessage:constants.response_msg_success,
			result:result
		}));
    };
	
    var taxSlabId = req.body.taxSlabId;
    Transaction.gettaxslabs(taxSlabId,callback);
};

/*
 * Edit Tax Slab
 */
exports.edittaxslab = function(req, res) {
    const currentDate   =   dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
	
    var callback	=	function(err2,result2)
    {
        res.end(JSON.stringify({
			responseCode: 1,
			responseMessage:constants.response_msg_success,
			response:result2
		}));
    };
    
    var post = {
        'name':req.body.name,  
       'percentage':req.body.percentage,  
        'updateDate':currentDate  
    };
	
    var where = {
        'taxSlabId':parseInt(req.body.taxSlabId)
    };
	
    Transaction.editTaxSlab(post,where,callback);
};
/**************************TAXSLABS SECTION ENDS HERE******************************************/

/**************************INVOICES SECTION STARTS HERE*************************************/
/*
 * Insert Invoice API.
 * Parameters: table invoices fields.
 * Return: Response Code 1.
 */
exports.insertinvoice = function(req, res) {
    const currentDate   =   dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
	
    var items = req.body.items;
    var result = JSON.parse(items);
    
    console.log(JSON.stringify(items));
	
    var callbackcheck = function(errcheck,resultcheck)
    {
        if(resultcheck && resultcheck.length <= 0)
        {
            var callback	=	function(err2,result2)
            {
                var invoiceId = result2; //Get inserted invoice Id
                
                var itemArray = [];
                result.forEach(function(obj) {
                  var itemListN = [
                      invoiceId,
                      obj.itemName,
                      obj.quantity,
                      obj.rate,
                      obj.tax,
                      (obj.itcEligible && obj.itcEligible!=="undefined" && obj.itcEligible !==null)?obj.itcEligible:'',
                      currentDate
                  ];
                  itemArray.push(itemListN);
             });
				
                Transaction.insertInvoiceItem(itemArray,function(err6,result6){
                      res.end(JSON.stringify({
                        responseCode: 1,
                        responseMessage:constants.response_msg_success
                    }));
                });
            };
            var post = {
                'contactId':req.body.contactId,
                'invoiceNo':req.body.invoiceNo,
                'orderNo':req.body.orderNo,
                'invoiceDate':req.body.invoiceDate,
                'dueDate':req.body.dueDate,
                'customerNotes':req.body.customerNotes,
                'termsAndConditions':req.body.termsAndConditions,
                'isIGST':req.body.isIGST,
                'companyName':req.body.companyName,
                'companyAddress':req.body.companyAddress,
                'companyPlaceOfSupply':req.body.companyPlaceOfSupply,
                'companyGSTNo':req.body.companyGSTNo,
                'createDate':currentDate,
                'updateDate':currentDate,
                'status':req.body.status,
                'subTotal':req.body.subTotal,
                'totalAmount':req.body.totalAmount,
                'totalTax':req.body.totalTax,
                'contactCompanyName':req.body.contactCompanyName,
                'contactAddress':req.body.contactAddress,
                'contactGSTIN':req.body.contactGSTIN,
                'contactPlaceOfSupply':req.body.contactPlaceOfSupply,
                'type':req.body.type,
                'isTaxExclusive':req.body.isTaxExclusive
            };
			
            Transaction.insertInvoice(post,callback);
        }
        else
        {
            let msg = "Invoice No already exists.";
            res.end(JSON.stringify({responseCode: 0, responseMessage:msg}));
        }
    };
    
    Transaction.checkNo("invoices",req.body.invoiceNo,req.body.type,callbackcheck);
};

/*
 * Edit Invoice API.
 * Parameters: table invoices fields.
 * Return: Response Code 1.
 */
exports.editinvoice = function(req, res) {
    const currentDate   =   dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
	
    var items = req.body.items;
    var result = JSON.parse(items);
    
    console.log(JSON.stringify(items));
	
    var callback	=	function(err2,result2)
    {
		console.log("Invoice Update Result"+result2);
		
        var invoiceId = req.body.invoiceId; // Get invoice Id from post param
        
        Transaction.deleteInvoiceItems(invoiceId,function(delErr,delRes)
        {
            var itemArray = [];
            result.forEach(function(obj) {
              var itemListN = [
                  invoiceId,
                  obj.itemName,
                  obj.quantity,
                  obj.rate,
                  obj.tax,
                  (obj.itcEligible && obj.itcEligible!=="undefined" && obj.itcEligible !==null)?obj.itcEligible:'',
                  currentDate
              ];
              itemArray.push(itemListN);
         });
            
        Transaction.insertInvoiceItem(itemArray,function(err6,result6){
              res.end(JSON.stringify({
              responseCode: 1,
              responseMessage:constants.response_msg_success
            }));
         });
    });
        
    };
    
    var post = {
        'contactId':parseInt(req.body.contactId),
        'isIGST':req.body.isIGST,
        'invoiceId':parseInt(req.body.invoiceId),
        'invoiceNo':req.body.invoiceNo,
        'orderNo':req.body.orderNo,
        'invoiceDate':req.body.invoiceDate,
        'dueDate':req.body.dueDate,
        'customerNotes':req.body.customerNotes,
        'termsAndConditions':req.body.termsAndConditions,
        'updateDate':currentDate,
        'reasonToEdit':req.body.reasonToEdit,
        'status':req.body.status,
		'subTotal':req.body.subTotal,
		'totalAmount':req.body.totalAmount,
		'totalTax':req.body.totalTax,
        'isTaxExclusive':req.body.isTaxExclusive,
        'contactCompanyName':req.body.contactCompanyName,
        'contactAddress':req.body.contactAddress,
        'contactGSTIN':req.body.contactGSTIN,
        'contactPlaceOfSupply':req.body.contactPlaceOfSupply
    };
    
	var where = {
        'invoiceId':parseInt(req.body.invoiceId)
    };
    
	Transaction.editInvoice(post,where,callback);
};

/*
 * Change INVOICE Status
 * Parameters: invoices table fields
 */
exports.changeinvoicestatus = function(req, res) {
    const currentDate   =   dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
	
    var callback	=	function(err2,result2)
    {
        if(req.body.currentStatus === constants.invoicestatus_cleared && req.body.status === constants.invoicestatus_void)
        {
            var callbackPayment = function(errPayment,resultPayment)
            {
                 res.end(JSON.stringify({responseCode: 1, responseMessage:constants.response_msg_success, response:result2}));
            };
            var postPayment = {
                 'status':constants.invoicestatus_void
            };
            var wherePayment = {
                'invoiceId':parseInt(req.body.invoiceId)
            };
            Transaction.updatePayment(postPayment,wherePayment,callbackPayment);
        }
        else
        {
             res.end(JSON.stringify({responseCode: 1, responseMessage:constants.response_msg_success, response:result2}));
        }
    };
    var post = {
        'status':req.body.status,
        'updateDate':currentDate,
    };
    var where = {
        'invoiceId':parseInt(req.body.invoiceId)
    };
    Transaction.editInvoice(post,where,callback);
};
/*
 * GET Invoices
 */
exports.getinvoices = function(req, res) {
	
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({
			responseCode: 1,
			responseMessage:constants.response_msg_success,
			invoices:result.list,
			totalCount:result.count
		}));
    };
	
    var post = {
        'invoiceId':req.body.invoiceId,
        'contactId':req.body.contactId,
        'invoiceNo':req.body.invoiceNo,
        'type':req.body.type,
        'orderNo':req.body.orderNo,
        'companyName':req.body.companyName,
        'companyGSTNo':req.body.companyGSTNo,
        'status':req.body.status,
        'pageNo':req.body.pageNo,
        'searchFilter':req.body.searchFilter,
        'searchFilterStatus':req.body.searchFilterStatus,
        'searchFilterFromDate':req.body.searchFilterFromDate,
        'searchFilterToDate':req.body.searchFilterToDate
    };
	
    Transaction.getInvoices(post,callback);
};
/*
 * GET Invoices
 */
exports.getinvoicedetails = function(req, res) {
	
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({
			responseCode: 1,
			responseMessage:constants.response_msg_success,
			invoices:result,
		}));
    };
	
    var post = {
        'invoiceId':req.body.invoiceId,
        'contactId':req.body.contactId,
        'invoiceNo':req.body.invoiceNo,
        'type':req.body.type,
        'orderNo':req.body.orderNo,
        'companyName':req.body.companyName,
        'companyGSTNo':req.body.companyGSTNo,
        'status':req.body.status,
        'pageNo':req.body.pageNo,
        'searchFilter':req.body.searchFilter,
        'searchFilterStatus':req.body.searchFilterStatus,
        'searchFilterFromDate':req.body.searchFilterFromDate,
        'searchFilterToDate':req.body.searchFilterToDate
    };
	
    Transaction.getInvoiceDetails(post,callback);
};
/*
 * GET Invoices -- Using it for download Excel - Invoices and Bills
 */
exports.getinvoicesold = function(req, res) {
	
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({
			responseCode: 1,
			responseMessage:constants.response_msg_success,
			invoices:result.result,
			totalCount:result.count
		}));
    };
	
    var post = {
        'invoiceId':req.body.invoiceId,
        'contactId':req.body.contactId,
        'invoiceNo':req.body.invoiceNo,
        'type':req.body.type,
        'orderNo':req.body.orderNo,
        'companyName':req.body.companyName,
        'companyGSTNo':req.body.companyGSTNo,
        'status':req.body.status,
        'pageNo':req.body.pageNo,
        'searchFilter':req.body.searchFilter,
        'searchFilterStatus':req.body.searchFilterStatus,
        'searchFilterFromDate':req.body.searchFilterFromDate,
        'searchFilterToDate':req.body.searchFilterToDate
    };
	
    Transaction.getInvoicesOld(post,callback);
};

/*
 * Email Invoice
 */
exports.sendinvoicemail = function(req, res) {
    var sendGridAPIKey = req.body.sendGridAPIKey;
    var templateID = req.body.templateID;
    var toEmail = req.body.toEmail;
    var toName = req.body.toName;
    var fromEmail = req.body.fromEmail;
    var fromName = req.body.fromName;
    var subject = req.body.subject;
    var cc = "";
    var bcc = "";
    var file = req.body.file;
    var filename = req.body.filename;
    var message = req.body.message;
    var subs = {
		content:message
    };
	
    Transaction.sendGridMailAttachment(sendGridAPIKey, templateID, toEmail, toName, fromEmail, fromName, subject, subs, cc, bcc, file, filename);
    res.end(JSON.stringify({responseCode: 1, responseMessage:'Successfully send'}));
};

/**************************INVOICES SECTION ENDS HERE*************************************/

/**************************ESTIMATES SECTION STARTS HERE*************************************/
/*
 * GET Estimates list
 */
exports.getestimates = function(req, res) {
	
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({
			responseCode: 1,
			responseMessage:constants.response_msg_success,
			invoices:result.list,
			totalCount:result.count
		}));
    };
	
    var post = {
        'estimateId':req.body.estimateId,
        'contactId':req.body.contactId,
        'estimateNo':req.body.estimateNo,
        'orderNo':req.body.orderNo,
        'companyName':req.body.companyName,
        'companyGSTNo':req.body.companyGSTNo,
        'status':req.body.status,
        'itemId':req.body.itemId,
        'pageNo':req.body.pageNo,
        'searchFilter':req.body.searchFilter,
        'searchFilterStatus':req.body.searchFilterStatus,
        'searchFilterFromDate':req.body.searchFilterFromDate,
        'searchFilterToDate':req.body.searchFilterToDate
    };
	
    Transaction.getEstimates(post,callback);
};
/*
 * GET Estimates list
 */
exports.getestimatesold = function(req, res) {
	
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({
			responseCode: 1,
			responseMessage:constants.response_msg_success,
			invoices:result.result,
			totalCount:result.count
		}));
    };
	
    var post = {
        'estimateId':req.body.estimateId,
        'contactId':req.body.contactId,
        'estimateNo':req.body.estimateNo,
        'orderNo':req.body.orderNo,
        'companyName':req.body.companyName,
        'companyGSTNo':req.body.companyGSTNo,
        'status':req.body.status,
        'itemId':req.body.itemId,
        'pageNo':req.body.pageNo,
        'searchFilter':req.body.searchFilter,
        'searchFilterStatus':req.body.searchFilterStatus,
        'searchFilterFromDate':req.body.searchFilterFromDate,
        'searchFilterToDate':req.body.searchFilterToDate
    };
	
    Transaction.getEstimatesOld(post,callback);
};

exports.changeestimatestatus = function(req, res) {
    const currentDate   =   dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
	
    var callback	=	function(err2,result2)
    {
        res.end(JSON.stringify({responseCode: 1, responseMessage:constants.response_msg_success, response:result2}));
    };
    var post = {
        'status':req.body.status,
        'updateDate':currentDate,
    };
    var where = {
        'estimateId':parseInt(req.body.estimateId)
    };
    Transaction.editEstimate(post,where,callback);
};
/*
 * GET Estimates list
 */
exports.getestimatedetails = function(req, res) {
	
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({
			responseCode: 1,
			responseMessage:constants.response_msg_success,
			invoices:result,
		}));
    };
	
    var post = {
        'estimateId':req.body.estimateId,
        'contactId':req.body.contactId,
        'estimateNo':req.body.estimateNo,
        'orderNo':req.body.orderNo,
        'companyName':req.body.companyName,
        'companyGSTNo':req.body.companyGSTNo,
        'status':req.body.status,
        'itemId':req.body.itemId,
        'pageNo':req.body.pageNo,
        'searchFilter':req.body.searchFilter,
        'searchFilterStatus':req.body.searchFilterStatus,
        'searchFilterFromDate':req.body.searchFilterFromDate,
        'searchFilterToDate':req.body.searchFilterToDate
    };
	
    Transaction.getEstimatesDetails(post,callback);
};
/*
 * Insert Estimate
 */
exports.insertestimate = function(req, res) {
    const currentDate   =   dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
    var items = req.body.items;
    var result = JSON.parse(items);
	
    var callbackcheck = function(errcheck,resultcheck)
    {
        if(resultcheck && resultcheck.length <= 0)
        {
            var callback	=	function(err2,result2)
            {
                var estimateId = result2;
                console.log("HERE-1");
                var itemArray = [];
                result.forEach(function(obj) {
                  var itemListN = [
                      estimateId,
                      obj.itemName,
                      obj.quantity,
                      obj.rate,
                      obj.tax,
                      currentDate
                  ];
                  itemArray.push(itemListN);
             });
               
                Transaction.insertEstimateItem(itemArray,function(err6,result6){
						res.end(JSON.stringify({responseCode: 1, responseMessage:'Successfully inserted'}));
					});
            };
			
            var post = {
                'contactId':req.body.contactId,
                'estimateNo':req.body.estimateNo,
                'orderNo':req.body.orderNo,
                'estimateDate':req.body.estimateDate,
                'customerNotes':req.body.customerNotes,
                'termsAndConditions':req.body.termsAndConditions,
                'isIGST':req.body.isIGST,
                'companyName':req.body.companyName,
                'companyAddress':req.body.companyAddress,
                'companyPlaceOfSupply':req.body.companyPlaceOfSupply,
                'companyGSTNo':req.body.companyGSTNo,
                'isTaxExclusive':req.body.isTaxExclusive,
                'subTotal':req.body.subTotal,
                'totalAmount':req.body.totalAmount,
                'totalTax':req.body.totalTax,
                'contactCompanyName':req.body.contactCompanyName,
                'contactAddress':req.body.contactAddress,
                'contactGSTIN':req.body.contactGSTIN,
                'contactPlaceOfSupply':req.body.contactPlaceOfSupply,
                'status':req.body.status,
                'createDate':currentDate,
                'updateDate':currentDate
            };
            Transaction.insertEstimate(post,callback);
        }
        else
        {
             res.end(JSON.stringify({responseCode: 0, responseMessage:'Estimate No already exists.'}));
        }
    };
    Transaction.checkNo("estimates",req.body.estimateNo,"",callbackcheck);
};

/*
 * Edit Estimate
 */
exports.editestimate = function(req, res) {
    const currentDate   =   dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
    var items = req.body.items;
    var result = JSON.parse(items);
	
    var callback	=	function(err2,result2)
    {
		console.log("Edit Estimate Result:"+result2);
        var estimateId = req.body.estimateId;
		
        Transaction.deleteEstimateItems(estimateId,function(delErr,delRes){
              var itemArray = [];
                result.forEach(function(obj) {
                  var itemListN = [
                      estimateId,
                      obj.itemName,
                      obj.quantity,
                      obj.rate,
                      obj.tax,
                      currentDate
                  ];
                  itemArray.push(itemListN);
             });
            Transaction.insertEstimateItem(itemArray,function(err6,result6){
                    res.end(JSON.stringify({
                        responseCode: 1,
                        responseMessage:constants.response_msg_success
                    }));
                });
        });
    };
    
    var post = {
        'contactId':parseInt(req.body.contactId),
        'isIGST':req.body.isIGST,
        'estimateId':parseInt(req.body.estimateId),
        'estimateNo':req.body.estimateNo,
        'orderNo':req.body.orderNo,
        'estimateDate':req.body.estimateDate,
        'customerNotes':req.body.customerNotes,
        'termsAndConditions':req.body.termsAndConditions,
        'isTaxExclusive':req.body.isTaxExclusive,
        'subTotal':req.body.subTotal,
        'totalAmount':req.body.totalAmount,
        'totalTax':req.body.totalTax,
        'status':req.body.status,
        'updateDate':currentDate,
        'reasonToEdit':req.body.reasonToEdit,
    };
	
    var where = {
        'estimateId':parseInt(req.body.estimateId)
    };

    Transaction.editEstimate(post,where,callback);
};

/*
 * Get GST Treatement list
 */
exports.getgsttreatment = function(req, res) {
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({responseCode: 1, responseMessage:'Successfull', list:result}));
    };
    Transaction.listGsttreatment(callback);
};
/**************************ESTIMATES SECTION ENDS HERE*************************************/

/**************************PAYMENTS SECTION STARTS HERE*************************************/
/*
 * Upload Attachments for Payment in tmp_payment_attachments folder
 */
exports.uploadpaymentattachments = function(req, res) {
	
    const timestamp = new Date().getTime();
    var formidable = require('formidable');
    //var util = require('util');
	
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024;
    form.maxFields = 1000;
    form.multiples = false;
    var dir = './public/tmp_payment_attachments/';
	
    form.on('fileBegin', function (name, file){
        file.path = dir + timestamp+"_"+file.name;
    });
	
    form.parse(req, function(err, fields, files) {
		console.log("FIELDS"+JSON.stringify(fields));
		//var file = util.inspect(files);
		var filename = files.file.name;
		//var filepath = "/tmp_payment_attachments/"+timestamp+"_"+filename;
		var actualfile = timestamp+"_"+filename;
		res.send(actualfile);
    });
    
};

/*
 *Delete Payment attachment from tmp_payment_attachments folder
 */
exports.deletepaymentattachment = function(req,res)
{
    var imagePath = req.body.path;
    
    var fs = require('fs');
    filePath = './public/tmp_payment_attachments/' + imagePath;
    
	fs.unlink(filePath, function(unlinkErr, unlinkRes){
        console.log("FILE ERR: "+JSON.stringify(unlinkErr));
        console.log("FILE RES: "+JSON.stringify(unlinkRes));
    });
    
	var responseArray =	{
        "responseCode":1,
        "responseMessage":constants.response_msg_success,
    };
    res.send(JSON.stringify(responseArray));
    
};
/*
 * Insert Payment and move the images from tmp_payment_attachment folder to payment_attachments folder
 */
exports.recordpayment = function(req,res)
{
	const currentDate = dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
	
	var invoiceId = req.body.invoiceId;
	var paymentNo = req.body.paymentNo;
	var amountReceived = req.body.amountReceived;
	var isTaxDeducted = req.body.isTaxDeducted;
	var taxAmount = (req.body.taxAmount && req.body.taxAmount!=="undefined" && req.body.taxAmount!==null)?req.body.taxAmount:0;
	var paymentDate = req.body.paymentDate;
	var paymentMode = req.body.paymentMode;
	var type = req.body.type;
	var notes = req.body.notes;
	var createdBy = req.body.createdBy;
    var imageArr = [];
	var imageArray = req.body.imageArray;
	
    if(imageArray !=="")
    {
        imageArr    =   imageArray.split(",");
    }
	
	var insertParams = {
		"invoiceId":invoiceId,
		"paymentNo":paymentNo,
		"amountReceived":amountReceived,
		"isTaxDeducted":isTaxDeducted,
		"taxAmount":taxAmount,
		"paymentDate":paymentDate,
		"paymentMode":paymentMode,
		"notes":notes,
		"type":type,
		"createdBy":createdBy,
        "createDate":currentDate
	};
	
    var callbackAddPayment	=	function(addPaymentErr,addPaymentResult)
    {
         if(imageArr.length > 0)
         {
            let imageArray = [];
            
            for(let imagePath of imageArr) {
                let tmp_imagePath = imagePath;
                let inputFile = './public/tmp_payment_attachments/'+tmp_imagePath;
                let outputFile  = './public/tmp_payment_attachments/';
                //For database entry
                let outputFilePath  =   "/payment_attachments/"+tmp_imagePath;
                //MOVE File
                var moveFile = (file, dir2)=>{
                  //include the fs, path modules
                    var fs = require('fs');
                    var path = require('path');
                  
                    //gets file name and adds it to dir2
                    var f = path.basename(file);
                    var dest = path.resolve(dir2, f);
                  
                    fs.rename(file, dest, (err)=>{
                        if(err){ throw err;}
                        else{
                            console.log('Successfully moved');
                        }
                    });
                };
                //move file1.htm from 'test/' to 'test/dir_1/'
                moveFile(inputFile,outputFile);
                
                let imageItem = [
                    addPaymentResult,
                    outputFilePath,
                    currentDate,
                ];
                
                imageArray.push(imageItem);
           }
            
           callbackAddImage = function(addImageErr,addImageResult)
           {
				console.log("Add Payment Images Response"+JSON.stringify(addImageResult));
                var responseArray =	{
                    "responseCode":1,
                    "responseMessage":constants.response_msg_success,
                    "paymentId":addPaymentResult
                };
                res.send(JSON.stringify(responseArray));
           };
           Transaction.addPaymentImages(imageArray,callbackAddImage);
            
         }
         else
         {
            
         }
         var responseArray =	{
			"responseCode":1,
			"responseMessage":'Payment added successfully',
			"paymentId":addPaymentResult
		};
		res.send(JSON.stringify(responseArray));
    };
	
    Transaction.addPayment(insertParams,callbackAddPayment);
};
/*
 * List of payments
 */
exports.getpaymentreceived = function(req, res) {
    var callback	=	function(err,result)
    {
        let invoiceId = req.body.invoiceId;
        let post = {};
        if(invoiceId && invoiceId !=="undefined" && invoiceId !==null)
        {
             post = {
                'invoiceId':invoiceId
            };
        }
        else
        {
            console.log("HERE--"+JSON.stringify(result));
            post = {
                'invoiceId':(result && result !=="undefined" && result !==null && result.result && result.result !=="undefined" && result.result !==null)?result.result[0].invoiceId:''
            };
        }
       if(req.body.paymentId && req.body.paymentId !=="undefined" && req.body.paymentId!==null)
       {
            var callbackInv	=	function(errInv,resultInv)
            {
                res.end(JSON.stringify({
                    responseCode: 1,
                    responseMessage:constants.response_msg_success,
                    payments:result.result,
                    invoices:resultInv.result,
                    totalAmount:result.totalAmount,
                    totalCount:result.count}));
            };
            Transaction.getInvoiceDetails(post,callbackInv);
       }
       else
       {
            res.end(JSON.stringify({
            responseCode: 1,
            responseMessage:constants.response_msg_success,
            payments:result.result,
            totalAmount:result.totalAmount,
            invoices:[],
            totalCount:result.count}));
       }
        
    };
	
    var post = {
        'invoiceNo':req.body.invoiceNo,
        'paymentId':req.body.paymentId,
        'invoiceId':req.body.invoiceId,
        'paymentNo':req.body.paymentNo,
        'displayName':req.body.displayName,
        'expenseCategoryId':req.body.expenseCategoryId,
        'pageNo':req.body.pageNo,
        'type':req.body.type,
        'status':req.body.status,
        'searchFilter':req.body.searchFilter,
        'searchFilterStatus':req.body.searchFilterStatus,
        'searchFilterFromDate':req.body.searchFilterFromDate,
        'searchFilterToDate':req.body.searchFilterToDate
    };
	
    Transaction.getPaymentReceived(post,callback);
};

/**************************PAYMENTS SECTION ENDS HERE*************************************/

/**************************************DELETE THESE LATER***************************/

exports.gstpayable = function(req,res)
{
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({responseCode: 1, responseMessage:'Successfull', list:result}));
    };
    Transaction.gstPayable(fromDate,toDate,callback);
};

exports.tdsreceivable = function(req,res)
{
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    
    var callback	=	function(err,result)
    {
        res.end(JSON.stringify({responseCode: 1, responseMessage:'Successfull', list:result}));
    };
    Transaction.tdsReceivable(fromDate,toDate,callback);
};
