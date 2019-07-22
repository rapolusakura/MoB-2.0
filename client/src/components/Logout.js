import React from 'react';
import { getFromStorage } from '../utils/storage';

class Logout extends React.Component {
  constructor(props) {
    super(props);
  }

  logout = () => {
    const obj = getFromStorage('mail_on_bike');
    if (obj && obj.token) {
    const { token } = obj;
    // Verify token
    fetch('http://localhost:9000/logout?token=' + token)
    .then(res => res.json());
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