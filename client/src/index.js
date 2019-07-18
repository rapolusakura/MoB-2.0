import React from 'react';
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './pages/App';
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 

const app = document.getElementById('root'); 

render((
   <BrowserRouter>
   		<Login/>
   		<Signup/>
   </BrowserRouter >
	), app); 