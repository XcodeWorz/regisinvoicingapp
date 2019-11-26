import React from 'react';
import {
    BrowserRouter as Router
} from 'react-router-dom';

class Dropdown extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            displayMenu: false
        };

        this.showDropdownMenu = this.showDropdownMenu.bind(this);
        this.hideDropdownMenu = this.hideDropdownMenu.bind(this);

   };

    showDropdownMenu(event) {
        event.preventDefault();
        this.setState({ displayMenu: true }, () => {
        document.addEventListener('click', this.hideDropdownMenu);
        });
    }

    hideDropdownMenu() {
        this.setState({ displayMenu: false }, () => {
            document.removeEventListener('click', this.hideDropdownMenu);
        });
    }

    onDropDownItemClick(item,indexVal)
    {
        this.props.onDropDownItemClick(item,indexVal)
    }

    render() {
        return (
            <Router>
                <div  className="dropdownmenu">
                    <span onClick={this.showDropdownMenu} className="menu-dd"><span className="material-icons MuiIcon-root" aria-hidden="true">more_vert</span></span>
                    { 
                        this.state.displayMenu ? (
                            <ul>
                                {
                                    this.props.items.length > 0 && this.props.items.map(function(itemVal,indexVal) {
                                        return <li onClick={this.onDropDownItemClick.bind(this,this.props.selectedItem,indexVal)}>
                                        <a href="javascript:void(0);" >

                                        <i className="material-icons">{this.props.itemsIconsObj[indexVal]}</i>{itemVal}</a></li>
                                    },this)
                                }  
                            </ul>
                        ):
                        (
                            null
                        )
                    }
                </div>
            </Router>
        );
    }
}

export default Dropdown;