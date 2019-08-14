import React from 'react'; 
import Order from '../components/Order'
import Pusher from 'pusher-js';
import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      text: '',
      username: '',
      chats: [],
      orders: []

    };
  }

  callAPI() {
      fetch("/getOutgoingOrders")
          .then(res => res.json())
          .then(res => this.setState({ 'orders': res }));
  }

  setupPusher() {

    const username = window.prompt('Username: ', 'Anonymous');
    this.setState({ username });
    const pusher = new Pusher('8f64842151a6eaee08bf', {
      cluster: 'mt1',
      encrypted: true
    });
    const channel = pusher.subscribe('chat');
    channel.bind('message', data => {
      this.setState({ chats: [...this.state.chats, data], test: '' });
    });
    this.handleTextChange = this.handleTextChange.bind(this);

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

  handleTextChange(e) {
  if (e.keyCode === 13) {
    fetch("/message", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        message: this.state.text
      })
    })
  } else {
    this.setState({ text: e.target.value });
  }
}

  componentWillMount() {
      this.callAPI();
      this.setupPusher(); 
  }

  componentDidMount() {
    this.setupPusher(); 
  }

    render() {
    return (
      <div> 

      <h1 className="App-title">Welcome to React-Pusher Chat</h1>
            <section>
              <ChatList chats={this.state.chats} />
              <ChatBox
                text={this.state.text}
                username={this.state.username}
                handleTextChange={this.handleTextChange}
              />
            </section>
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