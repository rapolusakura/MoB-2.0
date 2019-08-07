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
			isAdmin: false,
			isLoading: true
		}
	}

	verify = () => {
		const obj = getFromStorage('mail_on_bike');
		if (obj && obj.token) {
		const { token } = obj;
		// Verify token
		fetch('/verify?token=' + token)
		.then(res => res.json())
		.then(json => {
	  	if (json.success) {
		    this.setState({
		    	isLoggedIn: true, 
		    	isAdmin: json.isAdmin,
		    	isLoading: false
	    	}); 
		  }
		});
		} else {
			this.setState({ isLoading: false })
		}
	}

	loadingView = () => {
		return (
			<div> 
				Loading...
			</div>
		)
	}

	userAccountView = () => {
		return (
			<div> 
			<h1> User View </h1>
			<CreateOrder />
			<Logout setLoginStatus={this.setLoginStatus}/> 
			</div> 
		)
	}

	adminAccountView = () => {
		return (
		  <div>
		    <Header />
		    <Main />
		    <Logout setLoginStatus={this.setLoginStatus}/>
		  </div>
		)
	}

	loginView = () => {
		return (
			<div> 
		   		<Login setLoginStatus={this.setLoginStatus}/>
		   		<Signup/>
			</div> 
		)
	}

	setLoginStatus = (bool) => {
		this.setState({
	      isLoggedIn: bool
	    })
	}

	componentDidMount() {
		this.verify()
	}

	render() {
		if(this.state.isLoading) {
			return this.loadingView(); 
		} else {
			if(this.state.isLoggedIn) {
				if(this.state.isAdmin) {
					return this.adminAccountView(); 
				} return this.userAccountView(); 
			} return this.loginView(); 
		}
	}
}

