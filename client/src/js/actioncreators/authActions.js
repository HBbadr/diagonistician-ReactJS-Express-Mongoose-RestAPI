'use strict';

import * as ActionTypes from '../actiontypes/constants';
import { setErrorMessage, setSuccessMessage } from './messageActions';
import Auth from '../requests/auth';

import createBrowserHistory from 'history/createBrowserHistory' // this works like this
const history = createBrowserHistory();


function initRequest() {
	return {
		type: ActionTypes.INIT_REQUEST
	}
}

function registerSuccess() {
	return { type: ActionTypes.REGISTER_SUCCESS }
}

function loginSuccess(loggedIn) {
	return { type: ActionTypes.LOGIN_SUCCESS, loggedIn }
}
function logoutSuccess(loggedIn) {
	return { type: ActionTypes.LOGOUT_SUCCESS, loggedIn }
}

export function login(username, password, history) {
	return function (dispatch) {
		dispatch(initRequest()); // show spinner or something
		return Auth.login(username,password)
			.then((response) => {
				console.log('User logged in successfully', response);
				localStorage.setItem('jwt', response.token);
				dispatch(loginSuccess(Auth.loggedIn()));
				dispatch(requestUserDetails());
			})
			.then(dispatch(forwardTo(history, '/list')))
			.catch((err)=>dispatch(setErrorMessage(err.message)));
	}
}

export function requestUserDetails() {
	return function(dispatch){
		return Auth.getUserDetails()
			.then((user) => dispatch(getUserDetails(user)))
			.catch((err)=>dispatch(setErrorMessage(err.message)));
	}
}

export function logout(history) {
	return function (dispatch) {
		return Auth.logout()
			.then((res)=> {
				localStorage.removeItem('jwt');
				dispatch(logoutSuccess(Auth.loggedIn()));
				dispatch(forwardTo(history,'/list'));
				dispatch(setSuccessMessage(res.message));
			}).catch((err)=>dispatch(setErrorMessage(err.message)));
	}
}

export function register(user, history) {
	return function (dispatch) {
		dispatch(initRequest()); // show spinner or something
		return Auth.register(user)
			.then(()=> {
				dispatch(registerSuccess());
				dispatch(forwardTo(history, '/list'));
			})
			.catch((err)=> dispatch(setErrorMessage()));
			
	}
}

function forwardTo(history,location) {
	return {
			type : ActionTypes.FORWARD_TO,
			history,
			location
		}
}

function getUserDetails(details) {
	return {
		type: ActionTypes.USER_DETAILS,
		details
	}
}
