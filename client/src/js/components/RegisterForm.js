/**
 * Created by Iulia on 3/13/17.
 */
import React, {Component, PropTypes} from 'react';
import { withRouter, Redirect } from 'react-router';

//redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../actioncreators/authActions';

import makeRequest from '../fetchHelper';


class RegisterForm extends Component{
	constructor(props){
		super(props);
		this.register = props.actions.register;
	}
	static propTypes = {
		loggedIn: PropTypes.bool,
		errorMessage: PropTypes.string
	};
	state = { username : '', password: '', confirmPassword: ''};
	onInputChange = (event) => {
		const what = event.target.name;
		this.setState({
			[what]: event.target.value
		})
	};
	onSubmit = (event) => {
		event.preventDefault();
		let { username, password, confirmPassword } = this.state;
		password = password.trim();
		confirmPassword = confirmPassword.trim();
		if (!username || !password || !confirmPassword) {
			alert('Please type username and password!');
			return;
		}
		if ( confirmPassword != password) {
			alert('Passwords don\'t match!');
			return;
		}
		this.register({ username, password, confirmPassword }, this.props.history)
			.then(()=>{
				console.log("need to redirect me to questions");
			});
		
	};
	componentWillUnmount(){
		this.setState({ username : '', password: '', confirmPassword: ''});
	}
	render(){
		const errorMessage =  this.props.errorMessage;
		const loggedIn = this.props.loggedIn;
		return (
			<form className="question-form" onSubmit={this.onSubmit}>
				{loggedIn && <Redirect to="/list"/>}
				<h1>Sign up</h1>
				{!!errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
				
				<div className="grid-parent">
					<div className="grid-100">
						<input type="text" placeholder="Username"
					          value={this.state.username} name="username"
					          onChange={this.onInputChange}
						/>
						<input type="password" placeholder="Password"
							value={this.state.password}
						    name="password" onChange={this.onInputChange}
						/>
						<input type="password" placeholder="Confirm Password"
						       value={this.state.confirmPassword}
						       name="confirmPassword" onChange={this.onInputChange}
						/>
						<input className="button-primary ask-question-button" type="submit" value="Sign Up"/>
					</div>
				</div>
			</form>
		)
	}
}

function mapStateToProps(state) {
	return {
		errorMessage: state.errorMessage,
		loggedIn: state.loggedIn
	};
}

function mapDispatchedActionsToProps(dispatch) {
	return {
		actions: bindActionCreators(Actions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchedActionsToProps)(RegisterForm)