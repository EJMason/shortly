const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt-nodejs');
const assert = require('assert');
const Promise = require('bluebird');
const Schema = mongoose.Schema;

const uri = 'mongodb://localhost/shortly';
mongoose.connect(uri);

mongoose.Promise = require('bluebird');
var decrypt = Promise.promisify(bcrypt.compare);
var encrypt = Promise.promisify(bcrypt.hash);

var clicksSchema = new Schema({
  timestamp: Date
});

var linkSchema = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  clicks:[clicksSchema],
  timestamp: Date
});

var usersSchema = new Schema({
  username: {
    type: String,
    unique:true
  },
  password: String
});
usersSchema.plugin(uniqueValidator);

/*
------------------------------------------------
              MODELS
------------------------------------------------
*/

var User = mongoose.model('User', usersSchema);
var Link = mongoose.model('Link', linkSchema);

/*
------------------------------------------------
              Middleware
------------------------------------------------
*/
usersSchema.pre('save', function(next){
  let user = this;
  encrypt(user.password, null, null).then((secret) =>{
    console.log(secret);
    user.password = secret;
    next();
  });
});



/*
------------------------------------------------
              HELPERS
------------------------------------------------
*/

const addUser = (user, pass, res) => {
  var newUser = new User({username: user, password: pass});
  newUser.save()
  .then(user => {
    console.log('password: ' + user.password);
  })
  .catch(err => {
    console.log(err.errors.username.message);
  });
};

module.exports.User = User;
module.exports.Link = Link;
module.exports.addUser = addUser;


