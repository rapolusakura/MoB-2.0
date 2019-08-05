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
      fetch("/getCompletedOrders")
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
            <Order order = {order} />
            ) 
        })}
      </ul>
    );
  }
}