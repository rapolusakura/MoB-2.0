import React from 'react';
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './pages/App';

const app = document.getElementById('root'); 

render((
   <BrowserRouter>
   		<App />
   </BrowserRouter >
	), app); 