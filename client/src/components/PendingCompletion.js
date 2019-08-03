import React from 'react';

class PendingCompletion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assignedBiker: null
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
      this.setState({assignedBiker: json.name})
    })
  }

  componentWillMount() {
      this.callAPI()
  }

  render() {
    return (   
      <div>
      <h1> {this.props.order.assigned_messenger_id} </h1> 
      <h1> {this.state.assignedBiker} </h1> 
      </div>
    )
  }
}

export default PendingCompletion;