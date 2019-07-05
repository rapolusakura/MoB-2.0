import React from 'react';
import Order from './Order'; 

class DashboardPanel extends React.Component {
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
          return (
            <div>
              <h1> {order.company_name} </h1>
              <h3> {order.date_created} </h3>
              <h3> isDelivered: {order.isDelivered.toString()} </h3> 
            </div>
            ) 
        })}
      </ul>
    );
  }
}

export default DashboardPanel;