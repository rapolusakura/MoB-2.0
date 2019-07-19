import React from 'react'
import Header from '../components/Header'
import Main from '../components/Main'
import Login from './Login'; 
import Signup from './Signup'; 
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
			<h1> hahha fuck you youre just a pleb user </h1> 
		)
	}

	adminAccountView = () => {
		return (
		  <div>
		    <Header />
		    <Main />
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
		    this.setState({isLoggedIn: true}); 
		  }
		});
		}	
	}

	componentDidMount() {
		this.verify(); 
	}

	render() {
		return this.state.isLoggedIn ?  this.userAccountView() : this.loginView()
	}
}

