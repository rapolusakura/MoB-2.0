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
});


const Login = () => (
  <Formik 
    initialValues={{
        firstName: '',
        lastName: '',
        email: ''
      }}
    validationSchema={SignupSchema}
    onSubmit={values => {
          console.log('submitting', values);
    }}>
    {({ touched, errors }) => (
    <Form>
        <div> 
          <Field name="firstName" />
          {errors.firstName && touched.firstName ? (
            <div>{errors.firstName}</div>
          ) : null}
          <Field name="lastName" />
          {errors.lastName && touched.lastName ? (
            <div>{errors.lastName}</div>
          ) : null}
          <Field name="email" type="email" />
          {errors.email && touched.email ? <div>{errors.email}</div> : null}
          <button type="submit">Submit</button>
        </div> 
    </Form>
    )}
  </Formik>
)

export default Login; 
