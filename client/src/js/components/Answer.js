import React from 'react';

import Votes from './Votes';
import FormattedDate from './FormattedDate';

const Answer = (props) => {
	const onVoteChange = arg => {
		console.log("on vote ", arg);
		props.onVoteCountChanged(arg, props.id);
	};
	return (
		<div className="grid-parent answer-container">
			<div className="grid-10">
				<Votes votes={props.votes} onVote={onVoteChange}/>
			</div>
			<div className="grid-90">
				<p style={{'color': 'black', 'fontWeight': 600}}>{props.text}</p>
				<div className="align-right">
					<small>Answered <strong><FormattedDate date={props.createdAt}/></strong> | </small>
					<small>Modified <strong><FormattedDate date={props.updatedAt}/></strong></small>
				</div>
			</div>
		</div>
	)
	
};

export default Answer;