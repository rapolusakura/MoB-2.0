import React from 'react';

class CompletedOrder extends React.Component {
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
      <h1> MoBiker: {this.state.assignedBiker.name} </h1> 
      </div>
    )
  }
}

export default CompletedOrder;