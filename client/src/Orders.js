import React from 'react';
import ReactDOM from 'react-dom';

class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      'orders': []
    };
  }

  callAPI() {
      fetch("http://localhost:9000/getOrders")
          .then(res => res.json())
          .then(res => this.setState({ 'orders': res }));
  }

  componentWillMount() {
      this.callAPI();
  }

    render() {
    return (
      <ul>
        {this.state.orders.map( (order, index) => {
          return <h1> {order.company_name} </h1>
        })}
      </ul>
    );
  }
}

export default Orders;