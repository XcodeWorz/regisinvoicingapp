import React, { Component } from 'react';
import  Loader  from '../../../../public/assets/images/spinner.GIF';
import * as Constants from '../../../constants';
import Sidebar from '../../layoutsComponent/sidebar';
import Modal from 'react-bootstrap-modal';
import "../../../../public/assets/js/vfs_fonts.js";
import Pagination from '../pagination';
import "react-datepicker/dist/react-datepicker.css";
import Dropdown from '../uielements/dropdown';
import SpinnerLoader from 'react-loader-spinner';

import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

const itemsObj = [Constants.LISTING_EDIT, Constants.LISTING_DELETE];
const itemsIconsObj = [Constants.LISTING_EDIT_ICON, Constants.LISTING_DELETE_ICON];

class Itemslist extends Component {
    constructor(props) {
    super(props);
    this.state = {
            pageOfItems: [],
            pageNo:1,
            searchFiltersItems:'',
            itemId:'',
            operationType:'',
            contacts:{},
            errors:{},
            totalCount:0,
            name:'',
            description:'',
            type:'',
            hsnCode:'',
            sacCode:'',
            price:'',
            accountTypeSubId:'',
            hsnCodeDisplay:false,
            sacCodeDisplay:false,
            selectedOption:{},
            selectedOptionAccount:{},
            showDeleteModal:false,
            deleteItemId:''
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSearchType = this.handleSearchType.bind(this);
        this.onChangePage = this.onChangePage.bind(this);

        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleAutocompleteSelect = this.handleAutocompleteSelect.bind(this);
        this.search = this.search.bind(this);
        this.onDropDownItemClick = this.onDropDownItemClick.bind(this);
        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.closeDeleteModal = this.closeDeleteModal.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    operateSpinnerLoader(val)
    {
        let spinnerDiv = document.getElementById("spinnerLoaderDiv");
        let bodyDiv = document.getElementById("bodyDiv");
        if(val === "open")
        {
            if(bodyDiv)
            {
                bodyDiv.style.display="none";
            }
            if(spinnerDiv)
            {
                spinnerDiv.style.display="block";
            }
        }
        else if(val === "close")
        {
            if(spinnerDiv)
            {
                spinnerDiv.style.display="none";
            }
            if(bodyDiv)
            {
                bodyDiv.style.display="block";
            }
        }
    }

    componentDidMount() {
        this.operateSpinnerLoader("open");
        Promise.all([fetch(Constants.BASE_URL_API+"getitems",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({pageNo:this.state.pageNo})
        }),
        fetch(Constants.BASE_URL_API+"getcontacts",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams(this.state)
            }),
            fetch(Constants.BASE_URL_API+"getsettings",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams({settingsId:Constants.INVOICE_SETTINGS_ID})
            })
        ])
        .then(([res1,res2,res3]) => { 
            return Promise.all([res1.json(),res2.json(),res3.json()]) 
        })
        .then(([res1,res2,res3]) => {
        this.setState(
            {
                pageOfItems: res1.items, 
                contacts:res2.contacts, 
                totalCount:res1.totalCount,
                isRegisteredUnderGST:(res3.settings[0].isRegisteredUnderGST && res3.settings[0].isRegisteredUnderGST!=="undefined" && res3.settings[0].isRegisteredUnderGST !==null)?res3.settings[0].isRegisteredUnderGST:'N',
            });
        this.operateSpinnerLoader("close");
        });
   
    }

    onDropDownItemClick(item, index){
        switch(index){
            case 0://EDIT
                    this.openEditModal(item.itemId)
                break;
            case 1: //DELETE
                    this.openDeleteModal(item.itemId)
                break;
        }
    }

    openDeleteModal(itemId)
    {
        this.setState({
            showDeleteModal:true,
            deleteItemId:itemId
        });
    }

    closeDeleteModal(itemId)
    {
        this.setState({
            showDeleteModal:false,
            deleteItemId:''
        });
    }

    deleteItem()
    {
        Promise.all([
            fetch(Constants.BASE_URL_API+"deleteitem",
            {
                method: "POST",
                mode:'cors',
                body: new URLSearchParams({itemId:this.state.deleteItemId})
            })
        ])
    
        .then(([res1]) => { 
            return Promise.all([res1.json()]) 
        })
        .then(([res1]) => {
            this.closeDeleteModal();
            this.makeList();
        });
    }

    handleChangeCustomer = selectedOption => {
        this.setState({ selectedOption: selectedOption, valueContact:selectedOption.value});
      };

    handleChangeAccount = selectedOptionAccount => {
    this.setState({ selectedOptionAccount: selectedOptionAccount, accountTypeSubId:selectedOptionAccount.value});
    };

    async onChangePage(page) {
        if(page != this.state.pageNo){
            this.setState({
                pageNo:page
            },()=>{
                fetch(Constants.BASE_URL_API+"getitems",
                {
                    method: "POST",
                    mode:'cors',
                    body: new URLSearchParams(
                        this.state
                    )
                })
                .then(response => { return response.json(); } )
                .then(data =>
                {
                    this.setState({
                        pageNo:page,
                        pageOfItems:data.items,
                        totalCount:data.totalCount
                    });
                });
            });
        }
        
    }
    
    async handleSearch(e) {
        await this.setState({searchFiltersItems:e.target.value});
    }
    async handleSearchType(e) {
        await this.setState({searchFilterType:e.target.value});
    }
    
    makeList()
    {
        Promise.all([fetch(Constants.BASE_URL_API+"getitems",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams(this.state)
        })])
        .then(([res1]) => { 
            return Promise.all([res1.json()]) 
        })
        .then(([res1]) => {
        this.setState({pageOfItems: res1.items,totalCount:res1.totalCount});
        });
    
    }
   
   clearFilter()
   {
        this.setState({
            contactId: '',
            name:'',
            description:'',
            pageOfItems: [],
            pageNo:1,
            searchFiltersItems:'',
            items:{},
            itemId:'',
            operationType:'',
            customerDisplayName:'',
            errors:{}
            },()=>{
                this.makeList();
            });
   }

  search()
  {
       var error_flag = false;
       let errors = {};
       if (this.state.searchFiltersItems === ""
       )
       {
           error_flag = true;
           errors['search'] = "Please select atleast one filter!";
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
           this.setState({pageNo:1},()=>{
               this.makeList();
           });
       }
  }
  
   
