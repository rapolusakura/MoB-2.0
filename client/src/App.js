import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DashboardPanel from './components/DashboardPanel'; 
import './style.css'; 

class App extends Component {
  constructor(props) {
    super(props);
  }

  async fuckme() {
    const response = await fetch("http://localhost:9000/createOrders", {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': "*",
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  }

  render() {
    return (
      <div className="App">
      you got this!!  
      <button onClick={this.fuckme}> click this to make an order</button> 
      <DashboardPanel /> 


      </div>
    );
  }
}

export default App;