import React from 'react';
import { getFromStorage, deleteFromStorage } from '../utils/storage';

class Logout extends React.Component {
  constructor(props) {
    super(props);
  }

  logout = () => {
    const obj = getFromStorage('mail_on_bike');
    if (obj && obj.token) {
    deleteFromStorage('mail_on_bike')
    const { token } = obj;
    // Verify token
    fetch('/logout?token=' + token)
    .then(res => res.json())
    .then(
      this.props.setLoginStatus(false)
    )
    } 
  }

    render() {
      return (
        <div>
          <button onClick={this.logout}> click me to log out </button> 
        </div>
    );
  }
}

export default Logout;