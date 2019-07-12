import React from 'react';
import '../style.css'

class Order extends React.Component {
  constructor(props) {
    super(props);
  }

    render() {

    const mystyle = {
      color: "black",
      backgroundColor: "white",
      padding: "10px",
      fontFamily: "Arial"
    };

      return (
        <div className = "card">
              <div className = "container"> 
                <h1 style={mystyle}> {this.props.company_name}</h1>
                <h3> {this.props.date_created} </h3>
                <h2> {this.props.rate} Sol </h2> 
                <h3> Delivery Status: {this.props.delivery_status} </h3> 
                </div> 
        </div>
    );
  }
}

export default Order;