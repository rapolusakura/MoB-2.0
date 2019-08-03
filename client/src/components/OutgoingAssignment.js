import React from 'react';
import { Formik, Form, Field } from 'formik';

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

  callAPI = (list) => {
    fetch("http://localhost:9000/assignBikers", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        list,
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
  }

  render() {
    return (   

          <Formik
      onSubmit = { values => {
          console.log('submitting', values);
          //callAPI(values); 
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