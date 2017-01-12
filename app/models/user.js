const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');

var encrypt = Promise.promisify(bcrypt.hash);

//------------------------------------------------
//             SCHEMA / MIDDLEWARE
//------------------------------------------------
var usersSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String
});
usersSchema.plugin(uniqueValidator);

usersSchema.pre('save', function(next){
  let user = this;
  encrypt(user.password, null, null).then((secret) =>{
    user.password = secret;
    next();
  });
});

//------------------------------------------------
//                    MODELS
//------------------------------------------------
var User = mongoose.model('User', usersSchema);

//------------------------------------------------
//                    HELPERS
//------------------------------------------------
const addUser = (user, pass) => {
  var newUser = new User({username: user, password: pass});
  newUser.save()
  .then(user => {
    console.log('\nUser created!');
    console.log('Username: ' + user.username);
    console.log('Pass: ' + user.password);
  })
  .catch(err => {
    console.log(err);
  });
};

const checkUser = username => {
  return new Promise((resolve, reject) => {
    User.count({'username': username}, (err, count) => {
      if(count > 0){
        resolve(true);
      }
      else{
        resolve(false);
      }
    })
  });
};

module.exports.addUser = addUser;
module.exports.checkUser = checkUser;
