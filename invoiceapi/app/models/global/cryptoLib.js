const crypto = require('crypto');
const constants = require('../../../config/constants');
const globaldb = require('../global/databaseLib');
const IV_LENGTH = 16;

module.exports = {
	createAccessToken: function() {
		const randomNumber = Math.floor((Math.random() * 99999) + 10000);
		const accesstoken = 'CUST' + randomNumber;
		const sql = `SELECT count(*) cnt FROM user WHERE accessToken = '${accesstoken}'`;
		globaldb.selectData(sql, function(err, result) {
			let cnt = result[0].cnt;
			while (cnt) {
				const randomNumber = Math.floor((Math.random() * 99999) + 10000);
				const accesstoken = 'CUST' + randomNumber;
				const sql1 = `SELECT count(*) cnt FROM user WHERE accessToken = '${accesstoken}'`;
				globaldb.selectData(sql1, function(err1, result1) {
					cnt	=	result1[0].cnt;
				});
			}
		});
		return accesstoken;
	},

	// algorithm = 'aes-256-ctr',
	// password = constants.salt_password;
	encrypt: function(text, key) {
		// console.log(key);
		const iv = crypto.randomBytes(IV_LENGTH);
		const cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(key), iv);
		let encrypted = cipher.update(text);
		encrypted = Buffer.concat([encrypted, cipher.final()]);
		return iv.toString('hex') + ':' + encrypted.toString('hex');
	},

	decrypt: function(text, key) {
		const textParts = text.split(':');
		const iv = new Buffer(textParts.shift(), 'hex');
		const encryptedText = new Buffer(textParts.join(':'), 'hex');
		const decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(key), iv);
		let decrypted = decipher.update(encryptedText);
		decrypted = Buffer.concat([decrypted, decipher.final()]);
		return decrypted.toString();
	},

	getEncryptedCookie: function(id) {
		const salt = constants.userId_projectId_cookie_salt;
		const idNew	= String(id);
		const res = this.encrypt(idNew, salt);
		return res;
	},

	getDecryptedCookie: function(encryptId) {
		const salt = constants.userId_projectId_cookie_salt;
		const res = this.decrypt(encryptId, salt);
		return res;
	},
    
   getFormattedDate: function(dateStr,flag) {
		
		let fromDate = new Date(dateStr);
        
        var lastDay = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
        lastDay = lastDay.getDate();
        
        let from_date = fromDate.getDate();
        if(from_date === lastDay)
        {
            from_date   =   1;
        }
        else
        {
            from_date = fromDate.getDate()+1;
        }
		if(from_date < 10)
		{
		   from_date = "0"+from_date;
		}
        let from_month = fromDate.getMonth()+1;
        
        console.log("Month: "+fromDate.getMonth());
		if(from_month === 12)
        {
            from_month  =   1;
        }
        else
        {
            if(lastDay === fromDate.getDate())
            {
                from_month = from_month + 1;
            }
        }
		if(from_month < 10)
		{
			from_month = "0"+from_month;
		}
		
		let formattedDate = "";
		if(flag){
			formattedDate = fromDate.getFullYear() + "-" + from_month + "-" + from_date +" 00:00:00";	
		}else {
			formattedDate = fromDate.getFullYear() + "-" + from_month + "-" + from_date +" 23:59:59";
		}
		
		
		return formattedDate;
	},

};
