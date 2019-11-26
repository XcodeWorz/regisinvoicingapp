-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 26, 2019 at 05:28 PM
-- Server version: 5.7.27-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `githubinvoice`
--

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `contactId` int(11) NOT NULL,
  `salutation` varchar(50) DEFAULT NULL,
  `firstName` varchar(200) DEFAULT NULL,
  `lastName` varchar(200) DEFAULT NULL,
  `companyName` varchar(500) NOT NULL,
  `displayName` varchar(200) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phoneNo` varchar(100) DEFAULT NULL,
  `website` varchar(400) DEFAULT NULL,
  `address` longtext,
  `gstNo` varchar(200) NOT NULL,
  `placeOfSupply` varchar(200) NOT NULL,
  `isTaxable` char(1) NOT NULL DEFAULT 'N',
  `currency` varchar(100) DEFAULT NULL,
  `userType` varchar(45) DEFAULT 'CUSTOMER',
  `status` varchar(100) NOT NULL DEFAULT 'ACTIVE',
  `createDate` datetime NOT NULL,
  `updateDate` datetime DEFAULT NULL,
  `gstTreatmentId` int(11) DEFAULT NULL,
  `pan` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `zipCode` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `customerType` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`contactId`, `salutation`, `firstName`, `lastName`, `companyName`, `displayName`, `email`, `phoneNo`, `website`, `address`, `gstNo`, `placeOfSupply`, `isTaxable`, `currency`, `userType`, `status`, `createDate`, `updateDate`, `gstTreatmentId`, `pan`, `city`, `state`, `zipCode`, `country`, `customerType`) VALUES
(1, 'Mr.', 'Zorg', 'Corporation', 'Zorg Corporation', 'Zorg Corp', 'admin@zorgcorp.com', '', 'zorgcorp.com', '38 West 11st Street, 2th Floor,\nNew York, NY 10011 ', 'CBA2928GHT12', 'West Bengal', 'Y', 'INR', 'CUSTOMER', 'ACTIVE', '2019-11-26 17:25:47', '2019-11-26 17:25:47', 1, '', '', '', '', '', 'Business');

-- --------------------------------------------------------

--
-- Stand-in structure for view `customerinvoicetotal`
-- (See below for the actual view)
--
CREATE TABLE `customerinvoicetotal` (
`contactId` int(11)
,`totalSentInvoiceAmount15Days` double(19,2)
,`totalSentTaxAmount15Days` double(19,2)
,`totalSentInvoiceAmount30Days` double(19,2)
,`totalSentTaxAmount30Days` double(19,2)
,`totalSentInvoiceAmount` double(19,2)
,`totalSentTaxAmount` double(19,2)
,`totalPaidInvoiceAmount15Days` double(19,2)
,`totalPaidTaxAmount15Days` double(19,2)
,`totalPaidInvoiceAmount30Days` double(19,2)
,`totalPaidTaxAmount30Days` double(19,2)
,`totalPaidInvoiceAmount` double(19,2)
,`totalPaidTaxAmount` double(19,2)
,`totalVoidInvoiceAmount15Days` double(19,2)
,`totalVoidTaxAmount15Days` double(19,2)
,`totalVoidInvoiceAmount30Days` double(19,2)
,`totalVoidTaxAmount30Days` double(19,2)
,`totalVoidInvoiceAmount` double(19,2)
,`totalVoidTaxAmount` double(19,2)
);

-- --------------------------------------------------------

--
-- Table structure for table `estimateitems`
--

CREATE TABLE `estimateitems` (
  `estimateItemId` int(11) NOT NULL,
  `estimateId` int(11) NOT NULL,
  `itemName` varchar(100) NOT NULL,
  `quantity` int(11) NOT NULL,
  `rate` float NOT NULL,
  `tax` float NOT NULL,
  `createDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `estimateitems`
--

