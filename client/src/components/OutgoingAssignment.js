import React from 'react';
import { Formik, Form, Field } from 'formik';
import Button from '@material-ui/core/Button';

class OutgoingAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'availableBikers': [], 
      order: '',
      show: false
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

  alertMessage = () => {
    this.setState({
      show: true
    }); 
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
          this.alertMessage(); 
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
     <Text> Messages have been sent out! </Text>
     <Button variant="contained" color="primary" type="submit"> Asignarss MoBiker </Button> 
     this.state.show && <label> Messages have been sent out! </label> 
     </div>
    </Form>
    </Formik> 
     
    )
  }
}

export default OutgoingAssignment;