const express = require('express');
const app = express();
const multer = require('multer');
const constants = require('constants');
const constant = require('./config/constants');
const port = 3001;
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const dateFormat = require('dateformat');
const now = new Date();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); 

/* **************Mysql configuration********************/
const mysql = require('mysql');
const configDB = require('./config/database.js');
const mc = mysql.createConnection(configDB);
// configuration ===============================================================

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// required for passport
app.use(session({
	secret: 'github-invoice@123',
	resave: true,
	saveUninitialized: true,
	cookie: {
		// domain: 'localhost',
		sameSite: false,
		path: '/',
		httpOnly: true,
		secure: false,
		maxAge: null,
	},
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./config/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('server started ' + port);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	res.status(404).render('404', {title: 'Sorry, page not found', session: req.sessionbo});
});

app.use(function(req, res, next) {
	res.status(500).render('404', {title: 'Sorry, page not found'});
});

exports = module.exports = app;