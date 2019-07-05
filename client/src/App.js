import React, { Component } from 'react';
import Orders from './Orders'; 

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
      <Orders /> 
      </div>
    );
  }
}

export default App;