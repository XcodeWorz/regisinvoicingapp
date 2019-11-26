const db = require('../../../config/database');
const constants = require('../../../config/constants');

module.exports = {
	insertData: function(tableName, values, callback) {
		const sql = `INSERT INTO ${tableName} set ?`;
		db.query(sql, values, (err, result) => {
			console.log("last insert id="+JSON.stringify(err));
			callback(err, result.insertId);
		});
	},
    
    insertBulk: function(tableName, values, insertStatement, callback) {
		
		db.query(insertStatement, [values], (err, result) => {
			if(constants.show_log) {
				console.log("last insert id="+result.insertId);
			}
			callback(err, result.insertId);
		});
	},

	updateData: function(tableName, setArray, whereArray, callback) {
		const sql = `UPDATE ${tableName} SET ? WHERE ?`;
		db.query(sql, [setArray, whereArray], (err, result) => {
            console.log("RESULT"+err);
            callback(err, result);
		});
	},
    
    updateDataSql: function(sql, callback) {
		console.log("TEST SQL: "+sql);
		db.query(sql, (err, result) => {
			if(constants.show_log) {
				console.log("Update Res = " +JSON.stringify(result));
			}
			callback(err, result);
		});
	},

	selectData: function(selectString, callback) {
		const sql = selectString;
		db.query(sql, (err, result) => {
			callback(err, result);
		});
	},

	deleteData: function(tableName, whereArray, callback) {
		const sql = `DELETE FROM ${tableName} WHERE ?`;
		db.query(sql, whereArray, (err, result) => {
			callback(err, result);
		});
	},

	truncateTables: function(callback) {
		let sql = 'SET FOREIGN_KEY_CHECKS=0;';
		this.selectData(sql, callback);
		sql = 'TRUNCATE `user`';
		this.selectData(sql, callback);
		sql = 'TRUNCATE `action`';
		this.selectData(sql, callback);
		sql = 'TRUNCATE `config`';
		this.selectData(sql, callback);
		sql = 'TRUNCATE `elements`';
		this.selectData(sql, callback);
		sql = 'TRUNCATE `executionmapping`';
		this.selectData(sql, callback);
		sql = 'TRUNCATE `executionmaster`';
		this.selectData(sql, callback);
		sql = 'TRUNCATE `notifications`';
		this.selectData(sql, callback);
		sql = 'TRUNCATE `project`';
		this.selectData(sql, callback);
		sql = 'TRUNCATE `projectuser`';
		this.selectData(sql, callback);
		sql = 'TRUNCATE `scenario`';
		this.selectData(sql, callback);
		sql = 'TRUNCATE `scenarioactions`';
		this.selectData(sql, callback);
		sql = 'TRUNCATE `steps`';
		this.selectData(sql, callback);
		sql = 'TRUNCATE `subscriptions`';
		this.selectData(sql, callback);
		sql = 'TRUNCATE `userlogin`';
		this.selectData(sql, callback);
		sql = 'SET FOREIGN_KEY_CHECKS=1;';
		this.selectData(sql, callback);
	},

	updateTable: function(tableName, setArray, whereArray, callback) {
		this.updateData(tableName, setArray, whereArray, callback);
	},

	deleteTable: function(tableName, whereArray, callback) {
		this.deleteData(tableName, whereArray, callback);
	},
};
