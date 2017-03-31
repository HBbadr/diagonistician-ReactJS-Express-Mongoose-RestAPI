'use strict';

import * as ActionTypes from '../actiontypes/constants';
import Auth from '../requests/auth';


// The initial application state
const initialState = {
	questions : [],
	question: {},
	loginFormState: {
		username: '',
		password: ''
	},
	loggedIn: Auth.loggedIn(),
	successMessage: '',
	errorMessage: ''
};

export default function(state = initialState, action) {
	// make a COPY to the actual state (immutability) and merge it with the next questions
	switch (action.type){
		case ActionTypes.FETCH_QUESTIONS_SUCCESS:
			return {
				...state,
				questions: action.questions
			};
		case ActionTypes.FETCH_QUESTION_SUCCESS:
			return {
				...state,
				question: action.question,
			};
		
		case ActionTypes.SET_SUCCESS_MESSAGE: // add a hint that post was successful
				return {
					...state,
					successMessage: action.message
				};
		case ActionTypes.SET_ERROR_MESSAGE: // add a hint that post was successful
			return {
				...state,
				errorMessage: action.message
			};
		case ActionTypes.LOGIN_SUCCESS:
			return {
				...state,
				loggedIn: action.loggedIn
			};
		case ActionTypes.LOGOUT_SUCCESS:
			return {
				...state,
				loggedIn: action.loggedIn
			};
		default:
			return state;
	}
}