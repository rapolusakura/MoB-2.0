import React from 'react'; 

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username : '', 
      password : '', 
    }
  }

    mySubmitHandler = (event) => {
    event.preventDefault();

    fetch("http://localhost:9000/login", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username, 
        password: this.state.password,
      }),
    }).then(response => response.text())
      .then(text => 
        alert(text));  
  }

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }

    render() {
    return (
      <form onSubmit={this.mySubmitHandler}>
        <p>Enter your email:</p>
        <input
        type='text'
        name='username'
        onChange={this.myChangeHandler}
      />
        <p>Enter your password:</p>
      <input
        type='text'
        name='password'
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