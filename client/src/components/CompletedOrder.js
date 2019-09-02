import React from 'react';

class PendingCompletion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      assignedBiker: []
    }
  }

  callAPI = () => {

  fetch("/getBikerDetails", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bikerId: this.props.order.assigned_messenger_id
      }),
    }).then(res => res.json())
      .then(json => { 
        this.setState({
          assignedBiker : json
        })
    });
  }

  componentWillMount() {
      this.callAPI()
  }

  render() {
    return (   
      <div>
      <h1> Completed by: {this.state.assignedBiker.name} </h1> 
      </div>
    )
  }
}

export default PendingCompletion;