INSERT INTO `estimateitems` (`estimateItemId`, `estimateId`, `itemName`, `quantity`, `rate`, `tax`, `createDate`) VALUES
(1, 1, 'Website Development', 1, 80000, 18, '2019-11-26 17:26:48');

-- --------------------------------------------------------

--
-- Table structure for table `estimates`
--

CREATE TABLE `estimates` (
  `estimateId` int(11) NOT NULL,
  `contactId` int(11) NOT NULL,
  `estimateNo` varchar(200) NOT NULL,
  `orderNo` varchar(200) DEFAULT NULL,
  `estimateDate` date NOT NULL,
  `dueDate` date DEFAULT NULL,
  `customerNotes` longtext NOT NULL,
  `termsAndConditions` longtext NOT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'DRAFT',
  `isIGST` char(1) NOT NULL DEFAULT 'N',
  `reasonToEdit` longtext,
  `companyName` varchar(400) NOT NULL,
  `companyAddress` longtext NOT NULL,
  `companyPlaceOfSupply` varchar(400) NOT NULL,
  `companyGSTNo` varchar(200) NOT NULL,
  `isTaxExclusive` char(1) DEFAULT 'Y',
  `subTotal` float(10,2) DEFAULT NULL,
  `totalTax` float(10,2) DEFAULT NULL,
  `totalAmount` float(10,2) DEFAULT NULL,
  `contactCompanyName` varchar(100) DEFAULT NULL,
  `contactAddress` longtext,
  `contactGSTIN` varchar(45) DEFAULT NULL,
  `contactPlaceOfSupply` varchar(45) DEFAULT NULL,
  `createDate` datetime DEFAULT NULL,
  `updateDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `estimates`
--

INSERT INTO `estimates` (`estimateId`, `contactId`, `estimateNo`, `orderNo`, `estimateDate`, `dueDate`, `customerNotes`, `termsAndConditions`, `status`, `isIGST`, `reasonToEdit`, `companyName`, `companyAddress`, `companyPlaceOfSupply`, `companyGSTNo`, `isTaxExclusive`, `subTotal`, `totalTax`, `totalAmount`, `contactCompanyName`, `contactAddress`, `contactGSTIN`, `contactPlaceOfSupply`, `createDate`, `updateDate`) VALUES
(1, 1, 'EST1', '', '2019-11-26', NULL, 'IFSC CODE: 872324134123\nSWIFT:83148\nACC: 98423', 'Settings Terms and Conditions', 'SENT', 'Y', NULL, 'Regis Corporation Pvt Ltd', 'No 152, 12th Main, \nBangalore Karnataka 560078', 'Karnataka', 'AAA2933ZTN1S', 'Y', 80000.00, 14400.00, 94400.00, 'Zorg Corporation', '38 West 11st Street, 2th Floor,\nNew York, NY 10011 ', 'CBA2928GHT12', 'West Bengal', '2019-11-26 17:26:48', '2019-11-26 17:26:48');

-- --------------------------------------------------------

--
-- Table structure for table `gsttreatment`
--

CREATE TABLE `gsttreatment` (
  `gstTreatmentId` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `gsttreatment`
--

INSERT INTO `gsttreatment` (`gstTreatmentId`, `name`) VALUES
(1, 'Registered Business-Regular'),
(2, 'Registered Business-Composition'),
(3, 'Consumer'),
(4, 'Unregistered Business'),
(5, 'Overseas');

-- --------------------------------------------------------

--
-- Table structure for table `invoiceitems`
--

CREATE TABLE `invoiceitems` (
  `invoiceItemId` int(11) NOT NULL,
  `invoiceId` int(11) NOT NULL,
  `itemName` varchar(45) NOT NULL,
  `quantity` int(11) NOT NULL,
  `rate` float NOT NULL,
  `tax` float NOT NULL,
  `itcEligible` char(1) DEFAULT NULL,
  `createDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `invoiceitems`
--

INSERT INTO `invoiceitems` (`invoiceItemId`, `invoiceId`, `itemName`, `quantity`, `rate`, `tax`, `itcEligible`, `createDate`) VALUES
(1, 1, 'Website Development', 1, 80000, 18, '', '2019-11-26 17:27:05');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `invoiceId` int(11) NOT NULL,
  `contactId` int(11) NOT NULL,
  `invoiceNo` varchar(200) NOT NULL,
  `orderNo` varchar(200) DEFAULT NULL,
  `type` varchar(10) DEFAULT 'invoice',
  `invoiceDate` date NOT NULL,
  `dueDate` date DEFAULT NULL,
  `customerNotes` longtext,
  `termsAndConditions` longtext,
  `status` varchar(100) NOT NULL DEFAULT 'DUE ON RECEIPT',
  `isIGST` char(1) NOT NULL DEFAULT 'N',
  `reasonToEdit` longtext,
  `companyName` varchar(400) NOT NULL,
  `companyAddress` longtext NOT NULL,
  `companyPlaceOfSupply` varchar(400) NOT NULL,
  `companyGSTNo` varchar(200) NOT NULL,
  `isTaxExclusive` char(1) DEFAULT 'Y',
  `subTotal` float(10,2) DEFAULT NULL,
  `totalAmount` float(10,2) DEFAULT NULL,
  `totalTax` float(10,2) DEFAULT NULL,
  `updateDate` datetime DEFAULT NULL,
  `createDate` datetime DEFAULT NULL,
  `contactCompanyName` varchar(100) DEFAULT NULL,
  `contactAddress` longtext,
  `contactGSTIN` varchar(45) DEFAULT NULL,
  `contactPlaceOfSupply` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`invoiceId`, `contactId`, `invoiceNo`, `orderNo`, `type`, `invoiceDate`, `dueDate`, `customerNotes`, `termsAndConditions`, `status`, `isIGST`, `reasonToEdit`, `companyName`, `companyAddress`, `companyPlaceOfSupply`, `companyGSTNo`, `isTaxExclusive`, `subTotal`, `totalAmount`, `totalTax`, `updateDate`, `createDate`, `contactCompanyName`, `contactAddress`, `contactGSTIN`, `contactPlaceOfSupply`) VALUES
