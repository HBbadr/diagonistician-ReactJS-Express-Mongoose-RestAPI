'use strict';

// fetching from API
export const INIT_REQUEST = 'INIT_REQUEST';
export const FETCH_QUESTIONS_SUCCESS = 'FETCH_QUESTIONS_SUCCESS'; // all
export const FETCH_QUESTION_SUCCESS = 'FETCH_QUESTION_SUCCESS'; // single

export const REQUEST_FAILURE = 'REQUEST_FAILURE';

// posting question to API
export const POST_QUESTION_REQUEST = 'POST_QUESTION_REQUEST';

export const SET_SUCCESS_MESSAGE = 'SET_SUCCESS_MESSAGE';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';

//auth user interactions
export const REGISTER = 'REGISTER';
export const LOGIN = 'LOGIN';

// user interactions
export const ADD_QUESTION = 'ADD_QUESTION';
export const ADD_ANSWER = 'ADD_ANSWER';
export const VOTE = 'VOTE';