openModal() {
    this.setState(
        {
            showModal: true, 
            errors: {}, 
            operationType:'add',
            contactId:'',
            name:'',
            description:'',
            type:'',
            hsnCode:'',
            sacCode:'',
            price:'',
            accountTypeSubId:'',
            hsnCodeDisplay:false,
            sacCodeDisplay:false,
        },()=>{

        });
}

closeModal() {
    this.setState(
        {
            showModal: false,
            errors: {}, 
            operationType:'', 
            itemId:'', 
            contactId:'',
            name:'',
            description:''
        });
}

openEditModal(itemId)
{
    this.setState({
        showModal: true, 
        errors: {}, 
        itemId:itemId,
        operationType:'edit'
    },()=>{
        Promise.all([fetch(Constants.BASE_URL_API+"getitems",
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams({itemId:itemId})
        })
        ])
        .then(([res1]) => { 
            return Promise.all([res1.json()]) 
        })
        .then(([res1]) => {
            this.setState(
                {
                    itemId:itemId,
                    contactId:res1.items[0].contactId,
                    customerDisplayName:res1.items[0].displayName,
                    name: (res1.items[0].name && res1.items[0].name !=="undefined" && res1.items[0].name!==null)?res1.items[0].name:'',
                    description: (res1.items[0].description && res1.items[0].description !=="undefined" && res1.items[0].description!==null)?res1.items[0].description:'',
                    type: (res1.items[0].type && res1.items[0].type !=="undefined" && res1.items[0].type!==null)?res1.items[0].type:'',
                    hsnCode:res1.items[0].hsnCode,
                    sacCode:res1.items[0].sacCode,
                    price:(res1.items[0].price && res1.items[0].price !=="undefined" && res1.items[0].price!==null)?res1.items[0].price:'',
                    hsnCodeDisplay: (res1.items[0].type && res1.items[0].type !=="undefined" && res1.items[0].type!==null && res1.items[0].type === Constants.ITEM_TYPE_GOODS)?true:false,
                    sacCodeDisplay: (res1.items[0].type && res1.items[0].type !=="undefined" && res1.items[0].type!==null && res1.items[0].type === Constants.ITEM_TYPE_SERVICE)?true:false,
                });
        });
    });
}

