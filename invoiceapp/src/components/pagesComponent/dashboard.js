import React, { Component } from 'react';
import * as Constants from '../../constants';
import {
    BrowserRouter as Router
} from 'react-router-dom';
import Sidebar from '../layoutsComponent/sidebar';
import ReactApexCharts from 'react-apexcharts'

const monthName = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

class Dashboard extends Component {
     constructor(props) {
        super(props);
          this.state = {
            totalInvoice:{},
            invoicespending:{},
            invoicescleared:{},
            monthWisePayments:[],
            monthWiseInvoices:[]
        };
    }

    getFormattedDate(date) {
        var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    componentDidMount() {
        let toDate = new Date();
        let toDateFormatted = this.getFormattedDate(toDate);
        let fromDate = toDate.setMonth(toDate.getMonth() - 6);
        let fromDateFormatted = this.getFormattedDate(fromDate);
        // alert(fromDateFormatted+"-"+toDateFormatted);
        Promise.all([fetch(Constants.BASE_URL_API+"getinvoicetotal",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams({contactId:''})
            }),
            fetch(Constants.BASE_URL_API+"getmonthwisepayments",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams({fromDate:fromDateFormatted,toDate:toDateFormatted})
            }),
            fetch(Constants.BASE_URL_API+"getmonthwiseinvoices",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams({fromDate:fromDateFormatted,toDate:toDateFormatted})
            })
        ])
        .then(([res1,res2,res3]) => { 
            return Promise.all([res1.json(),res2.json(),res3.json()]) 
        })
        .then(([res1,res2,res3,res4]) => {
        
            this.setState({
                totalInvoice:res1.responseResult,
                invoicespending:res1.invoicespending,
                invoicescleared:res1.invoicescleared,
                monthWisePayments:res2.list,
                monthWiseInvoices:res3.list
            });
            
        });
    }
   
    render() {

        const {monthWisePayments,monthWiseInvoices} = this.state;
        var paymentsR = [];
        var paymentMonthLabels = [];
       
        var invoiceAmounts = [];
        var invoiceMonthLabels = [];

        monthWisePayments && monthWisePayments !=="undefined" && monthWisePayments !==null &&
        monthWisePayments.map((item,idx) => {
            paymentsR.push(item.amtReceived)
            paymentMonthLabels.push(monthName[(item.m-1)]+"-"+item.y)
        })

        monthWiseInvoices && monthWiseInvoices !=="undefined" && monthWiseInvoices !==null &&
        monthWiseInvoices.map((item,idx) => {
            invoiceAmounts.push(item.totalAmount)
            invoiceMonthLabels.push(monthName[(item.m-1)]+"-"+item.y)
        })
        const series = [
            {
                name: 'Payments Received',
                data: paymentsR
            }
        ]

        const options = {
            plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: '55%',
                  endingShape: 'rounded'	
                },
            },
            
            dataLabels: {
                enabled: false
            },
            
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
        
            xaxis: {
                    categories: paymentMonthLabels,
            },
        
            yaxis: {
                title: {
                    text: ' INR'
                }
            },
        
            fill: {
                opacity: 1
            },
        
            tooltip: {
                y: {
                    formatter: function (val) {
                    return "INR " + val
                    }
                }
            }
        }

        const invoiceSeries = [
            {
                name: 'Invoice Amount',
                data: invoiceAmounts
            }
        ]

        const invoiceOptions = {
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight'
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                },
            },
            xaxis: {
                categories: invoiceMonthLabels,
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                    return "INR " + val
                    }
                }
            }
        }

        return (
            <Router>
                <Sidebar />
                <div className="main-panel">
                    <nav className="header navbar">
                        <div className="header-inner">
                            <div className="navbar-item navbar-spacer-right brand hidden-lg-up">
                            <a href="javascript:;" data-toggle="sidebar" className="toggle-offscreen">
                                <i className="material-icons">menu</i>
                            </a>
                            </div>
                            <a className="navbar-item navbar-spacer-right navbar-heading hidden-md-down" href="javascript:void(0);">
                            <span className="tophead-txt">Dashboard</span>
                            <span className="tophead-txt pull-right"></span>
                            </a>
                        </div>
                    </nav>

                    <div className="main-content">
                        <div className="content-view">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="sec-t-container m-b-2"><h4 className="card-title">Payment Received</h4></div>
                                        <div className="card-block">
                                            <ReactApexCharts options={options} series={series} type="bar" height="350" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card">
                                    <div className="sec-t-container m-b-2"><h4 className="card-title">Invoices</h4></div>
                                        <div className="card-block">
                                            <ReactApexCharts options={invoiceOptions} series={invoiceSeries} type="area" height="350" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="sec-t-container m-b-2"><h4 className="card-title">Summary</h4></div>
                                <div className="card-block">
                                    <div className="card-block text-center form-left">
                                        <div className="row">
                                            <div className="emp-meta">
                                                <table className="table table-bordered m-b-0">
                                                <tr>
                                                <td></td>
                                                <td><b>Last 15 Days</b></td>
                                                <td><b>Last 30 Days</b></td>
                                                <td><b>Overall</b></td>
                                                </tr>
                                                <tr>
                                                <td><b>SENT</b></td>
                                                <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalSentInvoiceAmount15Days?'₹'+(this.state.totalInvoice[0].totalSentInvoiceAmount15Days+this.state.totalInvoice[0].totalSentTaxAmount15Days).toFixed(2):'₹0.00'}</td>
                                                <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalSentTaxAmount30Days?'₹'+(this.state.totalInvoice[0].totalSentInvoiceAmount30Days+this.state.totalInvoice[0].totalSentTaxAmount30Days).toFixed(2):'₹0.00'}</td>
                                                <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalSentInvoiceAmount?'₹'+(this.state.totalInvoice[0].totalSentInvoiceAmount+this.state.totalInvoice[0].totalSentTaxAmount).toFixed(2):'₹0.00'}</td>
                                                </tr>
                                                <tr>
                                                <td><b>PAID</b></td>
                                                <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalPaidInvoiceAmount15Days?'₹'+(this.state.totalInvoice[0].totalPaidInvoiceAmount15Days+this.state.totalInvoice[0].totalPaidTaxAmount15Days).toFixed(2):'₹0.00'}</td>
                                                <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalPaidTaxAmount30Days?'₹'+(this.state.totalInvoice[0].totalPaidInvoiceAmount30Days+this.state.totalInvoice[0].totalPaidTaxAmount30Days).toFixed(2):'₹0.00'}</td>
                                                <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalPaidInvoiceAmount?'₹'+(this.state.totalInvoice[0].totalPaidInvoiceAmount+this.state.totalInvoice[0].totalPaidTaxAmount).toFixed(2):'₹0.00'}</td>
                                                </tr>
                                                <tr>
                                                <td><b>VOID</b></td>
                                                <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalVoidInvoiceAmount15Days?'₹'+(this.state.totalInvoice[0].totalVoidInvoiceAmount15Days+this.state.totalInvoice[0].totalVoidTaxAmount15Days).toFixed(2):'₹0.00'}</td>
                                                <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalVoidTaxAmount30Days?'₹'+(this.state.totalInvoice[0].totalVoidInvoiceAmount30Days+this.state.totalInvoice[0].totalVoidTaxAmount30Days).toFixed(2):'₹0.00'}</td>
                                                <td>{this.state.totalInvoice.length > 0 && this.state.totalInvoice[0].totalVoidInvoiceAmount?'₹'+(this.state.totalInvoice[0].totalVoidInvoiceAmount+this.state.totalInvoice[0].totalVoidTaxAmount).toFixed(2):'₹0.00'}</td>
                                                </tr>
                                                <tr>
                                                <td><b>Total</b></td>
                                                <td>
                                                {
                                                    this.state.totalInvoice.length > 0 &&
                                                    (
                                                    '₹'+(this.state.totalInvoice[0].totalSentTaxAmount15Days +
                                                    this.state.totalInvoice[0].totalPaidTaxAmount15Days +
                                                    this.state.totalInvoice[0].totalVoidTaxAmount15Days +
                                                    this.state.totalInvoice[0].totalSentInvoiceAmount15Days +
                                                    this.state.totalInvoice[0].totalPaidInvoiceAmount15Days +
                                                    this.state.totalInvoice[0].totalVoidInvoiceAmount15Days).toFixed(2) 
                                                    )
                                                }
                                                </td>
                                                <td>
                                                {
                                                    this.state.totalInvoice.length > 0 &&
                                                    (
                                                    '₹'+(this.state.totalInvoice[0].totalSentTaxAmount30Days +
                                                    this.state.totalInvoice[0].totalPaidTaxAmount30Days +
                                                    this.state.totalInvoice[0].totalVoidTaxAmount30Days +
                                                    this.state.totalInvoice[0].totalSentInvoiceAmount30Days +
                                                    this.state.totalInvoice[0].totalPaidInvoiceAmount30Days +
                                                    this.state.totalInvoice[0].totalVoidInvoiceAmount30Days).toFixed(2)
                                                    )
                                                }
                                                </td>
                                                <td>
                                                {
                                                    this.state.totalInvoice.length > 0 &&
                                                    (
                                                    '₹'+(this.state.totalInvoice[0].totalSentTaxAmount +
                                                    this.state.totalInvoice[0].totalPaidTaxAmount +
                                                    this.state.totalInvoice[0].totalVoidTaxAmount +
                                                    this.state.totalInvoice[0].totalSentInvoiceAmount +
                                                    this.state.totalInvoice[0].totalPaidInvoiceAmount +
                                                    this.state.totalInvoice[0].totalVoidInvoiceAmount).toFixed(2)  
                                                    )
                                                }
                                                </td>
                                                </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="sec-t-container m-b-2"><h4 className="card-title">Pending Invoices List</h4></div>
                                        <div className="card-block">
                                            <div className="">
                                                <table className="table table-bordered m-b-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Sl</th>
                                                            <th>Details</th>
                                                            <th>Invoice</th>
                                                        </tr>
                                                    </thead>
                                                    
                                                    <tbody>
                                                    {
                                                        this.state.invoicespending.length > 0 && this.state.invoicespending.map(function(item,index) {
                                                        return <tr>
                                                            <td>{++index}</td>
                                                        <td>
                                                        <b>{(item.companyName)?item.companyName:'N/A'}</b><br/>
                                                        <b>GST No: </b>{(item.gstNo)?item.gstNo:'N/A'}<br/>
                                                        </td>
                                                            <td>
                                                            <b>No:</b>
                                                            <a href={"/invoicedetails/"+item.invoiceId}><span style={{fontSize:15}}>{(item.invoiceNo)?item.invoiceNo:'N/A'}</span></a>
                                                            <br/>
                                                            <b>Date:</b>
                                                            {(new Date(item.invoiceDate).getDate()) + "-" + (new Date(item.invoiceDate).getMonth() + 1) + "-" + (new Date(item.invoiceDate).getFullYear())}
                                                            <br/>
                                                            <b>Amt: </b><i className="fa fa-inr" aria-hidden="true"></i>
                                                            {parseFloat(item.totalAmount).toFixed(2)}
                                                            </td>
                                                        </tr>;
                                                        },this)
                                                    }  
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="sec-t-container m-b-2"><h4 className="card-title">Cleared Invoices List</h4></div>
                                        <div className="card-block">
                        
                                            <div className="emp-meta">
                                                <table className="table table-bordered m-b-0">
                                                    <thead>
                                                        <tr>
                                                            <th>Sl</th>
                                                            <th>Details</th>
                                                            <th>Invoice</th>
                                                        </tr>
                                                    </thead>
                                                    
                                                    <tbody>
                                                    {
                                                        this.state.invoicescleared.length > 0 && this.state.invoicescleared.map(function(item,index) {
                                                        return <tr>
                                                            <td>{++index}</td>
                                                            <td>
                                                            <b>{(item.companyName)?item.companyName:'N/A'}</b><br/>
                                                            <b>GST No: </b>{(item.gstNo)?item.gstNo:'N/A'}<br/>
                                                            </td>
                                                            <td>
                                                            <b>No:</b>
                                                            <a href={"/invoicedetails/"+item.invoiceId}><span style={{fontSize:15}}>{(item.invoiceNo)?item.invoiceNo:'N/A'}</span></a>
                                                            <br/>
                                                            <b>Date:</b>
                                                            {(new Date(item.invoiceDate).getDate()) + "-" + (new Date(item.invoiceDate).getMonth() + 1) + "-" + (new Date(item.invoiceDate).getFullYear())}
                                                            <br/>
                                                            <b>Amt: </b><i className="fa fa-inr" aria-hidden="true"></i>
                                                            {parseFloat(item.totalAmount).toFixed(2)}
                                                            </td>
                                                        </tr>;
                                                        },this)
                                                    }  
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}
export default Dashboard;
