import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter,
  Route,
  Link
} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

import App from './pages/App';

const app = document.getElementById('root'); 

ReactDOM.render((
   <HashRouter>
      <div>
        <Route exact path="/" component={Dashboard} />
      </div>
   </HashRouter >
), app); 

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

//      <label name = "company_name"> this will be the company name </label>
