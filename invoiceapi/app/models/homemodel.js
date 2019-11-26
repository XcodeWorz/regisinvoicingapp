const constants = require('../../config/constants');
const cryptoLib = require('./global/cryptoLib');
const globaldb = require('./global/databaseLib');
const jsesc = require('jsesc');
const dateFormat = require('dateformat');

const Transaction = {
 
/***************************LOGIN SECTION STARTS HERE*******************************************/   
/*
 * Check Login MODEL Function.
 * Parameters: email, password.
 * Return: Userdetails if success, else return null.
 */
    checkLogin: function(username, password, callback) {
		username = jsesc(username);
		password = jsesc(password);
		const sql = `SELECT * FROM users WHERE userName = '${username}' AND status='${constants.user_status_active}'`;
        console.log("Sql:-"+sql);
        globaldb.selectData(sql, function(err, result) {
            console.log("Result:-"+result.length);
			if (result && result.length > 0) {
				const salt = result[0].salt;
				const databasePassword = result[0].password;
                const decryptedPassword = cryptoLib.decrypt(databasePassword,salt);
                console.log("password:-"+password);
                console.log("decryptedPassword:-"+decryptedPassword);
				if (decryptedPassword == password) {
                    var isSettings = false;
					const sqlsettings = `SELECT * FROM settings WHERE settingsId = 1`;
                    globaldb.selectData(sqlsettings, function(errsettings, resultsettings) {
                        if (resultsettings && resultsettings.length > 0) {
                            if(resultsettings[0].companyName && resultsettings[0].companyName !=="" && resultsettings[0].companyName !=="undefined" && resultsettings[0].companyName !==null)
                            {
                                isSettings  =   true;
                                
                            }
                        }
                        var finalResult = {
                            accessToken:result[0].accessToken,
                            name:result[0].name,
                            email:result[0].email,
                            phoneNo:result[0].phoneNo,
                            userType:result[0].userType,
                            status:result[0].status,
                            userId:result[0].userId,
                            isSettings:isSettings,
                            isRegisteredUnderGST:resultsettings[0].isRegisteredUnderGST
                        };
                        
                        callback(err, finalResult);
                    });
                   
					return;
				} else {
					callback(err, null);
					return;
				}
			} else {
				callback(err, null);
			}
		});
	},
    
/*
 * Check Email MODEL Function.
 * Parameters: email.
 * Return: details if success, else return null.
 */    
    checkEmail: function(email, callback) {
		email = jsesc(email);
		const sql = `select * from contacts where email = '${email}'`;
		return globaldb.selectData(sql, callback);
	},
    
      checkUserEmail: function(email, callback) {
		email = jsesc(email);
		const sql = `select * from users where email = '${email}'`;
		return globaldb.selectData(sql, callback);
	},
    
/***************************LOGIN SECTION ENDS HERE*******************************************/
    
    
/***************************SETTINGS SECTION STARTS HERE****************************************/
 getSettings: function(settingsId, callback) {
        let sql = `select * from settings`;
        sql+=` where 1=1`;
        sql+=` and settingsId ='${settingsId}'`;
		sql +=`;`;
        console.log("sql:-"+sql);
		globaldb.selectData(sql, function(err, result) {
			if (result && result.length > 0) {
				callback(err, result);
			} else {
                callback(err, result);
			}
		}); 
    },
           
/*
 * Edit Setting MODEL Function.
 * Parameters: table settings fields.
 * Return: edit row id on success and else return false.
 */
    editSetting: function(post, where, callback) {
        globaldb.updateData('settings', post, where, function(err, result) {
           callback(err, result);
		});
	},
/***************************SETTINGS SECTION ENDS HERE****************************************/

/***************************ITEMS SECTION STARTS HERE****************************************/
/*
 * INSERT items MODEL Function.
 * Parameters: table items fields.
 * Return: inserted row id on success and else return false.
 */
    insertItem: function(post, callback) {
        globaldb.insertData('items', post, function(err, result) {
            callback(err, result);
		});
	},
    
    editItem: function(post, where, callback) {
           globaldb.updateData('items', post, where, function(err, result) {
              callback(err, result);
           });
       },
       
/*
 * GET Items List MODEL Function.
 * Parameters: table items fields.
 * Return: items details on success and else return null.
 */
    getItems: function(post, callback) {
        let sqlAll = `select *`;
        let sqlCount = ` select count(*) as rowCount`;
        let sql=` from items it`;
        sql+=` where 1=1`;
        console.log("POST "+JSON.stringify(post));
        if(post.searchFilter && post.searchFilter !=="")
        {
            sql+=` and (`;
            sql+=` it.name like '%${post.searchFilter}%'`;
            sql+=`)`;
        }
        if(post.itemId && post.itemId !=="")
        {
            sql+=` and it.itemId ='${post.itemId}'`;
        }
        if(post.name && post.name !=="")
        {
            sql+=` and it.name LIKE '%${post.name}%'`;
        }
    
    sqlCount += sql+";";
        sql +=` order by it.createDate desc`;
        if(post.pageNo && post.pageNo !=='') {
			const size = constants.resultsize;
			const start = (post.pageNo-1)*size;
			sql += ` LIMIT ${start},${size}`;
		}
		sql +=`;`;
		
		sqlAll += sql;
		
        console.log("sql1:-"+sql);
		globaldb.selectData(sqlAll, function(err, resultList) {
			globaldb.selectData(sqlCount, function(errCount, resultCount) {
				if (resultList && resultList.length > 0) {
                    var resultObj = {
						"count":resultCount[0].rowCount,
						"result":resultList
					};
					callback(err, resultObj);
				} else {
					callback(err, resultList);
				}
			});
		});
	},

/***************************ITEMS SECTION ENDS HERE****************************************/   
    
/*
 * INSERT Contacts MODEL Function.
 * Parameters: table contacts fields.
 * Return: inserted row id on success and else return false.
 */
    insertContact: function(post, callback) {
        globaldb.insertData('contacts', post, function(err, result) {
            callback(err, result);
		});
	},
    
   
/*
 * INSERT Tax Slab MODEL Function.
 * Parameters: table tax slab fields.
 * Return: inserted row id on success and else return false.
 */
    insertTaxSlab: function(post, callback) {
        globaldb.insertData('taxslab', post, function(err, result) {
            callback(err, result);
		});
	},
    
        
/*
 * INSERT Contacts MODEL Function.
 * Parameters: table contacts fields.
 * Return: inserted row id on success and else return false.
 */
    insertUser: function(post, callback) {
        const randomstring = require('randomstring');
		const salt = randomstring.generate(32);
		const encryptedPassword = cryptoLib.encrypt(post.password, salt);
        post.password = encryptedPassword;
        post.salt = salt;
        globaldb.insertData('users', post, function(err, result) {
            callback(err, result);
		});
	},
    

/*
 * INSERT invoices MODEL Function.
 * Parameters: table invoices fields.
 * Return: inserted row id on success and else return false.
 */    
    insertInvoice: function(post, callback) {
        globaldb.insertData('invoices', post, function(err, result) {
            var sql = `update settings set invoiceNo = invoiceNo+1`;
            globaldb.selectData(sql, function(errUpd, resultUpd) {
                 callback(err, result);
             });
		});
	},
    
/*
 * INSERT invoiceitems MODEL Function.
 * Parameters: table invoiceitems fields.
 * Return: inserted row id on success and else return false.
 */
    insertInvoiceItem: function(itemsArray, callback) {
        let sql = "INSERT INTO invoiceitems (invoiceId,itemName,quantity,rate,tax,itcEligible,createDate) VALUES ?";
		globaldb.insertBulk('invoiceitems', itemsArray, sql, function(insertErr, insertResult) {
			callback(1, insertResult);
        });
	},
    
    deleteInvoiceItems:function(invoiceId,callback){
        var where = {
            invoiceId:invoiceId
        };
        globaldb.deleteData('invoiceitems', where, function(err, result) {
                callback(err, err);
            });
    },
    
    deleteEstimateItems:function(estimateId,callback){
        var where = {
            estimateId:estimateId
        };
        globaldb.deleteData('estimateitems', where, function(err, result) {
                callback(err, err);
            });
    },
       
/*
 * Edit invoice MODEL Function.
 * Parameters: table invoices fields.
 * Return: edit row id on success and else return false.
 */
    editInvoice: function(post, where, callback) {
        globaldb.updateData('invoices', post, where, function(err, result) {
           callback(err, result);
		});
	},
    
         
/*
 * Edit taxslab MODEL Function.
 * Parameters: table taxslab fields.
 * Return: edit row id on success and else return false.
 */
    editTaxSlab: function(post, where, callback) {
        globaldb.updateData('taxslab', post, where, function(err, result) {
           callback(err, result);
		});
	},
    
/*
 * Edit contact MODEL Function.
 * Parameters: table contacts fields.
 * Return: edit row id on success and else return false.
 */
    editContact: function(post, where, callback) {
        globaldb.updateData('contacts', post, where, function(err, result) {
           callback(err, result);
		});
	},
    
     editUser: function(post, where, callback) {
        globaldb.updateData('users', post, where, function(err, result) {
           callback(err, result);
		});
	},
    
    
    
    
/*
 * GET Contacts List MODEL Function.
 * Parameters: table contacts fields.
 * Return: contacts details on success and else return null.
 */
    getContacts: function(post, callback) {
        let sqlAll = `select *, gt.name as gsttreatment_name`;
        let sqlCount = ` select count(*) as rowCount`;
        let sql = ` from contacts c,gsttreatment gt`;
        sql+=` where 1=1 and gt.gstTreatmentId = c.gstTreatmentId`;
        if(post.userType && post.userType !=="undefined" && post.userType !==null)
        {
            sql+=` and userType = '${post.userType}'`;
        }
        else
        {
            sql+=` and userType = '${constants.usertype_customer}'`;
        }
        if(post.searchFilter && post.searchFilter !=="")
        {
            sql+=` and (`;
            sql+=` firstName like '%${post.searchFilter}%' OR`;
            sql+=` companyName like '%${post.searchFilter}%' OR`;
            sql+=` displayName like '%${post.searchFilter}%' OR`;
            sql+=` email like '%${post.searchFilter}%' OR`;
            sql+=` phoneNo like '%${post.searchFilter}%' OR`;
            sql+=` website like '%${post.searchFilter}%' OR`;
            sql+=` gstNo like '%${post.searchFilter}%' OR`;
            sql+=` placeOfSupply like '%${post.searchFilter}%' OR`;
            sql+=` currency like '%${post.searchFilter}%'`;
            sql+=`)`;
        }
        else if(post.searchFilterStatus && post.searchFilterStatus !=="")
        {
            sql+=` and status ='${post.searchFilterStatus}'`;
        }
        else
        {
            if(post.contactId && post.contactId !=="")
            {
                sql+=` and contactId ='${post.contactId}'`;
            }
            if(post.salutation && post.salutation !=="")
            {
                sql+=` and salutation ='${post.salutation}'`;
            }
            if(post.firstName && post.firstName !=="")
            {
                sql+=` and firstName like '%${post.firstName}%'`;
            }
            if(post.lastName && post.lastName !=="")
            {
                sql+=` and lastName like '%${post.lastName}%'`;
            }
            if(post.companyName  && post.companyName  !=="")
            {
                sql+=` and companyName like '%${post.companyName}%'`;
            }
            if(post.displayName  && post.displayName  !=="")
            {
                sql+=` and displayName like '%${post.displayName}%'`;
            }
            if(post.email  && post.email  !=="")
            {
                sql+=` and email = '${post.email}'`;
            }
            if(post.phoneNo  && post.phoneNo  !=="")
            {
                sql+=` and phoneNo = '${post.phoneNo}'`;
            }
            if(post.website  && post.website  !=="")
            {
                sql+=` and website = '${post.website}'`;
            }
            if(post.gstNo  && post.gstNo  !=="")
            {
                sql+=` and gstNo = '${post.gstNo}'`;
            }
            if(post.placeOfSupply  && post.placeOfSupply  !=="")
            {
                sql+=` and placeOfSupply = '${post.placeOfSupply}'`;
            }
            if(post.isTaxable  && post.isTaxable  !=="")
            {
                sql+=` and isTaxable = '${post.isTaxable}'`;
            }
            if(post.currency  && post.currency  !=="")
            {
                sql+=` and currency = '${post.currency}'`;
            }
            if(post.status  && post.status  !=="")
            {
                sql+=` and status = '${post.status}'`;
            }
        }
        sqlCount += sql+";";
        sql +=` order by createDate desc`;
        if(post.pageNo && post.pageNo !=='') {
			const size = constants.resultsize;
			const start = (post.pageNo-1)*size;
			sql += ` LIMIT ${start},${size}`;
		}
		sql +=`;`;
		sqlAll += sql;
        console.log("sql:-"+sqlAll);
		globaldb.selectData(sqlAll, function(err, resultList) {
			globaldb.selectData(sqlCount, function(errCount, resultCount) {
				if (resultList && resultList.length > 0) {
                    var resultObj = {
						"count":resultCount[0].rowCount,
						"result":resultList
					};
					callback(err, resultObj);
				} else {
					callback(err, resultList);
				}
			});
		});
	},
    
           
/*
 * GET Contacts List MODEL Function.
 * Parameters: table contacts fields.
 * Return: contacts details on success and else return null.
 */
    getUsers: function(post, callback) {
        let sqlAll = `select * `;
        let sqlCount = ` select count(*) as rowCount`;
        let sql =` from users`;
        sql+=` where 1=1`;
        if(post.searchFilter && post.searchFilter !=="")
        {
            sql+=` and (`;
            sql+=` name like '%${post.searchFilter}%' OR`;
            sql+=` email like '%${post.searchFilter}%' OR`;
            sql+=` phoneNo like '%${post.searchFilter}%'`;
            sql+=`)`;
        }
        else
        {
            if(post.userId && post.userId !=="")
            {
                sql+=` and userId ='${post.userId}'`;
            }
            if(post.name && post.name !=="")
            {
                sql+=` and name ='${post.name}'`;
            }
            if(post.email  && post.email  !=="")
            {
                sql+=` and email = '${post.email}'`;
            }
            if(post.phoneNo  && post.phoneNo  !=="")
            {
                sql+=` and phoneNo = '${post.phoneNo}'`;
            }
        }
        sqlCount += sql+";";
        sql +=` order by createDate desc`;
        if(post.pageNo && post.pageNo !=='') {
			const size = constants.resultsize;
			const start = (post.pageNo-1)*size;
			sql += ` LIMIT ${start},${size}`;
		}
        sql +=`;`;
		sqlAll += sql;
        console.log("sql:-"+sql);
		globaldb.selectData(sqlAll, function(err, resultList) {
			globaldb.selectData(sqlCount, function(errCount, resultCount) {
				if (resultList && resultList.length > 0) {
                    var resultObj = {
						"count":resultCount[0].rowCount,
						"result":resultList
					};
					callback(err, resultObj);
				} else {
					callback(err, resultList);
				}
			});
		});
	},
    
    
    getSearchContacts: function(contactId, callback) {
        let rescontactId = contactId.trim();
		
        let sql = `select * from contacts`;
        sql+=` where 1=1`;
        
		if(rescontactId && rescontactId !=="")
        {
            sql+=` and (`;
            sql+=` displayName = '${rescontactId}' OR`;
            sql+=` contactId = '${rescontactId}'`;
            sql+=`)`;
        }
        sql +=` order by createDate desc`;
        sql +=` LIMIT 1`;
		sql +=`;`;
		
		
		globaldb.selectData(sql, function(err, result) {
            callback(err, result);
		}); 
	},
    
    
        
/*
 * GET Invoices List MODEL Function.
 * Parameters: table invoices fields.
 * Return: invoices details on success and else return null.
 */

 
    getInvoices: function(post, callback) {
        
        let sqlAll = `select *, iv.companyName as invoiceCompanyName, iv.status as invoice_status, iv.createDate as invoice_createdate`;
        let sqlCount = ` select count(*) as rowCount`;
		
        let sql = ` from invoices iv`;
        sql +=` inner join contacts ct on ct.contactId = iv.contactId`;
        sql+=` where 1=1`;
        
        if(post.contactId && post.contactId !=="")
        {
            sql+=` and iv.contactId = ${post.contactId}`;
        }

        if(post.type && post.type !=="")
        {
            sql+=` and iv.type = '${post.type}'`;
        }else{
			sql+=` and iv.type = 'invoice'`;
		}
        
        if(post.searchFilter && post.searchFilter !=="")
        {
            sql+=` and (`;
            sql+=` iv.invoiceNo like '%${post.searchFilter}%' OR`;
            sql+=` iv.orderNo like '%${post.searchFilter}%' OR`;
            sql+=` ct.firstName like '%${post.searchFilter}%' OR`;
            sql+=` ct.companyName like '%${post.searchFilter}%' OR`;
            sql+=` ct.displayName like '%${post.searchFilter}%' OR`;
            sql+=` ct.email like '%${post.searchFilter}%' OR`;
            sql+=` ct.phoneNo like '%${post.searchFilter}%' OR`;
            sql+=` ct.gstNo like '%${post.searchFilter}%'`;
            sql+=`)`;
        }
        if(post.searchFilterStatus && post.searchFilterStatus !=="")
        {
            sql+=` and iv.status = '${post.searchFilterStatus}'`;
        }
        if(post.invoiceId && post.invoiceId !=="")
        {
            sql+=` and iv.invoiceId ='${post.invoiceId}'`;
        }
        if(post.contactId && post.contactId !=="")
        {
            sql+=` and iv.contactId ='${post.contactId}'`;
        }
        if(post.invoiceNo && post.invoiceNo !=="")
        {
            sql+=` and iv.invoiceNo like '%${post.invoiceNo}%'`;
        }
        if(post.orderNo && post.orderNo !=="")
        {
            sql+=` and iv.orderNo like '%${post.orderNo}%'`;
        }
        if(post.status  && post.status  !=="")
        {
            sql+=` and iv.status = '${post.status}'`;
        }
       
        var fromDate = post.searchFilterFromDate;
		var toDate = post.searchFilterToDate;
		
		var dateSql = Transaction.getFormattedDateSql("iv.invoiceDate",fromDate,toDate);
		sql += dateSql;
        
        sqlCount += sql+";";
        sql +=` order by iv.invoiceDate desc, iv.createDate desc`;
        if(post.pageNo && post.pageNo !=='') {
			const size = constants.resultsize;
			const start = (post.pageNo-1)*size;
			sql += ` LIMIT ${start},${size}`;
		}
        
		sql +=`;`;
        sqlAll += sql;
        
        console.log("Get Invoices SQL:-"+sqlAll);
        
        globaldb.selectData(sqlAll, function(err, result) {
			globaldb.selectData(sqlCount, function(errCount, resultCount) {
				if (result && result.length > 0) {
					var resultObj = {
						list:result,
						count:resultCount[0].rowCount
					};
					callback(err, resultObj);
				}
                else
                {
                    var resultObj = {
						list:[],
						count:0
					};
					callback(err, resultObj);
                }
			});
                 
		}); 
	},
	
    getInvoiceDetails: function(post, callback) {
		let sql = `select *, iv.companyName as invoiceCompanyName, iv.status as invoice_status, iv.createDate as invoice_createdate`;
		sql += ` from invoices iv`;
        sql +=` inner join contacts ct on ct.contactId = iv.contactId`;
        sql+=` where iv.invoiceId =${post.invoiceId}`;
		
		globaldb.selectData(sql, function(err, result) {
			
			let sqlItems = `select * from invoiceitems where invoiceId = ${post.invoiceId}`;
			
			globaldb.selectData(sqlItems, function(errItems, resultItems) {
				
				console.log("SQL:"+sql);
				
				result[0].invoiceitems = resultItems;
				callback(err,result);
			});
			
		});
	},
	
	//TODO: DELETE THIS AFTER 26th AUG 2019
    getInvoicesOld: function(post, callback) {
        const tmpMasterArray = [];
        const invoices =   [];
        const countInvoices   =   [];
        const tmpItemsArray =   [];
        
        let sqlAll = `select *, iv.companyName as invoiceCompanyName, iv.status as invoice_status, iv.createDate as invoice_createdate`;
        let sqlCount = ` select count(*) as rowCount`;
        let sql = ` from invoices iv`;
        sql +=` inner join contacts ct on ct.contactId = iv.contactId`;
        sql +=` inner join invoiceitems it on iv.invoiceId = it.invoiceId`;
        sql+=` where 1=1`;
        
        if(post.contactId && post.contactId !=="")
        {
            sql+=` and iv.contactId = ${post.contactId}`;
        }

        if(post.type && post.type !=="")
        {
            sql+=` and iv.type = '${post.type}'`;
        }else{
			sql+=` and iv.type = 'invoice'`;
		}
        
        if(post.searchFilter && post.searchFilter !=="")
        {
            sql+=` and (`;
            sql+=` iv.invoiceNo like '%${post.searchFilter}%' OR`;
            sql+=` iv.orderNo like '%${post.searchFilter}%' OR`;
            sql+=` ct.firstName like '%${post.searchFilter}%' OR`;
            sql+=` ct.companyName like '%${post.searchFilter}%' OR`;
            sql+=` ct.displayName like '%${post.searchFilter}%' OR`;
            sql+=` ct.email like '%${post.searchFilter}%' OR`;
            sql+=` ct.phoneNo like '%${post.searchFilter}%' OR`;
            sql+=` ct.gstNo like '%${post.searchFilter}%'`;
            sql+=`)`;
        }
        else if(post.searchFilterStatus && post.searchFilterStatus !=="")
        {
            sql+=` and iv.status = '${post.searchFilterStatus}'`;
        }
        else
        {
            if(post.invoiceId && post.invoiceId !=="")
            {
                sql+=` and iv.invoiceId ='${post.invoiceId}'`;
            }
            if(post.contactId && post.contactId !=="")
            {
                sql+=` and iv.contactId ='${post.contactId}'`;
            }
            if(post.invoiceNo && post.invoiceNo !=="")
            {
                sql+=` and iv.invoiceNo like '%${post.invoiceNo}%'`;
            }
            if(post.orderNo && post.orderNo !=="")
            {
                sql+=` and iv.orderNo like '%${post.orderNo}%'`;
            }
            if(post.status  && post.status  !=="")
            {
                sql+=` and iv.status = '${post.status}'`;
            }
        }
        
        var fromDate = post.searchFilterFromDate;
		var toDate = post.searchFilterToDate;
		
		var dateSql = Transaction.getFormattedDateSql("iv.invoiceDate",fromDate,toDate);
		sql += dateSql;
        
        sqlCount += sql+";";
        sql +=` order by iv.invoiceDate desc, iv.createDate desc`;
        if(post.pageNo && post.pageNo !=='') {
			const size = constants.resultsize;
			const start = (post.pageNo-1)*size;
			sql += ` LIMIT ${start},${size}`;
		}
        
		sql +=`;`;
        sqlAll += sql;
        
        console.log("sql:-"+sql);
        
        globaldb.selectData(sqlAll, function(err, result) {
			globaldb.selectData(sqlCount, function(errCount, resultCount) {
			
				if (result && result.length > 0) {
                
					result.forEach(function(cust){
						eval('items'+cust.invoiceId+'= []');
						
						if (countInvoices[cust.invoiceId]) {
							let tmp1 = countInvoices[cust.invoiceId];
							countInvoices[cust.invoiceId] = ++tmp1;
						} else {
							countInvoices[cust.invoiceId] = 1;
						}
					});
                 
					result.forEach(function(cust) {
						
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
                        'itemName':cust.itemName,
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
                        'subTotal':cust.subTotal,
                        'totalAmount':cust.totalAmount,
                        'status':cust.invoice_status,
                        'salutation':cust.salutation,
                        'firstName':cust.firstName,
                        'lastName':cust.lastName,
                        'companyName':cust.contactCompanyName,
                        'displayName':cust.displayName,
                        'email':cust.email,
                        'address':cust.address,
                        'phoneNo':cust.phoneNo,
                        'website':cust.website,
                        'gstNo':cust.contactGSTIN,
                        'placeOfSupply':cust.contactPlaceOfSupply,
                        'isTaxable':cust.isTaxable,
                        'currency':cust.currency,
                        'customerNotes':cust.customerNotes,
                        'termsAndConditions':cust.termsAndConditions,
                        'createDate':cust.invoice_createdate,
                        'reasonToEdit':cust.reasonToEdit,
                        'isTaxExclusive':cust.isTaxExclusive,
						'invoiceitems': eval('items'+cust.invoiceId)
					};
                const evalCount = eval('countInvoices'+cust.invoiceId);
                //console.log("count"+countInvoices[cust.invoiceId]);
                if (evalCount == countInvoices[cust.invoiceId]) {
                    invoices.push(tmpInvoices);
                }  
               });
                 var resultObj = {
						"count":resultCount[0].rowCount,
						"result":invoices
					};
				callback(err, resultObj);
			} else {
                callback(err, result);
			}
		}); 
		}); 
	},
    
    getInvoiceItems: function(invoiceId, callback) {
        let sql = `select * from invoiceitems`;
        sql+=` where 1=1`;
        sql+=` and invoiceId ='${invoiceId}'`;
		sql +=`;`;
        console.log("sql:-"+sql);
		globaldb.selectData(sql, function(err, result) {
			if (result && result.length > 0) {
				callback(err, result);
			} else {
                callback(err, result);
			}
		}); 
    },
    
   
    
