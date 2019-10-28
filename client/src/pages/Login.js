import React from 'react'; 
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  setInStorage,
  getFromStorage,
} from '../utils/storage';
import Button from '@material-ui/core/Button';
import '../style.css'

export default class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .min(4, 'Too short!')
    .required('Password is required'),
  });

  attemptSignIn = (values) => {
  fetch("/signin", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }).then(res => res.json())
        .then(json => { 
        if(json.success) {
          setInStorage('mail_on_bike', { token: json.token });
          this.props.setLoginStatus(true); 
        }
    });  
  }

  render() {
    return (
      <div> 
      <h1>Log In</h1>
      <br/>
      <Formik 
        initialValues={{
            email: ''
          }}
        validationSchema={this.LoginSchema}
        onSubmit={values => {
              this.attemptSignIn(values); 
        }}>
        {({ touched, errors }) => (
        <Form>
            <div> 
              <Field className = "field" name="email" type="email" placeholder = "Ingresar correo electrónico" />
              {errors.email && touched.email ? <div>{errors.email}</div> : null}
              <br/>
              <Field className = "field" name="password" type="password" placeholder = "Ingresar contraseña" />
              {errors.password && touched.password ? <div>{errors.password}</div> : null}
              <br/>
              <br/>
              <Button variant="contained" color="primary" type="submit">Login</Button>
            </div> 
        </Form>
        )}
      </Formik>
      </div> 
    )
  }

}