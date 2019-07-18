import React from 'react'; 
import { Formik } from 'formik';

const Login = () => (
  <Formik 
    
initialValues={{ name: '' }}

validate={values => {
  let errors = {};
  if(!values.name) {
    errors.name = 'Name is required';
  }
  return errors;
}}
    
onSubmit={values => {
      console.log('submitting', values);
    }}>
    {({ handleSubmit, handleChange, values, touched, errors }) => (
    <form onSubmit={handleSubmit}>
    <div> 
      <input 
             onChange={handleChange} 
             value={values.name}
             name = "name"
             type="text" 
             placeholder="fuck">
      </input>
      <button>Submit</button>
      {errors.name && touched.name && <span style={{ color:"red", fontWeight: "bold" }}>
    {errors.name}    
    </span> }
      </div> 
    </form>
    )}
  </Formik>
)

export default Login; 
