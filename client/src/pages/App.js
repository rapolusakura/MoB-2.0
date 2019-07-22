import React from 'react'
import Header from '../components/Header'
import Main from '../components/Main'
import Login from './Login'; 
import Signup from './Signup'; 
import Logout from '../components/Logout'; 
import CreateOrder from '../components/CreateOrder'; 
import { getFromStorage } from '../utils/storage';

	
export default class App extends React.Component {
	constructor(props){
		super(props);
		this.state = { 
			isLoggedIn: false,
			isAdmin: false
		}
	}

	userAccountView = () => {
		return (
			<div> 
			<h1> User View </h1>
			<CreateOrder />
			<Logout /> 
			</div> 
		)
	}

	adminAccountView = () => {
		return (
		  <div>
		    <Header />
		    <Main />
		    <Logout />
		  </div>
		)
	}

	loginView = () => {
		return (
			<div> 
		   		<Login/>
		   		<Signup/>
			</div> 
		)
	}

	verify = () => {
		const obj = getFromStorage('mail_on_bike');
		if (obj && obj.token) {
		const { token } = obj;
		// Verify token
		fetch('http://localhost:9000/verify?token=' + token)
		.then(res => res.json())
		.then(json => {
	  	if (json.success) {
		    this.setState({
		    	isLoggedIn: true, 
		    	isAdmin: json.isAdmin
	    	}); 
		  }
		});
		}	
	}

	componentDidMount() {
		this.verify(); 
	}

	render() {
		if(this.state.isLoggedIn) {
			if(this.state.isAdmin) {
				return this.adminAccountView(); 
			} return this.userAccountView(); 
		} return this.loginView(); 
	}
}

