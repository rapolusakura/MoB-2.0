import React from 'react';
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './pages/App';
import Login from './pages/Login'; 
import Signup from './pages/Signup'; 
import { getFromStorage } from './utils/storage';

const app = document.getElementById('root'); 

function verify() {
	const obj = getFromStorage('mail_on_bike');
	if (obj && obj.token) {
	const { token } = obj;
	// Verify token
	fetch('http://localhost:9000/verify?token=' + token)
	.then(res => res.json())
	.then(json => {
  	if (json.success) {
	    return userAccountView(); 
	  } else {
	  	return loginView(); 
	  }
	});
	} else { return loginView(); }
}


const userAccountView = () => {
	return (
	<BrowserRouter>
		<div> 
	   		<App/>
		</div> 
   </BrowserRouter >
	)
}

const loginView = () => {
	return (

	<BrowserRouter>
		<div> 
	   		<Login/>
	   		<Signup/>
		</div> 
   </BrowserRouter >
		
	)
}

render(verify(), app); 