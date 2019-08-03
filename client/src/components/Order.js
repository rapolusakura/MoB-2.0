import React from 'react';
import '../style.css'
import OutgoingAssignment from './OutgoingAssignment'


class Order extends React.Component {
  constructor(props) {
    super(props);
  }

    render() {

    const status = this.props.delivery_status; 

    const mystyle = {
      color: "black",
      backgroundColor: "white",
      padding: "10px",
      fontFamily: "Arial"
    };

      return (
        <div className = "card">
              <div className = "container"> 
                <h3> ORDER ID: {this.props.id} </h3>
                <h1 style={mystyle}> {this.props.company_name}</h1>
                <h3> {this.props.date_created} </h3>
                <h2> {this.props.rate} Sol </h2> 
                <h3> Delivery Status: {status} </h3> 
                {status == 'outgoing' && <OutgoingAssignment orderId={this.props.id} /> }
                </div> 
        </div>
    );
  }
}

export default Order;