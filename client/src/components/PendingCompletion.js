import React from 'react';

class PendingCompletion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bikerName: null,
      bikerPhone: null, 
      bikerNumOrders: null
    };
  }

  callAPI = () => {
    fetch("http://localhost:9000/getBikerDetails", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bikerId: this.props.order.assigned_messenger_id
      }),
    })
    .then( res => res.json())
    .then( json => {
      this.setState({
        bikerName: json.name, 
        bikerPhone: json.phone_number, 
        bikerNumOrders: json.num_current_orders
      })
    })
  }

  componentWillMount() {
      this.callAPI()
  }

  render() {
    return (   
      <div>
      <h1> {this.state.bikerName} ({this.state.bikerNumOrders}) </h1> 
      <h1> {this.state.bikerPhone} </h1> 
      </div>
    )
  }
}

export default PendingCompletion;