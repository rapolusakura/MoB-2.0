import React from 'react';
import OutgoingAssignment from './OutgoingAssignment'
import PendingCompletion from './PendingCompletion'
import CompletedOrder from './CompletedOrder'
import '../style.css'
const moment = require('moment'); 

class Order extends React.Component {
    constructor(props) {
      super(props);
    }
    
    render() {

    const status = this.props.order.delivery_status; 

    const mystyle = {
      color: "black",
      backgroundColor: '#6f90ca',
      padding: "10px",
      fontFamily: "Arial"
    };

    const mapsNavLink = `https://www.google.com/maps/dir/?api=1&origin=${this.props.order.startLat},${this.props.order.startLng}&destination=${this.props.order.endLat},${this.props.order.endLng}&travelmode=walking`
    const time = this.props.order.timestamp; 

      return (
        <div className = "card">
              <div className = "container"> 
                <h3> ORDER ID: {this.props.order._id} </h3>
                <h1 style={mystyle}> {this.props.order.client_company_name}</h1>
                <h3> {moment(time).format('MMMM Do YYYY, h:mm:ss a')}</h3>
                <h3> Client Contact: {this.props.order.client_contact_name}</h3>
                <h2> {this.props.order.rate} Sol </h2> 
                <h4> {this.props.order.special_instructions} </h4>
                <a href={mapsNavLink}> Route </a> 
                <h3> Origin: {this.props.order.client_address} </h3> 
                <h3> Destination: {this.props.order.dest_address} </h3> 
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