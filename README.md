# Regis Invoice App

This repo contains the source code, MySQL file, and documentation
Getting started
Prerequisites
(1) Node: any 8.x version starting with 8.4.0 or greater: check online for installing node js in your specific OS
(2) pm2:  Run this command to install, sudo npm install pm2 -g
(2) Mysql server

# Installation

## MySQL:
Clone Regis Invoicing App repository to your local system

(1) create a database in your localhost
login to MySQL server using mysql -u root -p
create database githubinvoice;
	exit;
(2) Change your directory cloned folder and run this command,
      	mysql -u root -p githubinvoice < githubinvoice.sql


## Regis Invoice API:

(1) Now go to the cloned folder/invoiceapi
(2) vi config/database.js and change the user and password as per your mysql credentials and save the file
(3) Run the following command to install all the dependencies
sudo npm install
(4) To run the invoiceapi server, by running this command
pm2 start app.js

(5) To change the default port no from 3000 to 3001, change app.js file inside invoiceapi folder and run command pm2 restart app.js

const port = 3001;

open http://localhost:3001 in your browser


## Regis Invoice App

(1) Go to the cloned folder/invoiceapp
(2) Run the following command  to install all the dependencies
	sudo npm install
(3) To Run the invoiceapp server, use the following command
npm start

Now open http://localhost:3000

# Features

Regis app is an Invoicing application developed in ReactJS by Rapidmind Technologies. It is a simplified invoicing app that covers creating and sending invoices and also recording the payments.

Dashboard

Items

Customers

Estimates

Invoices

Payment Received

Reports

For More details [Click Here](https://www.therapidmind.com/case_study/regis-invoicing-app/)