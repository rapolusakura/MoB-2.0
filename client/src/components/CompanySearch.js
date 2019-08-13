import React from 'react'; 
import { Formik, Form, Field, FastField} from 'formik';

class CompanySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      company: null
    };
  }

  searchForCompany(value) {
      console.log(value); 
      // fetch("/getPendingOrders")
      //     .then(res => res.json())
      //     .then(res => this.setState({ 'orders': res }));
  }

  componentWillMount() {
  }

    render() {    
    return (
      <div>
      <Formik 
        onSubmit={values => {
            console.log('submitting', values);
            this.searchForCompany(values); 
      }}> 
      {({ values }) => (
        <Form> 
        <FastField name="company_search" type="text" placeholder = "Enter the RUC or the razon commercial name"> </FastField>
        <button type="submit"> Search for company </button>      
        </Form> 
      )}
      </Formik> 
      </div> 
    )
  }
}

export default CompanySearch