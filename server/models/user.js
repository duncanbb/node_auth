const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

// define our model
const userSchema = new Schema({
  email: { lowercase: true, type: String, unique: true },
  password: String
});

// on save hook, encrypt password
// before saving a model, run this function - like in ruby
userSchema.pre('save', function(next) {
  // get access to the user model;
  const user = this;
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }
      // overwrite plain text password with encrypted password
      user.password = hash;
      next();
    })
  })
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {return callback(err); }

    callback(null, isMatch);
  })
}

// create the model class

const ModelClass = mongoose.model('user', userSchema);

// export the model

module.exports = ModelClass;