// Libraries imported through Webpack
import React from 'react';
import { render } from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
	withRouter
} from 'react-router-dom'

import createBrowserHistory from 'history/createBrowserHistory' // this works like this
const history = createBrowserHistory();

//REDUX imports
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

// Redux middleware
import thunk from 'redux-thunk'; // lets us dispatch() functions async
import logger from 'redux-logger'; // nice state console.logs

import AppReducer from './reducers/AppReducer';
import { fetchQuestions } from './actioncreators/questionActions'
import {requestUserDetails} from './actioncreators/authActions'
import Auth from './requests/auth';



// Components
import Application from './components/Application';
import NotFound  from './components/NotFound';
import QuestionList  from './components/QuestionList'
import QuestionView from './components/QuestionView';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';

const store = createStore(AppReducer, applyMiddleware(thunk, logger));

store.dispatch(fetchQuestions()); // fetching questions at the highest level of the app

if(store.getState().loggedIn && !store.getState().user._id){
	store.dispatch(requestUserDetails())
}

const PrivateQuestionRoute = ({component, ...rest}) => {
	return (
		<Route {...rest} render={ props => {
				if(Auth.loggedIn()){
					return (
						React.createElement(component, props)
					)
				} else {
					return (
						<Redirect to={{
							pathname: '/login',
							state: {
								from: props.location.pathname, // redirect back after login
								//params : props.match.params
							}
							}}
						/>
					)}
			
		} }/>
	)
};


render((
	<Provider store={store}>
		<Router history={history}>
			<Application>
				<Switch>
					<Route path="/list" component={QuestionList}/>
					<PrivateQuestionRoute path="/question/:qId"
					                      component={QuestionView}/>
					<Route path="/login"  component={LoginForm}/>
					<Route path="/register" component={RegisterForm}/>
					<Route path="*" component={NotFound}/>
				</Switch>
			</Application>
		</Router>
	</Provider>
	), document.getElementById('container'));
