import React from 'react'; 

export default class CreateOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name : '', 
      rate : 0, 
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
      <form onSubmit={this.mySubmitHandler}>
        <p>Enter your company name:</p>
        <input
        type='text'
        name='name'
        onChange={this.myChangeHandler}
      />
        <p>Enter the rate:</p>
      <input
        type='text'
        name='rate'
        onChange={this.myChangeHandler}
      />
      <br/> 
      <br/>
      <input
        type='submit'
      />
      </form>
    )
  }
}