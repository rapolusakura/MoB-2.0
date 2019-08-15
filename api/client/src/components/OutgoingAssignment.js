import React from 'react';
import { Formik, Form, Field } from 'formik';

class OutgoingAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'availableBikers': [], 
      order: ''
    };
  }

  getBikers = () => {
      fetch("/getBikersForToday")
          .then(res => res.json())
          .then(res => this.setState({ 'availableBikers': res }));
  }

  callAPI = (list) => {
    let ids = []; 
    for(var i in list) { ids.push(i); }

    fetch("/assignBikers", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bikerIds: ids,
        orderId: this.state.order._id
      }),
    })
  }

  componentWillMount() {
      this.getBikers();
      this.setState({order: this.props.order})
  }

  render() {
    return (   

    <Formik
      onSubmit = { values => {
          this.callAPI(values); 
      }}
    > 
    <Form> 
       <div> 
     {this.state.availableBikers.map( (biker, index) => {
        return (
          <div> 
          <label> 
            <Field type="checkbox" name={biker._id}/> 
            {biker.name} ({biker.num_current_orders}): {biker.district}
          </label> 
          </div> 
          )
      })}
     <br/>
     <button type="submit"> assign bikers </button> 
     </div>
    </Form>
    </Formik> 
     
    )
  }
}

export default OutgoingAssignment;