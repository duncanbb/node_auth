const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  const timeStamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timeStamp }, config.secret);
  // json web tokens have a sub property short for subject
  // iat = issued at time

}

exports.signin = function(req, res, next) {
  // user has already had their email and password authd
  // we just need to give them a token, need access to user model in this function
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res,next) {
  //  see if a user with the given email address exists
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide an email and password'});
  }
  User.findOne({ email: email }, function (err, existingUser) {
    if (err) { return next(err); }
    
  // if a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use'});
    }

  // if not, create and save user record
    const user = new User({ 
      email: email,
      password: password,
    });

    user.save(function(err) {
      if (err) { return next(err); }

      // respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });

  });


}