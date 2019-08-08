import React from 'react';
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './pages/App';
import Fuckme from './components/test'

const app = document.getElementById('root'); 

render(
	<BrowserRouter>
		<div> 
	   		<App/>
		</div> 
   </BrowserRouter>, app); 

