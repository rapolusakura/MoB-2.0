import React from 'react'; 
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import "./../importedCSS/vendor/bootstrap/css/bootstrap.min.css"
import "./../importedCSS/fonts/font-awesome-4.7.0/css/font-awesome.min.css"
import "./../importedCSS/vendor/animate/animate.css"
import "./../importedCSS/vendor/css-hamburgers/hamburgers.min.css"
import "./../importedCSS/vendor/select2/select2.min.css"
import "./../importedCSS/css/util.css"
import "./../importedCSS/css/main.css"

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
  <div class="contact1">
    <div class="container-contact1">
  <span class="contact1-form-title">
        Create an Order
  </span>
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
          <Field name="companyName"  class="input1" type="text" placeholder = "Company Name" />
          {errors.companyName && touched.companyName ? <div>{errors.companyName}</div> : null}
          <br/>
          <Field name="rate"  class="input1" type="text" placeholder = "Rate in sols" />
          {errors.rate && touched.rate ? <div>{errors.rate}</div> : null}
          <br/> 
          <button class="contact1-form-btn" type="submit">Submit</button>
        </div> 
    </Form>
    )}
  </Formik>
  </div> </div>
)

export default orderForm; 
