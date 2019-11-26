const mysql=require('mysql');
const connection=mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'qwerty@123',
	database: 'githubinvoice',
	multipleStatements: true,
	port: '3306',
});
module.exports=connection;
