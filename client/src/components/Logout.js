import React from 'react';
import { getFromStorage, deleteFromStorage } from '../utils/storage';
import Button from '@material-ui/core/Button';

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
          <Button variant="contained" color="primary" onClick={this.logout}> Salir del Sistema </Button> 
        </div>
    );
  }
}

export default Logout;