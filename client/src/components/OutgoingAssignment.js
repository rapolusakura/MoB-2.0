import React from 'react';
import { Formik, Form, Field } from 'formik';

class OutgoingAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'availableBikers': [], 
      orderId: ''
    };
  }

  getBikers = () => {
      fetch("http://localhost:9000/getBikersForToday")
          .then(res => res.json())
          .then(res => this.setState({ 'availableBikers': res }));
  }

  callAPI = (list) => {

    let ids = []; 
    for(var i in list) { ids.push(i);   }

    fetch("http://localhost:9000/assignBikers", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bikerIds: ids,
        orderId: this.state.orderId
      }),
    }).then(res => res.json())
        .then(json => { 
        console.log('json', json); 
        if(json.success) {
          console.log("successfully assigned bikers!!");
        }
    });
  }

  componentWillMount() {
      this.getBikers();
      this.setState({orderId: this.props.orderId})
  }

  render() {
    return (   

    <Formik
      onSubmit = { values => {
          console.log('submitting', values);
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
            {biker.name} ({biker.num_current_orders})
          </label> 
          </div> 
          )
      })}
     <button type="submit"> assign bikers </button> 
     </div>
    </Form>
    </Formik> 
     
    )
  }
}

export default OutgoingAssignment;