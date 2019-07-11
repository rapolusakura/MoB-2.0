import React from 'react'; 
import '../style.css'; 

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      'orders': []
    };
  }

  callAPI() {
      fetch("http://localhost:9000/getOutgoingOrders")
          .then(res => res.json())
          .then(res => this.setState({ 'orders': res }));
  }

  componentWillMount() {
      this.callAPI();
  }

    render() {

    const mystyle = {
      color: "black",
      backgroundColor: "white",
      padding: "10px",
      fontFamily: "Arial"
    };

    return (
      <ul>
        {this.state.orders.map( (order, index) => {
          return (
            <div className = "card">
            <div className = "container"> 

              <h1 style={mystyle}> {order.company_name}</h1>
              <h3> {order.date_created} </h3>
              <h2> {order.rate} Sol </h2> 
              <h3> Delivery Status: {order.delivery_status} </h3> 
              </div> 
            </div>
            ) 
        })}
      </ul>
    );
  }
}

export default Dashboard;