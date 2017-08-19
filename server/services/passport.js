const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify this email and password, call done with the user 
  User.findOne( {email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });// compare passwords -- is password equal to user.password

  })
  // if its the correct email and password 
  // else call done with false
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // see if the user id in the payload is in our db
  // if it does, call done call back with that 
  // otherwise call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); }

    if (user) { 
      done(null, user);
    } else {
      done(null, false);
      // no user found but no error
    }
  });
});

// tell passport to use this strat
passport.use(jwtLogin);
passport.use(localLogin);