import React, { Component } from 'react';
import {Link} from "react-router"; 
import Dashboard from '../components/Dashboard'; 
import '../style.css'; 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name : '', 
      rate : 0, 
      isDelivered : ''
    }
  }

  mySubmitHandler = (event) => {
    event.preventDefault();

    fetch("http://localhost:9000/createOrder", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_name: this.state.name,
        rate: this.state.rate,
        isDelivered: this.state.isDelivered
      }),
    });
    alert("You are submitting " + this.state.name + "'s order");
  }

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }

  render() {
    return (

      <div className="App">
        <h1>fuck</h1>
        <form onSubmit={this.mySubmitHandler}>
        <p>Enter your company name:</p>
        <input
        type='text'
        name='name'
        onChange={this.myChangeHandler}
      />
        <p>Enter the fare:</p>
      <input
        type='text'
        name='rate'
        onChange={this.myChangeHandler}
      />
        <p>Enter if delivered or not:</p>
      <input
        type='text'
        name='isDelivered'
        onChange={this.myChangeHandler}
      />
      <input
        type='submit'
      />
      </form>
      <Dashboard /> 
      </div>
    );
  }
}

export default App;