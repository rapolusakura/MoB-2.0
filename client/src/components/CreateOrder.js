import React from 'react'; 
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const CreateOrderSchema = Yup.object().shape({
  companyName: Yup.string()
    .required('Company name is equired'),
  rate: Yup.number()
    .positive()
    .required('Rate is required'),
});

let createOrderAPI = (values) => {
  fetch("http://localhost:9000/createOrder", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_name: values.companyName,
        rate: values.rate,
      }),
    }).then(res => res.json())
        .then(json => { 
        console.log('json', json); 
        if(json.success) {
          console.log("worked!!");
        }
    });
}

const orderForm = () => (
  <div> 
  <h1>This is the form to create orders</h1>
  <br/>
  <Formik 
    initialValues={{
        companyName: '', 
        rate: 0.0
      }}
    validationSchema={CreateOrderSchema}
    onSubmit={values => {
          console.log('submitting', values);
          createOrderAPI(values); 
    }}>
    {({ touched, errors }) => (
    <Form>
        <div> 
          <Field name="companyName" type="text" placeholder = "Company Name" />
          {errors.companyName && touched.companyName ? <div>{errors.companyName}</div> : null}
          <Field name="rate" type="text" placeholder = "Rate in sols" />
          {errors.rate && touched.rate ? <div>{errors.rate}</div> : null}
          <button type="submit">Submit</button>
        </div> 
    </Form>
    )}
  </Formik>
  </div> 
)

export default orderForm; 
