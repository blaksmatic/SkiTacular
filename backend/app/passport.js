var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
        passReqToCallback : true
	},
	function(req, email, password, done) {
		User.findOne({'email' : email}, function(err, user) {
            console.log("found");
            console.log(user);
			if(err)
				return done(err);
			if(user) {
				return done(null, false);
			} else {
				var newUser = new User();

				// newUser.name = req.body.name;
				newUser.email = email;
				newUser.password = newUser.generateHash(password);
				newUser.zipcode = req.body.zipcode;
                console.log(newUser);

				newUser.save(function(err) {
					if(err)
						throw err;
					return done(null, newUser);
				});
			}

		});
	}));

	passport.use('login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
	},
	function(email, password, done) {
		User.findOne({'email': email}, function(err, user) {
			if(err)
				return done(err);
			if(!user)
				return done(null, false);
			if(!user.validPassword(password))
				return done(null, false);
			return done(null, user);

		});
	}));

};
