import React from 'react'; 
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import CompanySearch from '../components/CompanySearch'
import Button from '@material-ui/core/Button';
import '../style.css'

export default class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      companyId : null, 
      companyName : null, 
      companyRUC : null
    }
  }

 phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
 
 SignupSchema = () => { Yup.object().shape({
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
  phone_number: Yup.string()
    .required('A phone number is required')
    .matches(this.phoneRegExp, 'Phone number is not valid'),
  password: Yup.string()
    .min(1, 'Too short!')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
})}

 attemptSignup = (values) => {
  console.log('THIS IS THE COMPANY ID' , this.state.companyId)
  if(this.state.companyId != null ) {
  fetch("/signup", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: values.firstName, 
        lastName: values.lastName, 
        phone_number: values.phone_number, 
        email: values.email, 
        password: values.password,
        companyId: this.state.companyId, 
        company_name: this.state.companyName, 
        RUC: this.state.companyRUC
      }),
    }).then(response => response.json())
      .then(json => {
        if(json.success) {
          alert('Your account has been created! An agent from Mail on Bike will contact you shortly to verify your identity.')
        }
      });  
    }
}

companySelected = (company) => {
  this.setState({
    companyId: company._id, 
    companyName: company.official_company_name, 
    companyRUC: company.RUC
  })
}

render() {
  return (

  <div> 
    <h1>Sign Up </h1> 
  <Formik 
    initialValues={{
        firstName: '',
        lastName: '',
        email: '', 
        employer: '', 
        phone_number: ''
      }}
    validationSchema={this.SignupSchema}
    onSubmit={values => {
          console.log('submitting', values);
          this.attemptSignup(values); 
    }}>
    {({ touched, errors }) => (
    <Form>
        <div> 
          <Field className="field" name="firstName" placeholder="First Name" />
          {errors.firstName && touched.firstName ? (
            <div>{errors.firstName}</div>
          ) : null}
          <br/>
          <Field className="field" name="lastName" placeholder = "Last Name" />
          {errors.lastName && touched.lastName ? (
            <div>{errors.lastName}</div>
          ) : null}
          <br/>

          <Field className="field" name="email" type="email" placeholder = "Email" />
          {errors.email && touched.email ? <div>{errors.email}</div> : null}
          <br/>

          <CompanySearch companySelected={this.companySelected}/> 

          <Field className="field" name="phone_number" type="tel" placeholder = "Phone number"/>
          {errors.phone_number && touched.phone_number ? <div>{errors.phone_number}</div> : null}
          <br/>

          <Field className="field" name="password" type="password" placeholder = "Enter password" />
          {errors.password && touched.password ? <div>{errors.password}</div> : null}
          <br/>

          <Field className="field" name="confirmPassword" type="password" placeholder = "Confirm password" />
          {errors.confirmPassword && touched.confirmPassword ? <div>{errors.confirmPassword}</div> : null}
          <br/>
          
          <Button variant="contained" color="primary" type="submit">Signup</Button>        </div> 
    </Form>
    )}
  </Formik>
  </div> 
)
}
}