import React, { Component } from 'react';
class Logout extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        localStorage.removeItem('loggedInUserDetails');
        this.props.history.push('/');
    }

 render() {
    return null;
  }
}
export default Logout;
