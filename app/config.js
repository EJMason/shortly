const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt-nodejs');
const assert = require('assert');
const Promise = require('bluebird');
const Schema = mongoose.Schema;

const uri = 'mongodb://ejmason:4808@ds159998.mlab.com:59998/shortly';
var options = {
  server: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions:
    {
      keepAlive: 300000,
      connectTimeoutMS : 30000
    }
  }
};
mongoose.connect(uri, options);
var conn = mongoose.connection;


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
    unique: true
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
    console.log('User created success!');
  })
  .catch(err => {
    console.log(err);
  });
};

module.exports.User = User;
module.exports.Link = Link;
module.exports.addUser = addUser;
module.exports.connection = conn;