handleAutocompleteSelect = (valueContact,contactId) => {
    this.setState({
        valueContact:valueContact,
        contactId:JSON.stringify(contactId.id),
        contactPlaceOfSupply:JSON.stringify(contactId.supply)
    });
}

handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });

    if(e.target.name==="type" && e.target.value === Constants.ITEM_TYPE_GOODS)
    {
        this.setState({ hsnCodeDisplay: true, sacCodeDisplay:false });
    }
    else if(e.target.name==="type" && e.target.value === Constants.ITEM_TYPE_SERVICE)
    {
        this.setState({ sacCodeDisplay: true, hsnCodeDisplay:false });
    }
}

handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
   
    document.getElementById("wait").style.display="block";

    let apiname = "";

    if(this.state.operationType === "add")
    {
        apiname = "insertitem";
    }
    else if(this.state.operationType === "edit")
    {
        apiname = "edititem";
    }
    
    if(!this.validateForm())
    {
        fetch(Constants.BASE_URL_API+apiname,
        {
            method: "POST",
            mode:'cors',
            body: new URLSearchParams(this.state)
        })
        .then(response => { return response.json(); } )
        .then(data =>
              {
                document.getElementById("wait").style.display="none";
                document.getElementById("contact_submit").disabled; 
                if(data.responseCode)
                {
                    this.closeModal();
                    this.makeList();
                }
                else
                {
                    document.getElementById("resp-msg").innerHTML = data.responseMessage;
                }    
            });
    }
    else
    {
        document.getElementById("wait").style.display="none";
    }
    
}

