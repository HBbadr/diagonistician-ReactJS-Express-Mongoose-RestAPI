"use strict";

var express = require("express");
var router = express.Router();
var Question = require('./models');

//GET /questions
router.get('/',function(req,res,next){
	var query = Question.find({}, null); // null is for projection
	query.sort({ createdAt: - 1});
	query.exec()
		.then(function(questions){
			res.status(200).json(questions)})
		.catch(function(err){
			return next(err);
		});
});

//GET by id /questions/:qId

// these router.param methods check if some param is in the route requested and does something
router.param('qId', function(req,res,next){
	Question.findOne({_id: req.params.qId})// or use findById(req.params.qId)
	.exec()
	.then(function(question){
		// handle the id Not Found possibility
		if (!question){
			var err = new Error("Question not found.");
			err.status = 404;
			next(err); // this error will be caught by the errorHandler
		} else {
			req.questionFound = question;
			next(); //will pass req.questionFound to the route
		}
	})
	.catch(function(err){
		next(err);
	})
});

router.param('aId', function(req,res,next){
	req.answer = req.questionFound.answers.id(req.params.aId);//this id() retrieves the sub document with the respective id
	if (!req.answer){
		var err = new Error("Answer not found.");
		err.status = 404;
		next(err); // this error will be caught by the errorHandler
	} else { next(); } //will pass req.answer to the route
});

router.get('/:qId',function(req,res, next){
	res.status(200).json(req.questionFound.publicFormat());
});

//POST /questions
router.post('/',function(req,res,next){
	var newQuestion = new Question(req.body);
	newQuestion.save()
	.then(function(reply){ //the reply is the actual question created
		res.status(201).json(reply.id)
	})
	.catch(function(err){
		next(err);
	});
});

//POST /questions/:qId/answers
router.post('/:qId/answers',function(req, res, next){
	var questionFound = req.questionFound;
	questionFound.answers.push(req.body);
	questionFound.save()
	.then(function(reply){
		res.status(201).json(reply.id);
	}).catch(function(err){
		next(err);
	})

});

//PUT /questions/:qId/answers/:aId
router.put('/:qId/answers/:aId', function(req,res){
	req.answer.update(req.body)
	.then(function(reply){
		res.status(200).json(reply.id);
	})
	.catch(function(err){
		next(err);
	});
});

//DELETE /questions/:qId/answers/:aId
router.delete('/:qId/answers/:aId',function(req,res){
	req.answer.remove()
	.then(function(){
		req.answer.parent().save()
		.then(function(){
			res.status(200).send('Resource deleted.');
		}).catch(function(err){
			next(err);
		})
	}).catch(function(err){
		next(err);
	})
});

//POST /questions/:qId/answers/:aId/vote-up
// &
//POST /questions/:qId/answers/:aId/vote-down

router.post('/:qId/answers/:aId/vote-:dir', function(req,res,next){
			if(req.params.dir.search(/^(up|down)$/) === -1){
				var err = new Error("Not found");
				err.status = 404;
				next(err); //this next will call the Error handler with the err argument
			} else {
				next(); // this next will go forward to send the response
			}
		},function(req,res){
		req.answer.vote(req.params.dir)
		.then(function(){
			res.json({
				voteDirection: req.params.dir
			});
		})
		.catch(function(err){
			next(err);
		});
});


module.exports = router;