import React from 'react';

class OutgoingAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'availableBikers': []
    };
  }

  getBikers = () => {
      fetch("http://localhost:9000/getBikersForToday")
          .then(res => res.json())
          .then(res => this.setState({ 'availableBikers': res }));
  }

  componentWillMount() {
      this.getBikers();
  }

  render() {
    return (
      <ul> 
      {this.state.availableBikers.map( (biker, index) => {
        return (
            <h1> {biker.name} </h1> 
          )
      })}
      </ul> 
    )
  }
}

export default OutgoingAssignment;