(1, 1, 'INV1', '', 'invoice', '2019-11-26', '2019-12-26', 'IFSC CODE: 872324134123\nSWIFT:83148\nACC: 98423', 'Settings Terms and Conditions', 'PAID', 'Y', NULL, 'Regis Corporation Pvt Ltd', 'No 152, 12th Main, \nBangalore Karnataka 560078', 'Karnataka', 'AAA2933ZTN1S', 'Y', 80000.00, 94400.00, 14400.00, '2019-11-26 17:27:05', '2019-11-26 17:27:05', 'Zorg Corporation', '38 West 11st Street, 2th Floor,\nNew York, NY 10011 ', 'CBA2928GHT12', 'West Bengal');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `itemId` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` longtext,
  `status` varchar(100) NOT NULL DEFAULT 'ACTIVE',
  `createDate` datetime NOT NULL,
  `type` varchar(45) DEFAULT NULL,
  `hsnCode` varchar(45) DEFAULT NULL,
  `sacCode` varchar(45) DEFAULT NULL,
  `price` float(10,2) DEFAULT NULL,
  `isSales` char(1) DEFAULT 'Y'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`itemId`, `name`, `description`, `status`, `createDate`, `type`, `hsnCode`, `sacCode`, `price`, `isSales`) VALUES
(1, 'Website Development', '', 'ACTIVE', '2019-11-26 17:26:31', 'Service', '', '', 80000.00, 'Y');

-- --------------------------------------------------------

--
-- Table structure for table `paymentimages`
--

CREATE TABLE `paymentimages` (
  `paymentImageId` int(11) NOT NULL,
  `paymentId` int(11) NOT NULL,
  `path` varchar(200) NOT NULL,
  `createDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `paymentId` int(11) NOT NULL,
  `invoiceId` int(11) NOT NULL,
  `paymentNo` varchar(100) NOT NULL,
  `amountReceived` float(10,2) NOT NULL,
  `bankCharges` float(10,2) DEFAULT NULL,
  `isTaxDeducted` char(1) NOT NULL DEFAULT 'N',
  `taxAmount` float(10,2) DEFAULT NULL,
  `paymentDate` datetime NOT NULL,
  `paymentMode` varchar(100) NOT NULL,
  `notes` longtext NOT NULL,
  `status` varchar(45) DEFAULT 'SUCCESS',
  `type` varchar(45) DEFAULT 'RECEIVED',
  `createdBy` int(11) NOT NULL,
  `createDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`paymentId`, `invoiceId`, `paymentNo`, `amountReceived`, `bankCharges`, `isTaxDeducted`, `taxAmount`, `paymentDate`, `paymentMode`, `notes`, `status`, `type`, `createdBy`, `createDate`) VALUES
(1, 1, '1', 94400.00, NULL, 'N', 0.00, '2019-11-26 00:00:00', 'Bank Remittance', '', 'SUCCESS', 'RECEIVED', 1, '2019-11-26 17:27:54');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `settingsId` int(11) NOT NULL,
  `companyName` varchar(300) NOT NULL,
  `companyAddress` longtext NOT NULL,
  `companyPlaceOfSupply` varchar(500) DEFAULT NULL,
  `gstNo` varchar(200) NOT NULL,
  `imagePath` longtext NOT NULL,
  `isRegisteredUnderGST` char(1) DEFAULT 'N',
  `createDate` datetime NOT NULL,
  `updateDate` datetime DEFAULT NULL,
  `invoiceCustomerNotes` longtext,
  `invoiceTermsAndConditions` longtext,
  `invoiceNo` int(11) DEFAULT '0',
  `invoicePrefix` varchar(45) DEFAULT NULL,
  `estimateNo` int(11) DEFAULT '0',
  `estimatePrefix` varchar(45) DEFAULT NULL,
  `paymentNo` int(11) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`settingsId`, `companyName`, `companyAddress`, `companyPlaceOfSupply`, `gstNo`, `imagePath`, `isRegisteredUnderGST`, `createDate`, `updateDate`, `invoiceCustomerNotes`, `invoiceTermsAndConditions`, `invoiceNo`, `invoicePrefix`, `estimateNo`, `estimatePrefix`, `paymentNo`) VALUES
(1, 'Regis Corporation Pvt Ltd', 'No 152, 12th Main, \nBangalore Karnataka 560078', 'Karnataka', 'AAA2933ZTN1S', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJoAAAAuCAYAAADQpAB0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTExLTE5VDE3OjA0OjEyKzA1OjMwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTExLTE5VDE3OjA1OjA2KzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0xMS0xOVQxNzowNTowNiswNTozMCIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3ZjZhZGE0Zi02MzE5LTJlNDMtYTRlNy05MDMzN2Q4ZWFlNGYiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplMTJjNjgwZi0xMWRlLTAxNDItOTgzOC03NzJlNTRhYjdmOTkiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphYjUxN2NjNS03YjBjLTFkNDEtYTkwMi1mY2IxMTZmNGYzNjYiIHRpZmY6T3JpZW50YXRpb249IjEiIHRpZmY6WFJlc29sdXRpb249IjcyMDAwMC8xMDAwMCIgdGlmZjpZUmVzb2x1dGlvbj0iNzIwMDAwLzEwMDAwIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkNvbG9yU3BhY2U9IjEiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIxNTQiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSI0NiI+IDxwaG90b3Nob3A6VGV4dExheWVycz4gPHJkZjpCYWc+IDxyZGY6bGkgcGhvdG9zaG9wOkxheWVyTmFtZT0iUkVHSVMiIHBob3Rvc2hvcDpMYXllclRleHQ9IlJFR0lTIi8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphYjUxN2NjNS03YjBjLTFkNDEtYTkwMi1mY2IxMTZmNGYzNjYiIHN0RXZ0OndoZW49IjIwMTktMTEtMTlUMTc6MDQ6MTIrMDU6MzAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NWJkNWM3ZDctZDU1Ni1kODQxLWExYTQtMWE0Y2NkOThjM2MyIiBzdEV2dDp3aGVuPSIyMDE5LTExLTE5VDE3OjA1OjA2KzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjdmNmFkYTRmLTYzMTktMmU0My1hNGU3LTkwMzM3ZDhlYWU0ZiIgc3RFdnQ6d2hlbj0iMjAxOS0xMS0xOVQxNzowNTowNiswNTozMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1YmQ1YzdkNy1kNTU2LWQ4NDEtYTFhNC0xYTRjY2Q5OGMzYzIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YWI1MTdjYzUtN2IwYy0xZDQxLWE5MDItZmNiMTE2ZjRmMzY2IiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YWI1MTdjYzUtN2IwYy0xZDQxLWE5MDItZmNiMTE2ZjRmMzY2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+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', 'Y', '2019-05-28 00:00:00', '2019-11-26 17:21:16', 'IFSC CODE: 872324134123\nSWIFT:83148\nACC: 98423', 'Settings Terms and Conditions', 2, 'INV', 2, 'EST', 2);

-- --------------------------------------------------------

--
-- Stand-in structure for view `taxinputtotalview`
-- (See below for the actual view)
--
CREATE TABLE `taxinputtotalview` (
`invoiceId` int(11)
,`invoiceNo` varchar(200)
,`invoiceDate` date
,`totalInputTax` double
);

-- --------------------------------------------------------

--
-- Table structure for table `taxslab`
--

CREATE TABLE `taxslab` (
  `taxSlabId` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `percentage` int(11) NOT NULL,
  `createDate` datetime NOT NULL,
  `updateDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `taxslab`
