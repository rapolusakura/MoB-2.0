import React from 'react';
import '../style.css'
import OutgoingAssignment from './OutgoingAssignment'
import PendingCompletion from './PendingCompletion'
import CompletedOrder from './CompletedOrder'


class Order extends React.Component {
    constructor(props) {
      super(props);
    }
    
    render() {

    const status = this.props.order.delivery_status; 

    const mystyle = {
      color: "black",
      backgroundColor: "white",
      padding: "10px",
      fontFamily: "Arial"
    };

      return (
        <div className = "card">
              <div className = "container"> 
                <h3> ORDER ID: {this.props.order._id} </h3>
                <h1 style={mystyle}> {this.props.order.client_company_name}</h1>
                <h3> {this.props.order.date_created} </h3>
                <h2> {this.props.order.rate} Sol </h2> 
                <h3> Delivery Status: {status} </h3> 
                {status == 'outgoing' && <OutgoingAssignment order={this.props.order} /> }
                {status == 'pending' && <PendingCompletion order={this.props.order} /> }
                {status == 'completed' && <CompletedOrder order={this.props.order} /> }
                </div> 
        </div>
    );
  }
}

export default Order;