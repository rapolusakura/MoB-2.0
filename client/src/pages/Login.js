import React from 'react'; 
import { Formik, Field, Form, ErrorMessage } from 'formik';

const Login = () => (
  <Formik 
    
initialValues={{ name: '' }}
    
onSubmit={values => {
      console.log('submitting', values);
    }}>
    {({ handleSubmit, handleChange, values }) => (
    <form onSubmit={handleSubmit}>
      <input 
             onChange={handleChange} 
             value={values.name}
             name = "name"
             type="text" 
             placeholder="fuck">
      </input>
      <button>Submit</button>
    </form>
    )}
  </Formik>
)

export default Login; 
