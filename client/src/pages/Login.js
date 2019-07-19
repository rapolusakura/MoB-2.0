import React from 'react'; 
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  setInStorage,
  getFromStorage,
} from '../utils/storage';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .min(3, 'Too short!')
    .required('Password is required'),
});

let attemptSignIn = (values) => {
  fetch("http://localhost:9000/signin", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }).then(res => res.json())
        .then(json => { 
        console.log('json', json); 
        if(json.success) {
          setInStorage('mail_on_bike', { token: json.token });
        }
    });  
}

let verify = () => {
const obj = getFromStorage('mail_on_bike');
  if (obj && obj.token) {
    const { token } = obj;
    // Verify token
    fetch('http://localhost:9000/verify?token=' + token, {  headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }})
      .then(res => res.json())
      .then(json => {
          console.log("worked and set the cokie "); 
        });
      } else {
      console.log("failed to find a token")
  }
}

const Login = () => (
  <div> 
  <h1>this is a login page for people who have accounts aleady</h1>
  <button onClick={verify}> click to verify </button> 
  <Formik 
    initialValues={{
        email: ''
      }}
    validationSchema={LoginSchema}
    onSubmit={values => {
          console.log('submitting', values);
          attemptSignIn(values); 
    }}>
    {({ touched, errors }) => (
    <Form>
        <div> 
          <Field name="email" type="email" placeholder = "Email" />
          {errors.email && touched.email ? <div>{errors.email}</div> : null}
          <Field name="password" type="password" placeholder = "Enter password" />
          {errors.password && touched.password ? <div>{errors.password}</div> : null}
          <button type="submit">Submit</button>
        </div> 
    </Form>
    )}
  </Formik>
  </div> 
)

export default Login; 
