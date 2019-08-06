import React from 'react'; 
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  employer: Yup.string()
    .required('Required'), 
  phone_number: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('A phone number is required'),
  password: Yup.string()
    .min(1, 'Too short!')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
});

let attemptSignup = (values) => {
  fetch("/signup", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    }).then(response => response.text())
      .then(text => 
        alert(text));  
}

const Signup = () => (

  <div> 
    <h1>this is a sign up page for new users</h1> 
  <Formik 
    initialValues={{
        firstName: '',
        lastName: '',
        email: '', 
        employer: '', 
        phone_number: ''
      }}
    validationSchema={SignupSchema}
    onSubmit={values => {
          console.log('submitting', values);
          attemptSignup(values); 
    }}>
    {({ touched, errors }) => (
    <Form>
        <div> 
          <Field name="firstName" placeholder="First Name" />
          {errors.firstName && touched.firstName ? (
            <div>{errors.firstName}</div>
          ) : null}
          <br/>
          <Field name="lastName" placeholder = "Last Name" />
          {errors.lastName && touched.lastName ? (
            <div>{errors.lastName}</div>
          ) : null}
          <br/>

          <Field name="email" type="email" placeholder = "Email" />
          {errors.email && touched.email ? <div>{errors.email}</div> : null}
          <br/>
          search for your employer's razon commerical name
          <Field name="employer" type="text" placeholder = "Employer" />
          {errors.employer && touched.employer ? <div>{errors.employer}</div> : null}
          <br/>

          <Field name="phone_number" type="tel" placeholder = "Phone number"/>
          {errors.phone_number && touched.phone_number ? <div>{errors.phone_number}</div> : null}
          <br/>

          <Field name="password" type="password" placeholder = "Enter password" />
          {errors.password && touched.password ? <div>{errors.password}</div> : null}
          <br/>

          <Field name="confirmPassword" type="password" placeholder = "Confirm password" />
          {errors.confirmPassword && touched.confirmPassword ? <div>{errors.confirmPassword}</div> : null}
          <br/>
          
          <button type="submit">Submit</button>
        </div> 
    </Form>
    )}
  </Formik>
  </div> 
)

export default Signup; 
