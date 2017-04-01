'use strict';
/*
 * Keeping API requests organized
 * */

import makeRequest from '../fetchHelper';

const path = '/auth';

export default class Auth {
	static login(user,pass){
		const credentials = btoa(`${user}:${pass}`);
		return makeRequest(`${path}/login`, "POST", null, null, { Authorization: `Basic ${credentials}`})
	}
	
	static register(user){
		return makeRequest(`${path}/register`, "POST", user )
	}
	/* Checks if anybody is logged in
	 * @return {boolean} True if there is a logged in user, false if there isn't
	 */
	static loggedIn() {
		return !!localStorage.getItem('jwt');
	}
	static logout(){ // does nothing but sending GET request with token
		return makeRequest(`${path}/logout`, "GET")
	}
}