validateForm()
{
    var error_flag = false;
    let errors = {};
    if(this.state.type ==="" && this.state.isRegisteredUnderGST === "Y")
    {
        error_flag = true;
        errors["type"] = "Please enter type!";
        setTimeout(function(){
            this.setState({errors:{}});
        }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
    }
    if(this.state.name === "")
    {
        error_flag = true;
        errors["name"] = "Please enter name!";
        setTimeout(function(){
            this.setState({errors:{}});
        }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
    }
   
   if(this.state.price ==="")
    {
        error_flag = true;
        errors["price"] = "Please enter price!";
        setTimeout(function(){
            this.setState({errors:{}});
        }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
    }
    if(this.state.price !=="")
    {
        if(!this.isAmount(this.state.price))
        {
            error_flag = true;
            errors["price"] = "Please enter valid price!";
            setTimeout(function(){
                this.setState({errors:{}});
            }.bind(this),Constants.WRNG_MSG_TIMEOUT);  
        }
    }
    
    this.setState({
    errors: errors
    });
    return error_flag;
}

isAmount(val)
{
    var reg = /^\s*[+-]?(\d+|\.\d+|\d+\.\d+|\d+\.)(e[+-]?\d+)?\s*$/;
    if( !reg.test( val ) )
    {
        return false;
    }
    return true;
}

isNumeric(val)
{
    var reg = /^\d+$/;
    if( !reg.test( val ) )
    {
        return false;
    }
    return true;
}

isPhone(val)
{
    if(!this.isNumeric(val))
    {
        return false;
    }
    else
    {
        var len	=	val.length;
        var count_len	=	10;
        if(len == count_len)
        {
            return true;
        }
        else
        return false;
    }
    
}

  render() {
      let customerArray =   [];
      if(this.state.contacts && this.state.contacts !=="undefined" && this.state.contacts !==null && this.state.contacts.length > 0)
      {
        this.state.contacts.map(function(item,index) {
            let obj = {
                label:item.displayName,
                value:item.contactId
            };
            customerArray.push(obj);
        });
      }
    //   console.log(JSON.stringify(customerArray));

      
    let accountSubTypeArray =   [];
    if(this.state.accountSubTypes && this.state.accountSubTypes !=="undefined" && this.state.accountSubTypes !==null && this.state.accountSubTypes.length > 0)
    {
        this.state.accountSubTypes.map(function(item,index) {
            let obj = {
                label:item.accountTypeSubName,
                value:item.accountTypeSubId
            };
            accountSubTypeArray.push(obj);
        });
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
                      <span className="tophead-txt">Items >> View List</span>
                      <span className="tophead-txt pull-right"></span>
                    </a>
                   </div>
                </nav>
                
                 <div className="main-content">
                    <div className="content-view">
                    
                        <div className="card">
                            <div className="sec-t-container m-b-2"><h4 className="card-title">Search Filters</h4></div>
                            <div className="card-block">
                            <form method="post" action="javascript:void(0);" onSubmit={this.search.bind(this)}>
                                <div className="row">
                                    <div className="col-lg-3">
                                    <b>Search</b>
                                        <fieldset className="form-group">
                                        <input className="srh-fld" id="search_data"  onChange={this.handleSearch} value={this.state.searchFiltersItems} placeholder="item name"/>
                                        </fieldset>
                                    </div>
                                    <div className="col-lg-3" style={{float:'right'}}>
                                            <b>&nbsp;</b>
                                            <div className="srch-fltr-btns">
                                                <button type="submit" className="btn btn-primary" onClick={this.search.bind(this)}><i className="fa fa-search" aria-hidden="true"></i> <span className="filterText">Search</span></button>
                                                <button type="button" className="btn btn-cncl" onClick={this.clearFilter.bind(this)}><i className="fa fa-times-circle-o" aria-hidden="true"></i><span className="filterText">&nbsp;Clear</span></button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <span id="error_msg" className="err_msg">{this.state.errors.search}</span>
                            </div>
                            </div>
            
            
                    <div className="card">
                        <div className="sec-t-container m-b-2"><h4 className="card-title">Items List</h4>
                            <button className="btn btn-primary add-new" type="button" onClick={this.openModal.bind(this)}>
                                <i className="fa fa-plus-circle" aria-hidden="true"></i> Add New
                            </button>
                        </div>
                        <div className="card-block">
                            <div id="spinnerLoaderDiv" className="react-spinner">
                                <SpinnerLoader type={Constants.LOADER_TYPE} color={Constants.LOADER_COLOR} height={50} width={50} />
                            </div>
                            <div className="" id="bodyDiv">
                                <table className="table m-b-0">
                                    <thead>
                                        <tr>
                                            <th>Sl No</th>
                                            <th>Item</th>
                                            <th>Item Description</th>
                                            <th>Price</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    
                                    <tbody>
                                    {
                                        this.state.pageOfItems && this.state.pageOfItems!=="undefined" && this.state.pageOfItems !==null &&
                                        this.state.pageOfItems.length > 0 && this.state.pageOfItems.map(function(item,index) {
                                        return <tr>
                                            <td>{((this.state.pageNo-1)*Constants.RESULT_SET_SIZE)+(++index)}</td>
                                            <td>
                                            {(item.name && item.name !='')?item.name:'N/A'}

                                            {   
                                                this.state.isRegisteredUnderGST === "Y" && 
                                                <span><br/><b>Type:</b>{item.type}</span>
                                            }
                                            {   
                                                this.state.isRegisteredUnderGST === "Y" && 
                                                item.type===Constants.ITEM_TYPE_GOODS &&
                                                <span><br/><b>HSN Code:</b>{item.hsnCode?item.hsnCode:'N/A'}</span>
                                            }
                                            {   
                                                this.state.isRegisteredUnderGST === "Y" && 
                                                item.type===Constants.ITEM_TYPE_SERVICE &&
                                                <span><br/><b>SAC Code:</b>{item.sacCode?item.sacCode:'N/A'}</span>
                                            }
                                            </td>
                                            <td>{(item.description && item.description !='')?item.description:'N/A'}</td>
                                            <td>
                                            <i className="fa fa-inr" aria-hidden="true"></i>{(item.price && item.price !='')?item.price.toFixed(2):'N/A'}</td>
                                            <td>
                                            <Dropdown 
                                                items={itemsObj} 
                                                itemsIconsObj = {itemsIconsObj}
                                                selectedItem = {item}
                                                onDropDownItemClick = {this.onDropDownItemClick} 
                                            />
                                            </td>
                                        </tr>;
                                        },this)
                                    }  
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <Pagination 
                                totalLength ={this.state.totalCount} 
                                items={this.state.pageOfItems} 
                                onChangePage={this.onChangePage} 
                                currentPageNo = {this.state.pageNo} />
        </div>
     </div>
    </div>
    
    <Modal show={this.state.showModal} onHide={this.closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {this.state.operationType === "add" && "Add Item" }
                    {this.state.operationType === "edit" && "Edit Item" }
                    </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div id="wait" className="loader-login">
                    <img src={Loader} width="64" height="64" />
                </div>
                <form action="javascript:void(0);" onSubmit={this.handleSubmit} id="contact_form">
                { 
                    this.state.isRegisteredUnderGST === "Y" &&
                        <fieldset className="form-group">
                            <label for="customerType">
                            Type<span className="mandatory">*</span>
                            </label>
                            <br/>
                            <input type="radio" className="sal-radio" name="type" onChange={this.handleChange} value={Constants.ITEM_TYPE_GOODS} checked={this.state.type === Constants.ITEM_TYPE_GOODS}/><span className="contact-radio-label">{Constants.ITEM_TYPE_GOODS}</span>
                            <input type="radio" className="sal-radio" name="type" onChange={this.handleChange} value={Constants.ITEM_TYPE_SERVICE} checked={this.state.type === Constants.ITEM_TYPE_SERVICE}/><span className="contact-radio-label">{Constants.ITEM_TYPE_SERVICE}</span>
                        <br/>
                        <span className="err_msg">{this.state.errors.type}</span>
                        </fieldset>
                }

                    <fieldset className="form-group">
                        <label for="name">
                        Name<span className="mandatory">*</span>
                        </label>
                        <input type="text" className="form-control form-control-md" name="name" onChange={this.handleChange} value={this.state.name}/>
                        <span className="err_msg">{this.state.errors.name}</span>
                    </fieldset>
                    
                    <fieldset className="form-group">
                        <label for="description">
                        Description<span className="mandatory"></span>
                        </label>
                        <textarea rows="5" className="form-control" name="description" onChange={this.handleChange} value={this.state.description}></textarea>
                        <span className="err_msg">{this.state.errors.description}</span>
                    </fieldset>

                    {   this.state.hsnCodeDisplay && this.state.isRegisteredUnderGST === "Y" &&
                        <fieldset className="form-group" id="hsnCodeId">
                            <label for="name">
                            HSN Code<span className="mandatory"></span>
                            </label>
                            <input type="text" className="form-control form-control-md" name="hsnCode" onChange={this.handleChange} value={this.state.hsnCode}/>
                            <span className="err_msg">{this.state.errors.hsnCode}</span>
                        </fieldset>
                    }

                    {   this.state.sacCodeDisplay && this.state.isRegisteredUnderGST === "Y" &&
                        <fieldset className="form-group" id="sacCodeId">
                            <label for="name">
                            SAC Code<span className="mandatory"></span>
                            </label>
                            <input type="text" className="form-control form-control-md" name="sacCode" onChange={this.handleChange} value={this.state.sacCode}/>
                            <span className="err_msg">{this.state.errors.sacCode}</span>
                        </fieldset>
                    }

                    
                    <fieldset className="form-group">
                        <label for="name">
                        Selling Price<span className="mandatory">*</span>
                        </label>
                        <input type="text" className="form-control form-control-md" name="price" onChange={this.handleChange} value={this.state.price}/>
                        <span className="err_msg">{this.state.errors.price}</span>
                    </fieldset>
                
                    <div className="">
                        <button className="btn btn-info btn-md" type="button" onClick={this.closeModal}>Cancel</button>
                        <button className="btn btn-primary btn-md" type="submit" id="contact_submit">
                        Save
                        </button>
                    </div>
                    <span className="err_msg" id="resp-msg"></span>
                </form>
                <span className="err_msg" id="resp-msg"></span>
            </Modal.Body>
        </Modal>

        <Modal show={this.state.showDeleteModal} onHide={this.closeDeleteModal}>
            <Modal.Header closeButton>
                <Modal.Title>Warning!!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="wr-msg">Are you sure you want to delete this item?</div>
                <div className="text-center">
                    <button className="btn btn-info btn-md" type="button" onClick={this.closeDeleteModal}>No</button>
                    <button className="btn btn-primary btn-md" type="button" id="modal_button" onClick={this.deleteItem}>Yes</button>
                </div>
            </Modal.Body>
         
        </Modal>
        
        </Router>
    );
  }
}
export default Itemslist;
