'use strict';

const mongoose = require("mongoose");
const bcrypt =  require('bcrypt');

// Use native promises
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			min: [5, 'Answer must be at least 10 characters long']
		},
		password: {
			type: String,
			required: true
		}
	},
	{ timestamps: {
		createdAt	: "createdAt",
		updatedAt	: "updatedAt"
		}
	}
);

// authenticate user login input against db document
userSchema.statics.authenticate = function (username, password) {
	return new Promise((resolve, reject) => {
		this.model('user').findOne({username})
			.exec()
			.then((user)=>{
				if(user){
					bcrypt.compare(password, user.password, function (err, match) {
						// password matches hashed password from db
						if(err) return reject(err);
						match ? resolve(user) : function(){
							const err = new Error('Invalid password');
							// although i wouldn't differentiate
							// username error from pass error for the sake of security
							err.status = 401;
							reject(err);
							}();
					});
				} else {
					const err = new Error('User not found');
					err.status = 401;
					reject(err);
				}
			})
			.catch((err)=> reject(err));
	})

};

// hash and salt password before saving to db
userSchema.pre("save", function(next) { // !!! this and arrow function
	bcrypt.hash(this.password, 10)
		.then((hash) => {
			this.password = hash;
			next();
		}).catch( err => next(err));
});

userSchema.methods.publicFormat = function() {
	var result = this.toJSON();
	// this is to get rid of the question __v (used internally by mongoose) when sending the data to the client
	delete(result.__v);
	return result
};

const User = mongoose.model('user', userSchema );

module.exports = User;