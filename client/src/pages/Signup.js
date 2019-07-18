import React from 'react'; 
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

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
  password: Yup.string()
    .min(1, 'Too short!')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
});

let attemptSignup = (values) => {
  fetch("http://localhost:9000/signup", {
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
        email: ''
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
          <Field name="lastName" placeholder = "Last Name" />
          {errors.lastName && touched.lastName ? (
            <div>{errors.lastName}</div>
          ) : null}
          <Field name="email" type="email" placeholder = "Email" />
          {errors.email && touched.email ? <div>{errors.email}</div> : null}
          <Field name="password" type="password" placeholder = "Enter password" />
          {errors.password && touched.password ? <div>{errors.password}</div> : null}

          <Field name="confirmPassword" type="password" placeholder = "Confirm password" />
          {errors.confirmPassword && touched.confirmPassword ? <div>{errors.confirmPassword}</div> : null}
          <button type="submit">Submit</button>
        </div> 
    </Form>
    )}
  </Formik>
  </div> 
)

export default Signup; 