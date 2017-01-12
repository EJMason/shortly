// const Promise = require('bluebird');

// var db = require('../config');
// var schema = require('../collections/users');

// var User = db.mongoose.model('User', schema.usersSchema);

// var addUser = (user, pass) => {
//   var newUser = new User({username: user, password: pass});
//   newUser.save()
//   .then(user => {
//     console.log('password: ' + user.password);
//   })
//   .catch(err => {
//     console.log(err);
//     //console.log(err.errors.username.message);
//   });
// };

// module.exports.addUser = addUser;

