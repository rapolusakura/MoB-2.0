import React from 'react'; 
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import MapView from './Map'; 
import Maps from './test';

const CreateOrderSchema = Yup.object().shape({
  companyName: Yup.string()
    .required('Company name is required'),
  destContact: Yup.string()
    .required('the contact name of the destination is required'),
  destPhone: Yup.number()
    .positive()
    .required('the phone number of the dest is required'),  
});

let createOrderAPI = (values) => {
  fetch("/createOrder", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        company_name: values.companyName,
      }),
    }).then(res => res.json())
        .then(json => { 
        console.log('json', json); 
        if(json.success) {
          console.log("worked!!");
        }
    });
}

const orderForm = (props) => (
  <div>
    <div>
  <Formik 
    initialValues={{
        companyName: '', 
        mode: false
      }}
    validationSchema={CreateOrderSchema}
    onSubmit={values => {
          console.log('submitting', values);
          createOrderAPI(values); 
    }}>
    {({ touched, values, errors }) => (
    <Form>
        <div> 
          <h2> client info </h2> 
          <Field name="companyName" type="text" placeholder = "Company Name" />
          {errors.companyName && touched.companyName ? <div>{errors.companyName}</div> : null}
          <br/> 
          <Field name="origin-notes" type="text" placeholder = "Enter any special notes.. instructions on getting there, etc" />
          <br/>
          <Field name="type-of-load" type="text" placeholder = "Enter the type of load (document, etc.)" /> 
          <br/>
          <label> 
          <Field name="mode" type="checkbox" checked={values.mode}/> 
          Round-trip delivery?
          </label> 
          <br/>

          <h2> destination info </h2> 
          <Field name="destContact" type="text" placeholder = "Dest contact name" /> 
          {errors.destContact && touched.destContact ? <div>{errors.destContact}</div> : null}
          <br/>
          <Field name="destCompany" type="text" placeholder = "Dest company" /> 
          <br/>
          <Field name="destPhone" type="text" placeholder = "Dest phone number" /> 
          {errors.destPhone && touched.destPhone ? <div>{errors.destPhone}</div> : null}
          <br/>
          <Field name="dest-notes" type="text" placeholder = "Enter any special notes.. instructions on getting there, etc" />
          <br/>
          <div style={{ margin: '100px' }}>
          <Maps />
      </div>

          <button type="submit">Submit</button>
        </div> 
    </Form>
    )}
  </Formik>
  </div> </div>
)

export default orderForm; 
