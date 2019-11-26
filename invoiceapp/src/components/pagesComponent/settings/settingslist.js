import React, { Component } from 'react';
import  Loader  from '../../../../public/assets/images/spinner.GIF';
import * as Constants from '../../../constants';
import Sidebar from '../../layoutsComponent/sidebar';
import Pagination from '../pagination';

import {
    BrowserRouter as Router
} from 'react-router-dom';

class Settingslist extends Component {
    constructor(props) {
    super(props);
    this.state = {
            settings: {},
            settingsId:Constants.INVOICE_SETTINGS_ID,
            pageOfItems: [],
            currentPageNo:1
        };
    this.onChangePage = this.onChangePage.bind(this);
    this.onChangePageNo = this.onChangePageNo.bind(this);
}
 
  onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems});
    }
    
     async onChangePageNo(page) {
        // update state with new page of items
        await this.setState({ currentPageNo: page});
        
    }
   
  componentDidMount() {
        fetch(Constants.BASE_URL_API+"getsettings",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams(this.state)
        })
        .then(response => { return response.json(); } )
        .then(data => {
            this.setState({settings: data.settings});
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
                      <span className="tophead-txt">Settings >> View List</span>
                      <span className="tophead-txt pull-right"></span>
                    </a>
                   </div>
                </nav>
                
                 <div className="main-content">
        <div className="content-view">
            
        <div className="card">
            <div className="sec-t-container m-b-2"><h4 className="card-title">Settings List</h4></div>
            <div className="card-block">
            <div id="contactlist-wait" className="loader-login">
                <img src={Loader} width="64" height="64" />
            </div>	
                <div className="emp-meta">
                    <table className="table table-bordered m-b-0">
                        <thead>
                            <tr>
                                <th>Sl No</th>
                                <th width="250px;">Company Name</th>
                                <th width="250px;">Company Address</th>
                                <th>Logo</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                           {
                            this.state.settings.length > 0 && this.state.settings.map(function(item,index) {
                              return <tr>
                              <td>{((this.state.currentPageNo-1)*Constants.RESULT_SET_SIZE)+(++index)}</td>
                              <td>
                              {(item.companyName)?item.companyName:'N/A'}
                              <br/><br/>
                                <b>Registered Under GST:</b>
                            {(item.isRegisteredUnderGST && item.isRegisteredUnderGST ==="Y")?"Yes":'No'}
                               
                              </td>
                               <td>
                              {(item.companyAddress)?item.companyAddress:'N/A'}
                                <br/>
                                GSTIN:<b>{(item.gstNo)?item.gstNo:'N/A'}</b>
                                    <br/>
                                <b>Place Of Supply:</b>
                            {(item.companyPlaceOfSupply)?item.companyPlaceOfSupply:'N/A'}
                              </td>
                               <td>
                             <img src={item.imagePath} width="200px" />
                              </td>
                              
                              <td>
                              <b className="ed-del">
                              <a href={"/editsettings/"+item.settingsId}><i className="fa fa-pencil" aria-hidden="true"></i></a>
                              </b>
                              </td>
                              </tr>;
                            },this)
                        }  
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
            <Pagination items={this.state.contacts} onChangePage={this.onChangePage} onChangePageNo={this.onChangePageNo}/>
        </div>
     </div>
    </div>
       
        </Router>
    );
  }
}
export default Settingslist;
