import React, { Component } from 'react';
import * as Constants from '../../../constants';
import Sidebar from '../../layoutsComponent/sidebar';
import "../../../../public/assets/js/vfs_fonts.js";
import "react-datepicker/dist/react-datepicker.css";
import {
    BrowserRouter as Router
} from 'react-router-dom';

class Gstpayable extends Component {
    constructor(props) {
    super(props);
    this.state = {
            searchFilterYear:'',
            searchFilterMonth:'',
            errors:[],
            payable:{}
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.makeList();
    }

    makeList()
    {
        let fromDate = "";
        let toDate = "";
        if(this.state.searchFilterYear !=="" && this.state.searchFilterMonth !=="")
        {
            // alert(1);
            fromDate = this.state.searchFilterYear+"-"+this.state.searchFilterMonth+"-"+"1";
            toDate = this.state.searchFilterYear+"-"+this.state.searchFilterMonth+"-"+"31";
        }
        else if(this.state.searchFilterYear !=="" && this.state.searchFilterMonth ==="")
        {
            // alert(2);
            fromDate = this.state.searchFilterYear+"-"+"1"+"-"+"1";
            toDate = this.state.searchFilterYear+"-"+"1"+"-"+"31";
        }
        else if(this.state.searchFilterYear ==="" && this.state.searchFilterMonth !=="")
        {
            // alert(3);
            fromDate = "2018"+"-"+this.state.searchFilterMonth+"-"+"1";
            toDate = "2018"+"-"+this.state.searchFilterMonth+"-"+"31";
        }
        Promise.all([fetch(Constants.BASE_URL_API+"gstpayable",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({fromDate:fromDate,toDate:toDate})
        })
    ])
        .then(([res1]) => { 
            return Promise.all([res1.json()]) 
        })
        .then(([res1,res2]) => {
            this.setState({
                payable:res1.list
            });
        });
    }

    search()
    {
        var error_flag = false;
        let errors = {};
        if (this.state.searchFilterYear === "" &&
            this.state.searchFilterMonth === "" 
        )
        {
            error_flag = true;
            errors['search'] = "Please select the filters!";
            setTimeout(function(){
                    this.setState({errors:{}});
            }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
        }

        if (this.state.searchFilterYear === "" ||
            this.state.searchFilterMonth === "" 
        )
        {
            error_flag = true;
            errors['search'] = "Please select the filters!";
            setTimeout(function(){
                this.setState({errors:{}});
            }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
        }
        if (error_flag) {
            this.setState({
                errors: errors
            });
            return error_flag;
        }
        else {
            this.makeList();
        }
    }
    
    async handleSearch(e) {
        await this.setState({[e.target.name]:e.target.value});
    }
    
    clearFilter()
    {
        this.setState({
            searchFilterYear:'',
            searchFilterMonth:'',
            },()=>{
                this.makeList();
            });
    }
   
    render() {
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
                    <span className="tophead-txt">GST Tax Amount</span>
                    <span className="tophead-txt pull-right"></span>
                    </a>
                </div>
                </nav>
                
                <div className="main-content">
                    <div className="content-view">
                    
                        <div className="card">
                            <div className="sec-t-container m-b-2"><h4 className="card-title">Search Filters</h4></div>
                            <div className="card-block">
                        
                            <div className="row">
                                <div className="col-lg-3">
                                    <b>Year:</b>
                                    <select className="form-control" name="searchFilterYear" onChange={this.handleSearch} value={this.state.searchFilterYear}>
                                        <option value="">--select year--</option>
                                        <option value="2018">2018</option>
                                        <option value="2019">2019</option>
                                        <option value="2020">2020</option>
                                    </select>
                                </div>
                                <div className="col-lg-3">
                                    <b>Month:</b>
                                    <select className="form-control" name="searchFilterMonth" onChange={this.handleSearch} value={this.state.searchFilterMonth}>
                                        <option value="">--select month--</option>
                                        <option value="1">January</option>
                                        <option value="2">February</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">June</option>
                                        <option value="7">July</option>
                                        <option value="8">August</option>
                                        <option value="9">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select>
                                </div>
                                <div className="col-lg-3" style={{float:'right'}}>
                                    <b>&nbsp;</b>
                                    <div className="srch-fltr-btns">
                                        <button type="button" className="btn btn-primary" onClick={this.search.bind(this)}><i className="fa fa-search" aria-hidden="true"></i> <span className="filterText">Search</span></button>
                                        <button type="button" className="btn btn-cncl" onClick={this.clearFilter.bind(this)}><i className="fa fa-times-circle-o" aria-hidden="true"></i><span className="filterText">&nbsp;Clear</span></button>
                                    </div>
                                </div>
                            </div>
                            <span id="error_msg" className="err_msg">{this.state.errors.search}</span>
                            </div>
                        </div>

                         <div className="row">
                            <div className="col-md-12">

                            <div className="card">
                                <div className="sec-t-container m-b-2">
                                <h4 className="card-title">GST Payable - 
                                &nbsp;<i className="fa fa-inr" aria-hidden="true"></i>
                                {
                                    (this.state.payable && this.state.payable!=="undefined" && this.state.payable !==null &&
                                    this.state.payable.length > 0)?
                                    this.state.payable.reduce((sum, i) => (
                                            sum += i.totalTax
                                            ), 0).toFixed(2)
                                            :
                                            "0.00"
                                    }
                                </h4></div>
                                    <div className="card-block">
                                        <div className="emp-meta">
                                            <table className="table table-bordered m-b-0">
                                                <thead>
                                                    <tr>
                                                        <th>Sl No</th>
                                                        <th>Invoice Details</th>
                                                        <th>Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    this.state.payable && this.state.payable!=="undefined" && this.state.payable !==null &&
                                                    this.state.payable.length > 0 && this.state.payable.map(function(item,index) {
                                                    return <tr>
                                                    <td>{++index}</td>
                                                    <td>
                                                        <b>Invoice No:</b>
                                                        <span style={{fontSize:15}}>{(item.invoiceNo)?item.invoiceNo:'N/A'}</span>
                                                        <br/>
                                                        <b>Date:</b>{(new Date(item.invoiceDate).getDate()) + "-" + (new Date(item.invoiceDate).getMonth() + 1) + "-" + (new Date(item.invoiceDate).getFullYear())}
                                                    </td>
                                                    <td>
                                                        <b>Sub Total:</b>
                                                        &nbsp;<i className="fa fa-inr" aria-hidden="true"></i>
                                                        {item.subTotal.toFixed(2)}
                                                        <br/>
                                                        <b>Total Tax:</b>
                                                        &nbsp;<i className="fa fa-inr" aria-hidden="true"></i>
                                                        {item.totalTax.toFixed(2)}
                                                        <br/>
                                                        <b>Total Amount:</b>
                                                        &nbsp;<i className="fa fa-inr" aria-hidden="true"></i>
                                                        {item.totalAmount.toFixed(2)}
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
export default Gstpayable;
