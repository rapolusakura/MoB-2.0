import React, { Component } from 'react';

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
      fetch("http://localhost:9000/getOrders")
          .then(res => res.text())
          .then(res => this.setState({ apiResponse: res }));
  }

  componentWillMount() {
      this.callAPI();
  }

  render() {
    return (
      <div className="Orders">
            <label>{this.state.apiResponse}</label>
      </div>
    );
  }
}

export default Orders;