/*
 * UNIVERSAL MODEL Function to calculate Invoice Amount.
 * Parameters: quantity and rate.
 * Return: calculated amount.
 */
    calculateInvoiceAmount: function(quantity,rate) {
		const amount = quantity * rate;
		return amount;
	},
    
    sendGridMailAttachment: function(sendGridAPIKey, templateID, toEmail, toName, fromEmail, fromName, subject, subs, cc, bcc, file, filename) {
		const sgMail = require('@sendgrid/mail');
		sgMail.setApiKey(sendGridAPIKey);
		const msg = {
			to: toEmail,
			toname: toName,
			from: fromEmail,
			fromname: fromName,
			subject,
			cc,
			bcc,
			substitutionWrappers: ['{{', '}}'],
			templateId: templateID,
			substitutions: subs,
			attachments: [
				{
					content: file,
					filename,
					type: 'pdf',
					disposition: 'attachment',
					content_id: 'mytext',
				},
			],
		};
		sgMail.send(msg);
	},
    
      getItemIdBasedOnItemName: function(itemName, contactId, callback) {
        itemName    =   itemName.trim();
        let sql = `select * from items`;
        sql+=` where 1=1`;
        sql+=` and contactId ='${contactId}'`;
        sql+=` and name = '${itemName}'`;
        sql+=` LIMIT 1`;
		sql+=`;`;
        console.log("sql:-"+sql);
		globaldb.selectData(sql, function(err, result) {
			if (result && result.length > 0) {
				callback(err, result);
			} else {
                callback(err, 0);
			}
		}); 
    },
    
      getinvoicetotal: function(post, callback) {
        let sql = `select sum(totalSentInvoiceAmount) as totalSentInvoiceAmount,`;
        sql+=` sum(totalSentTaxAmount) as totalSentTaxAmount,`;
        sql+=` sum(totalPaidInvoiceAmount) as totalPaidInvoiceAmount,`;
        sql+=` sum(totalPaidTaxAmount) as totalPaidTaxAmount,`;
        sql+=` sum(totalVoidInvoiceAmount) as totalVoidInvoiceAmount,`;
        sql+=` sum(totalVoidTaxAmount) as totalVoidTaxAmount,`;
        sql+=` sum(totalPaidInvoiceAmount15Days) as totalPaidInvoiceAmount15Days,`;
        sql+=` sum(totalPaidTaxAmount15Days) as totalPaidTaxAmount15Days,`;
        sql+=` sum(totalPaidInvoiceAmount30Days) as totalPaidInvoiceAmount30Days,`;
        sql+=` sum(totalPaidTaxAmount30Days) as totalPaidTaxAmount30Days,`;
        sql+=` sum(totalVoidInvoiceAmount15Days) as totalVoidInvoiceAmount15Days,`;
        sql+=` sum(totalVoidTaxAmount15Days) as totalVoidTaxAmount15Days,`;
        sql+=` sum(totalVoidInvoiceAmount30Days) as totalVoidInvoiceAmount30Days,`;
        sql+=` sum(totalVoidTaxAmount30Days) as totalVoidTaxAmount30Days,`;
        sql+=` sum(totalSentInvoiceAmount15Days) as totalSentInvoiceAmount15Days,`;
        sql+=` sum(totalSentTaxAmount15Days) as totalSentTaxAmount15Days,`;
        sql+=` sum(totalSentInvoiceAmount30Days) as totalSentInvoiceAmount30Days,`;
        sql+=` sum(totalSentTaxAmount30Days) as totalSentTaxAmount30Days`;
        sql+=` from customerinvoicetotal`;
        sql+=` where 1=1`;
        if(post.contactId && post.contactId !="")
        {
             sql+=` and contactId ='${contactId}'`;
        }
		sql+=`;`;
        sql +=` select *, iv.companyName as invoiceCompanyName, iv.status as invoice_status, iv.createDate as invoice_createdate`;
        sql += ` from invoices iv`;
        sql +=` inner join contacts ct on ct.contactId = iv.contactId`;
        sql +=` left join invoiceitems it on iv.invoiceId = it.invoiceId`;
        //sql +=` left join items itm on itm.itemId = it.itemId`;
        sql+=` where iv.status='${constants.invoicestatus_due_on_date}' and iv.type='${constants.invoicetype_invoice}'`;
        sql+=` group by iv.invoiceId`;
        sql+=` LIMIT ${constants.dashboardinvoiceslimit}`;
        sql+=`;`;
        sql +=` select *, iv.companyName as invoiceCompanyName, iv.status as invoice_status, iv.createDate as invoice_createdate`;
        sql += ` from invoices iv`;
        sql +=` inner join contacts ct on ct.contactId = iv.contactId`;
        sql +=` left join invoiceitems it on iv.invoiceId = it.invoiceId`;
        //sql +=` left join items itm on itm.itemId = it.itemId`;
        sql+=` where iv.status='${constants.invoicestatus_cleared}' and iv.type='${constants.invoicetype_invoice}'`;
        sql+=` group by iv.invoiceId`;
        sql+=` LIMIT ${constants.dashboardinvoiceslimit}`;
        sql+=`;`;
        console.log("sql:-"+sql);
		globaldb.selectData(sql, function(err, result) {
            callback(err, result);
		}); 
    },
    
    createAccessToken: function() {
		const randomNumber = Math.floor((Math.random() * 99999) + 10000);
		const accesstoken = 'CUST' + randomNumber;
		const sql = `SELECT count(*) cnt FROM users WHERE accessToken = '${accesstoken}'`;
		globaldb.selectData(sql, function(err, result) {
			let cnt = result[0].cnt;
			while (cnt) {
				const randomNumber = Math.floor((Math.random() * 99999) + 10000);
				const accesstoken = 'CUST' + randomNumber;
				const sql1 = `SELECT count(*) cnt FROM users WHERE accessToken = '${accesstoken}'`;
				globaldb.selectData(sql1, function(err1, result1) {
					cnt	=	result1[0].cnt;
				});
			}
		});
		return accesstoken;
	},
    
     resetpassword: function(post, callback) {
        const randomstring = require('randomstring');
		const salt = randomstring.generate(32);
		const encryptedPassword = cryptoLib.encrypt(post.password, salt);
        let where = {
            userId:post.userId
            };
        let postArray = {
            password:encryptedPassword,
            salt:salt
            };
        //console.log("POSTArray"+JSON.stringify(postArray));
        //console.log("WHEREArray"+JSON.stringify(where));
        globaldb.updateData('users', postArray, where, function(err, result) {
           callback(err, result);
		});
     },
     
      gettaxslabs: function(taxSlabId, callback) {
        let sql = `select * from taxslab`;
        sql+=` where 1=1`;
        if(taxSlabId && taxSlabId !="")
        {
            sql+=` and taxSlabId ='${taxSlabId}'`;
        }
        sql +=` order by createDate desc`;
		sql+=`;`;
        console.log("sql:-"+sql);
		globaldb.selectData(sql, function(err, result) {
			if (result && result.length > 0) {
				callback(err, result);
			} else {
                callback(err, 0);
			}
		}); 
    },
    
    //UTILS
	getFormattedDateSql: function(tableName, fromDate, toDate) {
		var sql = "";
		if(fromDate && fromDate !="undefined" && fromDate !=="" && fromDate !=="null" && toDate && toDate !="undefined" && toDate !=="" && toDate !=="null")
        {
			let formatted_fromDate = cryptoLib.getFormattedDate(fromDate, true);
			let formatted_toDate = cryptoLib.getFormattedDate(toDate,false);
			
            if(formatted_fromDate !="NaN-NaN-NaN 00:00:00" && formatted_toDate !="NaN-NaN-NaN 23:59:59")
            {
                sql+=` and ${tableName} >= '${formatted_fromDate}' and ${tableName} <= '${formatted_toDate}'`;
            }
            
        }
        else if(fromDate && fromDate !="undefined" && fromDate !=="" && fromDate !=="null")
        {
            console.log(fromDate);
            let formatted_fromDate = cryptoLib.getFormattedDate(fromDate,true);
            if(formatted_fromDate !="NaN-NaN-NaN 00:00:00")
            {
                sql+=` and ${tableName} >= '${formatted_fromDate}'`;
            }
        }
        else if(toDate && toDate !="undefined" && toDate !=="" && toDate !=="null")
        {
			console.log("here");
			let formatted_toDate = cryptoLib.getFormattedDate(toDate,false);
            if(formatted_toDate !="NaN-NaN-NaN 23:59:59")
            {
                sql+=` and ${tableName} <= '${formatted_toDate}'`;
            }
        }
		return sql;
	},
    
    getEstimates: function(post, callback) {
        
        let sqlAll = `select *, iv.companyName as invoiceCompanyName, iv.status as invoice_status, iv.createDate as invoice_createdate`;
        let sqlCount = ` select count(*) as rowCount`;
		
        let sql = ` from estimates iv`;
        sql +=` inner join contacts ct on ct.contactId = iv.contactId`;
        sql+=` where 1=1`;
        
        if(post.contactId && post.contactId !=="")
        {
            sql+=` and iv.contactId = ${post.contactId}`;
        }
        
        if(post.searchFilter && post.searchFilter !=="")
        {
            sql+=` and (`;
            sql+=` iv.estimateNo like '%${post.searchFilter}%' OR`;
            sql+=` iv.orderNo like '%${post.searchFilter}%' OR`;
            sql+=` ct.firstName like '%${post.searchFilter}%' OR`;
            sql+=` ct.companyName like '%${post.searchFilter}%' OR`;
            sql+=` ct.displayName like '%${post.searchFilter}%' OR`;
            sql+=` ct.email like '%${post.searchFilter}%' OR`;
            sql+=` ct.phoneNo like '%${post.searchFilter}%' OR`;
            sql+=` ct.gstNo like '%${post.searchFilter}%'`;
            sql+=`)`;
        }
        if(post.estimateId && post.estimateId !=="")
        {
            sql+=` and iv.estimateId ='${post.estimateId}'`;
        }
        if(post.contactId && post.contactId !=="")
        {
            sql+=` and iv.contactId ='${post.contactId}'`;
        }
        if(post.invoiceNo && post.invoiceNo !=="")
        {
            sql+=` and iv.estimateNo like '%${post.estimateNo}%'`;
        }
        if(post.orderNo && post.orderNo !=="")
        {
            sql+=` and iv.orderNo like '%${post.orderNo}%'`;
        }
        if(post.searchFilterStatus && post.searchFilterStatus !=="")
        {
            sql+=` and iv.status = '${post.searchFilterStatus}'`;
        }
        
        var fromDate = post.searchFilterFromDate;
		var toDate = post.searchFilterToDate;
		
		var dateSql = Transaction.getFormattedDateSql("iv.estimateDate",fromDate,toDate);
		sql += dateSql;
        
        sqlCount += sql+";";
		
        sql +=` order by iv.estimateDate desc, iv.createDate desc`;
		
        if(post.pageNo && post.pageNo !=='') {
			const size = constants.resultsize;
			const start = (post.pageNo-1)*size;
			sql += ` LIMIT ${start},${size}`;
		}
        
		sql +=`;`;
        sqlAll += sql;
        
        console.log("Estimate Sql:-"+sqlAll);
        
        globaldb.selectData(sqlAll, function(err, result) {
			globaldb.selectData(sqlCount, function(errCount, resultCount) {
				if (result && result.length > 0) {
					var resultObj = {
						list:result,
						count:resultCount[0].rowCount
					};
					callback(err, resultObj);
				}
                else
                {
                    var resultObj = {
						list:[],
						count:0
					};
					callback(err, resultObj);
                }
			});
		}); 
	},
    
	getEstimatesDetails: function(post, callback) {
		let sql = `select *, iv.companyName as invoiceCompanyName, iv.status as invoice_status, iv.createDate as invoice_createdate`;
		sql += ` from estimates iv`;
        //sql += ` inner join contacts ct on ct.contactId = iv.contactId`;
        sql += ` where iv.estimateId = ${post.estimateId}`;
		
		globaldb.selectData(sql, function(err, result) {
			
			let sqlItems = `select * from estimateitems where estimateId = ${post.estimateId}`;
			
			globaldb.selectData(sqlItems, function(errItems, resultItems) {
				
				result[0].invoiceitems = resultItems;
				callback(err,result);
			});
		});
	},
	
    getEstimatesOld: function(post, callback) {
        const tmpMasterArray = [];
        const invoices =   [];
        const countInvoices   =   [];
        const tmpItemsArray =   [];
        
        let sqlAll = `select *, iv.companyName as invoiceCompanyName, iv.status as invoice_status, iv.createDate as invoice_createdate`;
        let sqlCount = ` select count(*) as rowCount`;
        let sql = ` from estimates iv`;
        sql +=` inner join contacts ct on ct.contactId = iv.contactId`;
        sql +=` left join estimateitems it on iv.estimateId = it.estimateId`;
        sql +=` left join items itm on itm.itemId = it.itemId`;
        sql+=` where 1=1`;
        
        if(post.contactId && post.contactId !=="")
        {
            sql+=` and iv.contactId = ${post.contactId}`;
        }
        
        if(post.searchFilter && post.searchFilter !=="")
        {
            sql+=` and (`;
            sql+=` iv.estimateNo like '%${post.searchFilter}%' OR`;
            sql+=` iv.orderNo like '%${post.searchFilter}%' OR`;
            sql+=` iv.customerNotes like '%${post.searchFilter}%' OR`;
            sql+=` iv.termsAndConditions like '%${post.searchFilter}%' OR`;
            sql+=` iv.reasonToEdit like '%${post.searchFilter}%' OR`;
            sql+=` itm.name like '%${post.searchFilter}%' OR`;
            sql+=` it.quantity like '%${post.searchFilter}%' OR`;
            sql+=` it.rate like '%${post.searchFilter}%' OR`;
            sql+=` ct.firstName like '%${post.searchFilter}%' OR`;
            sql+=` ct.companyName like '%${post.searchFilter}%' OR`;
            sql+=` ct.displayName like '%${post.searchFilter}%' OR`;
            sql+=` ct.email like '%${post.searchFilter}%' OR`;
            sql+=` ct.phoneNo like '%${post.searchFilter}%' OR`;
            sql+=` ct.website like '%${post.searchFilter}%' OR`;
            sql+=` ct.gstNo like '%${post.searchFilter}%' OR`;
            sql+=` ct.placeOfSupply like '%${post.searchFilter}%' OR`;
            sql+=` ct.currency like '%${post.searchFilter}%'`;
            sql+=`)`;
        }
        if(post.estimateId && post.estimateId !=="")
        {
            sql+=` and iv.estimateId ='${post.estimateId}'`;
        }
        if(post.contactId && post.contactId !=="")
        {
            sql+=` and iv.contactId ='${post.contactId}'`;
        }
        if(post.invoiceNo && post.invoiceNo !=="")
        {
            sql+=` and iv.estimateNo like '%${post.estimateNo}%'`;
        }
        if(post.orderNo && post.orderNo !=="")
        {
            sql+=` and iv.orderNo like '%${post.orderNo}%'`;
        }
        if(post.customerNotes  && post.customerNotes  !=="")
        {
            sql+=` and iv.customerNotes like '%${post.customerNotes}%'`;
        }
        if(post.termsAndConditions  && post.termsAndConditions  !=="")
        {
            sql+=` and iv.termsAndConditions like '%${post.termsAndConditions}%'`;
        }
        if(post.amount  && post.amount  !=="")
        {
            sql+=` and iv.amount = '${post.amount}'`;
        }
        if(post.itemId  && post.itemId  !=="")
        {
            sql+=` and it.itemId = '${post.itemId}'`;
        }
        if(post.quantity  && post.quantity  !=="")
        {
            sql+=` and it.quantity = '${post.quantity}'`;
        }
        if(post.rate  && post.rate  !=="")
        {
            sql+=` and it.rate = '${post.rate}'`;
        }
        if(post.searchFilterStatus && post.searchFilterStatus !=="")
        {
            sql+=` and iv.status = '${post.searchFilterStatus}'`;
        }
        
        var fromDate = post.searchFilterFromDate;
		var toDate = post.searchFilterToDate;
		
		var dateSql = Transaction.getFormattedDateSql("iv.estimateDate",fromDate,toDate);
		sql += dateSql;
        
        sqlCount += sql+";";
        sql +=` order by iv.estimateDate desc, iv.createDate desc`;
        if(post.pageNo && post.pageNo !=='') {
			const size = constants.resultsize;
			const start = (post.pageNo-1)*size;
			sql += ` LIMIT ${start},${size}`;
		}
        
		sql +=`;`;
        sqlAll += sql;
        
        console.log("sql:-"+sql);
        
        globaldb.selectData(sqlAll, function(err, result) {
		globaldb.selectData(sqlCount, function(errCount, resultCount) {
			if (result && result.length > 0) {
                
                 result.forEach(function(cust) {
                    eval('items'+cust.estimateId+'= []');
                    if (countInvoices[cust.estimateId]) {
						let tmp1 = countInvoices[cust.estimateId];
						countInvoices[cust.estimateId] = ++tmp1;
					} else {
						countInvoices[cust.estimateId] = 1;
					}
                 });
                 
                result.forEach(function(cust) {
                //console.log("Invoice Id"+cust.invoiceId);
               	if (tmpMasterArray[cust.estimateId]) {
                    const cnt = eval('countInvoices'+cust.estimateId);
                    const newCnt = cnt+1;
                    eval('countInvoices'+cust.estimateId+' = '+newCnt);
                }
                else
                {
                    tmpMasterArray[cust.estimateId]	=	cust.estimateId;
					eval('countInvoices'+cust.estimateId+' = 1');
                }
                
                const itemObj	= {
						'estimateItemId': cust.estimateItemId,
                        'itemId':cust.itemId,
                        'itemName':cust.name,
                        'itemDescription':cust.description,
						'quantity': cust.quantity,
						'rate': cust.rate,
						'tax': cust.tax
					};
                
                if (tmpItemsArray[cust.estimateItemId]) {
                    //nothing inside
                } else {
                    tmpItemsArray[cust.estimateItemId]	=	cust.estimateItemId;
                    eval('items'+cust.estimateId).push(itemObj);
                }
                 
                const tmpInvoices = {
						'estimateId': cust.estimateId,
						'contactId': cust.contactId,
                        'estimateNo':cust.estimateNo,
                        'orderNo':cust.orderNo,
                        'isIGST':cust.isIGST,
                        'invoiceCompanyName':cust.invoiceCompanyName,
                        'companyAddress':cust.companyAddress,
                        'companyPlaceOfSupply':cust.companyPlaceOfSupply,
                        'companyGSTNo':cust.companyGSTNo,
                        'estimateDate':cust.estimateDate,
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
                        'isTaxExclusive':cust.isTaxExclusive,
						'invoiceitems': eval('items'+cust.estimateId)
					};
                const evalCount = eval('countInvoices'+cust.estimateId);
                //console.log("count"+countInvoices[cust.invoiceId]);
                if (evalCount == countInvoices[cust.estimateId]) {
                    invoices.push(tmpInvoices);
                }  
               });
                 var resultObj = {
						"count":resultCount[0].rowCount,
						"result":invoices
					};
				callback(err, resultObj);
			} else {
                callback(err, result);
			}
		}); 
		}); 
	},
    
	
    getEstimateItems: function(estimateId, callback) {
        let sql = `select * from estimateitems`;
        sql+=` where 1=1`;
        sql+=` and estimateId ='${estimateId}'`;
		sql +=`;`;
        console.log("sql:-"+sql);
		globaldb.selectData(sql, function(err, result) {
			if (result && result.length > 0) {
				callback(err, result);
			} else {
                callback(err, result);
			}
		}); 
    },
    
     insertEstimate: function(post, callback) {
        globaldb.insertData('estimates', post, function(err, result) {
            var sql = `update settings set estimateNo = estimateNo+1`;
             globaldb.selectData(sql, function(errUpd, resultUpd) {
                 callback(err, result);
             });
		});
	},
    
