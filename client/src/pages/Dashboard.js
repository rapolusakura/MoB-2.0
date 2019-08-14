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

    const channel = pusher.subscribe('chat');

    channel.bind('message', data => {
      console.log(data); 
      this.callAPI();
      var notification = new Notification("A new order was just created. Check it out.");
      notification.onclick = function (event) {
          window.location.href = '/';
          event.preventDefault();
          notification.close();
      }
    });


    
    // pusher.subscribe('notifications')
    //         .bind('post_updated', function (post) {
    //             // if we're on the home page, show an "Updated" badge
    //             if (window.location.pathname === "/") {
    //                 $('a[href="/posts/' + post._id + '"]').append('<span class="badge badge-primary badge-pill">Updated</span>');
    //             }
    //             
    //             notification.onclick = function (event) {
    //                 window.location.href = '/posts/' + post._id;
    //                 event.preventDefault();
    //                 notification.close();
    //             }
    // });
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