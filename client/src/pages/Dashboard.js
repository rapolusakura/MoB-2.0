import React from 'react'; 
import Order from '../components/Order'
import Pusher from 'pusher-js';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      orders: []
    };
  }

  callAPI() {
      fetch("/getOutgoingOrders")
          .then(res => res.json())
          .then(res => this.setState({ 'orders': res }));
  }

  setupPusher() {
    Notification.requestPermission();
    const pusher = new Pusher('8f64842151a6eaee08bf', {
      cluster: 'mt1',
      useTLS: true
    });

    const orderChannel = pusher.subscribe('orders');
    const bikerChannel = pusher.subscribe('bikers'); 

    bikerChannel.bind('accepted_order', data => {
      this.callAPI();
      var notification = new Notification(`${data} just accepted an order!`);
    });

    orderChannel.bind('new_order', data => {
      this.callAPI();
      var notification = new Notification(`${data} ha creado un pedido.`);
      notification.onclick = function (event) {
          window.location.href = '/';
          event.preventDefault();
          notification.close();
      }
    });

    bikerChannel.bind('completed_order', data => {
      var notification = new Notification(`Order for ${data} has just been completed!`);
    });

  }

  componentWillMount() {
      this.callAPI();
  }

  componentDidMount() {
    this.setupPusher(); 
  }

    render() {
    return (
      <div> 
      <ul>
        {this.state.orders.map( (order, index) => {
          return (
            <Order order = {order} />
            ) 
        })}
      </ul>

      </div> 
    );
    }
}

export default Dashboard