/*
 * INSERT invoiceitems MODEL Function.
 * Parameters: table invoiceitems fields.
 * Return: inserted row id on success and else return false.
 */
    insertEstimateItem: function(itemsArray, callback) {
        let sql = "INSERT INTO estimateitems (estimateId,itemName,quantity,rate,tax,createDate) VALUES ?";
        globaldb.insertBulk('estimateitems', itemsArray, sql, function(insertErr, insertResult) {
          callback(1, insertResult);
         });
    },
    
       
/*
 * Edit invoice MODEL Function.
 * Parameters: table invoices fields.
 * Return: edit row id on success and else return false.
 */
    editEstimate: function(post, where, callback) {
        globaldb.updateData('estimates', post, where, function(err, result) {
           callback(err, result);
		});
	},
    
     listGsttreatment: function(callback) {
        let sql = `select * from gsttreatment`;
        sql+=` where 1=1`;
		sql +=`;`;
        console.log("sql:-"+sql);
		globaldb.selectData(sql, function(err, result) {
			if (result && result.length > 0) {
				callback(err, result);
			} else {
                callback(err, result);
			}
		}); 
    },
    
     listAccountTypes: function(callback) {
        let sql = `select * from accounttype`;
        sql+=` where 1=1`;
		sql +=`;`;
        console.log("sql:-"+sql);
		globaldb.selectData(sql, function(err, result) {
			if (result && result.length > 0) {
				callback(err, result);
			} else {
                callback(err, result);
			}
		}); 
    },
    
     listAccount:function(searchFilterArr,orderByParam, sort, pageNo, accountTypeSubId, accountTypeId, callback)
    {
        let sqlAll = `select *,ea.createDate as accountCreateDate `;
		let sqlCount = ` select count(*) as rowCount`;
        let sql=` from accounttypesub ea`;
        sql+=` inner join accounttype eat on eat.accountTypeId = ea.accountTypeId`;
        sql+=` where 1=1`;
        
        if(accountTypeSubId && accountTypeSubId !="")
        {
            sql+=` and ea.accountTypeSubId = ${accountTypeSubId}`;
        }
        
        if(accountTypeId && accountTypeId !="")
        {
            sql+=` and ea.accountTypeId = ${accountTypeId}`;
        }
        
        
        if(searchFilterArr && searchFilterArr !=="")
        {
             if(searchFilterArr.searchFilters &&
               searchFilterArr.searchFilters!=="undefined" &&
               searchFilterArr.searchFilters !==null)
            {
                sql+=` and (`;
                sql+=` ea.accountTypeSubName like '%${searchFilterArr.searchFilters}%' OR`;
                sql+=` eat.accountTypeName like '%${searchFilterArr.searchFilters}%' OR`;
                sql+=` eat.accountTypeMain like '%${searchFilterArr.searchFilters}%'`;
                sql+=`)`;
            }
            
            if(searchFilterArr.searchAccountTypeId &&
               searchFilterArr.searchAccountTypeId!=="undefined" &&
               searchFilterArr.searchAccountTypeId !==null)
            {
                sql+=` and ea.accountTypeId = ${searchFilterArr.searchAccountTypeId}`;
            }
        }
        
        var fromDate = searchFilterArr.searchFilterFromDate;
		var toDate = searchFilterArr.searchFilterToDate;
		
		var dateSql = Transaction.getFormattedDateSql("ea.createDate",fromDate,toDate);
		sql += dateSql;
        
        if(orderByParam && orderByParam !==''){
			sql +=` order by ea.${orderByParam} ${sort}`;
		}
        sqlCount += sql+";";
        
        if(pageNo && pageNo !=='') {
			const size = constants.resultsize;
			const start = (pageNo-1)*size;
			sql += ` LIMIT ${start},${size}`;
		}
        
        sql +=`;`;
		sqlAll += sql;
        
        console.log("Search sql: "+sqlAll);
        
        globaldb.selectData(sqlAll, function(err, resultList) {
			globaldb.selectData(sqlCount, function(errCount, resultCount) {
				if (resultList && resultList.length > 0) {
                    //console.log("Count"+resultCount[0].rowCount);
					var resultObj = {
						"count":resultCount[0].rowCount,
						"result":resultList
					};
					callback(err, resultObj);
				} else {
					callback(err, resultList);
				}
			});
		}); 
    },
    
     addAccount: function(insertParams, callback) {
		  globaldb.insertData('accounttypesub', insertParams, function(err, result) {
            callback(err, result);
		});
	},
    
   editAccount: function(post, where, callback) {
        globaldb.updateData('accounttypesub', post, where, function(err, result) {
           callback(err, result);
		});
	},
    
    contactDetails: function(contactId,callback)
    {
        let sql = ` select *, gt.name as gsttreatment_name from contacts c,gsttreatment gt where contactId=${contactId} and c.gstTreatmentId = gt.gstTreatmentId`;
        globaldb.selectData(sql, function(err, result) {
			if (result && result.length > 0) {
                console.log("SQL:"+sql);
                
                let userType = result[0].userType;
                let type=constants.invoicetype_invoice;
                let paymentType=constants.paymenttype_received;
                
                var post = {
                    contactId:contactId,
                    type:type
                };
                
                var postPayment = {
                    contactId:contactId,
                    type:paymentType
                };
                
                Transaction.getInvoices(post, function(errInvoice, resultInvoice) {
                    Transaction.getEstimates(post, function(errEstimate, resultEstimate) {
                        Transaction.getPaymentReceived(postPayment, function(errPayment, resultPayment) {
                            var finalArray = {
                                        'customer':result[0],
                                        'invoices':resultInvoice.list,
                                        'estimates':resultEstimate.list,
                                        'payments':resultPayment.result,
                                    };
                            callback(err, finalArray);
                        });
                    });
                });
            
			} else {
                callback(err, null);
			}
		}); 
        
    },
    
    addPayment: function(post, callback) {
        let invoiceId = post.invoiceId;
        globaldb.insertData('payments', post, function(err, result) {
            var sqlpayment = `update invoices set status = '${constants.invoicestatus_cleared}' where invoiceId = ${invoiceId}`;
            sqlpayment+=`;`;
            sqlpayment += `update settings set paymentNo = paymentNo+1`;
            globaldb.selectData(sqlpayment, function(errPayment, resultPayment) {
                callback(err, result);
            });
		});
	},
    
    addPaymentImages: function(imageArray,callback){
        let sql = "INSERT INTO paymentimages (paymentId, path,createDate) VALUES ?";
		globaldb.insertBulk('paymentimages', imageArray, sql, function(insertErr, insertResult) {
			callback(1, insertResult);
        });
	},
    
    deleteItem: function(itemId,callback){
         var where = {'itemId':itemId};
        globaldb.deleteData('items', where, function(err, result) {
            callback(1, result);
        });
	},
    
     getPaymentReceived: function(post, callback) {
        let sqlAll = `select *,p.status as paymentStatus, inv.companyName as invoiceCompanyName`;
        let sqlCount = ` select count(*) as rowCount, sum(case when amountReceived >=0 then (amountReceived+taxAmount) else 0 end) as totalAmount`;
        let sql = ` from payments p`;
        sql+=` INNER JOIN invoices inv on inv.invoiceId = p.invoiceId`;
        sql+=` INNER JOIN contacts c on c.contactId = inv.contactId`;
        sql+=` where 1=1`;
        if(post.searchFilter && post.searchFilter !=="")
        {
            sql+=` and (`;
            sql+=` p.paymentNo = '${post.searchFilter}' OR`;
            sql+=` c.displayName like '%${post.searchFilter}%' OR`;
            sql+=` inv.invoiceNo = '${post.searchFilter}'`;
            sql+=`)`;
        }
        if(post.searchFilterStatus && post.searchFilterStatus !=="")
        {
            sql+=` and p.status ='${post.searchFilterStatus}'`;
        }
        
        if(post.type && post.type !=="")
        {
            sql+=` and p.type = '${post.type}'`;
        }
        
        if(post.status && post.status !=="")
        {
            sql+=` and p.status = '${post.status}'`;
        }
        
        if(post.paymentId && post.paymentId !=="")
        {
            sql+=` and p.paymentId = ${post.paymentId}`;
        }
        
        if(post.contactId && post.contactId !=="")
        {
            sql+=` and c.contactId = ${post.contactId}`;
        }
        
        if(post.invoiceId && post.invoiceId !=="")
        {
            sql+=` and inv.invoiceId = ${post.invoiceId}`;
        }
        
        var fromDate = post.searchFilterFromDate;
		var toDate = post.searchFilterToDate;
		
		var dateSql = Transaction.getFormattedDateSql("p.paymentDate",fromDate,toDate);
		sql += dateSql;
        
        sqlCount += sql+";";
        sql +=` order by p.createDate desc`;
        if(post.pageNo && post.pageNo !=='') {
			const size = constants.resultsize;
			const start = (post.pageNo-1)*size;
			sql += ` LIMIT ${start},${size}`;
		}
		sql +=`;`;
		sqlAll += sql;
        console.log("sql:-"+sql);
		globaldb.selectData(sqlAll, function(err, resultList) {
			globaldb.selectData(sqlCount, function(errCount, resultCount) {
				if (resultList && resultList.length > 0) {
                    var resultObj = {
						"count":resultCount[0].rowCount,
						"totalAmount":resultCount[0].totalAmount,
						"result":resultList
					};
					callback(err, resultObj);
				} else {
					callback(err, resultList);
				}
			});
		});
	},
    
    updatePayment: function(post, where, callback) {
        globaldb.updateData('payments', post, where, function(err, result) {
           callback(err, result);
		});
	},
    
    updateProfileImage: function(updParams,userId,callback) {
		var whereArr = {
			'userId':userId
		};
        
        console.log("Where "+JSON.stringify(updParams));
		
		globaldb.updateData('users', updParams, whereArr, function(err, result) {
			if(result && result.affectedRows > 0){
				callback(1, "Image Updated successfully");	
			}else{
				callback(0, constants.error_msg);	
			}
		});
	},
    
    changePassword:function(userId,oldPassword,newPassword,callback)
    {
        const sql = `SELECT * FROM users WHERE userId = '${userId}'`;

		globaldb.selectData(sql, function(err, result) {
			if (result && result.length > 0) {
				const decryptedPassword = cryptoLib.decrypt(result[0].password, result[0].salt);
                //console.log("Decrypted password"+decryptedPassword);
				if (decryptedPassword == oldPassword) {
					const currentDay = dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss');
                    const randomstring = require('randomstring');
                    const salt = randomstring.generate(32);
                    const encryptedPassword = cryptoLib.encrypt(newPassword, salt);
                    const setArray = {
                        password: encryptedPassword,
                        salt: salt,
                        updateDate: currentDay,
                    };
                    const whereArray = {
                        userId: userId,
                    };
                    globaldb.updateData('users', setArray, whereArray,  function(errUser, resultUser) {
                       callback(errUser, 1);
                        return; 
                    });
				} else {
					callback(err, 0);
					return;
				}
			} else {
				callback(err, 0);
                return;
			}
		});
    },
    
    checkNo:function(tableName,no,type,callback)
    {
        no = no.trim();
        let sql = "";
        if(tableName === "invoices")
        {
            sql += `select * from ${tableName} where invoiceNo = '${no}' and type='${type}'`;
        }
        else if(tableName === "estimates")
        {
            sql += `select * from ${tableName} where estimateNo = '${no}'`;
        }
        console.log("SQL"+sql);
		return globaldb.selectData(sql, callback);
    },
    
    gstPayable: function(fromDate,toDate,callback){
        let sql = ` select *`;
        sql+= ` from invoices inv`;
        sql+=` where type = '${constants.invoicetype_invoice}' and inv.totalTax >=0`;
        sql+= ` and (`;
        sql+=` inv.status = '${constants.invoicestatus_due_on_date}' OR`;
        sql+=` inv.status = '${constants.invoicestatus_cleared}'`;
        sql+=`)`;
		var dateSql = Transaction.getFormattedDateSql("inv.invoiceDate",fromDate,toDate);
		sql += dateSql;
        sql +=` order by inv.createDate desc`;
		sql +=`;`;
        console.log("GST PAYABLE sql:-"+sql);
			globaldb.selectData(sql, function(errList, resultList) {
				if (resultList && resultList.length > 0) {
					callback(errList, resultList);
				} else {
					callback(errList, resultList);
				}
		});
    },
    
    tdsReceivable: function(fromDate,toDate,callback){
       let sql = ` select *`;
        sql+= ` from payments p, invoices inv`;
        sql+=` where p.invoiceId = inv.invoiceId and p.type = '${constants.paymenttype_received}' and p.taxAmount >=0`;
        sql+= ` and (`;
        sql+=` p.status = '${constants.paymenttype_status_success}'`;
        sql+=`)`;
		var dateSql = Transaction.getFormattedDateSql("p.paymentDate",fromDate,toDate);
		sql += dateSql;
        sql +=` order by p.createDate desc`;
		sql +=`;`;
        console.log("TDS RECEIVABLE sql:-"+sql);
			globaldb.selectData(sql, function(errList, resultList) {
				if (resultList && resultList.length > 0) {
					callback(errList, resultList);
				} else {
					callback(errList, resultList);
				}
		});
    },
    
    getMonthWisePayments: function(fromDate,toDate,callback)
    {
        let sqlR = `select YEAR(paymentDate) as y, MONTH(paymentDate) as m,`;
		sqlR += ` sum(case when type='${constants.paymenttype_received}'  then (amountReceived+taxAmount) else 0 end) as amtReceived`;
		sqlR+=` from payments `;  
		sqlR+=` where status = '${constants.paymenttype_status_success}'`;       
		sqlR+=` and (paymentDate between '${fromDate}' and '${toDate}')`;       
		sqlR+=` group by y,m`;
		sqlR+=`;`;

        console.log("sql:-"+sqlR);
        
		globaldb.selectData(sqlR, function(err, result) {
			if (result && result.length > 0) {
				callback(1, result);
			} else {
                callback(0, []);
			}
		}); 
    },
    
    getMonthWiseInvoices: function(fromDate,toDate,callback)
    {
        let sql = `select YEAR(invoiceDate) as y, MONTH(invoiceDate) as m,`;
		sql += ` sum(case when totalAmount >= 0 then totalAmount else 0 end) as totalAmount`;
		sql+=` from invoices `;  
		sql+=` where (status = '${constants.invoicestatus_due_on_date}' OR status = '${constants.invoicestatus_cleared}')`;       
		sql+=` and type='${constants.invoicetype_invoice}'`;       
		sql+=` and (invoiceDate between '${fromDate}' and '${toDate}')`;       
		sql+=` group by y,m`;
		sql+=`;`;

        console.log("sql:-"+sql);
        
		globaldb.selectData(sql, function(err, result) {
			if (result && result.length > 0) {
				callback(1, result);
			} else {
                callback(0, []);
			}
		}); 
    },
    
    deleteCustomer(contactId,type,callback)
    {
        // estimates -> contactId
        // estimateitems -> estimateId
        // invoices -> contactId
        // invoiceitems -> invoiceId
        // payments -> invoiceId
        // paymentimages -> paymentId
        
        var fs = require('fs');
        let sql = `SELECT *,pi.path as paymentImagePath`;
        sql+=` from contacts c`; 
        sql+= ` left join invoices inv on inv.contactId = c.contactId`;
        sql+= ` left join estimates est on est.contactId = c.contactId`;
        sql+=` left join payments p on p.invoiceId = inv.invoiceId`;
        sql+=` left join paymentimages pi on pi.paymentId = p.paymentId`;
        sql+=` where c.contactId = '${contactId}'`;
        
        globaldb.selectData(sql, function(err, result) {
            if (result && result.length > 0) {
                var invoiceArray = [];
                var estimateArray = [];
                var paymentArray = [];
                result.forEach(function(cust) {

                    invoiceArray.push(cust.invoiceId);
                    estimateArray.push(cust.estimateId);
                    paymentArray.push(cust.paymentId);

                    var paymentPath = constants.del_path + cust.paymentImagePath;
                    fs.unlink(paymentPath, function(unlinkTOErr, unlinkTORes){});
                    
                });
                
                let delSql  =   `delete from paymentimages where paymentId IN (${paymentArray});`;
                delSql  +=   `delete from estimateitems where estimateId IN (${estimateArray});`;
                delSql  +=   `delete from invoiceitems where invoiceId IN (${invoiceArray});`;
                delSql  +=   `delete from payments where invoiceId IN (${invoiceArray});`;
                delSql  +=   `delete from paymentimages where paymentId IN (${paymentArray});`;
                delSql  +=   `delete from estimates where contactId = ${contactId};`;
                delSql  +=   `delete from invoices where contactId = ${contactId};`;

                globaldb.updateDataSql(delSql, function(delErr, delRes) {
                callback(1, "Data deleted successfully");
                });
            }
            else
            {
                callback(err,0);
            }
        });
    }
};

module.exports=Transaction;
