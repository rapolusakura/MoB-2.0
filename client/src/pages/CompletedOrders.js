import React from 'react'; 
import Order from '../components/Order'


export default class CompletedOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      'orders': []
    };
  }

  callAPI() {
      fetch("http://localhost:9000/getCompletedOrders")
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
            <Order 
            company_name = {order.company_name} 
            date_created = {order.date_created} 
            rate = {order.rate} 
            delivery_status = {order.delivery_status}>
            </Order>
            ) 
        })}
      </ul>
    );
  }
}