--

INSERT INTO `taxslab` (`taxSlabId`, `name`, `percentage`, `createDate`, `updateDate`) VALUES
(1, 'GST0', 0, '2019-10-16 12:01:53', '2019-10-16 12:01:53'),
(2, 'GST5', 5, '2019-10-16 12:02:03', '2019-10-16 12:02:03'),
(3, 'GST12', 12, '2019-10-16 12:02:24', '2019-10-16 12:02:24'),
(4, 'GST18', 18, '2019-10-16 12:02:34', '2019-10-16 12:02:34'),
(5, 'GST28', 28, '2019-10-16 12:02:45', '2019-10-16 12:03:02');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `userName` varchar(200) NOT NULL,
  `userType` varchar(100) NOT NULL DEFAULT 'ADMIN',
  `salt` varchar(400) NOT NULL,
  `password` varchar(500) NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phoneNo` varchar(100) DEFAULT NULL,
  `accessToken` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'ACTIVE',
  `createDate` datetime NOT NULL,
  `updateDate` datetime DEFAULT NULL,
  `proPicPath` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `userName`, `userType`, `salt`, `password`, `name`, `email`, `phoneNo`, `accessToken`, `status`, `createDate`, `updateDate`, `proPicPath`) VALUES
(1, 'admin@admin.com', 'ADMIN', 'pVsMYAb4OG8ZRITnRA4WAY0OSazmoZjW', '492975f6087039078e7d558760245d23:34066e267793b231089c13abe004bec8', 'John Carter', 'admin@admin.com', '9987654321', 'CUST1234', 'ACTIVE', '2019-05-15 00:00:00', '2019-10-16 19:03:57', NULL);

-- --------------------------------------------------------

--
-- Structure for view `customerinvoicetotal`
--
DROP TABLE IF EXISTS `customerinvoicetotal`;

CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `customerinvoicetotal`  AS  select distinct `ct`.`contactId` AS `contactId`,(select round(sum((`ivt`.`quantity` * `ivt`.`rate`)),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`status` = 'SENT') and (`iv`.`type` = 'invoice') and (`iv`.`createDate` >= (curdate() - interval 15 day)))) AS `totalSentInvoiceAmount15Days`,(select round((sum(((`ivt`.`quantity` * `ivt`.`rate`) * `ivt`.`tax`)) / 100),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`status` = 'SENT') and (`iv`.`type` = 'invoice') and (`iv`.`createDate` >= (curdate() - interval 15 day)))) AS `totalSentTaxAmount15Days`,(select round(sum((`ivt`.`quantity` * `ivt`.`rate`)),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`status` = 'SENT') and (`iv`.`type` = 'invoice') and (`iv`.`createDate` >= (curdate() - interval 30 day)))) AS `totalSentInvoiceAmount30Days`,(select round((sum(((`ivt`.`quantity` * `ivt`.`rate`) * `ivt`.`tax`)) / 100),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`status` = 'SENT') and (`iv`.`type` = 'invoice') and (`iv`.`createDate` >= (curdate() - interval 30 day)))) AS `totalSentTaxAmount30Days`,(select round(sum((`ivt`.`quantity` * `ivt`.`rate`)),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`type` = 'invoice') and (`iv`.`status` = 'SENT'))) AS `totalSentInvoiceAmount`,(select round((sum(((`ivt`.`quantity` * `ivt`.`rate`) * `ivt`.`tax`)) / 100),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`type` = 'invoice') and (`iv`.`status` = 'SENT'))) AS `totalSentTaxAmount`,(select round(sum((`ivt`.`quantity` * `ivt`.`rate`)),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`status` = 'PAID') and (`iv`.`type` = 'invoice') and (`iv`.`createDate` >= (curdate() - interval 15 day)))) AS `totalPaidInvoiceAmount15Days`,(select round((sum(((`ivt`.`quantity` * `ivt`.`rate`) * `ivt`.`tax`)) / 100),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`status` = 'PAID') and (`iv`.`type` = 'invoice') and (`iv`.`createDate` >= (curdate() - interval 15 day)))) AS `totalPaidTaxAmount15Days`,(select round(sum((`ivt`.`quantity` * `ivt`.`rate`)),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`status` = 'PAID') and (`iv`.`type` = 'invoice') and (`iv`.`createDate` >= (curdate() - interval 30 day)))) AS `totalPaidInvoiceAmount30Days`,(select round((sum(((`ivt`.`quantity` * `ivt`.`rate`) * `ivt`.`tax`)) / 100),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`status` = 'PAID') and (`iv`.`type` = 'invoice') and (`iv`.`createDate` >= (curdate() - interval 30 day)))) AS `totalPaidTaxAmount30Days`,(select round(sum((`ivt`.`quantity` * `ivt`.`rate`)),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`type` = 'invoice') and (`iv`.`status` = 'PAID'))) AS `totalPaidInvoiceAmount`,(select round((sum(((`ivt`.`quantity` * `ivt`.`rate`) * `ivt`.`tax`)) / 100),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`type` = 'invoice') and (`iv`.`status` = 'PAID'))) AS `totalPaidTaxAmount`,(select round(sum((`ivt`.`quantity` * `ivt`.`rate`)),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`status` = 'VOID') and (`iv`.`type` = 'invoice') and (`iv`.`createDate` >= (curdate() - interval 15 day)))) AS `totalVoidInvoiceAmount15Days`,(select round((sum(((`ivt`.`quantity` * `ivt`.`rate`) * `ivt`.`tax`)) / 100),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`status` = 'VOID') and (`iv`.`type` = 'invoice') and (`iv`.`createDate` >= (curdate() - interval 15 day)))) AS `totalVoidTaxAmount15Days`,(select round(sum((`ivt`.`quantity` * `ivt`.`rate`)),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`status` = 'VOID') and (`iv`.`type` = 'invoice') and (`iv`.`createDate` >= (curdate() - interval 30 day)))) AS `totalVoidInvoiceAmount30Days`,(select round((sum(((`ivt`.`quantity` * `ivt`.`rate`) * `ivt`.`tax`)) / 100),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`status` = 'VOID') and (`iv`.`type` = 'invoice') and (`iv`.`createDate` >= (curdate() - interval 30 day)))) AS `totalVoidTaxAmount30Days`,(select round(sum((`ivt`.`quantity` * `ivt`.`rate`)),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`type` = 'invoice') and (`iv`.`status` = 'VOID'))) AS `totalVoidInvoiceAmount`,(select round((sum(((`ivt`.`quantity` * `ivt`.`rate`) * `ivt`.`tax`)) / 100),2) from (`invoices` `iv` join `invoiceitems` `ivt`) where ((`iv`.`invoiceId` = `ivt`.`invoiceId`) and (`iv`.`contactId` = `ct`.`contactId`) and (`iv`.`type` = 'invoice') and (`iv`.`status` = 'VOID'))) AS `totalVoidTaxAmount` from `contacts` `ct` ;

-- --------------------------------------------------------

--
-- Structure for view `taxinputtotalview`
--
DROP TABLE IF EXISTS `taxinputtotalview`;

CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `taxinputtotalview`  AS  select `inv`.`invoiceId` AS `invoiceId`,`inv`.`invoiceNo` AS `invoiceNo`,`inv`.`invoiceDate` AS `invoiceDate`,(select sum(if((`intm`.`tax` >= 0),(((`intm`.`quantity` * `intm`.`rate`) * `intm`.`tax`) / 100),0)) from `invoiceitems` `intm` where ((`intm`.`invoiceId` = `inv`.`invoiceId`) and (`intm`.`itcEligible` = 'Y'))) AS `totalInputTax` from (`invoices` `inv` join `invoiceitems` `intm` on(((`intm`.`invoiceId` = `inv`.`invoiceId`) and (`intm`.`itcEligible` = 'Y')))) where ((`inv`.`type` = 'bill') and ((`inv`.`status` = 'SENT') or (`inv`.`status` = 'PAID'))) group by `inv`.`invoiceId` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`contactId`);

--
-- Indexes for table `estimateitems`
--
ALTER TABLE `estimateitems`
  ADD PRIMARY KEY (`estimateItemId`);

--
-- Indexes for table `estimates`
--
ALTER TABLE `estimates`
  ADD PRIMARY KEY (`estimateId`);

--
-- Indexes for table `gsttreatment`
--
ALTER TABLE `gsttreatment`
  ADD PRIMARY KEY (`gstTreatmentId`);

--
-- Indexes for table `invoiceitems`
--
ALTER TABLE `invoiceitems`
  ADD PRIMARY KEY (`invoiceItemId`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`invoiceId`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`itemId`);

--
-- Indexes for table `paymentimages`
--
ALTER TABLE `paymentimages`
  ADD PRIMARY KEY (`paymentImageId`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`paymentId`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`settingsId`);

--
-- Indexes for table `taxslab`
--
ALTER TABLE `taxslab`
  ADD PRIMARY KEY (`taxSlabId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `contactId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `estimateitems`
--
ALTER TABLE `estimateitems`
  MODIFY `estimateItemId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `estimates`
--
ALTER TABLE `estimates`
  MODIFY `estimateId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `gsttreatment`
--
ALTER TABLE `gsttreatment`
  MODIFY `gstTreatmentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `invoiceitems`
--
ALTER TABLE `invoiceitems`
  MODIFY `invoiceItemId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `invoiceId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `itemId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `paymentimages`
--
ALTER TABLE `paymentimages`
  MODIFY `paymentImageId` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `paymentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `settingsId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `taxslab`
--
ALTER TABLE `taxslab`
  MODIFY `taxSlabId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
