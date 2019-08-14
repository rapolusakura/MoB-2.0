import React from 'react'; 
import Order from '../components/Order'
let Pusher = require('pusher');

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      'orders': []
    };
  }

  callAPI() {
      fetch("/getOutgoingOrders")
          .then(res => res.json())
          .then(res => this.setState({ 'orders': res }));
  }

  setupPusher() {
    // var pusher = new Pusher('8f64842151a6eaee08bf', {cluster: 'mt1'});
    // // retrieve the socket ID once we're connected

    // var channel = pusher.subscribe('my-channel');
    //   channel.bind('my-event', function(data) {
    //   alert('An event was triggered with message: ' + data.message);
    // });

    // Notification.requestPermission();
    // pusher.subscribe('notifications')
    //         .bind('post_updated', function (post) {
    //             // if we're on the home page, show an "Updated" badge
    //             if (window.location.pathname === "/") {
    //                 $('a[href="/posts/' + post._id + '"]').append('<span class="badge badge-primary badge-pill">Updated</span>');
    //             }
    //             var notification = new Notification(post.title + " was just updated. Check it out.");
    //             notification.onclick = function (event) {
    //                 window.location.href = '/posts/' + post._id;
    //                 event.preventDefault();
    //                 notification.close();
    //             }
    // });
  }

  componentWillMount() {
      this.callAPI();
      this.setupPusher(); 
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

export default Dashboard