const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const assert = require('assert');
const Promise = require('bluebird');
//Promise.promisifyAll(require("mongoose"));
mongoose.Promise = require('bluebird');

const uri = 'mongodb://localhost/shortly';
const options = {
  promiseLibrary: require('bluebird')
};



mongoose.connect(uri, options);

const clicksSchema = new mongoose.Schema({
  timestamp: Date
});

const linkSchema = new mongoose.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  clicks:[clicksSchema],
  timestamp: Date
});

const usersSchema = new mongoose.Schema({
  username: String,
  password: String
});

usersSchema.pre('save',(next) => {
  console.log(this.password);
  next();
});

usersSchema.methods.encrypt = () => {
  hashPass(this.password).then((hashed) => {
    this.password = hashed;
  });
};

/*
------------------------------------------------
              MODELS
------------------------------------------------
*/

var User = mongoose.model('User', usersSchema);
var Link = mongoose.model('Link', linkSchema);

/*
------------------------------------------------
              HELPERS
------------------------------------------------
*/

const hashPass = (pass) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(pass, null, null, (hash) => {
      resolve(hash);
    });
  });
};
const addUser = (user, pass, res) => {
  var newUser = new User({username: user, password: pass});
  newUser.save().then( user => {
    console.log(user);
  });
  //console.log(promise);
  // promise.then((potato) => {

  //   console.log('I THINK THIS IS GOOD!')
  //   res.status(200).send('Hello!');
  // }).catch((err) => {
  //   console.log(err);
  // })
};

module.exports.User = User;
module.exports.Link = Link;
//module.exports.db = db;
module.exports.addUser = addUser;

// var path = require('path');
// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   },
//   useNullAsDefault: true
// });
// var db = require('bookshelf')(knex);

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('clicks').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('clicks', function (click) {
//       click.increments('id').primary();
//       click.integer('linkId');
//       click.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// /************************************************************/
// // Add additional schema definitions below
// /************************************************************/


// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

